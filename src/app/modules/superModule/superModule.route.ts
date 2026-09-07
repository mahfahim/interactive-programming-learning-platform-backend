import express, { type Router } from "express";
import { Role } from "../../../generated/prisma/client";
import { auth } from "../../middlewares/checkAuth";
import { validateRequest } from "../../middlewares/validateRequest";
import { SuperModuleController } from "./superModule.controller";
import { SuperModuleValidations } from "./superModule.validation";

const router: Router = express.Router();

router.post(
	"/",
	auth(Role.INSTRUCTOR, Role.ADMIN),
	validateRequest(SuperModuleValidations.createSuperModuleSchema),
	SuperModuleController.createSuperModule,
);

router.get("/course/:courseId", SuperModuleController.getSuperModulesByCourse);

router.get("/:id", SuperModuleController.getSuperModuleById);

router.patch(
	"/:id",
	auth(Role.INSTRUCTOR, Role.ADMIN),
	validateRequest(SuperModuleValidations.updateSuperModuleSchema),
	SuperModuleController.updateSuperModule,
);

router.delete(
	"/:id",
	auth(Role.INSTRUCTOR, Role.ADMIN),
	SuperModuleController.deleteSuperModule,
);

export const SuperModuleRoutes = router;
