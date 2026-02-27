import type { UseCase } from "../../shared/application/UseCase";
import type { CacheManager } from "../../shared/domain/CacheManager";
import { InMemoryCacheManager } from "../../shared/infrastructure/InMemoryCacheManager";
import { Todo } from "../domain/Todo";
import type { TodoRepository } from "../domain/TodoRepository";
import { InMemoryTodoRepository } from "../infrastructure/InMemoryTodoRepository";

type CreateTodoInput = {
	id: string;
	title: string;
	completed: boolean;
};

export class CreateTodo implements UseCase<CreateTodoInput, Todo | null> {
	constructor(
		private readonly repository: TodoRepository,
		private readonly cache: CacheManager,
	) {}

	async execute(input: CreateTodoInput): Promise<Todo | null> {
		const created = await this.repository.create(
			new Todo(input.id, input.title, input.completed),
		);
		if (!created) return null;

		await this.cache.clear("todos:get-all");
		await this.cache.clear(`todos:by-id:${input.id}`);

		return created;
	}
}

export function createCreateTodo(
	repository: TodoRepository = new InMemoryTodoRepository(),
	cache: CacheManager = new InMemoryCacheManager(),
) {
	return new CreateTodo(repository, cache);
}
