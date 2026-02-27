import { CachedUseCaseProxy } from "../../shared/application/CachedUseCaseProxy";
import type { UseCase } from "../../shared/application/UseCase";
import type { CacheManager } from "../../shared/domain/CacheManager";
import { InMemoryCacheManager } from "../../shared/infrastructure/InMemoryCacheManager";
import type { Todo } from "../domain/Todo";
import type { TodoRepository } from "../domain/TodoRepository";
import { InMemoryTodoRepository } from "../infrastructure/InMemoryTodoRepository";

type GetTodoByIdInput = {
	id: string;
};

export class GetTodoById implements UseCase<GetTodoByIdInput, Todo | null> {
	constructor(private readonly repository: TodoRepository) {}

	async execute(input: GetTodoByIdInput): Promise<Todo | null> {
		return this.repository.findById(input.id);
	}
}

export function createCachedGetTodoById(
	repository: TodoRepository = new InMemoryTodoRepository(),
	cache: CacheManager = new InMemoryCacheManager(),
	ttlMs = 10000,
) {
	return new CachedUseCaseProxy(
		new GetTodoById(repository),
		cache,
		(input) => `todos:by-id:${input.id}`,
		ttlMs,
	);
}
