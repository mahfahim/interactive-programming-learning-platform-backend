// src/modules/judge/judge.interface.ts

import type {
	ProgrammingLanguage,
	SubmissionStatus,
} from "../../../generated/prisma/client";

export interface IRequestUser {
	userId: string;
	role: string;
	email?: string;
}

export interface ITestCasePayload {
	inputData: string;
	expectedOutput: string;
	isHidden: boolean;
	displayOrder: number;
}

export interface ICodingLessonCreatePayload {
	lessonId: string;
	problemStatement: string;
	inputFormat: string;
	outputFormat: string;
	timeLimitMs: number;
	memoryLimitKb: number;
	testCases?: ITestCasePayload[];
}

export interface ICodingLessonUpdatePayload {
	problemStatement?: string;
	inputFormat?: string;
	outputFormat?: string;
	timeLimitMs?: number;
	memoryLimitKb?: number;
}

export interface IUpdateTestCasesPayload {
	testCases: ITestCasePayload[];
}

export interface ICodeRunPayload {
	codingLessonId: string;
	language: ProgrammingLanguage;
	sourceCode: string;
}

export interface ICodeSubmitPayload {
	codingLessonId: string;
	language: ProgrammingLanguage;
	sourceCode: string;
}

export interface ICodeExecutionRequest {
	sourceCode: string;
	language: ProgrammingLanguage;
	input: string;
	timeLimitMs: number;
	memoryLimitKb: number;
}

export interface ICodeExecutionResult {
	status: SubmissionStatus;
	stdout?: string;
	stderr?: string;
	runtimeMs?: number;
	memoryUsedKb?: number;
}

export interface IPublicTestCaseResult {
	testCaseId: string;
	passed: boolean;
	actualOutput: string;
	expectedOutput: string;
	status: SubmissionStatus;
	runtimeMs?: number;
	memoryUsedKb?: number;
}

export interface ICodeRunResult {
	status: SubmissionStatus;
	runtimeMs: number;
	memoryUsedKb: number;
	passedTestCasesCount: number;
	totalTestCases: number;
	testCases: IPublicTestCaseResult[];
}

export interface ICodeSubmitResult {
	id: string;
	status: SubmissionStatus;
	runtimeMs: number;
	memoryUsedKb: number;
	passedTestCasesCount: number;
	totalTestCases: number;
	submittedAt: Date;
}
