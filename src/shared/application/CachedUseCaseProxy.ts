import type { CacheManager } from "../domain/CacheManager";
import type { UseCase } from "./UseCase";

export class CachedUseCaseProxy<TInput, TResult>
	implements UseCase<TInput, TResult>
{
	constructor(
		private readonly useCase: UseCase<TInput, TResult>,
		private readonly cache: CacheManager,
		private readonly keyFactory: (input: TInput) => string,
		private readonly ttlMs?: number,
	) {}

	async execute(input?: TInput): Promise<TResult> {
		const key = this.keyFactory(input as TInput);
		try {
			const cached = await this.cache.get<TResult>(key);
			if (cached !== undefined) return cached;
		} catch (error) {
			console.warn(`[cache:get] key=${key}`, error);
		}

		const result = await this.useCase.execute(input);
		try {
			await this.cache.set(key, result, this.ttlMs);
		} catch (error) {
			console.warn(`[cache:set] key=${key}`, error);
		}

		return result;
	}
}
