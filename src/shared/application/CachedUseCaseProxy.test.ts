import { describe, expect, mock, spyOn, test } from "bun:test";
import type { CacheManager } from "../domain/CacheManager";
import { CachedUseCaseProxy } from "./CachedUseCaseProxy";
import type { UseCase } from "./UseCase";

class FakeUseCase implements UseCase<{ id: string }, string> {
	constructor(private readonly response: string) {}

	async execute(_: { id: string }): Promise<string> {
		return this.response;
	}
}

describe("CachedUseCaseProxy", () => {
	test("returns cached value and does not execute real use case", async () => {
		const cacheGet = mock(async () => "cached-result") as CacheManager["get"];
		const cacheSet = mock(async () => undefined);
		const cacheClear = mock(async () => undefined);
		const cache: CacheManager = {
			get: cacheGet,
			set: cacheSet,
			clear: cacheClear,
		};
		const useCase: UseCase<{ id: string }, string> = {
			execute: mock(async () => "real-result"),
		};
		const proxy = new CachedUseCaseProxy(
			useCase,
			cache,
			(input) => `key:${input.id}`,
		);

		const result = await proxy.execute({ id: "10" });

		expect(result).toBe("cached-result");
		expect(useCase.execute).toHaveBeenCalledTimes(0);
	});

	test("executes real use case and caches when value is not cached", async () => {
		const cacheGet = mock(async () => undefined) as CacheManager["get"];
		const cacheSet = mock(async () => undefined);
		const cacheClear = mock(async () => undefined);
		const cache: CacheManager = {
			get: cacheGet,
			set: cacheSet,
			clear: cacheClear,
		};
		const useCase = new FakeUseCase("real-result");
		const proxy = new CachedUseCaseProxy(
			useCase,
			cache,
			(input) => `key:${input.id}`,
		);

		const result = await proxy.execute({ id: "10" });

		expect(result).toBe("real-result");
		expect(cacheSet).toHaveBeenCalledTimes(1);
		expect(cacheSet).toHaveBeenCalledWith("key:10", "real-result", undefined);
	});

	test("passes ttl to cache set when configured", async () => {
		const cacheGet = mock(async () => undefined) as CacheManager["get"];
		const cacheSet = mock(async () => undefined);
		const cacheClear = mock(async () => undefined);
		const cache: CacheManager = {
			get: cacheGet,
			set: cacheSet,
			clear: cacheClear,
		};
		const useCase = new FakeUseCase("real-result");
		const proxy = new CachedUseCaseProxy(
			useCase,
			cache,
			(input) => `key:${input.id}`,
			5_000,
		);

		await proxy.execute({ id: "10" });

		expect(cacheSet).toHaveBeenCalledWith("key:10", "real-result", 5_000);
	});

	test("continues when cache get/set throw errors", async () => {
		const cacheGet = mock(async () => {
			throw new Error("get error");
		}) as CacheManager["get"];
		const cacheSet = mock(async () => {
			throw new Error("set error");
		});
		const cacheClear = mock(async () => undefined);
		const cache: CacheManager = {
			get: cacheGet,
			set: cacheSet,
			clear: cacheClear,
		};
		const useCase = new FakeUseCase("fallback-result");
		const warnSpy = spyOn(console, "warn").mockImplementation(() => undefined);
		const proxy = new CachedUseCaseProxy(
			useCase,
			cache,
			(input) => `key:${input.id}`,
		);

		const result = await proxy.execute({ id: "10" });

		expect(result).toBe("fallback-result");
		expect(warnSpy).toHaveBeenCalledTimes(2);
		warnSpy.mockRestore();
	});
});
