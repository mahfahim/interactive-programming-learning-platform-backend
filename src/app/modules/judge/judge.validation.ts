// src/modules/judge/judge.validation.ts

import { ProgrammingLanguage } from "../../../generated/prisma/client";
import { z } from "zod";

const testCaseSchema = z.object({
	inputData: z.string({ message: "Input data is required" }),
	expectedOutput: z.string({ message: "Expected output is required" }),
	isHidden: z.boolean({ message: "isHidden flag is required" }),
	displayOrder: z
		.number({ message: "Display order is required" })
		.int()
		.min(0, "Display order must be non-negative"),
});

const CreateCodingLessonZodSchema = z.object({
	lessonId: z.string({ message: "Lesson ID is required" }).min(1),
	problemStatement: z
		.string({ message: "Problem statement is required" })
		.min(1),
	inputFormat: z.string({ message: "Input format is required" }).min(1),
	outputFormat: z.string({ message: "Output format is required" }).min(1),
	timeLimitMs: z
		.number({ message: "Time limit is required" })
		.int()
		.positive("Time limit must be a positive integer"),
	memoryLimitKb: z
		.number({ message: "Memory limit is required" })
		.int()
		.positive("Memory limit must be a positive integer"),
	testCases: z.array(testCaseSchema).optional(),
});

const UpdateCodingLessonZodSchema = z
	.object({
		problemStatement: z.string().min(1).optional(),
		inputFormat: z.string().min(1).optional(),
		outputFormat: z.string().min(1).optional(),
		timeLimitMs: z.number().int().positive().optional(),
		memoryLimitKb: z.number().int().positive().optional(),
	})
	.refine((data) => Object.keys(data).length > 0, {
		message: "At least one field must be provided for update",
	});

const UpdateTestCasesZodSchema = z.object({
	testCases: z.array(testCaseSchema, {
		message: "Test cases array is required",
	}),
});

const RunCodeZodSchema = z.object({
	codingLessonId: z.string({ message: "Coding lesson ID is required" }).min(1),
	language: z.nativeEnum(ProgrammingLanguage, {
		message: "Valid programming language is required",
	}),
	sourceCode: z
		.string({ message: "Source code is required" })
		.min(1, "Source code cannot be empty"),
});

const SubmitCodeZodSchema = z.object({
	codingLessonId: z.string({ message: "Coding lesson ID is required" }).min(1),
	language: z.nativeEnum(ProgrammingLanguage, {
		message: "Valid programming language is required",
	}),
	sourceCode: z
		.string({ message: "Source code is required" })
		.min(1, "Source code cannot be empty"),
});

export const JudgeValidation = {
	CreateCodingLessonZodSchema,
	UpdateCodingLessonZodSchema,
	UpdateTestCasesZodSchema,
	RunCodeZodSchema,
	SubmitCodeZodSchema,
};
