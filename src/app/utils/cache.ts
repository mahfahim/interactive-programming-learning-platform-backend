// src/app/utils/cache.ts
import { redisClient } from "../lib/redis";

const DEFAULT_TTL = 3600;

const ensureRedisConnected = async (): Promise<void> => {
	try {
		if (!redisClient.isOpen) {
			await redisClient.connect().catch(() => {});
		}
	} catch (error) {
		console.error("Redis Connection Error:", error);
	}
};

//  Generic Fetch & Cache Utility (Cache-Aside Pattern)

export const getOrSetCache = async <T>(
	key: string,
	fetchFn: () => Promise<T>,
	ttlInSeconds: number = DEFAULT_TTL,
): Promise<T> => {
	try {
		await ensureRedisConnected();
		if (redisClient.isOpen) {
			const cachedData = await redisClient.get(key);
			if (cachedData) {
				console.log(`⚡ [REDIS CACHE HIT]: Key -> ${key}`);
				return JSON.parse(cachedData) as T;
			}
			console.log(`🐢 [DATABASE MISS]: Fetching from DB for Key -> ${key}`);
		}
	} catch (error) {
		console.error(`Redis Get Error [Key: ${key}]:`, error);
	}

	const result = await fetchFn();

	try {
		if (redisClient.isOpen && result !== null && result !== undefined) {
			await redisClient.set(key, JSON.stringify(result), {
				EX: ttlInSeconds,
			});
			console.log(`💾 [REDIS CACHED]: Key -> ${key} (TTL: ${ttlInSeconds}s)`);
		}
	} catch (error) {
		console.error(`Redis Set Error [Key: ${key}]:`, error);
	}

	return result;
};

//  Enterprise Grade Cache Invalidation using cursor-based SCAN Iterator

export const clearCachePattern = async (pattern: string): Promise<void> => {
	try {
		await ensureRedisConnected();
		if (!redisClient.isOpen) return;

		let batch: string[] = [];
		let totalDeleted = 0;
		const BATCH_SIZE = 100;

		for await (const result of redisClient.scanIterator({
			MATCH: pattern,
			COUNT: BATCH_SIZE,
		}) as any) {
			if (Array.isArray(result)) {
				batch.push(...result);
			} else {
				batch.push(result);
			}

			if (batch.length >= BATCH_SIZE) {
				await Promise.all(batch.map((k) => redisClient.del(k)));
				totalDeleted += batch.length;
				batch = [];
			}
		}

		if (batch.length > 0) {
			await Promise.all(batch.map((k) => redisClient.del(k)));
			totalDeleted += batch.length;
		}

		console.log(
			`🧹 [REDIS CACHE CLEARED]: Pattern -> ${pattern} (Deleted ${totalDeleted} keys)`,
		);
	} catch (error) {
		console.error(`Redis Clear Error [Pattern: ${pattern}]:`, error);
	}
};
