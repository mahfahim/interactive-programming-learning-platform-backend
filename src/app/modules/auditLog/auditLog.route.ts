import { Router } from "express";
import { Role } from "../../../generated/prisma/client";
import { auth } from "../../middlewares/checkAuth";
import { validateRequest } from "../../middlewares/validateRequest";
import { AuditLogController } from "./auditLog.controller";
import { getAuditLogsQuerySchema } from "./auditLog.validation";

const router = Router();

router.get(
	"/",
	auth(Role.ADMIN),
	validateRequest(getAuditLogsQuerySchema),
	AuditLogController.getAuditLogs,
);

export const AuditLogRoutes = router;
