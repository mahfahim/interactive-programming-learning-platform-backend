import httpStatus from "http-status";
import { Prisma } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/AppError";
import { clearCachePattern, getOrSetCache } from "../../utils/cache";
import { assignmentCacheKeys } from "../../utils/cacheKey";
import {
	assertLessonExists,
	verifyLessonAccess,
} from "../../utils/courseLessonAssertions";

import type {
	IAssignmentCreatePayload,
	IAssignmentGradePayload,
	IAssignmentSubmitPayload,
	IAssignmentUpdatePayload,
} from "./assignment.interface";

import type { RequestUser } from "../../middlewares/checkAuth";

export const assertAssignmentExists = async (id: string) => {
	const assignment = await prisma.assignment.findUnique({ where: { id } });

	if (!assignment) {
		throw new AppError(httpStatus.NOT_FOUND, "Assignment not found");
	}

	return assignment;
};

const createAssignment = async (payload: IAssignmentCreatePayload) => {
	await assertLessonExists(payload.lessonId);

	const result = await prisma.assignment.create({
		data: payload,
	});

	await clearCachePattern(assignmentCacheKeys.pattern);

	return result;
};

const getAssignmentByLessonId = async (
	lessonId: string,
	user?: RequestUser,
) => {
	await verifyLessonAccess(lessonId, user?.userId, user?.role);

	return getOrSetCache(
		assignmentCacheKeys.lesson(lessonId),
		async () => {
			const assignment = await prisma.assignment.findUnique({
				where: { lessonId },
			});

			if (!assignment) {
				throw new AppError(httpStatus.NOT_FOUND, "Assignment not found");
			}

			return assignment;
		},
		600,
	);
};

const getAssignmentById = async (id: string, user?: RequestUser) => {
	const assignment = await getOrSetCache(
		assignmentCacheKeys.detail(id),
		async () => {
			const result = await prisma.assignment.findUnique({
				where: { id },
			});

			if (!result) {
				throw new AppError(httpStatus.NOT_FOUND, "Assignment not found");
			}

			return result;
		},
		3600,
	);

	await verifyLessonAccess(assignment.lessonId, user?.userId, user?.role);

	let mySubmission = null;
	if (user?.userId) {
		mySubmission = await getOrSetCache(
			assignmentCacheKeys.submission(user.userId, id),
			() =>
				prisma.assignmentSubmission.findUnique({
					where: {
						userId_assignmentId: {
							userId: user.userId,
							assignmentId: id,
						},
					},
				}),
			600,
		);
	}

	return {
		...assignment,
		mySubmission,
	};
};

const updateAssignment = async (
	id: string,
	payload: IAssignmentUpdatePayload,
) => {
	await assertAssignmentExists(id);

	const result = await prisma.assignment.update({
		where: { id },
		data: payload,
	});

	await clearCachePattern(assignmentCacheKeys.pattern);

	return result;
};

const deleteAssignment = async (id: string) => {
	await assertAssignmentExists(id);

	const result = await prisma.assignment.delete({
		where: { id },
	});

	await clearCachePattern(assignmentCacheKeys.pattern);

	return result;
};

const submitAssignment = async (
	user: RequestUser,
	payload: IAssignmentSubmitPayload,
) => {
	const assignment = await assertAssignmentExists(payload.assignmentId);
	await verifyLessonAccess(assignment.lessonId, user.userId, user.role);

	const result = await prisma.assignmentSubmission.upsert({
		where: {
			userId_assignmentId: {
				userId: user.userId,
				assignmentId: payload.assignmentId,
			},
		},
		create: {
			assignmentId: payload.assignmentId,
			userId: user.userId,
			fileUrls: payload.fileUrls,
		},
		update: {
			fileUrls: payload.fileUrls,
			submittedAt: new Date(),
			scoreObtained: null,
			instructorFeedback: null,
			gradedByUserId: null,
			gradedAt: null,
		},
	});

	await clearCachePattern(
		assignmentCacheKeys.submission(user.userId, payload.assignmentId),
	);
	await clearCachePattern(
		assignmentCacheKeys.submissions(payload.assignmentId),
	);
	await clearCachePattern(assignmentCacheKeys.detail(payload.assignmentId));

	return result;
};

const getMySubmission = async (user: RequestUser, assignmentId: string) => {
	const assignment = await assertAssignmentExists(assignmentId);
	await verifyLessonAccess(assignment.lessonId, user.userId, user.role);

	return getOrSetCache(
		assignmentCacheKeys.submission(user.userId, assignmentId),
		async () => {
			const submission = await prisma.assignmentSubmission.findUnique({
				where: {
					userId_assignmentId: {
						userId: user.userId,
						assignmentId,
					},
				},
			});

			if (!submission) {
				throw new AppError(httpStatus.NOT_FOUND, "Submission not found");
			}

			return submission;
		},
		600,
	);
};

const getAssignmentSubmissions = async (
	assignmentId: string,
	user?: RequestUser,
) => {
	const assignment = await assertAssignmentExists(assignmentId);
	await verifyLessonAccess(assignment.lessonId, user?.userId, user?.role);

	return getOrSetCache(
		assignmentCacheKeys.submissions(assignmentId),
		() =>
			prisma.assignmentSubmission.findMany({
				where: { assignmentId },
				orderBy: { submittedAt: "desc" },
			}),
		300,
	);
};

const gradeSubmission = async (
	submissionId: string,
	user: RequestUser,
	payload: IAssignmentGradePayload,
) => {
	const submissionExists = await prisma.assignmentSubmission.findUnique({
		where: { id: submissionId },
	});

	if (!submissionExists) {
		throw new AppError(httpStatus.NOT_FOUND, "Submission not found");
	}

	const result = await prisma.assignmentSubmission.update({
		where: { id: submissionId },
		data: {
			scoreObtained: new Prisma.Decimal(payload.scoreObtained),
			instructorFeedback: payload.instructorFeedback || null,
			gradedByUserId: user.userId,
			gradedAt: new Date(),
		},
	});

	await clearCachePattern(
		assignmentCacheKeys.submission(
			submissionExists.userId,
			submissionExists.assignmentId,
		),
	);
	await clearCachePattern(
		assignmentCacheKeys.submissions(submissionExists.assignmentId),
	);
	await clearCachePattern(
		assignmentCacheKeys.detail(submissionExists.assignmentId),
	);

	return result;
};

export const AssignmentService = {
	createAssignment,
	getAssignmentByLessonId,
	getAssignmentById,
	updateAssignment,
	deleteAssignment,
	submitAssignment,
	getMySubmission,
	getAssignmentSubmissions,
	gradeSubmission,
};
