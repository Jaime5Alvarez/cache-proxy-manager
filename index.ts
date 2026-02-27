import { InMemoryCacheManager } from "./src/shared/infrastructure/InMemoryCacheManager";
import { createCachedGetAllTodos } from "./src/todos/application/GetAllTodos";
import { createCachedGetTodoById } from "./src/todos/application/GetTodoById";
import { createUpdateTodoCompleted } from "./src/todos/application/UpdateTodoCompleted";
import { InMemoryTodoRepository } from "./src/todos/infrastructure/InMemoryTodoRepository";

const repository = new InMemoryTodoRepository();
const cacheManager = new InMemoryCacheManager();
const getAllTodos = createCachedGetAllTodos(repository, cacheManager);
const getTodoById = createCachedGetTodoById(repository, cacheManager);
const updateTodoCompleted = createUpdateTodoCompleted(repository, cacheManager);

const initialTodos = await getAllTodos.execute();
await updateTodoCompleted.execute({ id: "2", completed: false });
const updatedTodo = await getTodoById.execute({ id: "2" });
const updatedTodos = await getAllTodos.execute();

console.log(initialTodos);
console.log(updatedTodo);
console.log(updatedTodos);
