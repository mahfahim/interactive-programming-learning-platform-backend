import express from "express";
import { Role } from "../../../generated/prisma/client";
import { UserController } from "./user.controller";
import { UserValidation } from "./user.validation";
import { auth } from "../../middlewares/checkAuth";
import { validateRequest } from "../../middlewares/validateRequest";
import { upload } from "../../lib/multer";
import { authRateLimiter } from "../../middlewares/rateLimiter";

const router = express.Router();

router.get(
	"/me",
	auth(Role.ADMIN, Role.INSTRUCTOR, Role.STUDENT),
	UserController.getMyProfile,
);

router.patch(
	"/me",
	auth(Role.ADMIN, Role.INSTRUCTOR, Role.STUDENT),
	validateRequest(UserValidation.updateProfileSchema),
	UserController.updateMyProfile,
);

router.patch(
	"/me/upload-image",
	authRateLimiter,
	auth(Role.ADMIN, Role.INSTRUCTOR, Role.STUDENT),
	upload.single("image"),
	UserController.uploadProfileImage,
);

router.patch(
	"/me/educations",
	auth(Role.ADMIN, Role.INSTRUCTOR, Role.STUDENT),
	validateRequest(UserValidation.syncEducationsSchema),
	UserController.syncMyEducations,
);

router.patch(
	"/me/experiences",
	auth(Role.ADMIN, Role.INSTRUCTOR, Role.STUDENT),
	validateRequest(UserValidation.syncExperiencesSchema),
	UserController.syncMyExperiences,
);

router.patch(
	"/me/skills",
	auth(Role.ADMIN, Role.INSTRUCTOR, Role.STUDENT),
	validateRequest(UserValidation.syncSkillsSchema),
	UserController.syncMySkills,
);

router.patch(
	"/me/socials",
	auth(Role.ADMIN, Role.INSTRUCTOR, Role.STUDENT),
	validateRequest(UserValidation.syncSocialsSchema),
	UserController.syncMySocials,
);

router.patch(
	"/me/websites",
	auth(Role.ADMIN, Role.INSTRUCTOR, Role.STUDENT),
	validateRequest(UserValidation.syncWebsitesSchema),
	UserController.syncMyWebsites,
);

router.get(
	"/",
	auth(Role.ADMIN),
	validateRequest(UserValidation.userFilterSchema),
	UserController.getAllUsers,
);

router.get(
	"/:id",
	auth(Role.ADMIN, Role.INSTRUCTOR, Role.STUDENT),
	UserController.getUserById,
);

router.patch(
	"/:id",
	auth(Role.ADMIN),
	validateRequest(UserValidation.adminUpdateUserSchema),
	UserController.adminUpdateUser,
);

router.delete("/:id", auth(Role.ADMIN), UserController.softDeleteUser);

export const UserRoutes = router;
