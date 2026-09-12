import { StatusCodes } from "http-status-codes";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/AppError";
import { clearCachePattern, getOrSetCache } from "../../utils/cache";
import { lessonCacheKeys } from "../../utils/cacheKey";
import { checkProAccess } from "../../utils/checkProAccess";
import { assertModuleExists } from "../module/module.service";

import type {
	ICreateLessonInput,
	ISyncArticleLessonInput,
	IUpdateLessonInput,
	IUpdateLessonProgressInput,
	IUpsertVideoLessonInput,
} from "./lesson.interface";

export const assertLessonExists = async (id: string) => {
	const lesson = await prisma.lesson.findUnique({ where: { id } });

	if (!lesson) {
		throw new AppError(StatusCodes.NOT_FOUND, "Lesson not found");
	}

	return lesson;
};

const verifyLessonAccess = async (
	lessonId: string,
	userId?: string,
	userRole?: string,
) => {
	const lesson = await prisma.lesson.findUnique({
		where: { id: lessonId },
		select: {
			id: true,
			isPro: true,
			module: {
				select: {
					superModule: {
						select: {
							courseId: true,
						},
					},
				},
			},
		},
	});

	if (!lesson) {
		throw new AppError(StatusCodes.NOT_FOUND, "Lesson not found");
	}

	const courseId = lesson.module.superModule.courseId;

	await checkProAccess({
		userId,
		userRole,
		courseId,
		isPro: lesson.isPro,
	});

	return lesson;
};

const createLesson = async (payload: ICreateLessonInput) => {
	await assertModuleExists(payload.moduleId);

	const result = await prisma.lesson.create({
		data: payload,
	});

	await clearCachePattern(lessonCacheKeys.pattern);

	return result;
};

const getLessonById = async (
	id: string,
	userId?: string,
	userRole?: string,
) => {
	await verifyLessonAccess(id, userId, userRole);

	return getOrSetCache(
		lessonCacheKeys.detail(id),
		async () => {
			const lesson = await prisma.lesson.findUnique({
				where: { id },
				include: {
					video: true,
					article: {
						include: {
							sections: {
								orderBy: { displayOrder: "asc" },
							},
						},
					},
				},
			});

			if (!lesson) {
				throw new AppError(StatusCodes.NOT_FOUND, "Lesson not found");
			}

			return lesson;
		},
		3600,
	);
};

const updateLesson = async (id: string, payload: IUpdateLessonInput) => {
	await assertLessonExists(id);

	const result = await prisma.lesson.update({
		where: { id },
		data: payload,
	});

	await clearCachePattern(lessonCacheKeys.pattern);

	return result;
};

const deleteLesson = async (id: string) => {
	await assertLessonExists(id);

	const result = await prisma.lesson.delete({
		where: { id },
	});

	await clearCachePattern(lessonCacheKeys.pattern);

	return result;
};

const getVideoLesson = async (
	lessonId: string,
	userId?: string,
	userRole?: string,
) => {
	await verifyLessonAccess(lessonId, userId, userRole);

	return getOrSetCache(
		lessonCacheKeys.video(lessonId),
		async () => {
			const video = await prisma.videoLesson.findUnique({
				where: { lessonId },
			});

			if (!video) {
				throw new AppError(
					StatusCodes.NOT_FOUND,
					"Video content not found for this lesson",
				);
			}

			return video;
		},
		3600,
	);
};

const upsertVideoLesson = async (
	lessonId: string,
	payload: IUpsertVideoLessonInput,
) => {
	await assertLessonExists(lessonId);

	const result = await prisma.videoLesson.upsert({
		where: { lessonId },
		create: {
			lessonId,
			...payload,
		},
		update: payload,
	});

	await clearCachePattern(lessonCacheKeys.pattern);

	return result;
};

const getArticleLesson = async (
	lessonId: string,
	userId?: string,
	userRole?: string,
) => {
	await verifyLessonAccess(lessonId, userId, userRole);

	return getOrSetCache(
		lessonCacheKeys.article(lessonId),
		async () => {
			const article = await prisma.articleLesson.findUnique({
				where: { lessonId },
				include: {
					sections: {
						orderBy: { displayOrder: "asc" },
					},
				},
			});

			if (!article) {
				throw new AppError(
					StatusCodes.NOT_FOUND,
					"Article content not found for this lesson",
				);
			}

			return article;
		},
		3600,
	);
};

const syncArticleLesson = async (
	lessonId: string,
	payload: ISyncArticleLessonInput,
) => {
	await assertLessonExists(lessonId);

	const result = await prisma.$transaction(async (tx) => {
		await tx.articleLesson.upsert({
			where: { lessonId },
			create: { lessonId },
			update: {},
		});

		await tx.articleSection.deleteMany({
			where: { articleLessonId: lessonId },
		});

		if (payload.sections.length > 0) {
			await tx.articleSection.createMany({
				data: payload.sections.map((section) => ({
					articleLessonId: lessonId,
					content: section.content as any,
					displayOrder: section.displayOrder,
				})),
			});
		}

		return tx.articleLesson.findUniqueOrThrow({
			where: { lessonId },
			include: {
				sections: {
					orderBy: { displayOrder: "asc" },
				},
			},
		});
	});

	await clearCachePattern(lessonCacheKeys.pattern);

	return result;
};

const getLessonProgress = async (
	userId: string,
	lessonId: string,
	userRole?: string,
) => {
	await verifyLessonAccess(lessonId, userId, userRole);

	return getOrSetCache(
		lessonCacheKeys.progress(userId, lessonId),
		() =>
			prisma.lessonProgress.findUnique({
				where: {
					userId_lessonId: {
						userId,
						lessonId,
					},
				},
			}),
		300,
	);
};

const updateLessonProgress = async (
	userId: string,
	lessonId: string,
	payload: IUpdateLessonProgressInput,
	userRole?: string,
) => {
	await verifyLessonAccess(lessonId, userId, userRole);

	const completedAt = payload.isCompleted ? new Date() : null;

	const result = await prisma.lessonProgress.upsert({
		where: {
			userId_lessonId: {
				userId,
				lessonId,
			},
		},
		create: {
			userId,
			lessonId,
			isCompleted: payload.isCompleted,
			completedAt,
		},
		update: {
			isCompleted: payload.isCompleted,
			completedAt,
		},
	});

	await clearCachePattern(lessonCacheKeys.progress(userId, lessonId));

	return result;
};

export const LessonService = {
	createLesson,
	getLessonById,
	updateLesson,
	deleteLesson,
	getVideoLesson,
	upsertVideoLesson,
	getArticleLesson,
	syncArticleLesson,
	getLessonProgress,
	updateLessonProgress,
};
