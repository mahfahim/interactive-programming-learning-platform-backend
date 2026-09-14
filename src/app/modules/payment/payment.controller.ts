import type { Request, Response } from "express";
import httpStatus from "http-status";
import { AppError } from "../../utils/AppError";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { PaymentServices } from "./payment.service";

const getMyPayments = catchAsync(async (req: Request, res: Response) => {
	if (!req.user) {
		throw new AppError(httpStatus.UNAUTHORIZED, "Unauthorized access");
	}

	const result = await PaymentServices.getMyPayments(req.query, req.user);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		message: "User payments retrieved successfully",
		data: result.data,
		meta: result.meta,
	});
});

const getAllPayments = catchAsync(async (req: Request, res: Response) => {
	const { data, meta } = await PaymentServices.getAllPayments(req.query);
	sendResponse(res, {
		statusCode: httpStatus.OK,
		message: "Payments Retrieved Successfully",
		data,
		meta,
	});
});

const getSinglePayment = catchAsync(async (req: Request, res: Response) => {
	if (!req.user) {
		throw new AppError(httpStatus.UNAUTHORIZED, "Unauthorized access");
	}

	const paymentId = req.params.paymentId as string;
	const result = await PaymentServices.getSinglePayment(paymentId, req.user);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		message: "Payment Retrieved Successfully",
		data: result,
	});
});

const initiateRefund = catchAsync(async (req: Request, res: Response) => {
	const paymentId = req.params.paymentId as string;
	const { reason } = req.body;

	const result = await PaymentServices.initiateRefund(paymentId, reason);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		message: "Payment refunded and course enrollment cancelled successfully",
		data: result,
	});
});

export const PaymentController = {
	getMyPayments,
	getAllPayments,
	getSinglePayment,
	initiateRefund,
};
