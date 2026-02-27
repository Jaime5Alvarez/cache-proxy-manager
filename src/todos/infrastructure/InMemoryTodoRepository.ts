import { Todo } from "../domain/Todo";
import type { TodoRepository } from "../domain/TodoRepository";

type TodoData = {
	id: string;
	title: string;
	completed: boolean;
};

const DEFAULT_TODOS: TodoData[] = [
	{ id: "1", title: "Preparar arquitectura DDD", completed: true },
	{ id: "2", title: "Crear repositorio in-memory", completed: true },
	{ id: "3", title: "Exponer lista de todos", completed: false },
] as const as TodoData[];

export class InMemoryTodoRepository implements TodoRepository {
	constructor(private readonly todos: TodoData[] = DEFAULT_TODOS) {}

	async findAll(): Promise<Todo[]> {
		return this.todos.map(
			(todo) => new Todo(todo.id, todo.title, todo.completed),
		);
	}

	async findById(id: string): Promise<Todo | null> {
		const todo = this.todos.find((item) => item.id === id);
		if (!todo) return null;

		return new Todo(todo.id, todo.title, todo.completed);
	}
}
