import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { CourseService } from "./course.service";

const createCourse = catchAsync(async (req: Request, res: Response) => {
	const result = await CourseService.createCourse(req.body);

	sendResponse(res, {
		statusCode: StatusCodes.CREATED,
		success: true,
		message: "Course created successfully",
		data: result,
	});
});

const getCourses = catchAsync(async (req: Request, res: Response) => {
	const queryParams = {
		search: req.query.search as string,
		level: req.query.level as any,
		page: req.query.page ? Number(req.query.page) : 1,
		limit: req.query.limit ? Number(req.query.limit) : 10,
		sortBy: req.query.sortBy as string,
		sortOrder: req.query.sortOrder as "asc" | "desc",
	};

	const result = await CourseService.getCourses(queryParams);

	sendResponse(res, {
		statusCode: StatusCodes.OK,
		success: true,
		message: "Courses retrieved successfully",
		data: result.data,
		meta: result.meta,
	});
});

const getMyCourses = catchAsync(async (req: Request, res: Response) => {
	const userId = req.user!.userId;
	const result = await CourseService.getMyCourses(userId);

	sendResponse(res, {
		statusCode: StatusCodes.OK,
		success: true,
		message: "Instructor courses retrieved successfully",
		data: result,
	});
});

const getCourseById = catchAsync(async (req: Request, res: Response) => {
	const { id } = req.params;
	const result = await CourseService.getCourseById(id as string);

	sendResponse(res, {
		statusCode: StatusCodes.OK,
		success: true,
		message: "Course details retrieved successfully",
		data: result,
	});
});

const updateCourse = catchAsync(async (req: Request, res: Response) => {
	const { id } = req.params;
	const result = await CourseService.updateCourse(id as string, req.body);

	sendResponse(res, {
		statusCode: StatusCodes.OK,
		success: true,
		message: "Course updated successfully",
		data: result,
	});
});

const deleteCourse = catchAsync(async (req: Request, res: Response) => {
	const { id } = req.params;
	const result = await CourseService.deleteCourse(id as string);

	sendResponse(res, {
		statusCode: StatusCodes.OK,
		success: true,
		message: "Course deleted successfully",
		data: result,
	});
});

export const CourseController = {
	createCourse,
	getCourses,
	getMyCourses,
	getCourseById,
	updateCourse,
	deleteCourse,
};
