//src/app/utils/checkProAccess.ts
import { prisma } from "../lib/prisma";
import { AppError } from "./AppError";
import { StatusCodes } from "http-status-codes";
import { Role } from "../../generated/prisma/client";

interface ICheckProAccessParams {
	userId?: string;
	userRole?: string;
	courseId: string;
	isPro: boolean;
}

export const checkProAccess = async ({
	userId,
	userRole,
	courseId,
	isPro,
}: ICheckProAccessParams) => {
	// 1. Grant direct access if the user is an Admin or Instructor
	if (userRole === Role.ADMIN || userRole === Role.INSTRUCTOR) {
		return true;
	}

	// 2. Grant access if content is not Pro (i.e., Free/Preview)
	if (!isPro) {
		return true;
	}

	// 3. Retrieve the course price to check if it is free or paid
	const course = await prisma.course.findUnique({
		where: { id: courseId },
		select: { price: true },
	});

	if (!course) {
		throw new AppError(StatusCodes.NOT_FOUND, "Course not found");
	}

	// 4. Grant access if the course itself is free
	if (Number(course.price) <= 0) {
		return true;
	}

	// 5. Require authentication for Pro content in paid courses
	if (!userId) {
		throw new AppError(
			StatusCodes.UNAUTHORIZED,
			"You must be logged in to access this feature",
		);
	}

	// 6. Verify if the user has an active paid enrollment
	const enrollment = await prisma.enrollment.findUnique({
		where: {
			userId_courseId: { userId, courseId },
		},
	});

	if (!enrollment?.isPaid) {
		// Return 402 status code so the frontend can trigger the payment modal
		throw new AppError(StatusCodes.PAYMENT_REQUIRED, "PAYMENT_REQUIRED");
	}

	return true;
};
