import express, { type Router } from "express";
import { Role } from "../../../generated/prisma/client";
import { auth } from "../../middlewares/checkAuth";
import { validateRequest } from "../../middlewares/validateRequest";
import { ModuleController } from "./module.controller";
import { ModuleValidations } from "./module.validation";

const router: Router = express.Router();

router.post(
	"/",
	auth(Role.INSTRUCTOR, Role.ADMIN),
	validateRequest(ModuleValidations.createModuleSchema),
	ModuleController.createModule,
);

router.get(
	"/super-module/:superModuleId",
	ModuleController.getModulesBySuperModule,
);

router.get("/:id", ModuleController.getModuleById);

router.patch(
	"/:id",
	auth(Role.INSTRUCTOR, Role.ADMIN),
	validateRequest(ModuleValidations.updateModuleSchema),
	ModuleController.updateModule,
);

router.delete(
	"/:id",
	auth(Role.INSTRUCTOR, Role.ADMIN),
	ModuleController.deleteModule,
);

export const ModuleRoutes = router;
