import type { Request, Response } from "express";
import StatusCodes from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import type { IRequestUser } from "./certificate.interface";
import { CertificateService } from "./certificate.service";

const getMyCertificate = catchAsync(async (req: Request, res: Response) => {
	const user = req.user as unknown as IRequestUser;
	const { courseId } = req.params;

	const result = await CertificateService.getMyCertificate(
		user.userId,
		courseId as string,
	);

	sendResponse(res, {
		statusCode: StatusCodes.OK,
		success: true,
		message: "Course completion certificate fetched successfully",
		data: result,
	});
});

const verifyCertificate = catchAsync(async (req: Request, res: Response) => {
	const { certificateUid } = req.params;

	const result = await CertificateService.verifyCertificate(
		certificateUid as string,
	);

	sendResponse(res, {
		statusCode: StatusCodes.OK,
		success: true,
		message: "Certificate verified successfully",
		data: result,
	});
});

export const CertificateController = {
	getMyCertificate,
	verifyCertificate,
};
