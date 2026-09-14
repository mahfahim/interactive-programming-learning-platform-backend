// src/modules/judge/judge.controller.ts

import type { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import type { IRequestUser } from "./judge.interface";
import { JudgeService } from "./judge.service";

const runCode = catchAsync(async (req: Request, res: Response) => {
	const user = req.user as unknown as IRequestUser;
	const result = await JudgeService.runCode(user, req.body);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		message: "Code executed successfully",
		data: result,
	});
});

const submitCode = catchAsync(async (req: Request, res: Response) => {
	const user = req.user as unknown as IRequestUser;
	const result = await JudgeService.submitCode(user, req.body);

	sendResponse(res, {
		statusCode: httpStatus.CREATED,
		message: "Code submitted successfully",
		data: result,
	});
});

const getSubmissionById = catchAsync(async (req: Request, res: Response) => {
	const user = req.user as unknown as IRequestUser;
	const { id } = req.params;
	const result = await JudgeService.getSubmissionById(id as string, user);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		message: "Submission fetched successfully",
		data: result,
	});
});

const getMySubmissions = catchAsync(async (req: Request, res: Response) => {
	const user = req.user as unknown as IRequestUser;
	const { codingLessonId } = req.params;
	const result = await JudgeService.getMySubmissions(
		codingLessonId as string,
		user,
	);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		message: "My submissions fetched successfully",
		data: result,
	});
});

const getCodingLessonByLessonId = catchAsync(
	async (req: Request, res: Response) => {
		const user = req.user as IRequestUser;
		const { lessonId } = req.params;

		const result = await JudgeService.getCodingLessonByLessonId(
			lessonId as string,
			user?.userId,
			user?.role,
		);

		sendResponse(res, {
			statusCode: httpStatus.OK,
			message: "Coding lesson fetched successfully",
			data: result,
		});
	},
);

const createCodingLesson = catchAsync(async (req: Request, res: Response) => {
	const result = await JudgeService.createCodingLesson(req.body);

	sendResponse(res, {
		statusCode: httpStatus.CREATED,
		message: "Coding lesson created successfully",
		data: result,
	});
});

const updateCodingLesson = catchAsync(async (req: Request, res: Response) => {
	const { id } = req.params;
	const result = await JudgeService.updateCodingLesson(id as string, req.body);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		message: "Coding lesson updated successfully",
		data: result,
	});
});

const updateTestCases = catchAsync(async (req: Request, res: Response) => {
	const { id } = req.params;
	const result = await JudgeService.updateTestCases(id as string, req.body);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		message: "Test cases updated successfully",
		data: result,
	});
});

const getCodingLessonSubmissions = catchAsync(
	async (req: Request, res: Response) => {
		const { id } = req.params;
		const result = await JudgeService.getCodingLessonSubmissions(id as string);

		sendResponse(res, {
			statusCode: httpStatus.OK,
			message: "Coding lesson submissions fetched successfully",
			data: result,
		});
	},
);

export const JudgeController = {
	runCode,
	submitCode,
	getSubmissionById,
	getMySubmissions,
	getCodingLessonByLessonId,
	createCodingLesson,
	updateCodingLesson,
	updateTestCases,
	getCodingLessonSubmissions,
};
