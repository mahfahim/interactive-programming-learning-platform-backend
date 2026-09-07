import { z } from "zod";
import { LessonType } from "../../../generated/prisma/client";

export const createLessonSchema = z.object({
	moduleId: z.string().uuid("Invalid module ID format"),
	title: z.string().min(1, "Title is required").max(255),
	lessonType: z.nativeEnum(LessonType, { message: "Invalid lesson type" }),
	displayOrder: z.number().int().nonnegative(),
	isPro: z.boolean().optional().default(false),
});

export const updateLessonSchema = z.object({
	title: z.string().min(1).max(255).optional(),
	lessonType: z.nativeEnum(LessonType).optional(),
	displayOrder: z.number().int().nonnegative().optional(),
	isPro: z.boolean().optional(),
});

export const upsertVideoLessonSchema = z.object({
	videoUrl: z.string().url("Invalid video URL format"),
	durationSeconds: z
		.number()
		.int()
		.positive("Duration must be a positive integer"),
});

export const syncArticleLessonSchema = z.object({
	sections: z.array(
		z.object({
			content: z.record(z.string(), z.unknown()),
			displayOrder: z.number().int().nonnegative(),
		}),
	),
});

export const updateLessonProgressSchema = z.object({
	isCompleted: z.boolean(),
});

export const LessonValidations = {
	createLessonSchema,
	updateLessonSchema,
	upsertVideoLessonSchema,
	syncArticleLessonSchema,
	updateLessonProgressSchema,
};
