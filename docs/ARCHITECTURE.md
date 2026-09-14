# Архитектура

Проект — **модульный монолит** на Fastify. Внутри модулей используется слоистая
(«Clean-ish») архитектура: `Controller → Service → Repository`, а для оркестрации
нескольких сервисов — `UseCase`. Зависимости собираются вручную в одном месте
(composition root), без декораторов и фреймворковой магии.

## Слои

```
HTTP (routes/hooks/schemas)
   ↓
Controller        — принимает запрос, вызывает сервис/use-case, формирует ответ
   ↓
Service           — бизнес-логика одного домена, кидает AppError
   ↓
Repository        — доступ к БД через Prisma

UseCase           — оркестрация: несколько сервисов + транзакция
```

- **Controller** (`modules/*/*.controller.ts`) — только транспорт: достаёт данные из
  `request`, вызывает сервис, шлёт `ApiReply<...>`. Не содержит бизнес-логики.
- **Service** (`modules/*/*.service.ts`) — бизнес-логика домена, работает через
  интерфейс репозитория. Наружу отдаёт DTO (через маппер), не Prisma-модели.
- **Repository** (`modules/*/*.repository.ts`) — единственное место, где дёргается
  Prisma. Принимает `tx?: Prisma.TransactionClient` и делает `const client = tx ?? this.prisma`.
- **UseCase** (`modules/*/use-case/*.use-case.ts`) — сценарий, затрагивающий несколько
  доменов. Управляет транзакцией через `PrismaService.$transaction`.

## HTTP-слой

- `src/http/v1/routes/` — маршруты, по одному файлу на модуль. `index.ts` — агрегатор
  `registerRoutes(instance, controllers)`, который дёргается один раз из bootstrap.
- `src/http/v1/schemas/` — JSON-схемы Fastify: валидация запроса и описание ответов для
  Swagger. Схемы не содержат логики.
- `src/http/hooks/` — `preHandler`-хуки: `logRequest`, `validatePassword`.
- Префикс всех API: `/api/v1` (задаётся в `bootstrap.ts` при регистрации).
- Swagger: `openApiDocs` в `schemas/user.schema.ts`, UI на `/docs`.

## Модули

Модуль = вертикальный срез по домену. Публичный API модуля — его `index.ts` (barrel);
всё остальное считается внутренним. Текущие модули:

| Модуль      | Ответственность                              | Файлы                                        |
| ----------- | -------------------------------------------- | -------------------------------------------- |
| `users`     | CRUD/чтение пользователей                    | controller, service, repository, mapper, dto |
| `auth`      | Регистрация, логин/refresh/logout (JWT + Redis) | controller, service, token.service, refresh-token.repository, use-case |
| `licenses`  | Создание лицензии пользователя               | service, repository                          |

> `auth` для регистрации оркеструет `UserService` и `LicensesService` внутри одной
> транзакции. DTO для регистрации лежат в `users`, т.к. это контракт создания пользователя.
> Логин проверяет пароль через `userRepository`, выпускает access-JWT (`TokenService`) и
> хранит refresh-токен в Redis (`RefreshTokenRepository`) с ротацией. Защита маршрутов —
> `authGuard` (`src/http/hooks/auth.hook.ts`) как `preHandler`.

## DI / Composition root

`src/core/container.ts` создаёт граф объектов в порядке:

```
PrismaService → Repositories → Services → UseCases → Controllers → Hooks
```

(вместе с `RedisService`, который подключается рядом с `PrismaService`).

и возвращает `{prismaService, redisService, authGuard, userController, authController}`.
`bootstrap.ts` получает контейнер, регистрирует `onClose` (отключение Prisma и Redis) и
передаёт контроллеры и `authGuard` в `registerRoutes`. Никаких синглтонов и сервис-локаторов: зависимости идут через
конструкторы.

`ILogger` объявлен в `src/core/logger.ts`. Не импортируйте типы из `container.ts` в
модули — это создаёт циклическую зависимость `container ↔ service`.

## Жизненный цикл запроса

**Регистрация — `POST /api/v1/auth/register`:**

1. `preHandler`: `logRequest` → `validatePassword` (сложность пароля).
2. Валидация тела по `registerUserSchema`.
3. `AuthController.registerUser` → `RegisterUserUseCase.execute`.
4. UseCase проверяет дубликат по email, затем в `$transaction`:
   `UserService.register` (хеш пароля → `UserRepository.create`) и
   `LicensesService.register` (создание лицензии).
5. Результат маппится в `RegisterUserResponseDto` → `{success, data}` со статусом 201.

**Чтение — `GET /api/v1/user/:id`:**

1. `preHandler`: `logRequest`.
2. Валидация `params`.
3. `UserController.getUserById` → `UserService.findById` → `UserRepository.getById`.
4. Проверка `active === ACTIVE`, иначе `AppError(USER_NOT_FOUND, 404)`.
5. Маппинг Prisma-модели в `UserResponseDto` → ответ 200.

## Транзакции

Транзакцию открывает use-case: `prisma.$transaction(async tx => ...)` и прокидывает `tx`
во все вызовы сервисов/репозиториев. Репозитории обязаны использовать переданный `tx`
(`const client = tx ?? this.prisma`), иначе операция уйдёт мимо транзакции.

## Ошибки

- Доменные ошибки — `AppError` (`src/utils/error-handler.ts`) с текстом и HTTP-статусом.
- Тексты ошибок — в `ApiErrors` (`src/utils/enums/errors.ts`).
- Глобальный `setErrorHandler` в `bootstrap.ts` превращает `AppError` в
  `{success: false, error}`, ошибки валидации Fastify (`FST_ERR_VALIDATION`) — в 400,
  всё остальное — в 500. Контроллеры ошибки не ловят.

## Логирование

`LOGGER_CONFIG` в `src/core/logger.ts`: `pino-pretty` в dev, ротация в `logs/app.log` и
`logs/error.log` через `pino-roll`, отправка в Loki через `pino-loki`. Сервисы принимают
`ILogger` в конструктор — не используют глобальный логгер напрямую.

## Известные технические долги

- HTTP-статусы зашиты в сервисах (`new AppError(..., 404)`). Для сепарации транспорта
  стоит перейти на доменные ошибки + единый маппинг в error handler.
- `UserService` и `LicensesService` остаются точками кросс-доменной оркестрации только
  через use-case. При выносе `licenses` в отдельный сервис понадобится saga/outbox
  вместо `$transaction`.
