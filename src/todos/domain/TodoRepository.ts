import type { Todo } from "./Todo";

export interface TodoRepository {
	findAll(): Promise<Todo[]>;
	findById(id: string): Promise<Todo | null>;
}
