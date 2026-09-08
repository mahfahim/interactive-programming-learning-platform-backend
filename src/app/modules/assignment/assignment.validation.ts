import { z } from "zod";

const CreateAssignmentZodSchema = z.object({
	title: z
		.string({ message: "Title is required" })
		.min(1, "Title cannot be empty"),
	instructions: z
		.string({ message: "Instructions are required" })
		.min(1, "Instructions cannot be empty"),
	dueDate: z
		.string({ message: "Due date is required" })
		.datetime({ message: "Invalid ISO datetime string" }),
	lessonId: z
		.string({ message: "Lesson ID is required" })
		.min(1, "Lesson ID cannot be empty"),
});

const UpdateAssignmentZodSchema = z
	.object({
		title: z.string().min(1, "Title cannot be empty").optional(),
		instructions: z.string().min(1, "Instructions cannot be empty").optional(),
		dueDate: z
			.string()
			.datetime({ message: "Invalid ISO datetime string" })
			.optional(),
	})
	.refine((data) => Object.keys(data).length > 0, {
		message: "At least one field must be provided for update",
	});

const SubmitAssignmentZodSchema = z.object({
	assignmentId: z
		.string({ message: "Assignment ID is required" })
		.min(1, "Assignment ID cannot be empty"),
});

const GradeSubmissionZodSchema = z.object({
	scoreObtained: z
		.number({ message: "Score obtained is required" })
		.min(0, "Score cannot be negative"),
	instructorFeedback: z.string().optional(),
});

export const AssignmentValidation = {
	CreateAssignmentZodSchema,
	UpdateAssignmentZodSchema,
	SubmitAssignmentZodSchema,
	GradeSubmissionZodSchema,
};
