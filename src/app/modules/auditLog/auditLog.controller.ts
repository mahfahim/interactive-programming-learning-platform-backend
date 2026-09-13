import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import type { IAuditLogFilterQuery } from "./auditLog.interface";
import { AuditLogService } from "./auditLog.service";

const getAuditLogs = catchAsync(async (req: Request, res: Response) => {
	const result = await AuditLogService.getAll(
		req.query as unknown as IAuditLogFilterQuery,
	);

	sendResponse(res, {
		statusCode: StatusCodes.OK,
		message: "Audit logs retrieved successfully",
		meta: result.meta,
		data: result.data,
	});
});

export const AuditLogController = {
	getAuditLogs,
};
