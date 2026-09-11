import { SubmissionStatus } from "../../../generated/prisma/client";

/**
 * Output Normalize করা
 */
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

/**
 * একাধিক টেস্ট কেসের স্টেটাস থেকে ফাইনাল স্টেটাস নির্ধারণ
 */
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
