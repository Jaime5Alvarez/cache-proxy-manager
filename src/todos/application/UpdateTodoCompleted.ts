import type { UseCase } from "../../shared/application/UseCase";
import type { CacheManager } from "../../shared/domain/CacheManager";
import { InMemoryCacheManager } from "../../shared/infrastructure/InMemoryCacheManager";
import type { Todo } from "../domain/Todo";
import type { TodoRepository } from "../domain/TodoRepository";
import { InMemoryTodoRepository } from "../infrastructure/InMemoryTodoRepository";

type UpdateTodoCompletedInput = {
	id: string;
	completed: boolean;
};

export class UpdateTodoCompleted
	implements UseCase<UpdateTodoCompletedInput, Todo | null>
{
	constructor(
		private readonly repository: TodoRepository,
		private readonly cache: CacheManager,
	) {}

	async execute(input: UpdateTodoCompletedInput): Promise<Todo | null> {
		const updated = await this.repository.updateCompleted(
			input.id,
			input.completed,
		);
		if (!updated) return null;

		await this.cache.clear("todos:get-all");
		await this.cache.clear(`todos:by-id:${input.id}`);

		return updated;
	}
}

export function createUpdateTodoCompleted(
	repository: TodoRepository = new InMemoryTodoRepository(),
	cache: CacheManager = new InMemoryCacheManager(),
) {
	return new UpdateTodoCompleted(repository, cache);
}
