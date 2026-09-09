// src/modules/discussion/discussion.interface.ts

import type { ReactionType } from "../../../generated/prisma/client";

export interface IRequestUser {
	userId: string;
	role: string;
	email?: string;
}

export interface IDiscussionThreadCreatePayload {
	lessonId: string;
	title: string;
	body: string;
}

export interface IDiscussionThreadUpdatePayload {
	title?: string;
	body?: string;
}

export interface IDiscussionCommentCreatePayload {
	body: string;
	parentCommentId?: string;
}

export interface IDiscussionCommentUpdatePayload {
	body: string;
}

export interface IDiscussionReactionPayload {
	reactionType: ReactionType;
}

export interface IThreadQueryParams {
	page?: string | number;
	limit?: string | number;
	search?: string;
}

export interface ICommentResponseNode {
	id: string;
	threadId: string;
	userId: string | null;
	parentCommentId: string | null;
	body: string;
	replyCount: number;
	reactionCount: number;
	createdAt: Date;
	updatedAt: Date;
	isDeleted: boolean;
	user: {
		id: string;
		name: string | null;
		email: string;
		imageUrl: string | null;
	} | null;
	reactionSummary: Record<string, number>;
	myReaction: ReactionType | null;
	replies: ICommentResponseNode[];
}
