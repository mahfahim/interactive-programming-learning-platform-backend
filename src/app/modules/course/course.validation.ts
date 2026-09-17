import { z } from "zod";
import { CourseLevel, Language } from "../../../generated/prisma/client";

const learningOutcomeSchema = z.object({
	outcomeText: z.string().min(1, "Outcome text is required"),
	displayOrder: z
		.number()
		.int()
		.nonnegative("Display order must be 0 or greater"),
});

const prerequisiteSchema = z.object({
	prerequisiteText: z.string().min(1, "Prerequisite text is required"),
	displayOrder: z
		.number()
		.int()
		.nonnegative("Display order must be 0 or greater"),
});

export const createCourseSchema = z.object({
	title: z.string().min(1, "Title is required").max(255),
	slug: z
		.string()
		.min(1, "Slug is required")
		.regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug format"),
	coverImageUrl: z.string().url("Invalid image URL").optional(),
	price: z
		.number()
		.nonnegative("Price must be 0 or positive")
		.optional()
		.default(0),
	description: z.object({
		shortDescription: z
			.string()
			.min(1, "Short description is required")
			.max(500),
		fullDescription: z.string().min(1, "Full description is required"),
		level: z.nativeEnum(CourseLevel, { message: "Invalid course level" }),
		language: z.nativeEnum(Language, { message: "Invalid language" }),
		learningOutcomes: z.array(learningOutcomeSchema).default([]),
		prerequisites: z.array(prerequisiteSchema).default([]),
	}),
});

export const updateCourseSchema = z.object({
	title: z.string().min(1).max(255).optional(),
	slug: z
		.string()
		.min(1)
		.regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
		.optional(),
	coverImageUrl: z.string().url().optional(),
	price: z.number().nonnegative("Price must be 0 or positive").optional(),
	description: z
		.object({
			shortDescription: z.string().min(1).max(500).optional(),
			fullDescription: z.string().min(1).optional(),
			level: z.nativeEnum(CourseLevel).optional(),
			language: z.nativeEnum(Language).optional(),
			learningOutcomes: z.array(learningOutcomeSchema).optional(),
			prerequisites: z.array(prerequisiteSchema).optional(),
		})
		.optional(),
});

export const courseQuerySchema = z.object({
	search: z.string().optional(),
	level: z.nativeEnum(CourseLevel).optional(),
	page: z
		.string()
		.optional()
		.transform((val) => (val ? parseInt(val, 10) : 1)),
	limit: z
		.string()
		.optional()
		.transform((val) => (val ? parseInt(val, 10) : 10)),
	sortBy: z.string().optional(),
	sortOrder: z.enum(["asc", "desc"]).optional(),
});

export const CourseValidations = {
	createCourseSchema,
	updateCourseSchema,
	courseQuerySchema,
};
