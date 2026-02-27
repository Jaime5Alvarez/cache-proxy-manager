import type { CacheManager } from "../domain/CacheManager";

type CacheEntry = {
	value: unknown;
	expiresAt?: number;
};

type InMemoryCacheManagerOptions = {
	defaultTtlMs?: number;
};

export class InMemoryCacheManager implements CacheManager {
	private readonly cache = new Map<string, CacheEntry>();
	private readonly defaultTtlMs?: number;

	constructor(options?: InMemoryCacheManagerOptions) {
		this.defaultTtlMs = options?.defaultTtlMs;
	}

	async get<T>(key: string): Promise<T | undefined> {
		const entry = this.cache.get(key);
		if (!entry) return undefined;

		if (entry.expiresAt !== undefined && entry.expiresAt <= Date.now()) {
			this.cache.delete(key);
			return undefined;
		}

		return entry.value as T;
	}

	async set<T>(key: string, value: T, ttlMs?: number): Promise<void> {
		const effectiveTtlMs = ttlMs ?? this.defaultTtlMs;
		const hasValidTtl = effectiveTtlMs !== undefined && effectiveTtlMs > 0;
		this.cache.set(key, {
			value,
			expiresAt: hasValidTtl ? Date.now() + effectiveTtlMs : undefined,
		});
	}

	async clear(key: string): Promise<void> {
		this.cache.delete(key);
	}
}
