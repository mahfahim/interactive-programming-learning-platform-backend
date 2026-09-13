import { Router } from "express";
import { Role } from "../../../generated/prisma/client";
import { auth } from "../../middlewares/checkAuth";
import { AnalyticsController } from "./analytics.controller";

const router = Router();

router.get(
	"/admin-overview",
	auth(Role.ADMIN),
	AnalyticsController.getAdminOverviewStats,
);

export const AnalyticsRoutes = router;
