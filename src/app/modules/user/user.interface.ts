import type {
	Role,
	UserStatus,
	SocialPlatform,
	ProficiencyLevel,
	User,
	UserDescription,
	UserSocial,
	UserEducation,
	UserExperience,
	UserWebsite,
	UserSkill,
	Skill,
	City,
} from "../../../generated/prisma/client";

export interface IPaginationOptions {
	page?: number;
	limit?: number;
	sortBy?: string;
	sortOrder?: "asc" | "desc";
}

export interface IUserFilterRequest extends IPaginationOptions {
	search?: string;
	role?: Role;
	status?: UserStatus;
}

export interface IAdminUpdateUserDto {
	name?: string;
	role?: Role;
	status?: UserStatus;
	isDeleted?: boolean;
}

export interface IUpdateUserProfileDto {
	name?: string | null;
	imageUrl?: string | null;
	imagePublicId?: string | null;
	bio?: string | null;
	cityId?: string | null;
}

export interface ISyncEducationItem {
	institution: string;
	degree: string;
	fieldOfStudy: string;
	startDate: string | Date;
	endDate?: string | Date | null;
}

export interface ISyncEducationsDto {
	educations: ISyncEducationItem[];
}

export interface ISyncExperienceItem {
	company: string;
	position: string;
	startDate: string | Date;
	endDate?: string | Date | null;
	description?: string | null;
}

export interface ISyncExperiencesDto {
	experiences: ISyncExperienceItem[];
}

export interface ISyncSkillItem {
	skillId: string;
	proficiencyLevel?: ProficiencyLevel;
}

export interface ISyncSkillsDto {
	skills: ISyncSkillItem[];
}

export interface ISyncSocialItem {
	platform: SocialPlatform;
	url: string;
}

export interface ISyncSocialsDto {
	socials: ISyncSocialItem[];
}

export interface ISyncWebsiteItem {
	title: string;
	url: string;
}

export interface ISyncWebsitesDto {
	websites: ISyncWebsiteItem[];
}

export type IUserSkillWithDetail = UserSkill & {
	skill: Skill;
};

export type IUserDescriptionAggregate = UserDescription & {
	city: City | null;
	socials: UserSocial[];
	educations: UserEducation[];
	experiences: UserExperience[];
	websites: UserWebsite[];
	skills: IUserSkillWithDetail[];
};

export type IUserProfileResponse = Omit<User, "password"> & {
	description: IUserDescriptionAggregate | null;
};

export interface IPaginatedResult<T> {
	meta: {
		page: number;
		limit: number;
		total: number;
		totalPage: number;
	};
	data: T[];
}
