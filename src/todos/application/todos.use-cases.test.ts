import { describe, expect, test } from "bun:test";
import { InMemoryTodoRepository } from "../infrastructure/InMemoryTodoRepository";
import { GetAllTodos } from "./GetAllTodos";
import { GetTodoById } from "./GetTodoById";

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
});
