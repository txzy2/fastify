# Fastify API

REST API на базе **Fastify** с использованием **TypeScript**, **Prisma** и **PostgreSQL**.

## 📋 Описание

Проект представляет собой шаблон REST API приложения со следующей структурой:

- **Fastify v5** — быстрый и минималистичный веб-фреймворк
- **Prisma v7** — ORM для работы с базой данных
- **PostgreSQL** — основная СУБД
- **class-validator** — валидация запросов
- **Swagger** — автоматическая документация API
- **Pino** — логирование с ротацией файлов

## 🚀 Быстрый старт

### Требования

- [Bun](https://bun.sh/) или Node.js >= 20
- Docker и Docker Compose

### Установка

1. **Клонируйте репозиторий:**

    ```bash
    git clone <repository-url>
    cd fastify
    ```

2. **Установите зависимости:**

    ```bash
    bun install
    ```

3. **Настройте окружение:**

    ```bash
    cp .env.example .env
    ```

4. **Запустите базу данных:**

    ```bash
    docker-compose -f docker-compose.dev.yml up -d
    ```

5. **Примените миграции Prisma:**

    ```bash
    bunx prisma migrate dev
    ```

6. **Запустите сервер:**
    ```bash
    bun run dev
    ```

Сервер будет доступен по адресу: `http://localhost:3000`

## 📁 Структура проекта

```
fastify/
├── src/
│   ├── core/                    # Ядро приложения
│   │   ├── bootstrap.ts         # Инициализация приложения и обработчик ошибок
│   │   ├── config.ts            # Конфигурация сервера
│   │   ├── container.ts         # DI-контейнер
│   │   └── logger.ts            # Настройка логгера
│   ├── http/
│   │   └── v1/
│   │       ├── schemas/         # Swagger-схемы для валидации
│   │       └── routes.ts        # Регистрация маршрутов
│   ├── modules/
│   │   └── users/
│   │       ├── user.controller.ts   # Обработчики запросов
│   │       ├── user.service.ts      # Бизнес-логика
│   │       └── user.repository.ts   # Работа с БД
│   ├── prisma/
│   │   └── prisma.service.ts    # Сервис Prisma
│   ├── utils/
│   │   └── enums/
│   │       └── errors.ts        # Перечисление ошибок API
│   └── types.ts                 # Общие типы
├── prisma/
│   ├── schema.prisma            # Схема БД
│   └── migrations/              # Миграции Prisma
├── docker-compose.dev.yml       # Docker-конфигурация для разработки
├── index.ts                     # Точка входа
└── package.json
```

## 📖 API Документация

После запуска сервера Swagger UI доступен по адресу:

- **Swagger UI:** `http://localhost:3000/docs`

### Эндпоинты

| Метод | Путь                       | Описание                       |
| ----- | -------------------------- | ------------------------------ |
| `GET` | `/api/v1/user?name=<name>` | Получить пользователя по имени |
| `GET` | `/api/v1/user/:id`         | Получить пользователя по UUID  |

### Примеры запросов

**Получение пользователя по имени:**

```bash
curl http://localhost:3000/api/v1/user?name=John
```

**Получение пользователя по ID:**

```bash
curl http://localhost:3000/api/v1/user/550e8400-e29b-41d4-a716-446655440000
```

### Формат ответов

**Успешный ответ:**

```json
{
    "success": true,
    "data": {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "name": "John Doe",
        "age": 30
    }
}
```

**Ошибка валидации:**

```json
{
    "success": false,
    "error": "name must be a string"
}
```

**Пользователь не найден:**

```json
{
    "success": false,
    "error": "Пользователь не найден или не активен"
}
```

## ⚙️ Конфигурация

### Переменные окружения

| Переменная                | Описание             | Значение по умолчанию |
| ------------------------- | -------------------- | --------------------- |
| `NODE_ENV`                | Режим работы         | `dev`                 |
| `APP_NAME`                | Название приложения  | `Test Fastify Api`    |
| `APP_PORT`                | Порт сервера         | `3000`                |
| `LOGGER_LEVEL`            | Уровень логирования  | `info`                |
| `LOGGER_TRANSPORT_TARGET` | Транспорт логов      | `pino-pretty`         |
| `DATABASE_URL`            | URL подключения к БД | —                     |
| `DB_NAME`                 | Имя базы данных      | `fastify_db`          |
| `DB_USER`                 | Пользователь БД      | `fastify_user`        |
| `DB_PASS`                 | Пароль БД            | `fastify_pass`        |

## 🛠️ Команды

```bash
# Запуск в режиме разработки (с авто-перезагрузкой)
bun run dev

# Запуск в продакшен-режиме
bun run prod

# Генерация Prisma клиента
bunx prisma generate

# Создание миграции
bunx prisma migrate dev --name <migration_name>

# Применение миграций
bunx prisma migrate deploy

# Сброс базы данных
bunx prisma migrate reset
```

## 📝 Логирование

Логи записываются в директорию `logs/`:

- `app.log` — общие логи приложения
- `error.log` — только ошибки

В режиме разработки логи также выводятся в консоль через `pino-pretty`.

## 🗄️ База данных

### Схема данных

**Таблица `users`:**

| Поле   | Тип          | Описание                       |
| ------ | ------------ | ------------------------------ |
| `id`   | UUID         | Первичный ключ (автогенерация) |
| `name` | VARCHAR(255) | Уникальное имя пользователя    |
| `age`  | INTEGER      | Возраст пользователя           |

### Adminer

Для удобной работы с БД в docker-compose включён Adminer:

- **URL:** `http://localhost:795`
- **Система:** PostgreSQL
- **Сервер:** `fastify_db`
- **Пользователь:** `fastify_user`
- **Пароль:** `fastify_pass`
- **База данных:** `fastify_db`

## 🔧 Обработка ошибок

Приложение использует централизованный обработчик ошибок в `bootstrap.ts`:

- **AppError** — кастомные ошибки приложения с кодом статуса
- **ValidationError** — ошибки валидации от `class-validator`
- **Internal Server Error** — необработанные ошибки сервера (500)

## 📦 Зависимости

### Основные

- `fastify` — веб-фреймворк
- `@prisma/client` — ORM клиент
- `class-validator` — валидация данных
- `class-transformer` — трансформация объектов
- `@fastify/swagger` — генерация OpenAPI спецификации
- `@fastify/swagger-ui` — UI для документации
- `pino-roll` — ротация логов
- `dotenv` — управление переменными окружения

### Для разработки

- `typescript` — типизация
- `prisma` — CLI инструмент
- `pino-pretty` — красивое форматирование логов
- `@types/*` — типы для TypeScript

## 🎯 Расширение функциональности

### Добавление нового модуля

1. Создайте директорию в `src/modules/<module_name>/`
2. Реализуйте слои:
    - `*.repository.ts` — работа с данными
    - `*.service.ts` — бизнес-логика
    - `*.controller.ts` — обработка запросов
3. Добавьте схемы в `src/http/v1/schemas/`
4. Зарегистрируйте маршруты в `src/http/v1/routes.ts`
5. Обновите контейнер в `src/core/container.ts`

### Добавление миграции

```bash
bunx prisma migrate dev --name add_new_field
```

## 📄 Лицензия

MIT
