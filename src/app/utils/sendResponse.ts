import type { Response } from "express";

type TMeta = {
	page: number;
	limit: number;
	total: number;
	totalPages: number;
};

type TResponseData<T> = {
	statusCode: number;
	message: string;
	data: T;
	meta?: TMeta;
};

export const sendResponse = <T>(res: Response, payload: TResponseData<T>) => {
	const response: Record<string, any> = {
		success: true,
		message: payload.message,
		data: payload.data,
	};

	if (payload.meta) {
		response.meta = payload.meta;
	}

	res.status(payload.statusCode).json(response);
};
