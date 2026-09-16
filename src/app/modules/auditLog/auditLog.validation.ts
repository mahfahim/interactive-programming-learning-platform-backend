import { z } from "zod";
import { AuditAction } from "../../../generated/prisma/client";

export const getAuditLogsQuerySchema = z.object({
	query: z
		.object({
			actorId: z.string().uuid().optional(),
			action: z.nativeEnum(AuditAction).optional(),
			entityType: z.string().optional(),
			entityId: z.string().optional(),
			startDate: z.string().optional(),
			endDate: z.string().optional(),
			page: z.string().optional(),
			limit: z.string().optional(),
			sortBy: z.string().optional(),
			sortOrder: z.enum(["asc", "desc"]).optional(),
		})
		.optional(),
});
