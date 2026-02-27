# Cache Proxy Manager

A small TypeScript + Bun project that demonstrates:

- DDD-style module structure (`domain`, `application`, `infrastructure`)
- A reusable cache proxy in front of use cases
- In-memory repository and cache implementations
- TTL-based cache expiration

## Stack

- Bun runtime and test runner
- TypeScript
- Biome (installed as dev dependency)

## Project Structure

```text
src/
  shared/
    application/
      UseCase.ts
      CachedUseCaseProxy.ts
    domain/
      CacheManager.ts
    infrastructure/
      InMemoryCacheManager.ts
  todos/
    domain/
      Todo.ts
      TodoRepository.ts
    application/
      GetAllTodos.ts
      GetTodoById.ts
    infrastructure/
      InMemoryTodoRepository.ts
index.ts
```

## Core Idea

Use cases stay focused on business logic. Caching is added via `CachedUseCaseProxy`, which wraps any use case:

- reads cache before executing
- writes result to cache on miss
- supports TTL
- cache failures are best-effort (`try/catch`), so business flow continues

## Default Factories

Each use case exposes a cached factory with sensible defaults:

- `createCachedGetAllTodos(...)` in `GetAllTodos.ts`
- `createCachedGetTodoById(...)` in `GetTodoById.ts`

Both factories include default values for:

- `repository` (`InMemoryTodoRepository`)
- `cache` (`InMemoryCacheManager`)
- `ttlMs` (30s for `GetAllTodos`, 10s for `GetTodoById`)

So you can call them with explicit dependencies or rely on defaults.

## Run

Install dependencies:

```bash
bun install
```

Run the example:

```bash
bun run index.ts
```

## Test

Run all tests:

```bash
bun test
```

Type-check:

```bash
bunx tsc --noEmit
```

## Example (`index.ts`)

The entrypoint wires:

- `InMemoryTodoRepository`
- `InMemoryCacheManager`
- cached `GetAllTodos`
- cached `GetTodoById`

Then it executes both use cases and prints results.
