import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/AppError";
import { StatusCodes } from "http-status-codes";
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
	return prisma.module.create({ data: payload });
};

const getModulesBySuperModule = async (superModuleId: string) => {
	await assertSuperModuleExists(superModuleId);
	return prisma.module.findMany({
		where: { superModuleId },
		orderBy: { displayOrder: "asc" },
		include: { lessons: { orderBy: { displayOrder: "asc" } } },
	});
};

const getModuleById = async (id: string) => {
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
	if (!module) throw new AppError(StatusCodes.NOT_FOUND, "Module not found");
	return module;
};

const updateModule = async (id: string, payload: IUpdateModuleInput) => {
	await assertModuleExists(id);
	return prisma.module.update({ where: { id }, data: payload });
};

const deleteModule = async (id: string) => {
	await assertModuleExists(id);
	return prisma.module.delete({ where: { id } });
};

export const ModuleService = {
	createModule,
	getModulesBySuperModule,
	getModuleById,
	updateModule,
	deleteModule,
};
