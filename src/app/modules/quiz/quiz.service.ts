import { Prisma } from "../../../generated/prisma/client";
import httpStatus from "http-status";
import { AppError } from "../../utils/AppError";
import { prisma } from "../../lib/prisma";
import type {
	ICreateQuizPayload,
	IRequestUser,
	ISubmitQuizPayload,
	IUpdateQuizPayload,
} from "./quiz.interface";

const createQuiz = async (payload: ICreateQuizPayload) => {
	const lessonExists = await prisma.lesson.findUnique({
		where: { id: payload.lessonId },
	});

	if (!lessonExists) {
		throw new AppError(httpStatus.NOT_FOUND, "Lesson not found");
	}

	const existingQuiz = await prisma.quizLesson.findUnique({
		where: { lessonId: payload.lessonId },
	});

	if (existingQuiz) {
		throw new AppError(
			httpStatus.BAD_REQUEST,
			"A quiz already exists for this lesson",
		);
	}

	return await prisma.quizLesson.create({
		data: {
			lessonId: payload.lessonId,
			questions: {
				create: payload.questions.map((q) => ({
					questionText: q.questionText,
					displayOrder: q.displayOrder,
					options: {
						create: q.options.map((o) => ({
							optionText: o.optionText,
							isCorrect: o.isCorrect,
							displayOrder: o.displayOrder,
						})),
					},
				})),
			},
		},
		include: {
			questions: {
				orderBy: { displayOrder: "asc" },
				include: {
					options: {
						orderBy: { displayOrder: "asc" },
					},
				},
			},
		},
	});
};

const getQuizByLessonId = async (lessonId: string) => {
	const quiz = await prisma.quizLesson.findUnique({
		where: { lessonId },
		select: {
			id: true,
			lessonId: true,
			questions: {
				orderBy: { displayOrder: "asc" },
				select: {
					id: true,
					quizLessonId: true,
					questionText: true,
					displayOrder: true,
					options: {
						orderBy: { displayOrder: "asc" },
						select: {
							id: true,
							questionId: true,
							optionText: true,
							displayOrder: true,
						},
					},
				},
			},
		},
	});

	if (!quiz) {
		throw new AppError(httpStatus.NOT_FOUND, "Quiz not found for this lesson");
	}

	return quiz;
};

const getQuizById = async (id: string) => {
	const quiz = await prisma.quizLesson.findUnique({
		where: { id },
		include: {
			questions: {
				orderBy: { displayOrder: "asc" },
				include: {
					options: {
						orderBy: { displayOrder: "asc" },
					},
				},
			},
		},
	});

	if (!quiz) {
		throw new AppError(httpStatus.NOT_FOUND, "Quiz not found");
	}

	return quiz;
};

const updateQuiz = async (id: string, payload: IUpdateQuizPayload) => {
	const quizExists = await prisma.quizLesson.findUnique({
		where: { id },
	});

	if (!quizExists) {
		throw new AppError(httpStatus.NOT_FOUND, "Quiz not found");
	}

	const existingAttempt = await prisma.quizAttempt.findFirst({
		where: { quizLessonId: id },
	});

	if (existingAttempt) {
		throw new AppError(
			httpStatus.BAD_REQUEST,
			"Cannot modify quiz structure after students have submitted attempts",
		);
	}

	return await prisma.$transaction(async (tx) => {
		// 1. Delete all existing questions in 1 query (options auto-delete via cascading relation)
		await tx.quizQuestion.deleteMany({
			where: { quizLessonId: id },
		});

		// 2. Re-create updated questions and options in 1 query
		return await tx.quizLesson.update({
			where: { id },
			data: {
				questions: {
					create: payload.questions.map((q) => ({
						questionText: q.questionText,
						displayOrder: q.displayOrder,
						options: {
							create: q.options.map((o) => ({
								optionText: o.optionText,
								isCorrect: o.isCorrect,
								displayOrder: o.displayOrder,
							})),
						},
					})),
				},
			},
			include: {
				questions: {
					orderBy: { displayOrder: "asc" },
					include: {
						options: {
							orderBy: { displayOrder: "asc" },
						},
					},
				},
			},
		});
	});
};

const deleteQuiz = async (id: string) => {
	const quiz = await prisma.quizLesson.findUnique({
		where: { id },
	});

	if (!quiz) {
		throw new AppError(httpStatus.NOT_FOUND, "Quiz not found");
	}

	const existingAttempt = await prisma.quizAttempt.findFirst({
		where: { quizLessonId: id },
	});

	if (existingAttempt) {
		throw new AppError(
			httpStatus.BAD_REQUEST,
			"Cannot delete quiz because student attempts exist for it",
		);
	}

	return await prisma.quizLesson.delete({
		where: { id },
	});
};

const submitQuiz = async (user: IRequestUser, payload: ISubmitQuizPayload) => {
	const quiz = await prisma.quizLesson.findUnique({
		where: { id: payload.quizLessonId },
		include: {
			questions: {
				include: {
					options: true,
				},
			},
		},
	});

	if (!quiz) {
		throw new AppError(httpStatus.NOT_FOUND, "Quiz not found");
	}

	let calculatedScore = 0;
	const answerRecordsToCreate: Array<{
		questionId: string;
		selectedOptionId: string;
	}> = [];

	for (const submittedAnswer of payload.answers) {
		const question = quiz.questions.find(
			(q) => q.id === submittedAnswer.questionId,
		);

		if (!question) {
			throw new AppError(
				httpStatus.BAD_REQUEST,
				`Question ${submittedAnswer.questionId} does not belong to this quiz`,
			);
		}

		const selectedOption = question.options.find(
			(opt) => opt.id === submittedAnswer.selectedOptionId,
		);

		if (!selectedOption) {
			throw new AppError(
				httpStatus.BAD_REQUEST,
				`Selected option ${submittedAnswer.selectedOptionId} is invalid for question ${submittedAnswer.questionId}`,
			);
		}

		if (selectedOption.isCorrect) {
			calculatedScore += 1;
		}

		answerRecordsToCreate.push({
			questionId: submittedAnswer.questionId,
			selectedOptionId: submittedAnswer.selectedOptionId,
		});
	}

	return await prisma.$transaction(async (tx) => {
		const attempt = await tx.quizAttempt.create({
			data: {
				userId: user.userId,
				quizLessonId: payload.quizLessonId,
				score: new Prisma.Decimal(calculatedScore),
				answers: {
					create: answerRecordsToCreate,
				},
			},
			include: {
				answers: {
					include: {
						question: {
							select: {
								id: true,
								questionText: true,
							},
						},
						selectedOption: {
							select: {
								id: true,
								optionText: true,
								isCorrect: true,
							},
						},
					},
				},
			},
		});

		return {
			attemptId: attempt.id,
			quizLessonId: attempt.quizLessonId,
			score: attempt.score,
			totalQuestions: quiz.questions.length,
			correctAnswers: calculatedScore,
			attemptedAt: attempt.attemptedAt,
			answers: attempt.answers.map((ans) => ({
				questionId: ans.questionId,
				questionText: ans.question.questionText,
				selectedOptionId: ans.selectedOptionId,
				selectedOptionText: ans.selectedOption.optionText,
				isCorrect: ans.selectedOption.isCorrect,
			})),
		};
	});
};

const getAttemptById = async (id: string, user: IRequestUser) => {
	const attempt = await prisma.quizAttempt.findUnique({
		where: { id },
		include: {
			quizLesson: {
				select: {
					id: true,
					lessonId: true,
				},
			},
			answers: {
				include: {
					question: {
						select: {
							id: true,
							questionText: true,
							displayOrder: true,
							options: {
								select: {
									id: true,
									optionText: true,
									isCorrect: true,
									displayOrder: true,
								},
							},
						},
					},
					selectedOption: {
						select: {
							id: true,
							optionText: true,
							isCorrect: true,
						},
					},
				},
			},
		},
	});

	if (!attempt) {
		throw new AppError(httpStatus.NOT_FOUND, "Quiz attempt not found");
	}

	if (user.role === "STUDENT" && attempt.userId !== user.userId) {
		throw new AppError(
			httpStatus.FORBIDDEN,
			"You are not authorized to view this attempt",
		);
	}

	return {
		id: attempt.id,
		userId: attempt.userId,
		quizLessonId: attempt.quizLessonId,
		score: attempt.score,
		attemptedAt: attempt.attemptedAt,
		answers: attempt.answers.map((ans) => {
			const correctAnswer = ans.question.options.find((opt) => opt.isCorrect);
			return {
				questionId: ans.questionId,
				questionText: ans.question.questionText,
				selectedOptionId: ans.selectedOptionId,
				selectedOptionText: ans.selectedOption.optionText,
				isCorrect: ans.selectedOption.isCorrect,
				correctOptionId: correctAnswer?.id,
				correctOptionText: correctAnswer?.optionText,
			};
		}),
	};
};

const getMyAttempts = async (user: IRequestUser, quizLessonId: string) => {
	return await prisma.quizAttempt.findMany({
		where: {
			userId: user.userId,
			quizLessonId,
		},
		orderBy: {
			attemptedAt: "desc",
		},
		select: {
			id: true,
			quizLessonId: true,
			score: true,
			attemptedAt: true,
			_count: {
				select: {
					answers: true,
				},
			},
		},
	});
};

const getQuizAttempts = async (quizLessonId: string) => {
	return await prisma.quizAttempt.findMany({
		where: { quizLessonId },
		orderBy: {
			attemptedAt: "desc",
		},
		select: {
			id: true,
			score: true,
			attemptedAt: true,
			user: {
				select: {
					id: true,
					name: true,
					email: true,
					role: true,
				},
			},
			_count: {
				select: {
					answers: true,
				},
			},
		},
	});
};

export const QuizService = {
	createQuiz,
	getQuizByLessonId,
	getQuizById,
	updateQuiz,
	deleteQuiz,
	submitQuiz,
	getAttemptById,
	getMyAttempts,
	getQuizAttempts,
};
