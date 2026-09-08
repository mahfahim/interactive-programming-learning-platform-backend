import type { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import type { IRequestUser } from "./quiz.interface";
import { QuizService } from "./quiz.service";

const createQuiz = catchAsync(async (req: Request, res: Response) => {
	const result = await QuizService.createQuiz(req.body);

	sendResponse(res, {
		statusCode: httpStatus.CREATED,
		success: true,
		message: "Quiz created successfully",
		data: result,
	});
});

const getQuizByLessonId = catchAsync(async (req: Request, res: Response) => {
	const { lessonId } = req.params;
	const result = await QuizService.getQuizByLessonId(lessonId as string);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Quiz fetched successfully",
		data: result,
	});
});

const getQuizById = catchAsync(async (req: Request, res: Response) => {
	const { id } = req.params;
	const result = await QuizService.getQuizById(id as string);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Quiz details fetched successfully",
		data: result,
	});
});

const updateQuiz = catchAsync(async (req: Request, res: Response) => {
	const { id } = req.params;
	const result = await QuizService.updateQuiz(id as string, req.body);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Quiz updated successfully",
		data: result,
	});
});

const deleteQuiz = catchAsync(async (req: Request, res: Response) => {
	const { id } = req.params;
	const result = await QuizService.deleteQuiz(id as string);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Quiz deleted successfully",
		data: result,
	});
});

const submitQuiz = catchAsync(async (req: Request, res: Response) => {
	const user = req.user as unknown as IRequestUser;
	const result = await QuizService.submitQuiz(user, req.body);

	sendResponse(res, {
		statusCode: httpStatus.CREATED,
		success: true,
		message: "Quiz submitted successfully",
		data: result,
	});
});

const getAttemptById = catchAsync(async (req: Request, res: Response) => {
	const user = req.user as unknown as IRequestUser;
	const { id } = req.params;
	const result = await QuizService.getAttemptById(id as string, user);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Quiz attempt fetched successfully",
		data: result,
	});
});

const getMyAttempts = catchAsync(async (req: Request, res: Response) => {
	const user = req.user as unknown as IRequestUser;
	const { quizLessonId } = req.params;
	const result = await QuizService.getMyAttempts(user, quizLessonId as string);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "My attempts fetched successfully",
		data: result,
	});
});

const getQuizAttempts = catchAsync(async (req: Request, res: Response) => {
	const { id } = req.params;
	const result = await QuizService.getQuizAttempts(id as string);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Quiz attempts fetched successfully",
		data: result,
	});
});

export const QuizController = {
	createQuiz,
	getQuizByLessonId,
	getQuizById,
	updateQuiz,
	deleteQuiz,
	submitQuiz,
	getAttemptById,
	getMyAttempts,
	getQuizAttempts,
};
