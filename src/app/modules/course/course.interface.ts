import type { CourseLevel, Language } from "../../../generated/prisma/client";

export interface ICreateLearningOutcomeInput {
	outcomeText: string;
	displayOrder: number;
}

export interface ICreatePrerequisiteInput {
	prerequisiteText: string;
	displayOrder: number;
}

export interface ICreateCourseDescriptionInput {
	shortDescription: string;
	fullDescription: string;
	level: CourseLevel;
	language: Language;
	learningOutcomes: ICreateLearningOutcomeInput[];
	prerequisites: ICreatePrerequisiteInput[];
}

export interface ICreateCourseInput {
	title: string;
	slug: string;
	coverImageUrl?: string;
	price?: number;
	description: ICreateCourseDescriptionInput;
}

export interface IUpdateCourseInput {
	title?: string;
	slug?: string;
	coverImageUrl?: string;
	price?: number;
	description?: {
		shortDescription?: string;
		fullDescription?: string;
		level?: CourseLevel;
		language?: Language;
		learningOutcomes?: ICreateLearningOutcomeInput[];
		prerequisites?: ICreatePrerequisiteInput[];
	};
}

export interface ICourseQueryParams {
	search?: string;
	level?: CourseLevel;
	page?: number;
	limit?: number;
	sortBy?: string;
	sortOrder?: "asc" | "desc";
}

export interface IPaginatedMeta {
	page: number;
	limit: number;
	total: number;
	totalPages: number;
}

export interface IPaginatedResponse<T> {
	data: T[];
	meta: IPaginatedMeta;
}
