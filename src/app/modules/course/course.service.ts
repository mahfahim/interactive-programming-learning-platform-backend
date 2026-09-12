import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/AppError";
import { StatusCodes } from "http-status-codes";
import type { Prisma } from "../../../generated/prisma/client";
import type {
	ICreateCourseInput,
	IUpdateCourseInput,
	ICourseQueryParams,
} from "./course.interface";
import { assertCourseExists } from "./course.utils";
import { getOrSetCache, clearCachePattern } from "../../utils/cache";
import { courseCacheKeys } from "../../utils/cacheKey";

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

	const newCourse = await prisma.$transaction(async (tx) => {
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

	await clearCachePattern(courseCacheKeys.pattern);
	return newCourse;
};

const getCourses = async (params: ICourseQueryParams) => {
	const cacheKey = courseCacheKeys.list(params as Record<string, unknown>);

	return getOrSetCache(
		cacheKey,
		async () => {
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
		},
		300,
	);
};

const getMyCourses = async (userId: string) => {
	const cacheKey = courseCacheKeys.my(userId);

	return getOrSetCache(
		cacheKey,
		async () => {
			return prisma.course.findMany({
				where: { instructorId: userId },
				include: defaultCourseDetailsInclude,
			});
		},
		600,
	);
};

const getCourseById = async (id: string) => {
	const cacheKey = courseCacheKeys.detail(id);

	return getOrSetCache(
		cacheKey,
		async () => {
			const course = await prisma.course.findUnique({
				where: { id },
				include: defaultCourseDetailsInclude,
			});

			if (!course) {
				throw new AppError(StatusCodes.NOT_FOUND, "Course not found");
			}

			return course;
		},
		3600,
	);
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

	const updatedCourse = await prisma.$transaction(async (tx) => {
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

	await clearCachePattern(courseCacheKeys.pattern);
	return updatedCourse;
};

const deleteCourse = async (id: string) => {
	await assertCourseExists(id);
	const deletedCourse = await prisma.course.delete({ where: { id } });

	await clearCachePattern(courseCacheKeys.pattern);
	return deletedCourse;
};

export const CourseService = {
	createCourse,
	getCourses,
	getMyCourses,
	getCourseById,
	updateCourse,
	deleteCourse,
};
