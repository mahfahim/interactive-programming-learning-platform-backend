import { Prisma } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { requestContextStorage } from "../../utils/asyncLocalStorage";
import { sanitizeAuditData } from "../../utils/sanitizeAuditData";
import type {
	AuditTransactionClient,
	IAuditLogFilterQuery,
	ICreateAuditLogInput,
} from "./auditLog.interface";

const create = async (
	input: ICreateAuditLogInput,
	tx?: AuditTransactionClient,
): Promise<void> => {
	try {
		const context = requestContextStorage.getStore();
		const client = tx || prisma;

		const finalActorId =
			input.actorId !== undefined ? input.actorId : (context?.actorId ?? null);

		const sanitizedOldValues = sanitizeAuditData(input.oldValues);
		const sanitizedNewValues = sanitizeAuditData(input.newValues);
		const sanitizedMetadata = sanitizeAuditData(input.metadata);

		await client.auditLog.create({
			data: {
				action: input.action,
				entityType: input.entityType,
				entityId: input.entityId ?? null,
				description: input.description,
				actorId: finalActorId,
				oldValues:
					sanitizedOldValues !== null
						? (sanitizedOldValues as Prisma.InputJsonValue)
						: Prisma.JsonNull,
				newValues:
					sanitizedNewValues !== null
						? (sanitizedNewValues as Prisma.InputJsonValue)
						: Prisma.JsonNull,
				metadata:
					sanitizedMetadata !== null
						? (sanitizedMetadata as Prisma.InputJsonValue)
						: Prisma.JsonNull,
				ipAddress: context?.ipAddress ?? null,
				userAgent: context?.userAgent ?? null,
				requestId: context?.requestId ?? null,
			},
		});
	} catch (error) {
		console.error("Audit Log Creation Failed:", error);
		if (tx) throw error;
	}
};

const getAll = async (query: IAuditLogFilterQuery) => {
	const {
		actorId,
		action,
		entityType,
		entityId,
		startDate,
		endDate,
		page = 1,
		limit = 20,
		sortBy = "createdAt",
		sortOrder = "desc",
	} = query;

	const pageNumber = Math.max(1, Number(page));
	const limitNumber = Math.max(1, Number(limit));
	const skip = (pageNumber - 1) * limitNumber;

	const where: Prisma.AuditLogWhereInput = {
		...(actorId && { actorId }),
		...(action && { action }),
		...(entityType && { entityType }),
		...(entityId && { entityId }),
		...(startDate || endDate
			? {
					createdAt: {
						...(startDate && { gte: new Date(startDate) }),
						...(endDate && { lte: new Date(endDate) }),
					},
				}
			: {}),
	};

	const [data, total] = await Promise.all([
		prisma.auditLog.findMany({
			where,
			skip,
			take: limitNumber,
			orderBy: { [sortBy]: sortOrder },
			include: {
				actor: {
					select: {
						id: true,
						name: true,
						email: true,
						role: true,
					},
				},
			},
		}),
		prisma.auditLog.count({ where }),
	]);

	return {
		meta: {
			page: pageNumber,
			limit: limitNumber,
			total,
			totalPages: Math.ceil(total / limitNumber),
		},
		data,
	};
};

export const AuditLogService = {
	create,
	getAll,
};
