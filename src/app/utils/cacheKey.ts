// src/app/utils.cacheKey.ts

export const courseCacheKeys = {
	list: (params: Record<string, unknown>) => {
		const sortedParams = Object.keys(params)
			.sort()
			.reduce(
				(acc, key) => {
					acc[key] = params[key];
					return acc;
				},
				{} as Record<string, unknown>,
			);
		return `courses:list:${JSON.stringify(sortedParams)}`;
	},
	detail: (id: string) => `courses:detail:${id}`,
	my: (userId: string) => `courses:my:${userId}`,
	pattern: "courses:*",
};

export const superModuleCacheKeys = {
	byCourse: (courseId: string) => `super-modules:course:${courseId}`,
	detail: (id: string) => `super-modules:detail:${id}`,
	pattern: "super-modules:*",
};

export const moduleCacheKeys = {
	bySuperModule: (superModuleId: string) =>
		`modules:super-module:${superModuleId}`,
	detail: (id: string) => `modules:detail:${id}`,
	pattern: "modules:*",
};

export const lessonCacheKeys = {
	detail: (id: string) => `lessons:detail:${id}`,
	video: (lessonId: string) => `lessons:video:${lessonId}`,
	article: (lessonId: string) => `lessons:article:${lessonId}`,
	progress: (userId: string, lessonId: string) =>
		`lessons:progress:${userId}:${lessonId}`,
	pattern: "lessons:*",
};

export const assignmentCacheKeys = {
	lesson: (lessonId: string) => `assignments:lesson:${lessonId}`,
	detail: (assignmentId: string) => `assignments:detail:${assignmentId}`,
	submission: (userId: string, assignmentId: string) =>
		`assignments:submission:${userId}:${assignmentId}`,
	submissions: (assignmentId: string) =>
		`assignments:submissions:${assignmentId}`,
	pattern: "assignments:*",
};

export const enrollmentCacheKeys = {
	my: (userId: string) => `enrollments:my:${userId}`,
	detail: (userId: string, courseId: string) =>
		`enrollments:detail:${userId}:${courseId}`,
	pattern: "enrollments:*",
};

export const certificateCacheKeys = {
	my: (userId: string, courseId: string) =>
		`certificates:my:${userId}:${courseId}`,

	verify: (certificateUid: string) => `certificates:verify:${certificateUid}`,

	pattern: "certificates:*",
};

export const discussionCacheKeys = {
	listByLesson: (lessonId: string, query: Record<string, unknown>) => {
		const sortedParams = Object.keys(query)
			.sort()
			.reduce(
				(acc, key) => {
					if (query[key] !== undefined && query[key] !== "") {
						acc[key] = query[key];
					}
					return acc;
				},
				{} as Record<string, unknown>,
			);

		return `discussion:threads:lesson:${lessonId}:${JSON.stringify(sortedParams)}`;
	},

	detail: (threadId: string) => `discussion:thread:${threadId}`,

	comments: (threadId: string) => `discussion:comments:thread:${threadId}`,

	lessonThreadsPattern: (lessonId: string) =>
		`discussion:threads:lesson:${lessonId}:*`,
	threadPattern: (threadId: string) => `discussion:thread:${threadId}`,
	commentsPattern: (threadId: string) =>
		`discussion:comments:thread:${threadId}`,
	allPattern: "discussion:*",
};

export const judgeCacheKeys = {
	codingLessonByLessonId: (lessonId: string) =>
		`judge:coding-lesson:lesson:${lessonId}`,

	mySubmissions: (userId: string, codingLessonId: string) =>
		`judge:my-submissions:user:${userId}:lesson:${codingLessonId}`,

	// Invalidation Patterns
	codingLessonPattern: (lessonId: string) =>
		`judge:coding-lesson:lesson:${lessonId}`,

	mySubmissionsUserPattern: (userId: string) =>
		`judge:my-submissions:user:${userId}:*`,

	mySubmissionsLessonPattern: (codingLessonId: string) =>
		`judge:my-submissions:*:lesson:${codingLessonId}`,

	allPattern: "judge:*",
};

export const serializeCacheParams = (
	params: Record<string, unknown>,
): string => {
	const sortedKeys = Object.keys(params)
		.filter((key) => params[key] !== undefined)
		.sort();

	const sortedParams: Record<string, unknown> = {};
	for (const key of sortedKeys) {
		const value = params[key];
		if (value !== null && typeof value === "object" && !Array.isArray(value)) {
			sortedParams[key] = JSON.parse(
				serializeCacheParams(value as Record<string, unknown>),
			);
		} else {
			sortedParams[key] = value;
		}
	}

	return JSON.stringify(sortedParams);
};

export const paymentCacheKeys = {
	my: (userId: string, query: Record<string, unknown>) =>
		`payments:my:${userId}:${serializeCacheParams(query)}`,

	all: (query: Record<string, unknown>) =>
		`payments:all:${serializeCacheParams(query)}`,

	detail: (paymentId: string) => `payments:detail:${paymentId}`,

	myUserPattern: (userId: string) => `payments:my:${userId}:*`,
	allPattern: "payments:all:*",
	detailPattern: (paymentId: string) => `payments:detail:${paymentId}`,
	pattern: "payments:*",
};

export const quizCacheKeys = {
	byLesson: (lessonId: string) => `quizzes:lesson:${lessonId}`,
	detail: (id: string) => `quizzes:detail:${id}`,
	pattern: "quizzes:*",
};

export const userCacheKeys = {
	list: (params: Record<string, unknown>) => {
		const sortedParams = Object.keys(params)
			.sort()
			.reduce(
				(acc, key) => {
					acc[key] = params[key];
					return acc;
				},
				{} as Record<string, unknown>,
			);

		return `users:list:${JSON.stringify(sortedParams)}`;
	},

	detail: (id: string) => `users:detail:${id}`,

	myProfile: (userId: string) => `users:my:${userId}`,

	pattern: "users:*",
};
