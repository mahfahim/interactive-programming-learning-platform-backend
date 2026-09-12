import type { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import type z from "zod";
import { AppError } from "../utils/AppError";
import { catchAsync } from "../utils/catchAsync";

export const validateRequest = (zodSchema: z.ZodObject) => {
	return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
		const payload = req.body ?? {};

		const result = await zodSchema.safeParseAsync(payload);

		if (!result.success) {
			const formattedErrors = result.error.issues.map((issue) => ({
				path: issue.path.join("."),
				message: issue.message,
			}));

			throw new AppError(
				httpStatus.BAD_REQUEST,
				"Validation Error",
				formattedErrors,
			);
		}

		req.body = result.data;
		next();
	});
};
