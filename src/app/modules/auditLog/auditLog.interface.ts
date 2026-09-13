import type { AuditAction, Prisma } from "../../../generated/prisma/client";

export interface ICreateAuditLogInput {
	actorId?: string | null;
	action: AuditAction;
	entityType: string;
	entityId?: string | null;
	description: string;
	oldValues?: Record<string, unknown> | null;
	newValues?: Record<string, unknown> | null;
	metadata?: Record<string, unknown> | null;
}

export interface IAuditLogFilterQuery {
	actorId?: string;
	action?: AuditAction;
	entityType?: string;
	entityId?: string;
	startDate?: string;
	endDate?: string;
	page?: number;
	limit?: number;
	sortBy?: string;
	sortOrder?: "asc" | "desc";
}

export type AuditTransactionClient = Prisma.TransactionClient;
