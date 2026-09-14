// src/modules/discussion/discussion.controller.ts

import type { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import type { IRequestUser } from "./discussion.interface";
import { DiscussionService } from "./discussion.service";

const createThread = catchAsync(async (req: Request, res: Response) => {
	const user = req.user as unknown as IRequestUser;
	const result = await DiscussionService.createThread(user, req.body);

	sendResponse(res, {
		statusCode: httpStatus.CREATED,
		message: "Discussion thread created successfully",
		data: result,
	});
});

const getThreadsByLesson = catchAsync(async (req: Request, res: Response) => {
	const { lessonId } = req.params;
	const result = await DiscussionService.getThreadsByLesson(
		lessonId as string,
		req.query,
	);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		message: "Discussion threads fetched successfully",
		data: result.data,
		meta: result.meta,
	});
});

const getThreadById = catchAsync(async (req: Request, res: Response) => {
	const user = req.user as unknown as IRequestUser;
	const { id } = req.params;
	const result = await DiscussionService.getThreadById(id as string, user);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		message: "Discussion thread fetched successfully",
		data: result,
	});
});

const updateThread = catchAsync(async (req: Request, res: Response) => {
	const user = req.user as unknown as IRequestUser;
	const { id } = req.params;
	const result = await DiscussionService.updateThread(
		id as string,
		user,
		req.body,
	);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		message: "Discussion thread updated successfully",
		data: result,
	});
});

const deleteThread = catchAsync(async (req: Request, res: Response) => {
	const user = req.user as unknown as IRequestUser;
	const { id } = req.params;
	const result = await DiscussionService.deleteThread(id as string, user);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		message: "Discussion thread deleted successfully",
		data: result,
	});
});

const toggleThreadReaction = catchAsync(async (req: Request, res: Response) => {
	const user = req.user as unknown as IRequestUser;
	const { id } = req.params;
	const result = await DiscussionService.toggleThreadReaction(
		id as string,
		user,
		req.body,
	);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		message: "Thread reaction updated successfully",
		data: result,
	});
});

const createComment = catchAsync(async (req: Request, res: Response) => {
	const user = req.user as unknown as IRequestUser;
	const { threadId } = req.params;
	const result = await DiscussionService.createComment(
		threadId as string,
		user,
		req.body,
	);

	sendResponse(res, {
		statusCode: httpStatus.CREATED,
		message: "Comment created successfully",
		data: result,
	});
});

const getThreadComments = catchAsync(async (req: Request, res: Response) => {
	const user = req.user as unknown as IRequestUser;
	const { threadId } = req.params;
	const result = await DiscussionService.getThreadComments(
		threadId as string,
		user,
	);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		message: "Thread comments fetched successfully",
		data: result,
	});
});

const updateComment = catchAsync(async (req: Request, res: Response) => {
	const user = req.user as unknown as IRequestUser;
	const { id } = req.params;
	const result = await DiscussionService.updateComment(
		id as string,
		user,
		req.body,
	);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		message: "Comment updated successfully",
		data: result,
	});
});

const deleteComment = catchAsync(async (req: Request, res: Response) => {
	const user = req.user as unknown as IRequestUser;
	const { id } = req.params;
	const result = await DiscussionService.deleteComment(id as string, user);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		message: "Comment deleted successfully",
		data: result,
	});
});

const toggleCommentReaction = catchAsync(
	async (req: Request, res: Response) => {
		const user = req.user as unknown as IRequestUser;
		const { id } = req.params;
		const result = await DiscussionService.toggleCommentReaction(
			id as string,
			user,
			req.body,
		);

		sendResponse(res, {
			statusCode: httpStatus.OK,
			message: "Comment reaction updated successfully",
			data: result,
		});
	},
);

export const DiscussionController = {
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
