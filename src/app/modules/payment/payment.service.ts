// src/modules/payment/payment.service.ts

import httpStatus from "http-status";
import { type Prisma, Role } from "../../../generated/prisma/client";
import config from "../../config";
import type { IQuery } from "../../interfaces";
import { getBkashIdToken } from "../../lib/bkash";
import { prisma } from "../../lib/prisma";
import type { RequestUser } from "../../middlewares/checkAuth";
import { AppError } from "../../utils/AppError";
import { clearCachePattern, getOrSetCache } from "../../utils/cache";
import { courseCacheKeys, paymentCacheKeys } from "../../utils/cacheKey";

const MY_PAYMENTS_TTL = 60; // 1 minute
const ALL_PAYMENTS_TTL = 30; // 30 seconds
const SINGLE_PAYMENT_TTL = 60; // 1 minute

const getMyPayments = async (query: IQuery, user: RequestUser) => {
	const limit = query.limit ? Number(query.limit) : 10;
	const page = query.page ? Number(query.page) : 1;
	const skip = (page - 1) * limit;

	const cacheKey = paymentCacheKeys.my(user.userId, {
		limit,
		page,
		sortBy: query.sortBy || "createdAt",
		sortOrder: query.sortOrder || "desc",
	});

	return getOrSetCache(
		cacheKey,
		async () => {
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
				meta: {
					page,
					limit,
					total,
					totalPages: Math.ceil(total / limit) || 1,
				},
			};
		},
		MY_PAYMENTS_TTL,
	);
};

const getAllPayments = async (query: IQuery) => {
	const limit = query.limit ? Number(query.limit) : 10;
	const page = query.page ? Number(query.page) : 1;
	const skip = (page - 1) * limit;
	const sortBy = (query.sortBy as string) || "createdAt";
	const sortOrder = (query.sortOrder as string) || "desc";

	const cacheKey = paymentCacheKeys.all({
		limit,
		page,
		sortBy,
		sortOrder,
		payerReference: query.payerReference || null,
		status: query.status || null,
		studentEmail: query.studentEmail || null,
	});

	return getOrSetCache(
		cacheKey,
		async () => {
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
					totalPages: Math.ceil(total / limit) || 1,
				},
			};
		},
		ALL_PAYMENTS_TTL,
	);
};

const getSinglePayment = async (paymentId: string, user: RequestUser) => {
	const cacheKey = paymentCacheKeys.detail(paymentId);

	// 1. Fetch raw entity state from Redis or PostgreSQL
	const payment = await getOrSetCache(
		cacheKey,
		async () => {
			return prisma.payment.findUnique({
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
		},
		SINGLE_PAYMENT_TTL,
	);

	// 2. Existence Check
	if (!payment) {
		throw new AppError(httpStatus.NOT_FOUND, "Payment Not Found");
	}

	// 3. Authorization Check (Runs ALWAYS, even on Cache Hits)
	if (user.role === Role.STUDENT && payment.userId !== user.userId) {
		throw new AppError(
			httpStatus.FORBIDDEN,
			"You Are Not Allowed To View This Payment",
		);
	}

	return payment;
};

// Admin Only: Refund payment & cancel enrollment (UNCACHED MUTATION)
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
	const refundedPayment = await prisma.$transaction(async (tx) => {
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

	// D. Post-Transaction Cache Invalidation Execution
	await Promise.allSettled([
		// Clear specific payment detail cache
		clearCachePattern(paymentCacheKeys.detailPattern(payment.id)),
		// Clear affected student's payment history caches
		clearCachePattern(paymentCacheKeys.myUserPattern(payment.userId)),
		// Clear all admin list queries
		clearCachePattern(paymentCacheKeys.allPattern),
		// Clear affected student's enrolled courses cache
		clearCachePattern(courseCacheKeys.my(payment.userId)),
		// Clear course details cache (enrollment counter updated)
		clearCachePattern(courseCacheKeys.detail(payment.courseId)),
		// Clear general course listings cache
		clearCachePattern(courseCacheKeys.pattern),
	]);

	return refundedPayment;
};

export const PaymentServices = {
	getAllPayments,
	getMyPayments,
	getSinglePayment,
	initiateRefund,
};
