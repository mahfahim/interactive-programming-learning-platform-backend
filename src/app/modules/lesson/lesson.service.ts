import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/AppError";
import { StatusCodes } from "http-status-codes";
import { checkProAccess } from "../../utils/checkProAccess";
import { assertModuleExists } from "../module/module.service";
import type {
	ICreateLessonInput,
	IUpdateLessonInput,
	IUpsertVideoLessonInput,
	ISyncArticleLessonInput,
	IUpdateLessonProgressInput,
} from "./lesson.interface";

export const assertLessonExists = async (id: string) => {
	const lesson = await prisma.lesson.findUnique({ where: { id } });
	if (!lesson) throw new AppError(StatusCodes.NOT_FOUND, "Lesson not found");
	return lesson;
};

// Helper function to fetch course context and verify Pro access
const verifyLessonAccess = async (
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

	if (!lesson) throw new AppError(StatusCodes.NOT_FOUND, "Lesson not found");

	const courseId = lesson.module.superModule.courseId;

	// Triggers 402 PAYMENT_REQUIRED if user lacks access
	await checkProAccess({
		userId,
		userRole,
		courseId,
		isPro: lesson.isPro,
	});

	return lesson;
};

const createLesson = async (payload: ICreateLessonInput) => {
	await assertModuleExists(payload.moduleId);
	return prisma.lesson.create({ data: payload });
};

const getLessonById = async (
	id: string,
	userId?: string,
	userRole?: string,
) => {
	await verifyLessonAccess(id, userId, userRole);

	const lesson = await prisma.lesson.findUnique({
		where: { id },
		include: {
			video: true,
			article: {
				include: { sections: { orderBy: { displayOrder: "asc" } } },
			},
		},
	});
	if (!lesson) throw new AppError(StatusCodes.NOT_FOUND, "Lesson not found");
	return lesson;
};

const updateLesson = async (id: string, payload: IUpdateLessonInput) => {
	await assertLessonExists(id);
	return prisma.lesson.update({ where: { id }, data: payload });
};

const deleteLesson = async (id: string) => {
	await assertLessonExists(id);
	return prisma.lesson.delete({ where: { id } });
};

const getVideoLesson = async (
	lessonId: string,
	userId?: string,
	userRole?: string,
) => {
	await verifyLessonAccess(lessonId, userId, userRole);

	const video = await prisma.videoLesson.findUnique({ where: { lessonId } });
	if (!video)
		throw new AppError(
			StatusCodes.NOT_FOUND,
			"Video content not found for this lesson",
		);
	return video;
};

const upsertVideoLesson = async (
	lessonId: string,
	payload: IUpsertVideoLessonInput,
) => {
	await assertLessonExists(lessonId);
	return prisma.videoLesson.upsert({
		where: { lessonId },
		create: { lessonId, ...payload },
		update: payload,
	});
};

const getArticleLesson = async (
	lessonId: string,
	userId?: string,
	userRole?: string,
) => {
	await verifyLessonAccess(lessonId, userId, userRole);

	const article = await prisma.articleLesson.findUnique({
		where: { lessonId },
		include: { sections: { orderBy: { displayOrder: "asc" } } },
	});
	if (!article)
		throw new AppError(
			StatusCodes.NOT_FOUND,
			"Article content not found for this lesson",
		);
	return article;
};

const syncArticleLesson = async (
	lessonId: string,
	payload: ISyncArticleLessonInput,
) => {
	await assertLessonExists(lessonId);

	return prisma.$transaction(async (tx) => {
		await tx.articleLesson.upsert({
			where: { lessonId },
			create: { lessonId },
			update: {},
		});

		await tx.articleSection.deleteMany({
			where: { articleLessonId: lessonId },
		});

		if (payload.sections.length > 0) {
			await tx.articleSection.createMany({
				data: payload.sections.map((section) => ({
					articleLessonId: lessonId,
					content: section.content as any,
					displayOrder: section.displayOrder,
				})),
			});
		}

		return tx.articleLesson.findUniqueOrThrow({
			where: { lessonId },
			include: { sections: { orderBy: { displayOrder: "asc" } } },
		});
	});
};

const getLessonProgress = async (
	userId: string,
	lessonId: string,
	userRole?: string,
) => {
	await verifyLessonAccess(lessonId, userId, userRole);

	return prisma.lessonProgress.findUnique({
		where: { userId_lessonId: { userId, lessonId } },
	});
};

const updateLessonProgress = async (
	userId: string,
	lessonId: string,
	payload: IUpdateLessonProgressInput,
	userRole?: string,
) => {
	await verifyLessonAccess(lessonId, userId, userRole);

	const completedAt = payload.isCompleted ? new Date() : null;

	return prisma.lessonProgress.upsert({
		where: { userId_lessonId: { userId, lessonId } },
		create: {
			userId,
			lessonId,
			isCompleted: payload.isCompleted,
			completedAt,
		},
		update: {
			isCompleted: payload.isCompleted,
			completedAt,
		},
	});
};

export const LessonService = {
	createLesson,
	getLessonById,
	updateLesson,
	deleteLesson,
	getVideoLesson,
	upsertVideoLesson,
	getArticleLesson,
	syncArticleLesson,
	getLessonProgress,
	updateLessonProgress,
};
