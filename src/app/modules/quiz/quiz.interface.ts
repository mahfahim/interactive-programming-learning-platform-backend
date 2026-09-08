import type { Role } from "../../../generated/prisma/enums";

export interface IRequestUser {
	userId: string;
	role: Role;
	email?: string;
}

export interface IQuizOptionInput {
	id?: string;
	optionText: string;
	isCorrect: boolean;
	displayOrder: number;
}

export interface IQuizQuestionInput {
	id?: string;
	questionText: string;
	displayOrder: number;
	options: IQuizOptionInput[];
}

export interface ICreateQuizPayload {
	lessonId: string;
	questions: IQuizQuestionInput[];
}

export interface IUpdateQuizPayload {
	questions: IQuizQuestionInput[];
}

export interface ISubmitQuizAnswer {
	questionId: string;
	selectedOptionId: string;
}

export interface ISubmitQuizPayload {
	quizLessonId: string;
	answers: ISubmitQuizAnswer[];
}
