import { StatusCodes } from "http-status-codes";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/AppError";
import { checkProAccess } from "../../utils/checkProAccess";

//   Lesson exist ?

export const assertLessonExists = async (lessonId: string) => {
	const lesson = await prisma.lesson.findUnique({ where: { id: lessonId } });
	if (!lesson) {
		throw new AppError(StatusCodes.NOT_FOUND, "Lesson not found");
	}
	return lesson;
};

//  Lesson access and Pro Level Verification

export const verifyLessonAccess = async (
	lessonId: string,
	userId?: string,
	userRole?: string,
) => {
	const lesson = await prisma.lesson.findUnique({
		where: { id: lessonId },
		select: {
			id: true,
			isPro: true,
			module: {
				select: {
					superModule: {
						select: {
							courseId: true,
						},
					},
				},
			},
		},
	});

	if (!lesson) {
		throw new AppError(StatusCodes.NOT_FOUND, "Lesson not found");
	}

	const courseId = lesson.module.superModule.courseId;

	// Triggers PAYMENT_REQUIRED (402) if user lacks access
	await checkProAccess({
		userId,
		userRole,
		courseId,
		isPro: lesson.isPro,
	});

	return lesson;
};
