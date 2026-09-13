import { AsyncLocalStorage } from "node:async_hooks";

export interface IRequestContext {
	requestId: string;
	actorId?: string;
	ipAddress?: string;
	userAgent?: string;
}

export const requestContextStorage = new AsyncLocalStorage<IRequestContext>();
