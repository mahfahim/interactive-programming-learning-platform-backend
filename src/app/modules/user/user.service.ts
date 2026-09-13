import type { UploadApiResponse } from "cloudinary";
import { AuditAction, type Prisma } from "../../../generated/prisma/client";
import { UserStatus } from "../../../generated/prisma/enums";
import { cloudinary } from "../../lib/cloudinary";
import { prisma } from "../../lib/prisma";
import { clearCachePattern, getOrSetCache } from "../../utils/cache";
import { userCacheKeys } from "../../utils/cacheKey";
import { calculateEntityDiff } from "../../utils/sanitizeAuditData";
import { AuditLogService } from "../auditLog/auditLog.service";
import type {
	IAdminUpdateUserDto,
	ISyncEducationsDto,
	ISyncExperiencesDto,
	ISyncSkillsDto,
	ISyncSocialsDto,
	ISyncWebsitesDto,
	IUpdateUserProfileDto,
	IUserFilterRequest,
} from "./user.interface";

const USER_LIST_TTL = 300; // 5 minutes
const USER_DETAIL_TTL = 600; // 10 minutes
const USER_PROFILE_TTL = 300; // 5 minutes

const fullProfileInclude = {
	description: {
		include: {
			city: true,
			socials: true,
			educations: true,
			experiences: true,
			websites: true,
			skills: {
				include: {
					skill: true,
				},
			},
		},
	},
} satisfies Prisma.UserInclude;

type UserWithFullProfile = Prisma.UserGetPayload<{
	include: typeof fullProfileInclude;
}>;

const sanitizeUser = (user: UserWithFullProfile) => {
	const { password, ...sanitized } = user;
	return sanitized;
};

const ensureUserDescriptionExists = async (
	tx: Prisma.TransactionClient,
	userId: string,
) => {
	await tx.userDescription.upsert({
		where: { userId },
		create: { userId },
		update: {},
	});
};

const syncRelation = async (
	userId: string,
	deleteFn: (tx: Prisma.TransactionClient) => Promise<Prisma.BatchPayload>,
	createFn: (tx: Prisma.TransactionClient) => Promise<Prisma.BatchPayload>,
) => {
	const updatedUser = await prisma.$transaction(async (tx) => {
		await ensureUserDescriptionExists(tx, userId);
		await deleteFn(tx);
		await createFn(tx);

		return tx.user.findUnique({
			where: { id: userId },
			include: fullProfileInclude,
		});
	});

	if (!updatedUser) {
		throw new Error("User profile sync failed");
	}

	const sanitized = sanitizeUser(updatedUser);
	await clearCachePattern(userCacheKeys.pattern);
	return sanitized;
};

const uploadProfileImage = async (buffer: Buffer, userId: string) => {
	const currentUser = await prisma.user.findUnique({
		where: { id: userId },
		select: {
			imagePublicId: true,
			imageUrl: true,
		},
	});

	const cloudinaryResult = await new Promise<UploadApiResponse>(
		(resolve, reject) => {
			cloudinary.uploader
				.upload_stream({ resource_type: "auto" }, (error, result) => {
					if (error) {
						return reject(error);
					}

					if (!result) {
						return reject(new Error("No result returned from Cloudinary"));
					}

					resolve(result);
				})
				.end(buffer);
		},
	);

	const updatedUser = await prisma.user.update({
		where: { id: userId },
		data: {
			imageUrl: cloudinaryResult.secure_url,
			imagePublicId: cloudinaryResult.public_id,
		},
		include: fullProfileInclude,
	});

	if (currentUser?.imagePublicId && currentUser.imageUrl) {
		await cloudinary.uploader.destroy(currentUser.imagePublicId);
	}

	const sanitized = sanitizeUser(updatedUser);
	await clearCachePattern(userCacheKeys.pattern);
	return sanitized;
};

const getAllUsers = async (filters: IUserFilterRequest) => {
	const cacheKey = userCacheKeys.list(
		filters as unknown as Record<string, unknown>,
	);

	return await getOrSetCache(
		cacheKey,
		async () => {
			const {
				search,
				role,
				status,
				page = 1,
				limit = 10,
				sortBy = "createdAt",
				sortOrder = "desc",
			} = filters;

			const pageNumber = Math.max(1, Number(page));
			const limitNumber = Math.max(1, Number(limit));
			const skip = (pageNumber - 1) * limitNumber;

			const whereConditions: Prisma.UserWhereInput = {
				isDeleted: false,
				...(role && { role }),
				...(status && { status }),
				...(search && {
					OR: [
						{ name: { contains: search, mode: "insensitive" } },
						{ email: { contains: search, mode: "insensitive" } },
					],
				}),
			};

			const [users, total] = await Promise.all([
				prisma.user.findMany({
					where: whereConditions,
					skip,
					take: limitNumber,
					orderBy: {
						[sortBy]: sortOrder,
					},
					include: fullProfileInclude,
				}),
				prisma.user.count({ where: whereConditions }),
			]);

			return {
				meta: {
					page: pageNumber,
					limit: limitNumber,
					total,
					totalPage: Math.ceil(total / limitNumber),
				},
				data: users.map(sanitizeUser),
			};
		},
		USER_LIST_TTL,
	);
};

const getUserById = async (id: string) => {
	const cacheKey = userCacheKeys.detail(id);

	return await getOrSetCache(
		cacheKey,
		async () => {
			const user = await prisma.user.findFirst({
				where: { id, isDeleted: false },
				include: fullProfileInclude,
			});

			if (!user) {
				throw new Error("User account not found or has been deactivated");
			}

			return sanitizeUser(user);
		},
		USER_DETAIL_TTL,
	);
};

const adminUpdateUser = async (id: string, payload: IAdminUpdateUserDto) => {
	const updatedUser = await prisma.$transaction(async (tx) => {
		const currentUser = await tx.user.findUnique({ where: { id } });
		if (!currentUser) throw new Error("User not found or update failed");

		const result = await tx.user.update({
			where: { id },
			data: payload,
			include: fullProfileInclude,
		});

		const diff = calculateEntityDiff(currentUser, result);

		let action: AuditAction = AuditAction.USER_UPDATED;
		if (payload.role && payload.role !== currentUser.role) {
			action = AuditAction.ROLE_CHANGE;
		} else if (payload.status && payload.status !== currentUser.status) {
			action = AuditAction.STATUS_CHANGE;
		}

		await AuditLogService.create(
			{
				action,
				entityType: "USER",
				entityId: id,
				description: `Updated user profile/settings for ${result.email}`,
				oldValues: diff.oldValues,
				newValues: diff.newValues,
			},
			tx,
		);

		return result;
	});

	const sanitized = sanitizeUser(updatedUser);
	await clearCachePattern(userCacheKeys.pattern);
	return sanitized;
};

const softDeleteUser = async (id: string) => {
	const deletedUser = await prisma.$transaction(async (tx) => {
		const existingUser = await tx.user.findUnique({
			where: { id },
		});

		if (!existingUser || existingUser.isDeleted) {
			throw new Error("User not found or already deleted");
		}

		const result = await tx.user.update({
			where: { id },
			data: {
				isDeleted: true,
				status: UserStatus.DELETED,
				deletedAt: new Date(),
			},
			include: fullProfileInclude,
		});

		await AuditLogService.create(
			{
				action: AuditAction.USER_SOFT_DELETED,
				entityType: "USER",
				entityId: id,
				description: `Soft deleted user account ${result.email}`,
				oldValues: {
					isDeleted: existingUser.isDeleted,
					status: existingUser.status,
				},
				newValues: { isDeleted: result.isDeleted, status: result.status },
			},
			tx,
		);

		return result;
	});

	const sanitized = sanitizeUser(deletedUser);
	await clearCachePattern(userCacheKeys.pattern);
	return sanitized;
};

const getMyProfile = async (userId: string) => {
	const cacheKey = userCacheKeys.myProfile(userId);

	return await getOrSetCache(
		cacheKey,
		async () => {
			const user = await prisma.user.findUnique({
				where: { id: userId },
				include: fullProfileInclude,
			});

			if (!user || user.isDeleted) {
				throw new Error("User session invalid or account deleted");
			}

			return sanitizeUser(user);
		},
		USER_PROFILE_TTL,
	);
};

const updateMyProfile = async (
	userId: string,
	payload: IUpdateUserProfileDto,
) => {
	const { name, imageUrl, imagePublicId, bio, cityId } = payload;

	const updatedUser = await prisma.$transaction(async (tx) => {
		if (
			name !== undefined ||
			imageUrl !== undefined ||
			imagePublicId !== undefined
		) {
			await tx.user.update({
				where: { id: userId },
				data: {
					...(name !== undefined && { name }),
					...(imageUrl !== undefined && { imageUrl }),
					...(imagePublicId !== undefined && { imagePublicId }),
				},
			});
		}

		if (bio !== undefined || cityId !== undefined) {
			await tx.userDescription.upsert({
				where: { userId },
				create: {
					userId,
					bio: bio ?? null,
					cityId: cityId ?? null,
				},
				update: {
					...(bio !== undefined && { bio }),
					...(cityId !== undefined && { cityId }),
				},
			});
		}

		return tx.user.findUnique({
			where: { id: userId },
			include: fullProfileInclude,
		});
	});

	if (!updatedUser) {
		throw new Error("Failed to update user profile");
	}

	const sanitized = sanitizeUser(updatedUser);
	await clearCachePattern(userCacheKeys.pattern);
	return sanitized;
};

const syncMyEducations = async (
	userId: string,
	payload: ISyncEducationsDto,
) => {
	return syncRelation(
		userId,
		(tx) =>
			tx.userEducation.deleteMany({ where: { userDescriptionId: userId } }),
		(tx) =>
			payload.educations && payload.educations.length > 0
				? tx.userEducation.createMany({
						data: payload.educations.map((item) => ({
							userDescriptionId: userId,
							institution: item.institution,
							degree: item.degree,
							fieldOfStudy: item.fieldOfStudy,
							startDate: new Date(item.startDate),
							endDate: item.endDate ? new Date(item.endDate) : null,
						})),
					})
				: Promise.resolve({ count: 0 }),
	);
};

const syncMyExperiences = async (
	userId: string,
	payload: ISyncExperiencesDto,
) => {
	return syncRelation(
		userId,
		(tx) =>
			tx.userExperience.deleteMany({ where: { userDescriptionId: userId } }),
		(tx) =>
			payload.experiences && payload.experiences.length > 0
				? tx.userExperience.createMany({
						data: payload.experiences.map((item) => ({
							userDescriptionId: userId,
							company: item.company,
							position: item.position,
							startDate: new Date(item.startDate),
							endDate: item.endDate ? new Date(item.endDate) : null,
							description: item.description ?? null,
						})),
					})
				: Promise.resolve({ count: 0 }),
	);
};

const syncMySkills = async (userId: string, payload: ISyncSkillsDto) => {
	return syncRelation(
		userId,
		(tx) => tx.userSkill.deleteMany({ where: { userDescriptionId: userId } }),
		(tx) =>
			payload.skills && payload.skills.length > 0
				? tx.userSkill.createMany({
						data: payload.skills.map((item) => ({
							userDescriptionId: userId,
							skillId: item.skillId,
							proficiencyLevel: item.proficiencyLevel,
						})),
					})
				: Promise.resolve({ count: 0 }),
	);
};

const syncMySocials = async (userId: string, payload: ISyncSocialsDto) => {
	return syncRelation(
		userId,
		(tx) => tx.userSocial.deleteMany({ where: { userDescriptionId: userId } }),
		(tx) =>
			payload.socials && payload.socials.length > 0
				? tx.userSocial.createMany({
						data: payload.socials.map((item) => ({
							userDescriptionId: userId,
							platform: item.platform,
							url: item.url,
						})),
					})
				: Promise.resolve({ count: 0 }),
	);
};

const syncMyWebsites = async (userId: string, payload: ISyncWebsitesDto) => {
	return syncRelation(
		userId,
		(tx) => tx.userWebsite.deleteMany({ where: { userDescriptionId: userId } }),
		(tx) =>
			payload.websites && payload.websites.length > 0
				? tx.userWebsite.createMany({
						data: payload.websites.map((item) => ({
							userDescriptionId: userId,
							title: item.title,
							url: item.url,
						})),
					})
				: Promise.resolve({ count: 0 }),
	);
};

export const UserService = {
	getAllUsers,
	getUserById,
	adminUpdateUser,
	softDeleteUser,
	getMyProfile,
	updateMyProfile,
	uploadProfileImage,
	syncMyEducations,
	syncMyExperiences,
	syncMySkills,
	syncMySocials,
	syncMyWebsites,
};
