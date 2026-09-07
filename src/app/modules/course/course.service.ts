import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/AppError";
import { StatusCodes } from "http-status-codes";
import type { Prisma } from "../../../generated/prisma/client";
import type {
	ICreateCourseInput,
	IUpdateCourseInput,
	ICourseQueryParams,
} from "./course.interface";

// Reusable Include Schema
export const defaultCourseDetailsInclude = {
	description: {
		include: {
			learningOutcomes: { orderBy: { displayOrder: "asc" as const } },
			prerequisites: { orderBy: { displayOrder: "asc" as const } },
		},
	},
	superModules: {
		orderBy: { displayOrder: "asc" as const },
		include: {
			modules: {
				orderBy: { displayOrder: "asc" as const },
				include: {
					lessons: {
						orderBy: { displayOrder: "asc" as const },
						include: {
							video: true,
							article: {
								include: {
									sections: { orderBy: { displayOrder: "asc" as const } },
								},
							},
						},
					},
				},
			},
		},
	},
};

export const assertCourseExists = async (id: string) => {
	const course = await prisma.course.findUnique({ where: { id } });
	if (!course) throw new AppError(StatusCodes.NOT_FOUND, "Course not found");
	return course;
};

const createCourse = async (payload: ICreateCourseInput) => {
	const existingSlug = await prisma.course.findUnique({
		where: { slug: payload.slug },
	});
	if (existingSlug) {
		throw new AppError(
			StatusCodes.CONFLICT,
			"A course with this slug already exists",
		);
	}

	return prisma.$transaction(async (tx) => {
		return tx.course.create({
			data: {
				title: payload.title,
				slug: payload.slug,
				coverImageUrl: payload.coverImageUrl,
				description: {
					create: {
						shortDescription: payload.description.shortDescription,
						fullDescription: payload.description.fullDescription,
						level: payload.description.level,
						language: payload.description.language,
						learningOutcomes: {
							create: payload.description.learningOutcomes.map((item) => ({
								outcomeText: item.outcomeText,
								displayOrder: item.displayOrder,
							})),
						},
						prerequisites: {
							create: payload.description.prerequisites.map((item) => ({
								prerequisiteText: item.prerequisiteText,
								displayOrder: item.displayOrder,
							})),
						},
					},
				},
			},
			include: defaultCourseDetailsInclude,
		});
	});
};

const getCourses = async (params: ICourseQueryParams) => {
	const {
		search,
		level,
		page = 1,
		limit = 10,
		sortBy = "createdAt",
		sortOrder = "desc",
	} = params;
	const skip = (page - 1) * limit;

	const where: Prisma.CourseWhereInput = {};

	if (search) {
		where.OR = [
			{ title: { contains: search, mode: "insensitive" } },
			{ slug: { contains: search, mode: "insensitive" } },
			{
				description: {
					shortDescription: { contains: search, mode: "insensitive" },
				},
			},
		];
	}

	if (level) {
		where.description = {
			...where.description,
			level,
		} as Prisma.CourseDescriptionWhereInput;
	}

	const [data, total] = await Promise.all([
		prisma.course.findMany({
			where,
			skip,
			take: limit,
			orderBy: { [sortBy]: sortOrder },
			include: {
				description: {
					include: {
						learningOutcomes: { orderBy: { displayOrder: "asc" } },
						prerequisites: { orderBy: { displayOrder: "asc" } },
					},
				},
			},
		}),
		prisma.course.count({ where }),
	]);

	return {
		data,
		meta: {
			page,
			limit,
			total,
			totalPages: Math.ceil(total / limit) || 1,
		},
	};
};

const getMyCourses = async (userId: string) => {
	return prisma.course.findMany({
		where: { instructorId: userId },
		include: defaultCourseDetailsInclude,
	});
};

const getCourseById = async (id: string) => {
	const course = await prisma.course.findUnique({
		where: { id },
		include: defaultCourseDetailsInclude,
	});

	if (!course) {
		throw new AppError(StatusCodes.NOT_FOUND, "Course not found");
	}

	return course;
};

const updateCourse = async (id: string, payload: IUpdateCourseInput) => {
	await assertCourseExists(id);

	if (payload.slug) {
		const existingSlug = await prisma.course.findFirst({
			where: { slug: payload.slug, NOT: { id } },
		});
		if (existingSlug) {
			throw new AppError(
				StatusCodes.CONFLICT,
				"Slug is already in use by another course",
			);
		}
	}

	return prisma.$transaction(async (tx) => {
		if (payload.description?.learningOutcomes) {
			await tx.courseLearningOutcome.deleteMany({
				where: { courseDescriptionId: id },
			});
		}

		if (payload.description?.prerequisites) {
			await tx.coursePrerequisite.deleteMany({
				where: { courseDescriptionId: id },
			});
		}

		return tx.course.update({
			where: { id },
			data: {
				title: payload.title,
				slug: payload.slug,
				coverImageUrl: payload.coverImageUrl,
				description: payload.description
					? {
							upsert: {
								create: {
									shortDescription: payload.description.shortDescription || "",
									fullDescription: payload.description.fullDescription || "",
									level: payload.description.level || "BEGINNER",
									language: payload.description.language || "ENGLISH",
									learningOutcomes: payload.description.learningOutcomes
										? { create: payload.description.learningOutcomes }
										: undefined,
									prerequisites: payload.description.prerequisites
										? { create: payload.description.prerequisites }
										: undefined,
								},
								update: {
									shortDescription: payload.description.shortDescription,
									fullDescription: payload.description.fullDescription,
									level: payload.description.level,
									language: payload.description.language,
									learningOutcomes: payload.description.learningOutcomes
										? { create: payload.description.learningOutcomes }
										: undefined,
									prerequisites: payload.description.prerequisites
										? { create: payload.description.prerequisites }
										: undefined,
								},
							},
						}
					: undefined,
			},
			include: defaultCourseDetailsInclude,
		});
	});
};

const deleteCourse = async (id: string) => {
	await assertCourseExists(id);
	return prisma.course.delete({ where: { id } });
};

const enrollCourse = async (userId: string, courseId: string) => {
	await assertCourseExists(courseId);

	const existingEnrollment = await prisma.enrollment.findUnique({
		where: {
			userId_courseId: { userId, courseId },
		},
	});

	if (existingEnrollment) {
		throw new AppError(
			StatusCodes.CONFLICT,
			"User is already enrolled in this course",
		);
	}

	return prisma.$transaction(async (tx) => {
		const enrollment = await tx.enrollment.create({
			data: {
				userId,
				courseId,
				isPaid: true,
			},
		});

		await tx.course.update({
			where: { id: courseId },
			data: {
				enrollmentCount: { increment: 1 },
			},
		});

		return enrollment;
	});
};

const getMyEnrolledCourses = async (userId: string) => {
	const enrollments = await prisma.enrollment.findMany({
		where: { userId },
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
		const completedLessons = completedLessonsMap.get(enrollment.courseId) || 0;
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
};

export const CourseService = {
	createCourse,
	getCourses,
	getMyCourses,
	getCourseById,
	updateCourse,
	deleteCourse,
	enrollCourse,
	getMyEnrolledCourses,
};
