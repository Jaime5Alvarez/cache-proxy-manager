import { describe, expect, mock, test } from "bun:test";
import type { CacheManager } from "../../shared/domain/CacheManager";
import { InMemoryTodoRepository } from "../infrastructure/InMemoryTodoRepository";
import { GetAllTodos } from "./GetAllTodos";
import { GetTodoById } from "./GetTodoById";
import { UpdateTodoCompleted } from "./UpdateTodoCompleted";

describe("Todos use cases", () => {
	test("GetAllTodos returns static todos", async () => {
		const repository = new InMemoryTodoRepository();
		const useCase = new GetAllTodos(repository);

		const result = await useCase.execute();

		expect(result).toHaveLength(3);
		expect(result[0]?.id).toBe("1");
		expect(result[1]?.title).toBe("Crear repositorio in-memory");
	});

	test("GetTodoById returns todo when id exists", async () => {
		const repository = new InMemoryTodoRepository();
		const useCase = new GetTodoById(repository);

		const result = await useCase.execute({ id: "2" });

		expect(result).not.toBeNull();
		expect(result?.id).toBe("2");
	});

	test("GetTodoById returns null when id does not exist", async () => {
		const repository = new InMemoryTodoRepository();
		const useCase = new GetTodoById(repository);

		const result = await useCase.execute({ id: "999" });

		expect(result).toBeNull();
	});

	test("UpdateTodoCompleted updates repository state", async () => {
		const repository = new InMemoryTodoRepository();
		const cache: CacheManager = {
			get: async () => undefined,
			set: async () => undefined,
			clear: async () => undefined,
		};
		const useCase = new UpdateTodoCompleted(repository, cache);

		const updated = await useCase.execute({ id: "3", completed: true });
		const reloaded = await new GetTodoById(repository).execute({ id: "3" });

		expect(updated?.completed).toBeTrue();
		expect(reloaded?.completed).toBeTrue();
	});

	test("UpdateTodoCompleted invalidates related cache keys", async () => {
		const repository = new InMemoryTodoRepository();
		const cacheClear = mock(async () => undefined);
		const cache: CacheManager = {
			get: async () => undefined,
			set: async () => undefined,
			clear: cacheClear,
		};
		const useCase = new UpdateTodoCompleted(repository, cache);

		await useCase.execute({ id: "2", completed: false });

		expect(cacheClear).toHaveBeenCalledTimes(2);
		expect(cacheClear).toHaveBeenNthCalledWith(1, "todos:get-all");
		expect(cacheClear).toHaveBeenNthCalledWith(2, "todos:by-id:2");
	});
});
