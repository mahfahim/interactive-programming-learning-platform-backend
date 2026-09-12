// src/middlewares/globalErrorHandler.ts
import type { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { Prisma } from "../../generated/prisma/client";
import { AppError } from "../utils/AppError";

export const globalErrorHandler = async (
	err: any,
	_req: Request,
	res: Response,
	_next: NextFunction,
) => {
	let statusCode: number = httpStatus.INTERNAL_SERVER_ERROR;
	let message = "Something went wrong";
	let errors: any[] = [];

	if (err instanceof AppError) {
		statusCode = err.statusCode;
		message = err.message;
		errors = err.errors || [{ message: err.message }];
	} else if (err instanceof Prisma.PrismaClientValidationError) {
		statusCode = httpStatus.BAD_REQUEST;
		message = "Prisma Validation Error";
		errors = [
			{ message: "You have provided incorrect field type or missing fields" },
		];
	} else if (err instanceof Prisma.PrismaClientKnownRequestError) {
		statusCode = httpStatus.BAD_REQUEST;
		if (err.code === "P2002") {
			message = "Duplicate Key Error";
		} else if (err.code === "P2003") {
			message = "Foreign key constraint failed";
		} else if (err.code === "P2025") {
			message = "Record not found";
		}
		errors = [{ message }];
	} else if (err instanceof Prisma.PrismaClientInitializationError) {
		statusCode = httpStatus.UNAUTHORIZED;
		message = "Database Initialization Error";
		if (err.errorCode === "P1000") {
			errors = [
				{
					message:
						"Authentication failed against database server. Please Check Your Credentials",
				},
			];
		} else if (err.errorCode === "P1001") {
			statusCode = httpStatus.BAD_REQUEST;
			errors = [{ message: "Can't reach database server" }];
		}
	} else if (err instanceof Prisma.PrismaClientUnknownRequestError) {
		statusCode = httpStatus.INTERNAL_SERVER_ERROR;
		message = "Database Error";
		errors = [{ message: "Error occurred during query execution" }];
	} else if (err instanceof Error) {
		message = err.message;
		errors = [{ message: err.message }];
	}

	res.status(statusCode).json({
		success: false,
		message,
		errors,
	});
};
