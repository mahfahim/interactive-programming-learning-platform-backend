import { StatusCodes } from "http-status-codes";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/AppError";
import { clearCachePattern, getOrSetCache } from "../../utils/cache";
import { superModuleCacheKeys } from "../../utils/cacheKey";
import { assertCourseExists } from "../../utils/courseLessonAssertions";
import type {
	ICreateSuperModuleInput,
	IUpdateSuperModuleInput,
} from "./superModule.interface";

export const assertSuperModuleExists = async (id: string) => {
	const superModule = await prisma.superModule.findUnique({ where: { id } });

	if (!superModule)
		throw new AppError(StatusCodes.NOT_FOUND, "Super module not found");

	return superModule;
};

const createSuperModule = async (payload: ICreateSuperModuleInput) => {
	await assertCourseExists(payload.courseId);

	const result = await prisma.superModule.create({ data: payload });

	await clearCachePattern(superModuleCacheKeys.pattern);

	return result;
};

const getSuperModulesByCourse = async (courseId: string) => {
	await assertCourseExists(courseId);

	return getOrSetCache(
		superModuleCacheKeys.byCourse(courseId),
		() =>
			prisma.superModule.findMany({
				where: { courseId },
				orderBy: { displayOrder: "asc" },
				include: {
					modules: {
						orderBy: { displayOrder: "asc" },
					},
				},
			}),
		600,
	);
};

const getSuperModuleById = async (id: string) => {
	return getOrSetCache(
		superModuleCacheKeys.detail(id),
		async () => {
			const superModule = await prisma.superModule.findUnique({
				where: { id },
				include: {
					modules: {
						orderBy: { displayOrder: "asc" },
						include: {
							lessons: { orderBy: { displayOrder: "asc" } },
						},
					},
				},
			});

			if (!superModule)
				throw new AppError(StatusCodes.NOT_FOUND, "Super module not found");

			return superModule;
		},
		3600,
	);
};

const updateSuperModule = async (
	id: string,
	payload: IUpdateSuperModuleInput,
) => {
	await assertSuperModuleExists(id);

	const result = await prisma.superModule.update({
		where: { id },
		data: payload,
	});

	await clearCachePattern(superModuleCacheKeys.pattern);

	return result;
};

const deleteSuperModule = async (id: string) => {
	await assertSuperModuleExists(id);

	const result = await prisma.superModule.delete({ where: { id } });

	await clearCachePattern(superModuleCacheKeys.pattern);

	return result;
};

export const SuperModuleService = {
	createSuperModule,
	getSuperModulesByCourse,
	getSuperModuleById,
	updateSuperModule,
	deleteSuperModule,
};
