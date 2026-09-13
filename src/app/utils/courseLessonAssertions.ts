import { StatusCodes } from "http-status-codes";
import { prisma } from "../lib/prisma";
import { AppError } from "./AppError";
import { getOrSetCache } from "./cache";
import { courseCacheKeys, lessonCacheKeys } from "./cacheKey";
import { checkProAccess } from "./checkProAccess";

const ASSERTION_CACHE_TTL = 600; // 10 minutes

//  Asserts course existence with Cache-Aside pattern.

export const assertCourseExists = async (id: string) => {
	const cacheKey = courseCacheKeys.detail(id);

	return await getOrSetCache(
		cacheKey,
		async () => {
			const course = await prisma.course.findUnique({ where: { id } });
			if (!course) {
				throw new AppError(StatusCodes.NOT_FOUND, "Course not found");
			}
			return course;
		},
		ASSERTION_CACHE_TTL,
	);
};

// Asserts lesson existence with Cache-Aside pattern.

export const assertLessonExists = async (lessonId: string) => {
	const cacheKey = lessonCacheKeys.detail(lessonId);

	return await getOrSetCache(
		cacheKey,
		async () => {
			const lesson = await prisma.lesson.findUnique({
				where: { id: lessonId },
			});
			if (!lesson) {
				throw new AppError(StatusCodes.NOT_FOUND, "Lesson not found");
			}
			return lesson;
		},
		ASSERTION_CACHE_TTL,
	);
};

//   Verifies lesson access by caching the nested relational metadata lookup
//   while dynamically evaluating user Pro permissions on every invocation.

export const verifyLessonAccess = async (
	lessonId: string,
	userId?: string,
	userRole?: string,
) => {
	const cacheKey = `lessons:access-meta:${lessonId}`;

	const lesson = await getOrSetCache(
		cacheKey,
		async () => {
			const foundLesson = await prisma.lesson.findUnique({
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

			if (!foundLesson) {
				throw new AppError(StatusCodes.NOT_FOUND, "Lesson not found");
			}

			return foundLesson;
		},
		ASSERTION_CACHE_TTL,
	);

	const courseId = lesson.module.superModule.courseId;

	// Dynamic security verification remains outside cache evaluation
	await checkProAccess({
		userId,
		userRole,
		courseId,
		isPro: lesson.isPro,
	});

	return lesson;
};
