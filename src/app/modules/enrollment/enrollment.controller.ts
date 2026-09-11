import type { Request, Response } from "express";
import httpStatus from "http-status";
import type { RequestUser } from "../../middlewares/checkAuth";
import { AppError } from "../../utils/AppError";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { EnrollmentService } from "./enrollment.service";

const enrollCourse = catchAsync(async (req: Request, res: Response) => {
	if (!req.user) {
		throw new AppError(httpStatus.UNAUTHORIZED, "Unauthorized access");
	}
	const user = req.user as RequestUser;
	const { courseId } = req.params;
	const { paymentGateway } = req.body;

	const result = await EnrollmentService.enrollCourse(
		user,
		courseId as string,
		paymentGateway,
	);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: result.isPaidCourse
			? "Payment URL generated successfully"
			: "Successfully enrolled in free course",
		data: result,
	});
});

const sslSuccess = catchAsync(async (req: Request, res: Response) => {
	const redirectUrl = await EnrollmentService.handleSslSuccess(req.body);
	return res.redirect(redirectUrl);
});

const sslFail = catchAsync(async (req: Request, res: Response) => {
	const redirectUrl = await EnrollmentService.handleSslFail(req.body);
	return res.redirect(redirectUrl);
});

const sslCancel = catchAsync(async (req: Request, res: Response) => {
	const redirectUrl = await EnrollmentService.handleSslCancel(req.body);
	return res.redirect(redirectUrl);
});

// bKash Automatic Redirect Callback Handler
const handleBkashCallback = catchAsync(async (req: Request, res: Response) => {
	const redirectUrl = await EnrollmentService.handleBkashCallback(req.query);
	return res.redirect(redirectUrl);
});

const getMyEnrolledCourses = catchAsync(async (req: Request, res: Response) => {
	if (!req.user) {
		throw new AppError(httpStatus.UNAUTHORIZED, "Unauthorized access");
	}
	const user = req.user as RequestUser;
	const result = await EnrollmentService.getMyEnrolledCourses(user.userId);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Enrolled courses retrieved successfully",
		data: result,
	});
});

export const EnrollmentController = {
	enrollCourse,
	sslSuccess,
	sslFail,
	sslCancel,
	handleBkashCallback,
	getMyEnrolledCourses,
};
