import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { AnalyticsService } from "./analytics.service";

const getAdminOverviewStats = catchAsync(
	async (req: Request, res: Response) => {
		const result = await AnalyticsService.getAdminOverviewStats();

		sendResponse(res, {
			statusCode: StatusCodes.OK,
			message: "Admin overview analytics retrieved successfully",
			data: result,
		});
	},
);

export const AnalyticsController = {
	getAdminOverviewStats,
};
