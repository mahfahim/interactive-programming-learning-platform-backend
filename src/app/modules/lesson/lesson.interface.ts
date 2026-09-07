import type { LessonType } from "../../../generated/prisma/client";

export interface ICreateLessonInput {
	moduleId: string;
	title: string;
	lessonType: LessonType;
	displayOrder: number;
	isPro?: boolean;
}

export interface IUpdateLessonInput {
	title?: string;
	lessonType?: LessonType;
	displayOrder?: number;
	isPro?: boolean;
}

export interface IUpsertVideoLessonInput {
	videoUrl: string;
	durationSeconds: number;
}

export interface IArticleSectionInput {
	content: Record<string, unknown>;
	displayOrder: number;
}

export interface ISyncArticleLessonInput {
	sections: IArticleSectionInput[];
}

export interface IUpdateLessonProgressInput {
	isCompleted: boolean;
}
