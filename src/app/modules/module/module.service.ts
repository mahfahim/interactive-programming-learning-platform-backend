import { StatusCodes } from "http-status-codes";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/AppError";
import { clearCachePattern, getOrSetCache } from "../../utils/cache";
import { moduleCacheKeys } from "../../utils/cacheKey";
import { assertSuperModuleExists } from "../superModule/superModule.service";
import type {
	ICreateModuleInput,
	IUpdateModuleInput,
} from "./module.interface";

export const assertModuleExists = async (id: string) => {
	const module = await prisma.module.findUnique({ where: { id } });

	if (!module) throw new AppError(StatusCodes.NOT_FOUND, "Module not found");

	return module;
};

const createModule = async (payload: ICreateModuleInput) => {
	await assertSuperModuleExists(payload.superModuleId);

	const result = await prisma.module.create({ data: payload });

	await clearCachePattern(moduleCacheKeys.pattern);

	return result;
};

const getModulesBySuperModule = async (superModuleId: string) => {
	await assertSuperModuleExists(superModuleId);

	return getOrSetCache(
		moduleCacheKeys.bySuperModule(superModuleId),
		() =>
			prisma.module.findMany({
				where: { superModuleId },
				orderBy: { displayOrder: "asc" },
				include: {
					lessons: {
						orderBy: { displayOrder: "asc" },
					},
				},
			}),
		600,
	);
};

const getModuleById = async (id: string) => {
	return getOrSetCache(
		moduleCacheKeys.detail(id),
		async () => {
			const module = await prisma.module.findUnique({
				where: { id },
				include: {
					lessons: {
						orderBy: { displayOrder: "asc" },
						include: {
							video: true,
							article: true,
						},
					},
				},
			});

			if (!module)
				throw new AppError(StatusCodes.NOT_FOUND, "Module not found");

			return module;
		},
		3600,
	);
};

const updateModule = async (id: string, payload: IUpdateModuleInput) => {
	await assertModuleExists(id);

	const result = await prisma.module.update({
		where: { id },
		data: payload,
	});

	await clearCachePattern(moduleCacheKeys.pattern);

	return result;
};

const deleteModule = async (id: string) => {
	await assertModuleExists(id);

	const result = await prisma.module.delete({
		where: { id },
	});

	await clearCachePattern(moduleCacheKeys.pattern);

	return result;
};

export const ModuleService = {
	createModule,
	getModulesBySuperModule,
	getModuleById,
	updateModule,
	deleteModule,
};
