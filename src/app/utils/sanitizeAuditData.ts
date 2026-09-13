import type { Prisma } from "../../generated/prisma/client";

const SENSITIVE_KEYS_REGEX =
	/^(password|passwordhash|accesstoken|refreshtoken|token|cookie|authorization|apikey|secret|privatekey|cvv|cardnumber|bkashtoken|sslcommerzsecret)$/i;

const serializeValue = (val: unknown): unknown => {
	if (val === null || val === undefined) return null;
	if (typeof val === "bigint") return val.toString();
	if (val instanceof Date) return val.toISOString();
	if (
		typeof val === "object" &&
		val !== null &&
		"s" in val &&
		"e" in val &&
		"d" in val
	) {
		return (val as Prisma.Decimal).toNumber();
	}
	return val;
};

export const sanitizeAuditData = <T>(data: T): T | null => {
	if (data === null || data === undefined) return null;

	const sanitized = serializeValue(data);
	if (typeof sanitized !== "object" || sanitized === null) {
		return sanitized as T;
	}

	if (Array.isArray(sanitized)) {
		return sanitized.map((item) => sanitizeAuditData(item)) as unknown as T;
	}

	const result: Record<string, unknown> = {};
	for (const [key, value] of Object.entries(
		sanitized as Record<string, unknown>,
	)) {
		if (SENSITIVE_KEYS_REGEX.test(key)) {
			result[key] = "[REDACTED]";
		} else if (typeof value === "object" && value !== null) {
			result[key] = sanitizeAuditData(value);
		} else {
			result[key] = serializeValue(value);
		}
	}

	return result as T;
};

export const calculateEntityDiff = (
	oldObj: Record<string, unknown> | null,
	newObj: Record<string, unknown> | null,
): {
	oldValues: Record<string, unknown> | null;
	newValues: Record<string, unknown> | null;
} => {
	if (!oldObj || !newObj) {
		return {
			oldValues: sanitizeAuditData(oldObj),
			newValues: sanitizeAuditData(newObj),
		};
	}

	const oldDiff: Record<string, unknown> = {};
	const newDiff: Record<string, unknown> = {};
	const allKeys = new Set([...Object.keys(oldObj), ...Object.keys(newObj)]);

	for (const key of allKeys) {
		if (SENSITIVE_KEYS_REGEX.test(key)) continue;

		const oldVal = oldObj[key];
		const newVal = newObj[key];

		if (JSON.stringify(oldVal) !== JSON.stringify(newVal)) {
			if (oldVal !== undefined) oldDiff[key] = oldVal;
			if (newVal !== undefined) newDiff[key] = newVal;
		}
	}

	return {
		oldValues:
			Object.keys(oldDiff).length > 0 ? sanitizeAuditData(oldDiff) : null,
		newValues:
			Object.keys(newDiff).length > 0 ? sanitizeAuditData(newDiff) : null,
	};
};
