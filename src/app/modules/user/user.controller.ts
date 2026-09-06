import type { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { UserService } from "./user.service";
import type {
	IUserFilterRequest,
	IAdminUpdateUserDto,
	IUpdateUserProfileDto,
	ISyncEducationsDto,
	ISyncExperiencesDto,
	ISyncSkillsDto,
	ISyncSocialsDto,
	ISyncWebsitesDto,
} from "./user.interface";

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
	const filters: IUserFilterRequest = {
		search: req.query.search as string,
		role: req.query.role as any,
		status: req.query.status as any,
		page: req.query.page ? Number(req.query.page) : undefined,
		limit: req.query.limit ? Number(req.query.limit) : undefined,
		sortBy: req.query.sortBy as string,
		sortOrder: req.query.sortOrder as "asc" | "desc",
	};

	const result = await UserService.getAllUsers(filters);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Users retrieved successfully",
		meta: {
			page: result.meta.page,
			limit: result.meta.limit,
			total: result.meta.total,
			totalPages: result.meta.totalPage,
		},
		data: result.data,
	});
});

const getUserById = catchAsync(async (req: Request, res: Response) => {
	const { id } = req.params;
	const result = await UserService.getUserById(id as string);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "User profile retrieved successfully",
		data: result,
	});
});

const adminUpdateUser = catchAsync(async (req: Request, res: Response) => {
	const { id } = req.params;
	const payload: IAdminUpdateUserDto = req.body;

	const result = await UserService.adminUpdateUser(id as string, payload);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "User updated successfully by admin",
		data: result,
	});
});

const softDeleteUser = catchAsync(async (req: Request, res: Response) => {
	const { id } = req.params;
	const result = await UserService.softDeleteUser(id as string);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "User account soft deleted successfully",
		data: result,
	});
});

const getMyProfile = catchAsync(async (req: Request, res: Response) => {
	const userId = (req as any).user.userId;
	const result = await UserService.getMyProfile(userId);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Current user profile fetched successfully",
		data: result,
	});
});

const updateMyProfile = catchAsync(async (req: Request, res: Response) => {
	const userId = (req as any).user.userId;
	const payload: IUpdateUserProfileDto = req.body;

	const result = await UserService.updateMyProfile(userId, payload);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "User profile updated successfully",
		data: result,
	});
});

const syncMyEducations = catchAsync(async (req: Request, res: Response) => {
	const userId = (req as any).user.userId;
	const payload: ISyncEducationsDto = req.body;

	const result = await UserService.syncMyEducations(userId, payload);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Educational records synchronized successfully",
		data: result,
	});
});

const syncMyExperiences = catchAsync(async (req: Request, res: Response) => {
	const userId = (req as any).user.userId;
	const payload: ISyncExperiencesDto = req.body;

	const result = await UserService.syncMyExperiences(userId, payload);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Work experience records synchronized successfully",
		data: result,
	});
});

const syncMySkills = catchAsync(async (req: Request, res: Response) => {
	const userId = (req as any).user.userId;
	const payload: ISyncSkillsDto = req.body;

	const result = await UserService.syncMySkills(userId, payload);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Skills matrix synchronized successfully",
		data: result,
	});
});

const syncMySocials = catchAsync(async (req: Request, res: Response) => {
	const userId = (req as any).user.userId;
	const payload: ISyncSocialsDto = req.body;

	const result = await UserService.syncMySocials(userId, payload);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Social links synchronized successfully",
		data: result,
	});
});

const syncMyWebsites = catchAsync(async (req: Request, res: Response) => {
	const userId = (req as any).user.userId;
	const payload: ISyncWebsitesDto = req.body;

	const result = await UserService.syncMyWebsites(userId, payload);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Personal websites synchronized successfully",
		data: result,
	});
});

const uploadProfileImage = catchAsync(async (req: Request, res: Response) => {
	const userId = (req as any).user.userId;

	if (!req.file) {
		throw new Error("Please upload an image file");
	}

	const result = await UserService.uploadProfileImage(req.file.buffer, userId);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Profile image uploaded successfully",
		data: result,
	});
});

export const UserController = {
	getAllUsers,
	getUserById,
	adminUpdateUser,
	softDeleteUser,
	getMyProfile,
	updateMyProfile,
	syncMyEducations,
	syncMyExperiences,
	syncMySkills,
	syncMySocials,
	syncMyWebsites,
	uploadProfileImage,
};
