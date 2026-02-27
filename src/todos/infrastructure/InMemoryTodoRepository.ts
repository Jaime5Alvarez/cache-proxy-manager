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
	private readonly todos: TodoData[];

	constructor(todos: TodoData[] = DEFAULT_TODOS) {
		this.todos = todos.map((todo) => ({ ...todo }));
	}

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

	async updateCompleted(id: string, completed: boolean): Promise<Todo | null> {
		const index = this.todos.findIndex((item) => item.id === id);
		if (index === -1) return null;
		const current = this.todos[index];
		if (!current) return null;

		const updated: TodoData = { ...current, completed };
		this.todos[index] = updated;

		return new Todo(updated.id, updated.title, updated.completed);
	}
}
