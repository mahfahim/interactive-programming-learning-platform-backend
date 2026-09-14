import { z } from "zod";
import {
	Role,
	UserStatus,
	SocialPlatform,
	ProficiencyLevel,
} from "../../../generated/prisma/client";

const isoDateSchema = z
	.string()
	.refine((val) => !Number.isNaN(Date.parse(val)), {
		message: "Invalid start date format (ISO 8601 string expected)",
	});

const optionalIsoDateSchema = z
	.union([
		z.string().refine((val) => !Number.isNaN(Date.parse(val)), {
			message: "Invalid end date format",
		}),
		z.null(),
		z.undefined(),
	])
	.optional();

const userFilterSchema = z.object({
	search: z.string().optional(),
	role: z.nativeEnum(Role).optional(),
	status: z.nativeEnum(UserStatus).optional(),
	page: z.string().optional(),
	limit: z.string().optional(),
	sortBy: z.string().optional(),
	sortOrder: z.enum(["asc", "desc"]).optional(),
});

const adminUpdateUserSchema = z.object({
	name: z.string().min(1, "Name cannot be empty").optional(),
	role: z
		.nativeEnum(Role, { message: "Invalid user role specified" })
		.optional(),
	status: z
		.nativeEnum(UserStatus, { message: "Invalid user status specified" })
		.optional(),
	isDeleted: z.boolean().optional(),
});

const updateProfileSchema = z.object({
	name: z.string().min(1).nullable().optional(),
	imageUrl: z.string().url("Invalid image URL format").nullable().optional(),
	imagePublicId: z.string().nullable().optional(),
	bio: z
		.string()
		.max(1000, "Bio cannot exceed 1000 characters")
		.nullable()
		.optional(),
	cityId: z.string().uuid("Invalid City ID format").nullable().optional(),
});

const syncEducationsSchema = z.object({
	educations: z.array(
		z.object({
			institution: z.string({ message: "Institution name is required" }).min(1),
			degree: z.string({ message: "Degree is required" }).min(1),
			fieldOfStudy: z.string({ message: "Field of study is required" }).min(1),
			startDate: isoDateSchema,
			endDate: optionalIsoDateSchema,
		}),
	),
});

const syncExperiencesSchema = z.object({
	experiences: z.array(
		z.object({
			company: z.string({ message: "Company name is required" }).min(1),
			position: z.string({ message: "Position title is required" }).min(1),
			startDate: isoDateSchema,
			endDate: optionalIsoDateSchema,
			description: z.string().nullable().optional(),
		}),
	),
});

const syncSkillsSchema = z.object({
	skills: z.array(
		z.object({
			skillId: z
				.string({ message: "Skill ID is required" })
				.uuid("Invalid Skill ID format"),
			proficiencyLevel: z
				.nativeEnum(ProficiencyLevel, {
					message: "Invalid proficiency level value",
				})
				.optional(),
		}),
	),
});

const syncSocialsSchema = z.object({
	socials: z.array(
		z.object({
			platform: z.nativeEnum(SocialPlatform, {
				message: "Invalid social platform type specified",
			}),
			url: z
				.string({ message: "Social URL is required" })
				.url("Invalid social link URL format"),
		}),
	),
});

const syncWebsitesSchema = z.object({
	websites: z.array(
		z.object({
			title: z.string({ message: "Website title is required" }).min(1),
			url: z
				.string({ message: "Website URL is required" })
				.url("Invalid website URL format"),
		}),
	),
});

export const UserValidation = {
	userFilterSchema,
	adminUpdateUserSchema,
	updateProfileSchema,
	syncEducationsSchema,
	syncExperiencesSchema,
	syncSkillsSchema,
	syncSocialsSchema,
	syncWebsitesSchema,
};
