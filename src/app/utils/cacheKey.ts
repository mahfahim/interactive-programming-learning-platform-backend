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
