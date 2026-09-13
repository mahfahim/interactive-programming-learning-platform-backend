import httpStatus from "http-status";
import config from "../../config";
import { getBkashIdToken } from "../../lib/bkash";
import { prisma } from "../../lib/prisma";
import { initiateSslPayment, validateSslPayment } from "../../lib/sslcommerz";
import type { RequestUser } from "../../middlewares/checkAuth";
import { AppError } from "../../utils/AppError";
import { clearCachePattern, getOrSetCache } from "../../utils/cache";
import { courseCacheKeys, enrollmentCacheKeys } from "../../utils/cacheKey";
import { assertCourseExists } from "../../utils/courseLessonAssertions";

// 1. Enroll in free course or initiate payment (bKash / SSLCommerz)
const enrollCourse = async (
	user: RequestUser,
	courseId: string,
	paymentGateway: "BKASH" | "SSLCOMMERZ" = "SSLCOMMERZ",
) => {
	const course = await assertCourseExists(courseId);

	const existingEnrollment = await prisma.enrollment.findUnique({
		where: {
			userId_courseId: {
				userId: user.userId,
				courseId: course.id,
			},
		},
	});

	if (existingEnrollment?.isPaid) {
		throw new AppError(
			httpStatus.CONFLICT,
			"You are already enrolled in this course.",
		);
	}

	// A. Free course logic
	if (!course.price || Number(course.price) <= 0) {
		const result = await prisma.$transaction(async (tx) => {
			const enrollment = await tx.enrollment.upsert({
				where: {
					userId_courseId: { userId: user.userId, courseId: course.id },
				},
				create: {
					userId: user.userId,
					courseId: course.id,
					isPaid: true,
				},
				update: {
					isPaid: true,
				},
			});

			await tx.course.update({
				where: { id: course.id },
				data: { enrollmentCount: { increment: 1 } },
			});

			return {
				isPaidCourse: false,
				message: "Successfully enrolled in free course",
				enrollment,
			};
		});

		await clearCachePattern(enrollmentCacheKeys.my(user.userId));
		await clearCachePattern(courseCacheKeys.pattern);

		return result;
	}

	// B. Paid course logic
	const merchantInvoiceNumber = `INV-${Date.now()}-${crypto.randomUUID().slice(0, 8)}`;

	const payment = await prisma.payment.create({
		data: {
			userId: user.userId,
			courseId: course.id,
			amount: course.price,
			merchantInvoiceNumber,
			payerReference: user.email,
			paymentGateway,
			status: "UNPAID",
		},
	});

	// Option 1: SSLCommerz Integration
	if (paymentGateway === "SSLCOMMERZ") {
		try {
			const sslResult = await initiateSslPayment({
				amount: Number(course.price),
				transactionId: merchantInvoiceNumber,
				customerName: user.email.split("@")[0] || "Student",
				customerEmail: user.email,
				productName: course.title,
			});

			await prisma.payment.update({
				where: { id: payment.id },
				data: { sslSessionKey: sslResult.sessionkey },
			});

			return {
				isPaidCourse: true,
				paymentGateway: "SSLCOMMERZ",
				paymentId: payment.id,
				transactionId: merchantInvoiceNumber,
				redirectURL: sslResult.GatewayPageURL,
			};
		} catch (error: any) {
			await prisma.payment.update({
				where: { id: payment.id },
				data: {
					status: "FAILED",
					gatewayResponse: error?.message || error,
				},
			});
			throw error;
		}
	}

	// Option 2: bKash Integration
	const bkashToken = await getBkashIdToken();

	if (!bkashToken) {
		throw new AppError(
			httpStatus.INTERNAL_SERVER_ERROR,
			"Failed to retrieve bKash authentication token",
		);
	}

	const response = await fetch(
		`${config.bkash_base_url}/tokenized/checkout/create`,
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
				authorization: bkashToken,
				"x-app-key": config.bkash_app_key as string,
			},
			body: JSON.stringify({
				mode: "0011",
				payerReference: user.email,
				callbackURL: `${config.backend_url}/api/v1/enrollments/bkash-callback`,
				amount: String(course.price),
				currency: "BDT",
				intent: "sale",
				merchantInvoiceNumber,
			}),
		},
	);

	const result = await response.json();

	if (result.statusCode !== "0000") {
		await prisma.payment.update({
			where: { id: payment.id },
			data: { status: "FAILED", gatewayResponse: result },
		});

		throw new AppError(
			httpStatus.BAD_REQUEST,
			result.statusMessage || "bKash Payment Initiation Failed",
		);
	}

	await prisma.payment.update({
		where: { id: payment.id },
		data: { bkashPaymentId: result.paymentID },
	});

	return {
		isPaidCourse: true,
		paymentGateway: "BKASH",
		paymentId: payment.id,
		transactionId: merchantInvoiceNumber,
		bkashURL: result.bkashURL,
		paymentID: result.paymentID,
	};
};

// 2. SSLCommerz Success Callback Handler
const handleSslSuccess = async (payload: Record<string, any>) => {
	const { tran_id, val_id, amount } = payload;

	const payment = await prisma.payment.findUnique({
		where: { merchantInvoiceNumber: tran_id },
	});

	if (!payment) {
		throw new AppError(httpStatus.NOT_FOUND, "Payment Record Not Found");
	}

	if (Number(amount) !== Number(payment.amount)) {
		await prisma.payment.update({
			where: { id: payment.id },
			data: { status: "FAILED", gatewayResponse: payload },
		});
		throw new AppError(httpStatus.BAD_REQUEST, "Payment amount mismatch");
	}

	const validationResult = await validateSslPayment(val_id);

	if (
		validationResult.status !== "VALID" &&
		validationResult.status !== "VALIDATED"
	) {
		await prisma.payment.update({
			where: { id: payment.id },
			data: { status: "FAILED", gatewayResponse: validationResult },
		});
		return `${config.frontend_url}/payment/callback?status=failed&tran_id=${tran_id}`;
	}

	await prisma.$transaction(async (tx) => {
		await tx.payment.update({
			where: { id: payment.id },
			data: {
				status: "COMPLETED",
				sslValId: val_id,
				paidAt: new Date(),
				gatewayResponse: validationResult,
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

		if (!existingEnrollment) {
			await tx.enrollment.create({
				data: {
					userId: payment.userId,
					courseId: payment.courseId,
					isPaid: true,
				},
			});

			await tx.course.update({
				where: { id: payment.courseId },
				data: { enrollmentCount: { increment: 1 } },
			});
		} else if (!existingEnrollment.isPaid) {
			await tx.enrollment.update({
				where: { id: existingEnrollment.id },
				data: { isPaid: true },
			});

			await tx.course.update({
				where: { id: payment.courseId },
				data: { enrollmentCount: { increment: 1 } },
			});
		}
	});

	await clearCachePattern(enrollmentCacheKeys.my(payment.userId));
	await clearCachePattern(courseCacheKeys.pattern);

	return `${config.frontend_url}/payment/callback?status=success&tran_id=${tran_id}`;
};

// 3. SSLCommerz Fail Handler
const handleSslFail = async (payload: Record<string, any>) => {
	const { tran_id } = payload;
	await prisma.payment.updateMany({
		where: { merchantInvoiceNumber: tran_id },
		data: { status: "FAILED", gatewayResponse: payload },
	});
	return `${config.frontend_url}/payment/callback?status=failed&tran_id=${tran_id}`;
};

// 4. SSLCommerz Cancel Handler
const handleSslCancel = async (payload: Record<string, any>) => {
	const { tran_id } = payload;
	await prisma.payment.updateMany({
		where: { merchantInvoiceNumber: tran_id },
		data: { status: "CANCELLED", gatewayResponse: payload },
	});
	return `${config.frontend_url}/payment/callback?status=cancelled&tran_id=${tran_id}`;
};

// 5. Automatic bKash Callback Handler
const handleBkashCallback = async (query: Record<string, any>) => {
	const { paymentID, status } = query;

	if (status === "cancel") {
		if (paymentID) {
			await prisma.payment.updateMany({
				where: { bkashPaymentId: paymentID as string },
				data: { status: "CANCELLED" },
			});
		}
		return `${config.frontend_url}/payment/callback?status=cancelled`;
	}

	if (status === "failure" || status !== "success" || !paymentID) {
		if (paymentID) {
			await prisma.payment.updateMany({
				where: { bkashPaymentId: paymentID as string },
				data: { status: "FAILED" },
			});
		}
		return `${config.frontend_url}/payment/callback?status=failed`;
	}

	const payment = await prisma.payment.findUnique({
		where: { bkashPaymentId: paymentID as string },
	});

	if (!payment) {
		return `${config.frontend_url}/payment/callback?status=failed`;
	}

	if (payment.status === "COMPLETED") {
		return `${config.frontend_url}/payment/callback?status=success&paymentID=${paymentID}`;
	}

	const bkashToken = await getBkashIdToken();

	if (!bkashToken) {
		await prisma.payment.update({
			where: { id: payment.id },
			data: {
				status: "FAILED",
				gatewayResponse: { error: "Failed to fetch token" },
			},
		});
		return `${config.frontend_url}/payment/callback?status=failed`;
	}

	const response = await fetch(
		`${config.bkash_base_url}/tokenized/checkout/execute`,
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
				authorization: bkashToken,
				"x-app-key": config.bkash_app_key as string,
			},
			body: JSON.stringify({ paymentID }),
		},
	);

	const result = await response.json();

	if (
		result.statusCode !== "0000" ||
		result.transactionStatus !== "Completed"
	) {
		await prisma.payment.update({
			where: { id: payment.id },
			data: { status: "FAILED", gatewayResponse: result },
		});

		return `${config.frontend_url}/payment/callback?status=failed`;
	}

	await prisma.$transaction(async (tx) => {
		await tx.payment.update({
			where: { id: payment.id },
			data: {
				status: "COMPLETED",
				bkashTrxId: result.trxID,
				paidAt: new Date(),
				gatewayResponse: result,
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

		if (!existingEnrollment) {
			await tx.enrollment.create({
				data: {
					userId: payment.userId,
					courseId: payment.courseId,
					isPaid: true,
				},
			});

			await tx.course.update({
				where: { id: payment.courseId },
				data: { enrollmentCount: { increment: 1 } },
			});
		} else if (!existingEnrollment.isPaid) {
			await tx.enrollment.update({
				where: { id: existingEnrollment.id },
				data: { isPaid: true },
			});

			await tx.course.update({
				where: { id: payment.courseId },
				data: { enrollmentCount: { increment: 1 } },
			});
		}
	});

	await clearCachePattern(enrollmentCacheKeys.my(payment.userId));
	await clearCachePattern(courseCacheKeys.pattern);

	return `${config.frontend_url}/payment/callback?status=success&paymentID=${paymentID}`;
};

// 6. Get Enrolled Courses
const getMyEnrolledCourses = async (userId: string) => {
	return getOrSetCache(
		enrollmentCacheKeys.my(userId),
		async () => {
			const enrollments = await prisma.enrollment.findMany({
				where: { userId, isPaid: true },
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
				orderBy: { enrolledAt: "desc" },
			});

			if (enrollments.length === 0) return [];

			const courseIds = enrollments.map((e) => e.courseId);

			const [allLessons, completedProgresses] = await Promise.all([
				prisma.lesson.findMany({
					where: {
						module: {
							superModule: {
								courseId: { in: courseIds },
							},
						},
					},
					select: {
						id: true,
						module: {
							select: {
								superModule: {
									select: { courseId: true },
								},
							},
						},
					},
				}),
				prisma.lessonProgress.findMany({
					where: {
						userId,
						isCompleted: true,
						lesson: {
							module: {
								superModule: {
									courseId: { in: courseIds },
								},
							},
						},
					},
					select: {
						lessonId: true,
						lesson: {
							select: {
								module: {
									select: {
										superModule: {
											select: { courseId: true },
										},
									},
								},
							},
						},
					},
				}),
			]);

			const totalLessonsMap = new Map<string, number>();
			const completedLessonsMap = new Map<string, number>();

			allLessons.forEach((lesson) => {
				const cId = lesson.module.superModule.courseId;
				totalLessonsMap.set(cId, (totalLessonsMap.get(cId) || 0) + 1);
			});

			completedProgresses.forEach((progress) => {
				const cId = progress.lesson.module.superModule.courseId;
				completedLessonsMap.set(cId, (completedLessonsMap.get(cId) || 0) + 1);
			});

			return enrollments.map((enrollment) => {
				const totalLessons = totalLessonsMap.get(enrollment.courseId) || 0;
				const completedLessons =
					completedLessonsMap.get(enrollment.courseId) || 0;
				const progressPercentage =
					totalLessons > 0
						? Number(((completedLessons / totalLessons) * 100).toFixed(2))
						: 0;

				return {
					enrollmentId: enrollment.id,
					enrolledAt: enrollment.enrolledAt,
					isPaid: enrollment.isPaid,
					course: enrollment.course,
					progressPercentage,
					completedLessons,
					totalLessons,
				};
			});
		},
		300,
	);
};

export const EnrollmentService = {
	enrollCourse,
	handleSslSuccess,
	handleSslFail,
	handleSslCancel,
	handleBkashCallback,
	getMyEnrolledCourses,
};
