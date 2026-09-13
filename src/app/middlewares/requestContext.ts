import type { NextFunction, Request, Response } from "express";
import crypto from "node:crypto";
import { requestContextStorage } from "../utils/asyncLocalStorage";

export const requestContextMiddleware = (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const requestId =
		(req.headers["x-request-id"] as string) || crypto.randomUUID();

	res.setHeader("X-Request-ID", requestId);

	const clientIp =
		(req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ||
		req.socket.remoteAddress ||
		req.ip;

	const userAgent = req.headers["user-agent"] || "unknown";

	const context = {
		requestId,
		ipAddress: clientIp,
		userAgent,
	};

	requestContextStorage.run(context, () => {
		next();
	});
};

export const updateRequestContextActor = (actorId: string) => {
	const store = requestContextStorage.getStore();
	if (store) {
		store.actorId = actorId;
	}
};
