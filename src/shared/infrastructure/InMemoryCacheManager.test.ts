import { describe, expect, test } from "bun:test";
import { InMemoryCacheManager } from "./InMemoryCacheManager";

describe("InMemoryCacheManager", () => {
	test("expires cached values when ttl is reached", async () => {
		const cache = new InMemoryCacheManager();
		await cache.set("key", "value", 10);

		const beforeExpiry = await cache.get<string>("key");
		expect(beforeExpiry).toBe("value");

		await new Promise((resolve) => setTimeout(resolve, 20));

		const afterExpiry = await cache.get<string>("key");
		expect(afterExpiry).toBeUndefined();
	});
});
