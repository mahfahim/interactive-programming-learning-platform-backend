import httpStatus from "http-status";
import { type Prisma, Role } from "../../../generated/prisma/client";
import config from "../../config";
import type { IQuery } from "../../interfaces";
import { getBkashIdToken } from "../../lib/bkash";
import { prisma } from "../../lib/prisma";
import type { RequestUser } from "../../middlewares/checkAuth";
import { AppError } from "../../utils/AppError";

const getMyPayments = async (query: IQuery, user: RequestUser) => {
	const limit = query.limit ? Number(query.limit) : 10;
	const page = query.page ? Number(query.page) : 1;
	const skip = (page - 1) * limit;

	const [payments, total] = await Promise.all([
		prisma.payment.findMany({
			where: { userId: user.userId },
			take: limit,
			skip,
			orderBy: {
				[(query.sortBy as string) || "createdAt"]:
					(query.sortOrder as string) || "desc",
			},
			include: {
				course: {
					select: {
						id: true,
						title: true,
						slug: true,
						coverImageUrl: true,
					},
				},
			},
		}),
		prisma.payment.count({ where: { userId: user.userId } }),
	]);

	return {
		data: payments,
		meta: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 },
	};
};

const getAllPayments = async (query: IQuery) => {
	const limit = query.limit ? Number(query.limit) : 10;
	const page = query.page ? Number(query.page) : 1;
	const skip = (page - 1) * limit;
	const sortBy = (query.sortBy as string) || "createdAt";
	const sortOrder = (query.sortOrder as string) || "desc";

	const andConditions: Prisma.PaymentWhereInput[] = [];

	if (query.payerReference) {
		andConditions.push({
			payerReference: {
				contains: query.payerReference as string,
				mode: "insensitive",
			},
		});
	}

	if (query.status) {
		andConditions.push({
			status: query.status as any,
		});
	}

	if (query.studentEmail) {
		andConditions.push({
			user: {
				email: {
					contains: query.studentEmail as string,
					mode: "insensitive",
				},
			},
		});
	}

	const whereConditions: Prisma.PaymentWhereInput =
		andConditions.length > 0 ? { AND: andConditions } : {};

	const payments = await prisma.payment.findMany({
		where: whereConditions,
		take: limit,
		skip,
		orderBy: { [sortBy]: sortOrder },
		include: {
			user: {
				select: {
					id: true,
					name: true,
					email: true,
				},
			},
			course: {
				select: {
					id: true,
					title: true,
					slug: true,
				},
			},
		},
	});

	const total = await prisma.payment.count({
		where: whereConditions,
	});

	return {
		data: payments,
		meta: {
			page,
			limit,
			total,
			totalPages: Math.ceil(total / limit),
		},
	};
};

const getSinglePayment = async (paymentId: string, user: RequestUser) => {
	const payment = await prisma.payment.findUnique({
		where: { id: paymentId },
		include: {
			user: {
				select: {
					id: true,
					name: true,
					email: true,
				},
			},
			course: {
				select: {
					id: true,
					title: true,
					slug: true,
					coverImageUrl: true,
				},
			},
		},
	});

	if (!payment) {
		throw new AppError(httpStatus.NOT_FOUND, "Payment Not Found");
	}

	if (user.role === Role.STUDENT) {
		if (payment.userId !== user.userId) {
			throw new AppError(
				httpStatus.FORBIDDEN,
				"You Are Not Allowed To View This Payment",
			);
		}
	}

	return payment;
};

// Admin Only: Refund payment & cancel enrollment
const initiateRefund = async (paymentId: string, reason?: string) => {
	const payment = await prisma.payment.findUnique({
		where: { id: paymentId },
	});

	if (!payment) {
		throw new AppError(httpStatus.NOT_FOUND, "Payment record not found");
	}

	if (payment.status !== "COMPLETED") {
		throw new AppError(
			httpStatus.BAD_REQUEST,
			`Cannot refund payment with status '${payment.status}'. Only COMPLETED payments can be refunded.`,
		);
	}

	let gatewayRefundData: any = null;

	// A. bKash Refund Logic
	if (payment.paymentGateway === "BKASH") {
		if (!payment.bkashPaymentId || !payment.bkashTrxId) {
			throw new AppError(
				httpStatus.BAD_REQUEST,
				"bKash Payment ID or Transaction ID missing for this record",
			);
		}

		const bkashToken = await getBkashIdToken();
		if (!bkashToken) {
			throw new AppError(
				httpStatus.INTERNAL_SERVER_ERROR,
				"Failed to retrieve bKash authentication token",
			);
		}

		const response = await fetch(
			`${config.bkash_base_url}/tokenized/checkout/payment/refund`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
					authorization: bkashToken,
					"x-app-key": config.bkash_app_key as string,
				},
				body: JSON.stringify({
					paymentID: payment.bkashPaymentId,
					amount: String(payment.amount),
					trxID: payment.bkashTrxId,
					sku: "Course Enrolment Refund",
					reason: reason || "Admin Initiated Refund",
				}),
			},
		);

		gatewayRefundData = await response.json();

		if (gatewayRefundData.statusCode !== "0000") {
			throw new AppError(
				httpStatus.BAD_REQUEST,
				gatewayRefundData.statusMessage || "bKash Refund Request Failed",
			);
		}
	}
	// B. SSLCommerz Refund Logic
	else if (payment.paymentGateway === "SSLCOMMERZ") {
		const bankTranId =
			payment.sslValId ||
			(payment.gatewayResponse as any)?.bank_tran_id ||
			payment.merchantInvoiceNumber;

		const baseUrl = config.ssl_is_live
			? "https://securepay.sslcommerz.com"
			: "https://sandbox.sslcommerz.com";

		const sslRefundUrl = `${baseUrl}/validator/api/merchantTransIDvalidationAPI.php?refund_amount=${payment.amount}&refund_remarks=${encodeURIComponent(reason || "Admin Refund")}&bank_tran_id=${bankTranId}&refe_id=${payment.merchantInvoiceNumber}&store_id=${config.ssl_store_id}&store_passwd=${config.ssl_store_password}&v=1&format=json`;

		const response = await fetch(sslRefundUrl, { method: "GET" });
		gatewayRefundData = await response.json();

		if (
			gatewayRefundData.status !== "success" &&
			gatewayRefundData.APIConnect !== "DONE"
		) {
			throw new AppError(
				httpStatus.BAD_REQUEST,
				gatewayRefundData.errorReason || "SSLCommerz Refund Request Failed",
			);
		}
	} else {
		throw new AppError(
			httpStatus.BAD_REQUEST,
			"Unsupported payment gateway for refund",
		);
	}

	// C. Database Atomic Transaction
	return prisma.$transaction(async (tx) => {
		// 1. Update Payment Status
		const updatedPayment = await tx.payment.update({
			where: { id: payment.id },
			data: {
				status: "REFUNDED",
				gatewayResponse: {
					...((payment.gatewayResponse as object) || {}),
					refundResponse: gatewayRefundData,
				},
			},
		});

		// 2. Find and Delete Enrollment
		const existingEnrollment = await tx.enrollment.findUnique({
			where: {
				userId_courseId: {
					userId: payment.userId,
					courseId: payment.courseId,
				},
			},
		});

		if (existingEnrollment) {
			await tx.enrollment.delete({
				where: { id: existingEnrollment.id },
			});

			// 3. Decrement Course Enrollment Count
			await tx.course.update({
				where: { id: payment.courseId },
				data: {
					enrollmentCount: {
						decrement: 1,
					},
				},
			});
		}

		return updatedPayment;
	});
};

export const PaymentServices = {
	getAllPayments,
	getMyPayments,
	getSinglePayment,
	initiateRefund,
};
