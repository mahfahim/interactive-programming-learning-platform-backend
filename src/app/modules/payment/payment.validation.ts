import { z } from "zod";

const initiateRefundValidationSchema = z.object({
	reason: z.string().optional(),
});

export const PaymentValidation = {
	initiateRefundValidationSchema,
};
