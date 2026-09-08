import { z } from "zod";

const QuizOptionSchema = z.object({
	id: z.string().optional(),
	optionText: z.string().min(1, "Option text is required"),
	isCorrect: z.boolean({ message: "isCorrect field is required" }),
	displayOrder: z
		.number()
		.int()
		.positive("Display order must be a positive integer"),
});

const QuizQuestionSchema = z.object({
	id: z.string().optional(),
	questionText: z.string().min(1, "Question text is required"),
	displayOrder: z
		.number()
		.int()
		.positive("Display order must be a positive integer"),
	options: z
		.array(QuizOptionSchema)
		.min(1, "Question must have at least one option"),
});

export const CreateQuizZodSchema = z
	.object({
		lessonId: z.string().min(1, "Lesson ID is required"),
		questions: z
			.array(QuizQuestionSchema)
			.min(1, "Quiz must contain at least one question"),
	})
	.refine(
		(data) =>
			data.questions?.every((q) =>
				q.options?.some((opt) => opt.isCorrect === true),
			),
		{
			message: "Every question must have at least one correct option",
			path: ["questions"],
		},
	);

export const UpdateQuizZodSchema = z
	.object({
		questions: z
			.array(QuizQuestionSchema)
			.min(1, "Quiz must contain at least one question"),
	})
	.refine(
		(data) =>
			data.questions?.every((q) =>
				q.options?.some((opt) => opt.isCorrect === true),
			),
		{
			message: "Every question must have at least one correct option",
			path: ["questions"],
		},
	);

export const SubmitQuizZodSchema = z
	.object({
		quizLessonId: z.string().min(1, "Quiz Lesson ID is required"),
		answers: z
			.array(
				z.object({
					questionId: z.string().min(1, "Question ID is required"),
					selectedOptionId: z.string().min(1, "Selected Option ID is required"),
				}),
			)
			.min(1, "At least one answer must be submitted"),
	})
	.refine(
		(data) => {
			if (!data.answers) return false;
			const questionIds = data.answers.map((a) => a.questionId);
			return new Set(questionIds).size === questionIds.length;
		},
		{
			message: "Duplicate question IDs are not allowed in submitted answers",
			path: ["answers"],
		},
	);

export const QuizValidation = {
	CreateQuizZodSchema,
	UpdateQuizZodSchema,
	SubmitQuizZodSchema,
};
