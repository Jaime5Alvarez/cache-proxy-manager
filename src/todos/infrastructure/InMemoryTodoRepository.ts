import { Todo } from "../domain/Todo";
import type { TodoRepository } from "../domain/TodoRepository";

const DEFAULT_TODOS = [
	new Todo("1", "Preparar arquitectura DDD", true),
	new Todo("2", "Crear repositorio in-memory", true),
	new Todo("3", "Exponer lista de todos", false),
];

export class InMemoryTodoRepository implements TodoRepository {
	private readonly todos: Todo[];

	constructor(todos: Todo[] = DEFAULT_TODOS) {
		this.todos = todos.map(
			(todo) => new Todo(todo.id, todo.title, todo.completed),
		);
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

	async create(todo: Todo): Promise<Todo | null> {
		const exists = this.todos.some((item) => item.id === todo.id);
		if (exists) return null;

		this.todos.push(new Todo(todo.id, todo.title, todo.completed));

		return new Todo(todo.id, todo.title, todo.completed);
	}

	async updateCompleted(id: string, completed: boolean): Promise<Todo | null> {
		const current = this.todos.find((todo) => todo.id === id);
		if (!current) return null;

		const updated = new Todo(current.id, current.title, completed);
		const nextTodos = this.todos.map((todo) =>
			todo.id === id ? updated : todo,
		);

		this.todos.splice(0, this.todos.length, ...nextTodos);
		return new Todo(updated.id, updated.title, updated.completed);
	}
}
