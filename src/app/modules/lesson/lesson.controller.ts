import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { LessonService } from "./lesson.service";

const createLesson = catchAsync(async (req: Request, res: Response) => {
	const result = await LessonService.createLesson(req.body);

	sendResponse(res, {
		statusCode: StatusCodes.CREATED,
		message: "Lesson created successfully",
		data: result,
	});
});

const getLessonById = catchAsync(async (req: Request, res: Response) => {
	const { id } = req.params;
	const userId = req.user?.userId;
	const userRole = req.user?.role;

	const result = await LessonService.getLessonById(
		id as string,
		userId,
		userRole,
	);

	sendResponse(res, {
		statusCode: StatusCodes.OK,
		message: "Lesson retrieved successfully",
		data: result,
	});
});

const updateLesson = catchAsync(async (req: Request, res: Response) => {
	const { id } = req.params;
	const result = await LessonService.updateLesson(id as string, req.body);

	sendResponse(res, {
		statusCode: StatusCodes.OK,
		message: "Lesson updated successfully",
		data: result,
	});
});

const deleteLesson = catchAsync(async (req: Request, res: Response) => {
	const { id } = req.params;
	const result = await LessonService.deleteLesson(id as string);

	sendResponse(res, {
		statusCode: StatusCodes.OK,
		message: "Lesson deleted successfully",
		data: result,
	});
});

const getVideoLesson = catchAsync(async (req: Request, res: Response) => {
	const { lessonId } = req.params;
	const userId = req.user?.userId;
	const userRole = req.user?.role;

	const result = await LessonService.getVideoLesson(
		lessonId as string,
		userId,
		userRole,
	);

	sendResponse(res, {
		statusCode: StatusCodes.OK,
		message: "Video lesson content retrieved successfully",
		data: result,
	});
});

const upsertVideoLesson = catchAsync(async (req: Request, res: Response) => {
	const { lessonId } = req.params;
	const result = await LessonService.upsertVideoLesson(
		lessonId as string,
		req.body,
	);

	sendResponse(res, {
		statusCode: StatusCodes.OK,
		message: "Video lesson updated successfully",
		data: result,
	});
});

const getArticleLesson = catchAsync(async (req: Request, res: Response) => {
	const { lessonId } = req.params;
	const userId = req.user?.userId;
	const userRole = req.user?.role;

	const result = await LessonService.getArticleLesson(
		lessonId as string,
		userId,
		userRole,
	);

	sendResponse(res, {
		statusCode: StatusCodes.OK,
		message: "Article lesson content retrieved successfully",
		data: result,
	});
});

const syncArticleLesson = catchAsync(async (req: Request, res: Response) => {
	const { lessonId } = req.params;
	const result = await LessonService.syncArticleLesson(
		lessonId as string,
		req.body,
	);

	sendResponse(res, {
		statusCode: StatusCodes.OK,
		message: "Article lesson sections synchronized successfully",
		data: result,
	});
});

const getLessonProgress = catchAsync(async (req: Request, res: Response) => {
	const userId = req.user!.userId;
	const userRole = req.user?.role;
	const { lessonId } = req.params;

	const result = await LessonService.getLessonProgress(
		userId,
		lessonId as string,
		userRole,
	);

	sendResponse(res, {
		statusCode: StatusCodes.OK,
		message: "Lesson progress retrieved successfully",
		data: result,
	});
});

const updateLessonProgress = catchAsync(async (req: Request, res: Response) => {
	const userId = req.user!.userId;
	const userRole = req.user?.role;
	const { lessonId } = req.params;

	const result = await LessonService.updateLessonProgress(
		userId,
		lessonId as string,
		req.body,
		userRole,
	);

	sendResponse(res, {
		statusCode: StatusCodes.OK,
		message: "Lesson progress updated successfully",
		data: result,
	});
});

export const LessonController = {
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
