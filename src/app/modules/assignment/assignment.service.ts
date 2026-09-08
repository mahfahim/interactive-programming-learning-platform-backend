import { Prisma } from "@prisma/client";
import httpStatus from "http-status";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/AppError";
import type {
	IAssignmentCreatePayload,
	IAssignmentGradePayload,
	IAssignmentSubmitPayload,
	IAssignmentUpdatePayload,
	IRequestUser,
} from "./assignment.interface";

const createAssignment = async (payload: IAssignmentCreatePayload) => {
	const lessonExists = await prisma.lesson.findUnique({
		where: { id: payload.lessonId },
	});

	if (!lessonExists) {
		throw new AppError(httpStatus.NOT_FOUND, "Lesson not found");
	}

	const existingAssignment = await prisma.assignment.findUnique({
		where: { lessonId: payload.lessonId },
	});

	if (existingAssignment) {
		throw new AppError(
			httpStatus.BAD_REQUEST,
			"An assignment already exists for this lesson",
		);
	}

	return await prisma.assignment.create({
		data: {
			title: payload.title,
			instructions: payload.instructions,
			dueDate: new Date(payload.dueDate),
			lessonId: payload.lessonId,
		},
	});
};

const getAssignmentByLessonId = async (lessonId: string) => {
	const assignment = await prisma.assignment.findUnique({
		where: { lessonId },
		select: {
			id: true,
			title: true,
			instructions: true,
			dueDate: true,
			lessonId: true,
		},
	});

	if (!assignment) {
		throw new AppError(
			httpStatus.NOT_FOUND,
			"Assignment not found for this lesson",
		);
	}

	return assignment;
};

const getAssignmentById = async (id: string, user: IRequestUser) => {
	const assignment = await prisma.assignment.findUnique({
		where: { id },
		select: {
			id: true,
			title: true,
			instructions: true,
			dueDate: true,
			lessonId: true,
		},
	});

	if (!assignment) {
		throw new AppError(httpStatus.NOT_FOUND, "Assignment not found");
	}

	const mySubmission = await prisma.assignmentSubmission.findUnique({
		where: {
			userId_assignmentId: {
				userId: user.userId,
				assignmentId: id,
			},
		},
		select: {
			id: true,
			fileUrls: true,
			submittedAt: true,
			scoreObtained: true,
			instructorFeedback: true,
			gradedAt: true,
		},
	});

	return {
		...assignment,
		mySubmission: mySubmission || null,
	};
};

const updateAssignment = async (
	id: string,
	payload: IAssignmentUpdatePayload,
) => {
	const assignmentExists = await prisma.assignment.findUnique({
		where: { id },
	});

	if (!assignmentExists) {
		throw new AppError(httpStatus.NOT_FOUND, "Assignment not found");
	}

	return await prisma.assignment.update({
		where: { id },
		data: {
			title: payload.title,
			instructions: payload.instructions,
			dueDate: payload.dueDate ? new Date(payload.dueDate) : undefined,
		},
	});
};

const deleteAssignment = async (id: string) => {
	const assignmentExists = await prisma.assignment.findUnique({
		where: { id },
	});

	if (!assignmentExists) {
		throw new AppError(httpStatus.NOT_FOUND, "Assignment not found");
	}

	return await prisma.assignment.delete({
		where: { id },
	});
};

const submitAssignment = async (
	user: IRequestUser,
	payload: IAssignmentSubmitPayload,
) => {
	const assignmentExists = await prisma.assignment.findUnique({
		where: { id: payload.assignmentId },
	});

	if (!assignmentExists) {
		throw new AppError(httpStatus.NOT_FOUND, "Assignment not found");
	}

	const existingSubmission = await prisma.assignmentSubmission.findUnique({
		where: {
			userId_assignmentId: {
				userId: user.userId,
				assignmentId: payload.assignmentId,
			},
		},
	});

	if (existingSubmission) {
		return await prisma.assignmentSubmission.update({
			where: {
				userId_assignmentId: {
					userId: user.userId,
					assignmentId: payload.assignmentId,
				},
			},
			data: {
				fileUrls: payload.fileUrls,
				submittedAt: new Date(),
				scoreObtained: null,
				instructorFeedback: null,
				gradedByUserId: null,
				gradedAt: null,
			},
		});
	}

	return await prisma.assignmentSubmission.create({
		data: {
			assignmentId: payload.assignmentId,
			userId: user.userId,
			fileUrls: payload.fileUrls,
		},
	});
};

const getMySubmission = async (user: IRequestUser, assignmentId: string) => {
	const submission = await prisma.assignmentSubmission.findUnique({
		where: {
			userId_assignmentId: {
				userId: user.userId,
				assignmentId,
			},
		},
		select: {
			id: true,
			assignmentId: true,
			userId: true,
			fileUrls: true,
			submittedAt: true,
			scoreObtained: true,
			instructorFeedback: true,
			gradedByUserId: true,
			gradedAt: true,
		},
	});

	return submission || null;
};

const getAssignmentSubmissions = async (assignmentId: string) => {
	const assignmentExists = await prisma.assignment.findUnique({
		where: { id: assignmentId },
	});

	if (!assignmentExists) {
		throw new AppError(httpStatus.NOT_FOUND, "Assignment not found");
	}

	return await prisma.assignmentSubmission.findMany({
		where: { assignmentId },
		orderBy: {
			submittedAt: "desc",
		},
		select: {
			id: true,
			fileUrls: true,
			submittedAt: true,
			scoreObtained: true,
			instructorFeedback: true,
			gradedByUserId: true,
			gradedAt: true,
			user: {
				select: {
					id: true,
					name: true,
					email: true,
				},
			},
		},
	});
};

const gradeSubmission = async (
	submissionId: string,
	user: IRequestUser,
	payload: IAssignmentGradePayload,
) => {
	const submissionExists = await prisma.assignmentSubmission.findUnique({
		where: { id: submissionId },
	});

	if (!submissionExists) {
		throw new AppError(httpStatus.NOT_FOUND, "Assignment submission not found");
	}

	return await prisma.assignmentSubmission.update({
		where: { id: submissionId },
		data: {
			scoreObtained: new Prisma.Decimal(payload.scoreObtained),
			instructorFeedback: payload.instructorFeedback || null,
			gradedByUserId: user.userId,
			gradedAt: new Date(),
		},
	});
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
