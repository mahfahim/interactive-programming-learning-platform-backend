// src/modules/discussion/discussion.service.ts

import { type ReactionType, Role } from "../../../generated/prisma/client";
import httpStatus from "http-status";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/AppError";
import { clearCachePattern, getOrSetCache } from "../../utils/cache";
import { discussionCacheKeys } from "../../utils/cacheKey";
import type {
	ICommentResponseNode,
	IDiscussionCommentCreatePayload,
	IDiscussionCommentUpdatePayload,
	IDiscussionReactionPayload,
	IDiscussionThreadCreatePayload,
	IDiscussionThreadUpdatePayload,
	IRequestUser,
	IThreadQueryParams,
} from "./discussion.interface";

const safeUserSelect = {
	id: true,
	name: true,
	email: true,
	imageUrl: true,
};

// Internal interface for shared cached comment structure (without myReaction)
interface ISharedCommentNode {
	id: string;
	threadId: string;
	userId: string | null;
	parentCommentId: string | null;
	body: string;
	replyCount: number;
	reactionCount: number;
	createdAt: Date;
	updatedAt: Date;
	isDeleted: boolean;
	user: {
		id: string;
		name: string | null;
		email: string;
		imageUrl: string | null;
	} | null;
	reactionSummary: Record<string, number>;
	replies: ISharedCommentNode[];
}

const createThread = async (
	user: IRequestUser,
	payload: IDiscussionThreadCreatePayload,
) => {
	const lesson = await prisma.lesson.findUnique({
		where: { id: payload.lessonId },
	});

	if (!lesson) {
		throw new AppError(httpStatus.NOT_FOUND, "Lesson not found");
	}

	const newThread = await prisma.discussionThread.create({
		data: {
			lessonId: payload.lessonId,
			userId: user.userId,
			title: payload.title,
			body: payload.body,
		},
		include: {
			user: { select: safeUserSelect },
		},
	});

	// Invalidate thread lists for this lesson
	await clearCachePattern(
		discussionCacheKeys.lessonThreadsPattern(payload.lessonId),
	);

	return newThread;
};

const getThreadsByLesson = async (
	lessonId: string,
	query: IThreadQueryParams,
) => {
	const cacheKey = discussionCacheKeys.listByLesson(
		lessonId,
		query as Record<string, unknown>,
	);

	return getOrSetCache(
		cacheKey,
		async () => {
			const lesson = await prisma.lesson.findUnique({
				where: { id: lessonId },
			});

			if (!lesson) {
				throw new AppError(httpStatus.NOT_FOUND, "Lesson not found");
			}

			const page = Math.max(1, Number(query.page) || 1);
			const rawLimit = Number(query.limit) || 10;
			const limit = Math.min(50, Math.max(1, rawLimit));
			const skip = (page - 1) * limit;

			const whereClause: Record<string, unknown> = { lessonId };

			if (query.search && query.search.trim() !== "") {
				whereClause.OR = [
					{ title: { contains: query.search.trim(), mode: "insensitive" } },
					{ body: { contains: query.search.trim(), mode: "insensitive" } },
				];
			}

			const [threads, total] = await Promise.all([
				prisma.discussionThread.findMany({
					where: whereClause,
					skip,
					take: limit,
					orderBy: { createdAt: "desc" },
					include: {
						user: { select: safeUserSelect },
					},
				}),
				prisma.discussionThread.count({
					where: whereClause,
				}),
			]);

			const totalPages = Math.ceil(total / limit);

			return {
				data: threads,
				meta: {
					page,
					limit,
					total,
					totalPages,
				},
			};
		},
		300, // 5 minutes TTL
	);
};

const getThreadById = async (id: string, user: IRequestUser) => {
	// 1. Fetch/Cache shared core thread data & reaction summary
	const sharedThreadData = await getOrSetCache(
		discussionCacheKeys.detail(id),
		async () => {
			const thread = await prisma.discussionThread.findUnique({
				where: { id },
				include: {
					user: { select: safeUserSelect },
				},
			});

			if (!thread) {
				throw new AppError(httpStatus.NOT_FOUND, "Discussion thread not found");
			}

			const groupedReactions = await prisma.discussionThreadReaction.groupBy({
				by: ["reactionType"],
				where: { threadId: id },
				_count: { _all: true },
			});

			const reactionSummary: Record<string, number> = {
				LIKE: 0,
				DISLIKE: 0,
				LOVE: 0,
				HELPFUL: 0,
				CELEBRATE: 0,
				THINKING: 0,
			};

			groupedReactions.forEach((group) => {
				reactionSummary[group.reactionType] = group._count._all;
			});

			return {
				thread,
				reactionSummary,
			};
		},
		600, // 10 minutes TTL
	);

	// 2. Query user-specific reaction independently (fast, indexed key lookup)
	const myReactionRecord = await prisma.discussionThreadReaction.findUnique({
		where: {
			userId_threadId: {
				userId: user.userId,
				threadId: id,
			},
		},
		select: { reactionType: true },
	});

	return {
		...sharedThreadData.thread,
		reactionSummary: sharedThreadData.reactionSummary,
		myReaction: myReactionRecord?.reactionType || null,
	};
};

const updateThread = async (
	id: string,
	user: IRequestUser,
	payload: IDiscussionThreadUpdatePayload,
) => {
	const thread = await prisma.discussionThread.findUnique({
		where: { id },
	});

	if (!thread) {
		throw new AppError(httpStatus.NOT_FOUND, "Discussion thread not found");
	}

	if (thread.userId !== user.userId) {
		throw new AppError(
			httpStatus.FORBIDDEN,
			"You are not allowed to update this thread",
		);
	}

	const updatedThread = await prisma.discussionThread.update({
		where: { id },
		data: {
			...(payload.title !== undefined && { title: payload.title }),
			...(payload.body !== undefined && { body: payload.body }),
		},
		include: {
			user: { select: safeUserSelect },
		},
	});

	await Promise.all([
		clearCachePattern(discussionCacheKeys.detail(id)),
		clearCachePattern(
			discussionCacheKeys.lessonThreadsPattern(thread.lessonId),
		),
	]);

	return updatedThread;
};

const deleteThread = async (id: string, user: IRequestUser) => {
	const thread = await prisma.discussionThread.findUnique({
		where: { id },
	});

	if (!thread) {
		throw new AppError(httpStatus.NOT_FOUND, "Discussion thread not found");
	}

	const isOwner = thread.userId === user.userId;
	const isAdminOrInstructor =
		user.role === Role.ADMIN || user.role === Role.INSTRUCTOR;

	if (!isOwner && !isAdminOrInstructor) {
		throw new AppError(
			httpStatus.FORBIDDEN,
			"You are not allowed to delete this thread",
		);
	}

	const deletedThread = await prisma.discussionThread.delete({
		where: { id },
	});

	await Promise.all([
		clearCachePattern(discussionCacheKeys.detail(id)),
		clearCachePattern(
			discussionCacheKeys.lessonThreadsPattern(thread.lessonId),
		),
		clearCachePattern(discussionCacheKeys.comments(id)),
	]);

	return deletedThread;
};

const toggleThreadReaction = async (
	threadId: string,
	user: IRequestUser,
	payload: IDiscussionReactionPayload,
) => {
	const thread = await prisma.discussionThread.findUnique({
		where: { id: threadId },
	});

	if (!thread) {
		throw new AppError(httpStatus.NOT_FOUND, "Discussion thread not found");
	}

	const existingReaction = await prisma.discussionThreadReaction.findUnique({
		where: {
			userId_threadId: {
				userId: user.userId,
				threadId,
			},
		},
	});

	const result = await prisma.$transaction(async (tx) => {
		if (!existingReaction) {
			await tx.discussionThreadReaction.create({
				data: {
					userId: user.userId,
					threadId,
					reactionType: payload.reactionType,
				},
			});

			await tx.discussionThread.update({
				where: { id: threadId },
				data: { reactionCount: { increment: 1 } },
			});

			return { status: "ADDED", reactionType: payload.reactionType };
		}

		if (existingReaction.reactionType === payload.reactionType) {
			await tx.discussionThreadReaction.delete({
				where: { id: existingReaction.id },
			});

			await tx.discussionThread.update({
				where: { id: threadId },
				data: { reactionCount: { decrement: 1 } },
			});

			return { status: "REMOVED", reactionType: null };
		}

		await tx.discussionThreadReaction.update({
			where: { id: existingReaction.id },
			data: { reactionType: payload.reactionType },
		});

		return { status: "UPDATED", reactionType: payload.reactionType };
	});

	await Promise.all([
		clearCachePattern(discussionCacheKeys.detail(threadId)),
		clearCachePattern(
			discussionCacheKeys.lessonThreadsPattern(thread.lessonId),
		),
	]);

	return result;
};

const createComment = async (
	threadId: string,
	user: IRequestUser,
	payload: IDiscussionCommentCreatePayload,
) => {
	const thread = await prisma.discussionThread.findUnique({
		where: { id: threadId },
	});

	if (!thread) {
		throw new AppError(httpStatus.NOT_FOUND, "Discussion thread not found");
	}

	if (payload.parentCommentId) {
		const parentComment = await prisma.discussionComment.findUnique({
			where: { id: payload.parentCommentId },
		});

		if (!parentComment) {
			throw new AppError(httpStatus.NOT_FOUND, "Parent comment not found");
		}

		if (parentComment.threadId !== threadId) {
			throw new AppError(
				httpStatus.BAD_REQUEST,
				"Parent comment belongs to a different thread",
			);
		}
	}

	const comment = await prisma.$transaction(async (tx) => {
		const created = await tx.discussionComment.create({
			data: {
				threadId,
				userId: user.userId,
				parentCommentId: payload.parentCommentId || null,
				body: payload.body,
			},
			include: {
				user: { select: safeUserSelect },
			},
		});

		await tx.discussionThread.update({
			where: { id: threadId },
			data: { commentCount: { increment: 1 } },
		});

		if (payload.parentCommentId) {
			await tx.discussionComment.update({
				where: { id: payload.parentCommentId },
				data: { replyCount: { increment: 1 } },
			});
		}

		return created;
	});

	await Promise.all([
		clearCachePattern(discussionCacheKeys.comments(threadId)),
		clearCachePattern(discussionCacheKeys.detail(threadId)),
		clearCachePattern(
			discussionCacheKeys.lessonThreadsPattern(thread.lessonId),
		),
	]);

	return comment;
};

const getThreadComments = async (
	threadId: string,
	user: IRequestUser,
): Promise<ICommentResponseNode[]> => {
	// 1. Fetch/Cache shared comment tree structure (without myReaction)
	const sharedTree = await getOrSetCache<ISharedCommentNode[]>(
		discussionCacheKeys.comments(threadId),
		async () => {
			const thread = await prisma.discussionThread.findUnique({
				where: { id: threadId },
			});

			if (!thread) {
				throw new AppError(httpStatus.NOT_FOUND, "Discussion thread not found");
			}

			const comments = await prisma.discussionComment.findMany({
				where: { threadId },
				orderBy: { createdAt: "asc" },
				include: {
					user: { select: safeUserSelect },
					reactions: {
						select: {
							userId: true,
							reactionType: true,
						},
					},
				},
			});

			const nodesMap = new Map<string, ISharedCommentNode>();

			comments.forEach((c) => {
				const reactionSummary: Record<string, number> = {
					LIKE: 0,
					DISLIKE: 0,
					LOVE: 0,
					HELPFUL: 0,
					CELEBRATE: 0,
					THINKING: 0,
				};

				c.reactions.forEach((r) => {
					reactionSummary[r.reactionType] =
						(reactionSummary[r.reactionType] || 0) + 1;
				});

				const node: ISharedCommentNode = {
					id: c.id,
					threadId: c.threadId,
					userId: c.isDeleted ? null : c.userId,
					parentCommentId: c.parentCommentId,
					body: c.isDeleted ? "[deleted]" : c.body,
					replyCount: c.replyCount,
					reactionCount: c.reactionCount,
					createdAt: c.createdAt,
					updatedAt: c.updatedAt,
					isDeleted: c.isDeleted,
					user: c.isDeleted ? null : c.user,
					reactionSummary,
					replies: [],
				};

				nodesMap.set(c.id, node);
			});

			const rootComments: ISharedCommentNode[] = [];

			nodesMap.forEach((node) => {
				if (node.parentCommentId && nodesMap.has(node.parentCommentId)) {
					nodesMap.get(node.parentCommentId)!.replies.push(node);
				} else {
					rootComments.push(node);
				}
			});

			return rootComments;
		},
		600, // 10 minutes TTL
	);

	// 2. Fetch user-specific comment reactions for this thread via single indexed query
	const userReactions = await prisma.discussionCommentReaction.findMany({
		where: {
			userId: user.userId,
			comment: { threadId },
		},
		select: {
			commentId: true,
			reactionType: true,
		},
	});

	const userReactionMap = new Map<string, ReactionType>();
	userReactions.forEach((r) => {
		userReactionMap.set(r.commentId, r.reactionType);
	});

	// 3. Recursively map and merge myReaction onto the cached shared tree
	const mapNodeWithMyReaction = (
		nodes: ISharedCommentNode[],
	): ICommentResponseNode[] => {
		return nodes.map((node) => ({
			...node,
			myReaction: userReactionMap.get(node.id) || null,
			replies: mapNodeWithMyReaction(node.replies),
		}));
	};

	return mapNodeWithMyReaction(sharedTree);
};

const updateComment = async (
	id: string,
	user: IRequestUser,
	payload: IDiscussionCommentUpdatePayload,
) => {
	const comment = await prisma.discussionComment.findUnique({
		where: { id },
	});

	if (!comment) {
		throw new AppError(httpStatus.NOT_FOUND, "Comment not found");
	}

	if (comment.isDeleted) {
		throw new AppError(
			httpStatus.BAD_REQUEST,
			"Deleted comments cannot be edited",
		);
	}

	if (comment.userId !== user.userId) {
		throw new AppError(
			httpStatus.FORBIDDEN,
			"You are not allowed to update this comment",
		);
	}

	const updatedComment = await prisma.discussionComment.update({
		where: { id },
		data: { body: payload.body },
		include: {
			user: { select: safeUserSelect },
		},
	});

	await clearCachePattern(discussionCacheKeys.comments(comment.threadId));

	return updatedComment;
};

const deleteComment = async (id: string, user: IRequestUser) => {
	const comment = await prisma.discussionComment.findUnique({
		where: { id },
	});

	if (!comment) {
		throw new AppError(httpStatus.NOT_FOUND, "Comment not found");
	}

	if (comment.isDeleted) {
		throw new AppError(httpStatus.BAD_REQUEST, "Comment is already deleted");
	}

	const isOwner = comment.userId === user.userId;
	const isAdminOrInstructor =
		user.role === Role.ADMIN || user.role === Role.INSTRUCTOR;

	if (!isOwner && !isAdminOrInstructor) {
		throw new AppError(
			httpStatus.FORBIDDEN,
			"You are not allowed to delete this comment",
		);
	}

	const thread = await prisma.discussionThread.findUnique({
		where: { id: comment.threadId },
		select: { lessonId: true },
	});

	const updatedComment = await prisma.$transaction(async (tx) => {
		const result = await tx.discussionComment.update({
			where: { id },
			data: { isDeleted: true },
		});

		await tx.discussionThread.update({
			where: { id: comment.threadId },
			data: { commentCount: { decrement: 1 } },
		});

		return result;
	});

	await Promise.all([
		clearCachePattern(discussionCacheKeys.comments(comment.threadId)),
		clearCachePattern(discussionCacheKeys.detail(comment.threadId)),
		...(thread
			? [
					clearCachePattern(
						discussionCacheKeys.lessonThreadsPattern(thread.lessonId),
					),
				]
			: []),
	]);

	return updatedComment;
};

const toggleCommentReaction = async (
	commentId: string,
	user: IRequestUser,
	payload: IDiscussionReactionPayload,
) => {
	const comment = await prisma.discussionComment.findUnique({
		where: { id: commentId },
	});

	if (!comment) {
		throw new AppError(httpStatus.NOT_FOUND, "Comment not found");
	}

	if (comment.isDeleted) {
		throw new AppError(
			httpStatus.BAD_REQUEST,
			"Deleted comments cannot be reacted to",
		);
	}

	const existingReaction = await prisma.discussionCommentReaction.findUnique({
		where: {
			userId_commentId: {
				userId: user.userId,
				commentId,
			},
		},
	});

	const result = await prisma.$transaction(async (tx) => {
		if (!existingReaction) {
			await tx.discussionCommentReaction.create({
				data: {
					userId: user.userId,
					commentId,
					reactionType: payload.reactionType,
				},
			});

			await tx.discussionComment.update({
				where: { id: commentId },
				data: { reactionCount: { increment: 1 } },
			});

			return { status: "ADDED", reactionType: payload.reactionType };
		}

		if (existingReaction.reactionType === payload.reactionType) {
			await tx.discussionCommentReaction.delete({
				where: { id: existingReaction.id },
			});

			await tx.discussionComment.update({
				where: { id: commentId },
				data: { reactionCount: { decrement: 1 } },
			});

			return { status: "REMOVED", reactionType: null };
		}

		await tx.discussionCommentReaction.update({
			where: { id: existingReaction.id },
			data: { reactionType: payload.reactionType },
		});

		return { status: "UPDATED", reactionType: payload.reactionType };
	});

	await clearCachePattern(discussionCacheKeys.comments(comment.threadId));

	return result;
};

export const DiscussionService = {
	createThread,
	getThreadsByLesson,
	getThreadById,
	updateThread,
	deleteThread,
	toggleThreadReaction,
	createComment,
	getThreadComments,
	updateComment,
	deleteComment,
	toggleCommentReaction,
};
