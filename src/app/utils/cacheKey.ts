
//  Deterministic and namespaced cache key builder for courses
 
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
