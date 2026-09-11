import { SubmissionStatus } from "../../../generated/prisma/client";

export const normalizeOutput = (output?: string): string => {
	if (!output) return "";
	return output
		.replace(/\r\n/g, "\n")
		.replace(/\r/g, "\n")
		.split("\n")
		.map((line) => line.trimEnd())
		.join("\n")
		.trim();
};

export const calculateAggregateStatus = (
	statuses: SubmissionStatus[],
): SubmissionStatus => {
	const priorityOrder: SubmissionStatus[] = [
		SubmissionStatus.COMPILATION_ERROR,
		SubmissionStatus.RUNTIME_ERROR,
		SubmissionStatus.TIME_LIMIT_EXCEEDED,
		SubmissionStatus.MEMORY_LIMIT_EXCEEDED,
		SubmissionStatus.WRONG_ANSWER,
	];

	for (const status of priorityOrder) {
		if (statuses.includes(status)) return status;
	}

	return SubmissionStatus.ACCEPTED;
};
