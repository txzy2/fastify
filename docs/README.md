# Контекст проекта

Этот каталог содержит документацию, которая описывает архитектуру и конвенции проекта.
Цель — чтобы новый разработчик или AI-агент мог быстро понять, как всё устроено и куда
добавлять код, не перечитывая весь `src`.

## Содержание

| Файл                                   | О чём                                                         |
| -------------------------------------- | ------------------------------------------------------------- |
| [`ARCHITECTURE.md`](./ARCHITECTURE.md) | Слои, модули, DI, жизненный цикл запроса, транзакции, ошибки  |
| [`CONVENTIONS.md`](./CONVENTIONS.md)   | Стиль кода, правила именования, как добавить модуль/роут/usecase |

## Быстрые факты

- **Стек:** Fastify v5, TypeScript (ESM, Bun), Prisma v7 + PostgreSQL, Pino, Swagger.
- **Архитектура:** layered + vertical slices (модули по домену), ручной DI.
- **Точка входа:** `index.ts` → `src/core/bootstrap.ts`.
- **Composition root:** `src/core/container.ts`.
- **Запуск:** `docker-compose -f docker-compose.dev.yml up -d`, затем `bun run dev`.
- **Проверка типов:** `bunx tsc --noEmit`.
- **Сборка (проверка резолва):** `bun build index.ts --target bun`.
- **Документация API:** Swagger UI на `/docs` после запуска сервера.

Полное описание — в корневом [`README.md`](../README.md).
