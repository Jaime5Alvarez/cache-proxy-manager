import { CachedUseCaseProxy } from "../../shared/application/CachedUseCaseProxy";
import type { UseCase } from "../../shared/application/UseCase";
import type { CacheManager } from "../../shared/domain/CacheManager";
import { InMemoryCacheManager } from "../../shared/infrastructure/InMemoryCacheManager";
import type { Todo } from "../domain/Todo";
import type { TodoRepository } from "../domain/TodoRepository";
import { InMemoryTodoRepository } from "../infrastructure/InMemoryTodoRepository";

export class GetAllTodos implements UseCase<void, Todo[]> {
	constructor(private readonly repository: TodoRepository) {}

	async execute(): Promise<Todo[]> {
		return this.repository.findAll();
	}
}

export function createCachedGetAllTodos(
	repository: TodoRepository = new InMemoryTodoRepository(),
	cache: CacheManager = new InMemoryCacheManager(),
	ttlMs = 30000,
) {
	return new CachedUseCaseProxy(
		new GetAllTodos(repository),
		cache,
		() => "todos:get-all",
		ttlMs,
	);
}
