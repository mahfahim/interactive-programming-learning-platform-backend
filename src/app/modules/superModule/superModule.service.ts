import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/AppError";
import { StatusCodes } from "http-status-codes";
import { assertCourseExists } from "../course/course.service";
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
	return prisma.superModule.create({ data: payload });
};

const getSuperModulesByCourse = async (courseId: string) => {
	await assertCourseExists(courseId);
	return prisma.superModule.findMany({
		where: { courseId },
		orderBy: { displayOrder: "asc" },
		include: {
			modules: {
				orderBy: { displayOrder: "asc" },
			},
		},
	});
};

const getSuperModuleById = async (id: string) => {
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
};

const updateSuperModule = async (
	id: string,
	payload: IUpdateSuperModuleInput,
) => {
	await assertSuperModuleExists(id);
	return prisma.superModule.update({ where: { id }, data: payload });
};

const deleteSuperModule = async (id: string) => {
	await assertSuperModuleExists(id);
	return prisma.superModule.delete({ where: { id } });
};

export const SuperModuleService = {
	createSuperModule,
	getSuperModulesByCourse,
	getSuperModuleById,
	updateSuperModule,
	deleteSuperModule,
};
