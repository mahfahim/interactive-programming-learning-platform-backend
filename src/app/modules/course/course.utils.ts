import {AppError} from "../../utils/AppError";
import {StatusCodes} from "http-status-codes";
import {prisma} from "../../lib/prisma";

export const assertCourseExists = async (id: string) => {
	const course = await prisma.course.findUnique({ where: { id } });
	if (!course) throw new AppError(StatusCodes.NOT_FOUND, "Course not found");
	return course;
};