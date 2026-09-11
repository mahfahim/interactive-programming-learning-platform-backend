import { z } from "zod";
import { LessonType } from "../../../generated/prisma/client";

export const createLessonSchema = z.object({
	moduleId: z
		.string({ message: "Module ID is required" })
		.min(1, "Module ID cannot be empty"),
	title: z
		.string({ message: "Title is required" })
		.trim()
		.min(1, "Title cannot be empty")
		.max(255, "Title cannot exceed 255 characters"),
	lessonType: z.nativeEnum(LessonType, {
		message: "Invalid lesson type",
	}),
	displayOrder: z
		.number({ message: "Display order is required" })
		.int("Display order must be an integer")
		.nonnegative("Display order cannot be negative"),
	isPro: z.boolean().optional().default(false),
});

export const updateLessonSchema = z.object({
	title: z
		.string()
		.trim()
		.min(1, "Title cannot be empty")
		.max(255, "Title cannot exceed 255 characters")
		.optional(),
	lessonType: z
		.nativeEnum(LessonType, {
			message: "Invalid lesson type",
		})
		.optional(),
	displayOrder: z
		.number()
		.int("Display order must be an integer")
		.nonnegative("Display order cannot be negative")
		.optional(),
	isPro: z.boolean().optional(),
});

export const upsertVideoLessonSchema = z.object({
	videoUrl: z
		.string({ message: "Video URL is required" })
		.url("Invalid video URL format"),
	durationSeconds: z
		.number({ message: "Duration is required" })
		.int("Duration must be an integer")
		.positive("Duration must be a positive integer"),
});

export const syncArticleLessonSchema = z.object({
	sections: z.array(
		z.object({
			content: z.record(z.string(), z.unknown(), {
				message: "Section content is required",
			}),
			displayOrder: z
				.number({ message: "Display order is required" })
				.int("Display order must be an integer")
				.nonnegative("Display order cannot be negative"),
		}),
	),
});

export const updateLessonProgressSchema = z.object({
	isCompleted: z.boolean({
		message: "isCompleted status must be a boolean",
	}),
});

export const LessonValidations = {
	createLessonSchema,
	updateLessonSchema,
	upsertVideoLessonSchema,
	syncArticleLessonSchema,
	updateLessonProgressSchema,
};
