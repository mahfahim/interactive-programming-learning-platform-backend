// src/modules/discussion/discussion.validation.ts

import { z } from "zod";
import { ReactionType } from "../../../generated/prisma/client";

const CreateDiscussionThreadZodSchema = z.object({
	lessonId: z
		.string({ message: "Lesson ID is required" })
		.min(1, "Lesson ID cannot be empty"),
	title: z
		.string({ message: "Title is required" })
		.min(1, "Title cannot be empty"),
	body: z
		.string({ message: "Body is required" })
		.min(1, "Body cannot be empty"),
});

const UpdateDiscussionThreadZodSchema = z
	.object({
		title: z.string().min(1, "Title cannot be empty").optional(),
		body: z.string().min(1, "Body cannot be empty").optional(),
	})
	.refine((data) => Object.keys(data).length > 0, {
		message: "At least one field must be provided for update",
	});

const CreateDiscussionCommentZodSchema = z.object({
	body: z
		.string({ message: "Comment body is required" })
		.min(1, "Comment body cannot be empty"),
	parentCommentId: z.string().optional(),
});

const UpdateDiscussionCommentZodSchema = z.object({
	body: z
		.string({ message: "Comment body is required" })
		.min(1, "Comment body cannot be empty"),
});

const ReactionZodSchema = z.object({
	reactionType: z.nativeEnum(ReactionType, {
		message: "Reaction type is required",
	}),
});

const ThreadQueryZodSchema = z.object({
	page: z.string().optional(),
	limit: z.string().optional(),
	search: z.string().optional(),
});

export const DiscussionValidation = {
	CreateDiscussionThreadZodSchema,
	UpdateDiscussionThreadZodSchema,
	CreateDiscussionCommentZodSchema,
	UpdateDiscussionCommentZodSchema,
	ReactionZodSchema,
	ThreadQueryZodSchema,
};
