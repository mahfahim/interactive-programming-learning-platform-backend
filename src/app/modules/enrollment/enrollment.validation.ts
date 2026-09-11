import { z } from "zod";

const enrollCourseValidationSchema = z.object({
	paymentGateway: z
		.enum(["BKASH", "SSLCOMMERZ"])
		.optional()
		.default("SSLCOMMERZ"),
});

const executePaymentValidationSchema = z.object({
	paymentID: z.string({
		message: "Payment ID is required",
	}),
});

export const EnrollmentValidation = {
	enrollCourseValidationSchema,
	executePaymentValidationSchema,
};
