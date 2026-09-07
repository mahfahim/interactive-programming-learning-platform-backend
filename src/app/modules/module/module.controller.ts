import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { ModuleService } from "./module.service";

const createModule = catchAsync(async (req: Request, res: Response) => {
	const result = await ModuleService.createModule(req.body);

	sendResponse(res, {
		statusCode: StatusCodes.CREATED,
		success: true,
		message: "Module created successfully",
		data: result,
	});
});

const getModulesBySuperModule = catchAsync(
	async (req: Request, res: Response) => {
		const { superModuleId } = req.params;
		const result = await ModuleService.getModulesBySuperModule(
			superModuleId as string,
		);

		sendResponse(res, {
			statusCode: StatusCodes.OK,
			success: true,
			message: "Modules retrieved successfully",
			data: result,
		});
	},
);

const getModuleById = catchAsync(async (req: Request, res: Response) => {
	const { id } = req.params;
	const result = await ModuleService.getModuleById(id as string);

	sendResponse(res, {
		statusCode: StatusCodes.OK,
		success: true,
		message: "Module details retrieved successfully",
		data: result,
	});
});

const updateModule = catchAsync(async (req: Request, res: Response) => {
	const { id } = req.params;
	const result = await ModuleService.updateModule(id as string, req.body);

	sendResponse(res, {
		statusCode: StatusCodes.OK,
		success: true,
		message: "Module updated successfully",
		data: result,
	});
});

const deleteModule = catchAsync(async (req: Request, res: Response) => {
	const { id } = req.params;
	const result = await ModuleService.deleteModule(id as string);

	sendResponse(res, {
		statusCode: StatusCodes.OK,
		success: true,
		message: "Module deleted successfully",
		data: result,
	});
});

export const ModuleController = {
	createModule,
	getModulesBySuperModule,
	getModuleById,
	updateModule,
	deleteModule,
};
