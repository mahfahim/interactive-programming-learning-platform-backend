import type { Request, Response } from "express";
import httpStatus from "http-status";
import { AppError } from "../../utils/AppError";
import { catchAsync } from "../../utils/catchAsync";
import { uploadToCloudinary } from "../../utils/cloudinaryUpload";
import { sendResponse } from "../../utils/sendResponse";
import type { RequestUser } from "../../middlewares/checkAuth";
import { AssignmentService } from "./assignment.service";

const createAssignment = catchAsync(async (req: Request, res: Response) => {
	const result = await AssignmentService.createAssignment(req.body);

	sendResponse(res, {
		statusCode: httpStatus.CREATED,
		message: "Assignment created successfully",
		data: result,
	});
});

const getAssignmentByLessonId = catchAsync(
	async (req: Request, res: Response) => {
		const { lessonId } = req.params;
		const result = await AssignmentService.getAssignmentByLessonId(
			lessonId as string,
		);

		sendResponse(res, {
			statusCode: httpStatus.OK,
			message: "Assignment fetched successfully",
			data: result,
		});
	},
);

const getAssignmentById = catchAsync(async (req: Request, res: Response) => {
	const { id } = req.params;
	const user = req.user as RequestUser;
	const result = await AssignmentService.getAssignmentById(id as string, user);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		message: "Assignment details fetched successfully",
		data: result,
	});
});

const updateAssignment = catchAsync(async (req: Request, res: Response) => {
	const { id } = req.params;
	const result = await AssignmentService.updateAssignment(
		id as string,
		req.body,
	);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		message: "Assignment updated successfully",
		data: result,
	});
});

const deleteAssignment = catchAsync(async (req: Request, res: Response) => {
	const { id } = req.params;
	const result = await AssignmentService.deleteAssignment(id as string);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		message: "Assignment deleted successfully",
		data: result,
	});
});

const submitAssignment = catchAsync(async (req: Request, res: Response) => {
	const user = req.user as RequestUser;
	const files = req.files as Express.Multer.File[];

	if (!files || files.length === 0) {
		throw new AppError(
			httpStatus.BAD_REQUEST,
			"Please upload at least one assignment file",
		);
	}

	const uploadPromises = files.map((file) => uploadToCloudinary(file));
	const fileUrls = await Promise.all(uploadPromises);

	const result = await AssignmentService.submitAssignment(user, {
		assignmentId: req.body.assignmentId,
		fileUrls,
	});

	sendResponse(res, {
		statusCode: httpStatus.OK,
		message: "Assignment submitted successfully",
		data: result,
	});
});

const getMySubmission = catchAsync(async (req: Request, res: Response) => {
	const { assignmentId } = req.params;
	const user = req.user as RequestUser;
	const result = await AssignmentService.getMySubmission(
		user,
		assignmentId as string,
	);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		message: "My submission fetched successfully",
		data: result,
	});
});

const getAssignmentSubmissions = catchAsync(
	async (req: Request, res: Response) => {
		const { id } = req.params;
		const result = await AssignmentService.getAssignmentSubmissions(
			id as string,
		);

		sendResponse(res, {
			statusCode: httpStatus.OK,
			message: "Assignment submissions fetched successfully",
			data: result,
		});
	},
);

const gradeSubmission = catchAsync(async (req: Request, res: Response) => {
	const { submissionId } = req.params;
	const user = req.user as RequestUser;
	const result = await AssignmentService.gradeSubmission(
		submissionId as string,
		user,
		req.body,
	);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		message: "Assignment submission graded successfully",
		data: result,
	});
});

export const AssignmentController = {
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
