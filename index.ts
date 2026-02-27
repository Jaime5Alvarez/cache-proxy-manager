import { InMemoryCacheManager } from "./src/shared/infrastructure/InMemoryCacheManager";
import { createCachedGetAllTodos } from "./src/todos/application/GetAllTodos";
import { createCachedGetTodoById } from "./src/todos/application/GetTodoById";
import { InMemoryTodoRepository } from "./src/todos/infrastructure/InMemoryTodoRepository";

const repository = new InMemoryTodoRepository();
const cacheManager = new InMemoryCacheManager();
const getAllTodos = createCachedGetAllTodos(repository, cacheManager);
const getTodoById = createCachedGetTodoById(repository, cacheManager);

const todos = await getAllTodos.execute();
const todo = await getTodoById.execute({ id: "2" });
console.log(todos);
console.log(todo);
