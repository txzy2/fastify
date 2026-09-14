# AGENTS.md

Контекст проекта для AI-агентов и разработчиков. Перед изменениями прочитайте
[`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) и [`docs/CONVENTIONS.md`](./docs/CONVENTIONS.md).

## Что это

REST API на Fastify v5 + TypeScript (ESM, запускается через Bun) + Prisma v7/PostgreSQL.
Архитектура — модульный монолит: слои `Controller → Service → Repository`, use-case для
оркестрации, ручной DI в `src/core/container.ts`.

## Команды

```bash
make init                 # cp .env.example .env + bun install + prisma generate + migrate
make up-dev               # поднять инфраструктуру (docker compose)
make app-dev              # bun run dev (watch)
make app-prod             # bun run prod
make down-dev             # остановить инфраструктуру

bunx tsc --noEmit                 # проверка типов
bun build index.ts --target bun   # проверка резолва импортов/алиасов
```

Отдельных линтера и автотестов в проекте нет.

## Карта кода

- `index.ts` → `src/core/bootstrap.ts` — точка входа и глобальный error handler.
- `src/core/container.ts` — composition root (весь DI здесь).
- `src/core/logger.ts` — `ILogger` и конфиг Pino (импортировать `ILogger` только отсюда).
- `src/http/v1/routes/` — маршруты по модулям, `index.ts` — агрегатор `registerRoutes`.
- `src/http/v1/schemas/` — JSON-схемы Fastify/Swagger.
- `src/http/hooks/` — preHandler-хуки.
- `src/modules/{users,auth,licenses}/` — доменные модули.
- `prisma/schema.prisma` — схема БД.

## Инварианты

- Prisma вызывается **только** в `*.repository.ts`.
- Репозитории принимают `tx?: Prisma.TransactionClient` и используют `tx ?? this.prisma`.
- Контроллеры не содержат бизнес-логики и не знают про Prisma.
- Сервисы не знают про Fastify `request`/`reply`; возвращают DTO.
- `ILogger` — из `@/core/logger`, не из `@/core/container` (иначе цикл).
- Тексты ошибок — через `ApiErrors`; бросаем `AppError`, ловит глобальный handler.
- Новые зависимости инжектятся через конструктор и собираются в `core/container.ts`.
- Публичный API модуля — его `index.ts` (barrel); остальные файлы считаются приватными.

## Стиль

4 пробела, одинарные кавычки, точки с запятой, ширина 100 (см. `.prettierrc`).
Не добавляйте комментарии-шум; JSDoc — только на публичных методах классов.

## Инфраструктура

`docker-compose.dev.yml`: PostgreSQL, Adminer, Prometheus, Grafana, Loki, postgres-exporter.
Проблема с правами Grafana/Loki и её решение описаны в корневом `README.md` (раздел «Мониторинг»).
