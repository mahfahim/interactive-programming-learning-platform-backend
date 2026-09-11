import {
	type ProgrammingLanguage,
	Role,
	SubmissionStatus,
} from "../../../generated/prisma/client";
import config from "../../config";
import httpStatus from "http-status";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/AppError";
import { calculateAggregateStatus, normalizeOutput } from "./judge.utils";
import { assertLessonExists, verifyLessonAccess } from "../lesson/lesson.utils";
import type {
	ICodeExecutionRequest,
	ICodeExecutionResult,
	ICodeRunPayload,
	ICodeRunResult,
	ICodeSubmitPayload,
	ICodeSubmitResult,
	ICodingLessonCreatePayload,
	ICodingLessonUpdatePayload,
	IPublicTestCaseResult,
	IRequestUser,
	IUpdateTestCasesPayload,
} from "./judge.interface";

// 1. External Execution Call
const executeCode = async (
	request: ICodeExecutionRequest,
): Promise<ICodeExecutionResult> => {
	const judgeApiUrl = config.judge0_api_url;
	const judgeApiKey = config.judge0_api_key;
	const judgeApiHost = config.judge0_api_host;

	if (!judgeApiUrl) {
		throw new AppError(
			httpStatus.INTERNAL_SERVER_ERROR,
			"Code execution provider is not configured.",
		);
	}

	const languageMap: Record<ProgrammingLanguage, number> = {
		JAVASCRIPT: 63,
		TYPESCRIPT: 74,
		PYTHON: 71,
		JAVA: 62,
		CPP: 54,
		C: 50,
		GO: 60,
		RUST: 73,
		PHP: 68,
		CSHARP: 51,
	};

	const languageId = languageMap[request.language];
	if (!languageId) {
		throw new AppError(
			httpStatus.BAD_REQUEST,
			`Unsupported programming language: ${request.language}`,
		);
	}

	try {
		const headers: Record<string, string> = {
			"Content-Type": "application/json",
		};

		if (judgeApiKey) {
			headers["X-RapidAPI-Key"] = judgeApiKey;
		}
		if (judgeApiHost) {
			headers["X-RapidAPI-Host"] = judgeApiHost;
		}

		const response = await fetch(
			`${judgeApiUrl}/submissions?wait=true&fields=stdout,stderr,status_id,time,memory,compile_output`,
			{
				method: "POST",
				headers,
				body: JSON.stringify({
					source_code: request.sourceCode,
					language_id: languageId,
					stdin: request.input,
					cpu_time_limit: Math.ceil(request.timeLimitMs / 1000),
					memory_limit: request.memoryLimitKb,
				}),
			},
		);

		if (!response.ok) {
			const errorBody = await response.text();
			console.error("Judge0 Execution Error Details:", errorBody);

			throw new AppError(
				httpStatus.INTERNAL_SERVER_ERROR,
				`Judge execution provider error: ${response.statusText} - ${errorBody}`,
			);
		}

		const data = (await response.json()) as {
			status_id: number;
			stdout?: string;
			stderr?: string;
			compile_output?: string;
			time?: string;
			memory?: number;
		};

		let status: SubmissionStatus = SubmissionStatus.ACCEPTED;
		if (data.status_id === 6) status = SubmissionStatus.COMPILATION_ERROR;
		else if (data.status_id === 5)
			status = SubmissionStatus.TIME_LIMIT_EXCEEDED;
		else if (data.status_id >= 7 && data.status_id <= 12)
			status = SubmissionStatus.RUNTIME_ERROR;
		else if (data.status_id === 4) status = SubmissionStatus.WRONG_ANSWER;

		return {
			status,
			stdout: data.stdout || "",
			stderr: data.stderr || data.compile_output || "",
			runtimeMs: data.time ? Math.round(parseFloat(data.time) * 1000) : 0,
			memoryUsedKb: data.memory || 0,
		};
	} catch (error) {
		if (error instanceof AppError) throw error;
		throw new AppError(
			httpStatus.INTERNAL_SERVER_ERROR,
			`Code execution failed: ${(error as Error).message}`,
		);
	}
};

// 2. Helper Processing TestCases
const processTestCases = async (
	testCases: Array<{ id: string; inputData: string; expectedOutput: string }>,
	sourceCode: string,
	language: ProgrammingLanguage,
	timeLimitMs: number,
	memoryLimitKb: number,
) => {
	const results: IPublicTestCaseResult[] = [];
	const statuses: SubmissionStatus[] = [];
	let maxRuntimeMs = 0;
	let maxMemoryKb = 0;
	let passedCount = 0;

	for (const tc of testCases) {
		const execResult = await executeCode({
			sourceCode,
			language,
			input: tc.inputData,
			timeLimitMs,
			memoryLimitKb,
		});

		maxRuntimeMs = Math.max(maxRuntimeMs, execResult.runtimeMs || 0);
		maxMemoryKb = Math.max(maxMemoryKb, execResult.memoryUsedKb || 0);

		let tcStatus = execResult.status;
		if (tcStatus === SubmissionStatus.ACCEPTED) {
			const matched =
				normalizeOutput(execResult.stdout) ===
				normalizeOutput(tc.expectedOutput);
			if (!matched) tcStatus = SubmissionStatus.WRONG_ANSWER;
		}

		const passed = tcStatus === SubmissionStatus.ACCEPTED;
		if (passed) passedCount++;

		statuses.push(tcStatus);
		results.push({
			testCaseId: tc.id,
			passed,
			actualOutput: execResult.stdout || "",
			expectedOutput: tc.expectedOutput,
			status: tcStatus,
			runtimeMs: execResult.runtimeMs,
			memoryUsedKb: execResult.memoryUsedKb,
		});
	}

	return {
		aggregateStatus: calculateAggregateStatus(statuses),
		maxRuntimeMs,
		maxMemoryKb,
		passedCount,
		results,
	};
};

// 3. Business Methods
const runCode = async (
	user: IRequestUser,
	payload: ICodeRunPayload,
): Promise<ICodeRunResult> => {
	const codingLesson = await prisma.codingLesson.findUnique({
		where: { id: payload.codingLessonId },
		include: {
			testCases: {
				where: { isHidden: false },
				orderBy: { displayOrder: "asc" },
			},
		},
	});

	if (!codingLesson) {
		throw new AppError(httpStatus.NOT_FOUND, "Coding lesson not found");
	}

	await verifyLessonAccess(codingLesson.lessonId, user.userId, user.role);

	if (!codingLesson.testCases.length) {
		throw new AppError(
			httpStatus.BAD_REQUEST,
			"No public test cases found for this problem",
		);
	}

	const { aggregateStatus, maxRuntimeMs, maxMemoryKb, passedCount, results } =
		await processTestCases(
			codingLesson.testCases,
			payload.sourceCode,
			payload.language,
			codingLesson.timeLimitMs,
			codingLesson.memoryLimitKb,
		);

	return {
		status: aggregateStatus,
		runtimeMs: maxRuntimeMs,
		memoryUsedKb: maxMemoryKb,
		passedTestCasesCount: passedCount,
		totalTestCases: codingLesson.testCases.length,
		testCases: results,
	};
};

const submitCode = async (
	user: IRequestUser,
	payload: ICodeSubmitPayload,
): Promise<ICodeSubmitResult> => {
	const codingLesson = await prisma.codingLesson.findUnique({
		where: { id: payload.codingLessonId },
		include: { testCases: { orderBy: { displayOrder: "asc" } } },
	});

	if (!codingLesson) {
		throw new AppError(httpStatus.NOT_FOUND, "Coding lesson not found");
	}

	await verifyLessonAccess(codingLesson.lessonId, user.userId, user.role);

	if (!codingLesson.testCases.length) {
		throw new AppError(
			httpStatus.BAD_REQUEST,
			"No test cases found for this problem",
		);
	}

	const { aggregateStatus, maxRuntimeMs, maxMemoryKb, passedCount } =
		await processTestCases(
			codingLesson.testCases,
			payload.sourceCode,
			payload.language,
			codingLesson.timeLimitMs,
			codingLesson.memoryLimitKb,
		);

	const submission = await prisma.codingAnswer.create({
		data: {
			userId: user.userId,
			codingLessonId: payload.codingLessonId,
			language: payload.language,
			submittedCode: payload.sourceCode,
			status: aggregateStatus,
			runtimeMs: maxRuntimeMs,
			memoryUsedKb: maxMemoryKb,
			passedTestCasesCount: passedCount,
		},
	});

	return {
		id: submission.id,
		status: submission.status,
		runtimeMs: submission.runtimeMs ?? 0,
		memoryUsedKb: submission.memoryUsedKb ?? 0,
		passedTestCasesCount: submission.passedTestCasesCount,
		totalTestCases: codingLesson.testCases.length,
		submittedAt: submission.submittedAt,
	};
};

const getSubmissionById = async (id: string, user: IRequestUser) => {
	const submission = await prisma.codingAnswer.findUnique({
		where: { id },
		include: {
			user: { select: { id: true, name: true, email: true } },
			codingLesson: {
				select: { id: true, lessonId: true, problemStatement: true },
			},
		},
	});

	if (!submission) {
		throw new AppError(httpStatus.NOT_FOUND, "Submission not found");
	}

	await verifyLessonAccess(
		submission.codingLesson.lessonId,
		user.userId,
		user.role,
	);

	if (user.role === Role.STUDENT && submission.userId !== user.userId) {
		throw new AppError(
			httpStatus.FORBIDDEN,
			"You are not allowed to view this submission",
		);
	}

	return submission;
};

const getMySubmissions = async (codingLessonId: string, user: IRequestUser) => {
	const codingLesson = await prisma.codingLesson.findUnique({
		where: { id: codingLessonId },
	});

	if (!codingLesson) {
		throw new AppError(httpStatus.NOT_FOUND, "Coding lesson not found");
	}

	await verifyLessonAccess(codingLesson.lessonId, user.userId, user.role);

	return prisma.codingAnswer.findMany({
		where: { codingLessonId, userId: user.userId },
		orderBy: { submittedAt: "desc" },
		select: {
			id: true,
			language: true,
			status: true,
			runtimeMs: true,
			memoryUsedKb: true,
			passedTestCasesCount: true,
			submittedAt: true,
		},
	});
};

const getCodingLessonByLessonId = async (
	lessonId: string,
	userId?: string,
	userRole?: string,
) => {
	await verifyLessonAccess(lessonId, userId, userRole);

	const codingLesson = await prisma.codingLesson.findUnique({
		where: { lessonId },
		include: {
			testCases: {
				where: { isHidden: false },
				orderBy: { displayOrder: "asc" },
				select: {
					id: true,
					inputData: true,
					expectedOutput: true,
					isHidden: true,
					displayOrder: true,
				},
			},
		},
	});

	if (!codingLesson) {
		throw new AppError(httpStatus.NOT_FOUND, "Coding lesson not found");
	}

	return codingLesson;
};

const createCodingLesson = async (payload: ICodingLessonCreatePayload) => {
	await assertLessonExists(payload.lessonId);

	const existingCodingLesson = await prisma.codingLesson.findUnique({
		where: { lessonId: payload.lessonId },
	});

	if (existingCodingLesson) {
		throw new AppError(
			httpStatus.BAD_REQUEST,
			"Coding lesson already exists for this lesson",
		);
	}

	return prisma.codingLesson.create({
		data: {
			lessonId: payload.lessonId,
			problemStatement: payload.problemStatement,
			inputFormat: payload.inputFormat,
			outputFormat: payload.outputFormat,
			timeLimitMs: payload.timeLimitMs,
			memoryLimitKb: payload.memoryLimitKb,
			testCases: payload.testCases?.length
				? {
						create: payload.testCases.map((tc) => ({
							inputData: tc.inputData,
							expectedOutput: tc.expectedOutput,
							isHidden: tc.isHidden,
							displayOrder: tc.displayOrder,
						})),
					}
				: undefined,
		},
		include: { testCases: true },
	});
};

const updateCodingLesson = async (
	id: string,
	payload: ICodingLessonUpdatePayload,
) => {
	const existing = await prisma.codingLesson.findUnique({ where: { id } });
	if (!existing) {
		throw new AppError(httpStatus.NOT_FOUND, "Coding lesson not found");
	}

	return prisma.codingLesson.update({
		where: { id },
		data: {
			...(payload.problemStatement !== undefined && {
				problemStatement: payload.problemStatement,
			}),
			...(payload.inputFormat !== undefined && {
				inputFormat: payload.inputFormat,
			}),
			...(payload.outputFormat !== undefined && {
				outputFormat: payload.outputFormat,
			}),
			...(payload.timeLimitMs !== undefined && {
				timeLimitMs: payload.timeLimitMs,
			}),
			...(payload.memoryLimitKb !== undefined && {
				memoryLimitKb: payload.memoryLimitKb,
			}),
		},
	});
};

const updateTestCases = async (
	id: string,
	payload: IUpdateTestCasesPayload,
) => {
	const existing = await prisma.codingLesson.findUnique({ where: { id } });
	if (!existing) {
		throw new AppError(httpStatus.NOT_FOUND, "Coding lesson not found");
	}

	return prisma.$transaction(async (tx) => {
		await tx.codingTestCase.deleteMany({ where: { codingLessonId: id } });
		await tx.codingTestCase.createMany({
			data: payload.testCases.map((tc) => ({
				codingLessonId: id,
				inputData: tc.inputData,
				expectedOutput: tc.expectedOutput,
				isHidden: tc.isHidden,
				displayOrder: tc.displayOrder,
			})),
		});

		return tx.codingTestCase.findMany({
			where: { codingLessonId: id },
			orderBy: { displayOrder: "asc" },
		});
	});
};

const getCodingLessonSubmissions = async (id: string) => {
	const existing = await prisma.codingLesson.findUnique({ where: { id } });
	if (!existing) {
		throw new AppError(httpStatus.NOT_FOUND, "Coding lesson not found");
	}

	return prisma.codingAnswer.findMany({
		where: { codingLessonId: id },
		orderBy: { submittedAt: "desc" },
		select: {
			id: true,
			language: true,
			status: true,
			runtimeMs: true,
			memoryUsedKb: true,
			passedTestCasesCount: true,
			submittedAt: true,
			user: { select: { id: true, name: true, email: true } },
		},
	});
};

export const JudgeService = {
	runCode,
	submitCode,
	getSubmissionById,
	getMySubmissions,
	getCodingLessonByLessonId,
	createCodingLesson,
	updateCodingLesson,
	updateTestCases,
	getCodingLessonSubmissions,
};
