import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { SuperModuleService } from "./superModule.service";

const createSuperModule = catchAsync(async (req: Request, res: Response) => {
	const result = await SuperModuleService.createSuperModule(req.body);

	sendResponse(res, {
		statusCode: StatusCodes.CREATED,
		success: true,
		message: "Super module created successfully",
		data: result,
	});
});

const getSuperModulesByCourse = catchAsync(
	async (req: Request, res: Response) => {
		const { courseId } = req.params;
		const result = await SuperModuleService.getSuperModulesByCourse(
			courseId as string,
		);

		sendResponse(res, {
			statusCode: StatusCodes.OK,
			success: true,
			message: "Super modules retrieved successfully",
			data: result,
		});
	},
);

const getSuperModuleById = catchAsync(async (req: Request, res: Response) => {
	const { id } = req.params;
	const result = await SuperModuleService.getSuperModuleById(id as string);

	sendResponse(res, {
		statusCode: StatusCodes.OK,
		success: true,
		message: "Super module details retrieved successfully",
		data: result,
	});
});

const updateSuperModule = catchAsync(async (req: Request, res: Response) => {
	const { id } = req.params;
	const result = await SuperModuleService.updateSuperModule(
		id as string,
		req.body,
	);

	sendResponse(res, {
		statusCode: StatusCodes.OK,
		success: true,
		message: "Super module updated successfully",
		data: result,
	});
});

const deleteSuperModule = catchAsync(async (req: Request, res: Response) => {
	const { id } = req.params;
	const result = await SuperModuleService.deleteSuperModule(id as string);

	sendResponse(res, {
		statusCode: StatusCodes.OK,
		success: true,
		message: "Super module deleted successfully",
		data: result,
	});
});

export const SuperModuleController = {
	createSuperModule,
	getSuperModulesByCourse,
	getSuperModuleById,
	updateSuperModule,
	deleteSuperModule,
};
