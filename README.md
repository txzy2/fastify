# Fastify API

REST API на базе **Fastify** с использованием **TypeScript**, **Prisma** и **PostgreSQL**.

## 📋 Описание

Проект представляет собой шаблон REST API приложения со следующей структурой:

- **Fastify v5** — быстрый и минималистичный веб-фреймворк
- **Prisma v7** — ORM для работы с базой данных
- **PostgreSQL** — основная СУБД
- **JSON Schema** — валидация запросов и ответов
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
│   │   ├── container.ts         # DI-контейнер (composition root)
│   │   └── logger.ts            # Настройка логгера и интерфейс ILogger
│   ├── http/
│   │   ├── hooks/               # preHandler-хуки (лог, валидация пароля)
│   │   └── v1/
│   │       ├── routes/          # Маршруты по модулям
│   │       │   ├── index.ts     # Общий агрегатор registerRoutes
│   │       │   ├── auth.routes.ts
│   │       │   └── user.routes.ts
│   │       └── schemas/         # Swagger/JSON-схемы
│   │           ├── auth.schema.ts
│   │           └── user.schema.ts
│   ├── modules/                 # Вертикальные срезы по домену
│   │   ├── auth/
│   │   │   ├── auth.controller.ts
│   │   │   └── use-case/register-user.use-case.ts
│   │   ├── licenses/
│   │   │   ├── licenses.repository.ts
│   │   │   └── licenses.service.ts
│   │   └── users/
│   │       ├── dto/
│   │       ├── user.controller.ts
│   │       ├── user.mapper.ts
│   │       ├── user.repository.ts
│   │       └── user.service.ts
│   ├── prisma/
│   │   └── prisma.service.ts    # Сервис Prisma
│   ├── utils/
│   │   └── enums/
│   │       └── errors.ts        # Перечисление ошибок API
│   └── types.ts                 # Общие типы
├── prisma/
│   ├── schema.prisma            # Схема БД
│   └── migrations/              # Миграции Prisma
├── docker/
│   └── nginx/
│       └── default.conf         # Конфиг nginx внутри стека (проксирует на app)
├── monitoring/
│   ├── prometheus.yml           # Конфиг Prometheus
│   ├── loki/config.yml          # Конфиг Loki
│   ├── alloy/config.alloy       # Grafana Alloy — сбор логов nginx в Loki
│   └── grafana/provisioning/    # Автопровижининг datasources Grafana
├── docs/                        # Контекст проекта для разработчиков и агентов
├── dev_data/                    # Данные dev-инфраструктуры (gitignore)
├── prod_data/                   # Данные prod-инфраструктуры (gitignore)
├── docker-compose.dev.yml       # Docker-конфигурация для разработки
├── docker-compose.yml           # Docker-конфигурация для продакшена
├── Dockerfile                   # Образ приложения для продакшена
├── Makefile                     # Команды запуска dev/prod
├── index.ts                     # Точка входа
└── package.json
```

> Подробное описание архитектуры и конвенций — в каталоге [`docs/`](./docs/README.md).

## 📖 API Документация

После запуска сервера Swagger UI доступен по адресу:

- **Swagger UI:** `http://localhost:3000/docs`

> В режиме `prod` (`NODE_ENV=prod`) Swagger и `/docs` **не регистрируются** вовсе —
> схема API наружу не отдаётся. Полная документация доступна только в dev.

### Эндпоинты

| Метод | Путь              | Описание                      |
| ----- | ----------------- | ----------------------------- |
| `GET` | `/api/v1/user/:id` | Получить пользователя по UUID |

### Примеры запросов

**Получение пользователя по ID:**

```bash
curl http://localhost:3000/api/v1/user/550e8400-e29b-41d4-a716-446655440000
```

### Формат ответов

Поле `version` добавляется через обёртки `apiSuccess(data)` / `apiError(message)` из
`src/utils/helpers/response.helper.ts` — значение берётся из `APP_VERSION`. В контроллерах
достаточно обернуть ответ, вручную `version` указывать не нужно.

**Успешный ответ:**

```json
{
    "success": true,
    "data": {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "name": "John Doe",
        "age": 30
    },
    "version": "v1.0.0"
}
```

**Ошибка валидации:**

```json
{
    "success": false,
    "error": "name must be a string",
    "version": "v1.0.0"
}
```

**Пользователь не найден:**

```json
{
    "success": false,
    "error": "Пользователь не найден или не активен",
    "version": "v1.0.0"
}
```

## ⚙️ Конфигурация

### Переменные окружения

| Переменная                | Описание             | Значение по умолчанию |
| ------------------------- | -------------------- | --------------------- |
| `NODE_ENV`                | Режим работы         | `dev`                 |
| `APP_NAME`                | Название приложения  | `Test Fastify Api`    |
| `APP_VERSION`             | Версия приложения    | `v1.0.0`              |
| `APP_PORT`                | Порт сервера         | `3000`                |
| `LOGGER_LEVEL`            | Уровень логирования  | `info`                |
| `LOGGER_TRANSPORT_TARGET` | Транспорт логов      | `pino-pretty`         |
| `DATABASE_URL`            | URL подключения к БД | —                     |
| `DB_NAME`                 | Имя базы данных      | `fastify_db`          |
| `DB_USER`                 | Пользователь БД      | `fastify_user`        |
| `DB_PASS`                 | Пароль БД            | `fastify_pass`        |
| `REDIS_HOST`              | Хост Redis           | `127.0.0.1`           |
| `REDIS_PORT`              | Порт Redis           | `6379`                |
| `REDIS_PASS`              | Пароль Redis         | —                     |

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

### Make-таргеты

```bash
# --- Разработка ---
make init-dev     # создать dev_data/ и выставить права на директории
make up-dev       # поднять dev-инфраструктуру
make ps-dev       # статус dev-контейнеров
make down-dev     # остановить dev-инфраструктуру
make app-dev      # запустить приложение в watch-режиме

# --- Продакшен ---
make init-prod    # создать .env.prod, prod_data/ и выставить права
make build-prod   # собрать образ приложения
make up-prod      # собрать и поднять prod-стек
make ps-prod      # статус prod-контейнеров
make logs-prod    # логи prod-стека (follow)
make down-prod    # остановить prod-стек
```

## 📝 Логирование

Поведение зависит от `NODE_ENV`:

- **dev** — логи пишутся в директорию `logs/` (`app.log` — общие, `error.log` — ошибки,
  ротация ежедневно, хранение 30 файлов) и дополнительно выводятся в консоль через
  `pino-pretty`.
- **prod** — файлы не пишутся, логи уходят напрямую в **Loki** (`pino-loki`). Локальный
  диск не засоряется, сервис считается stateless.

Сбор логов и просмотр описаны в разделе [Мониторинг](#-мониторинг).

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

- **URL (dev):** `http://localhost:795`
- **Система:** PostgreSQL
- **Сервер dev:** `fastify_db`
- **Пользователь:** `fastify_user`
- **Пароль:** `fastify_pass`
- **База данных:** `fastify_db`

> В prod-режиме порт Adminer привязан к `127.0.0.1` и наружу не выставлен — доступ
> только через SSH-туннель, см. [Доступ к Grafana и Adminer](#-доступ-к-grafana-и-adminer-через-ssh).
> В качестве сервера БД указывайте `db`.

## 📊 Мониторинг

В стеке поднимаются **Prometheus**, **Grafana**, **Loki**, `postgres-exporter` и
**Grafana Alloy**. Данные хранятся в хостовых директориях: в dev — `./dev_data`, в prod —
`./prod_data` (обе в `.gitignore`).

| Сервис     | Хост (dev)                | Хост (prod)                | Контейнер          | UID/GID   |
| ---------- | ------------------------- | -------------------------- | ------------------ | --------- |
| Prometheus | `./dev_data/prometheus`   | `./prod_data/prometheus`   | `/prometheus`      | `65534`   |
| Grafana    | `./dev_data/grafana`      | `./prod_data/grafana`      | `/var/lib/grafana` | `472`     |
| Loki       | `./dev_data/loki`         | `./prod_data/loki`         | `/loki`            | `10001`   |

**Grafana** при старте автоматически подхватывает datasources (Prometheus и Loki) из
`monitoring/grafana/provisioning/`. **Alloy** читает логи nginx из общего тома
`nginx_logs` и отправляет их в Loki с метками `job="nginx"`, `logtype="access|error"` —
искать в Grafana Explore запросом `{job="nginx"}`.

### Просмотр логов nginx

В Grafana → **Explore** → datasource **Loki**:

```logql
{job="nginx"}
{job="nginx", logtype="error"}
```

> Логи nginx собираются только в prod-стеке (`docker-compose.yml`), т.к. nginx есть
> только там. В dev приложение запускается на хосте, без nginx-контейнера.

### 🌐 Публичные и внутренние порты (prod)

Наружу в prod-стеке опубликованы только:

| Сервис  | Порт на хосте | Назначение                        |
| ------- | ------------- | --------------------------------- |
| nginx   | `${NGINX_PORT}` | точка входа API (за системным nginx) |

**Grafana** и **Adminer** привязаны к `127.0.0.1` и доступны только с самого сервера —
см. [Доступ к Grafana и Adminer](#-доступ-к-grafana-и-adminer-через-ssh). Все остальные
сервисы (app, db, Prometheus, Loki, postgres-exporter, Alloy) общаются только внутри
docker-сети.

### ⚠️ Проблема с правами (Grafana и Loki не запускаются)

**Симптомы:** контейнеры `${PROJECT_NAME}_grafana` и `${PROJECT_NAME}_loki` падают сразу после старта или бесконечно перезапускаются (`restart: always`). В логах:

```text
GF_PATHS_DATA='/var/lib/grafana' is not writable.
open /var/lib/grafana/grafana.db: permission denied
```

```text
failed to create directory /loki/chunks: mkdir /loki/chunks: permission denied
```

**Причина:** Docker создаёт bind-mount директории (например, `./dev_data/grafana`) на хосте от имени `root`, а процессы внутри контейнеров работают под непривилегированными пользователями (Grafana — `472`, Prometheus — `65534`, Loki — `10001`). Поэтому контейнер не может писать в смонтированную директорию.

**Решение:** Make-таргеты `init-dev` / `init-prod` создают директории и выставляют владельца автоматически (через одноразовый root-контейнер, `sudo` на хосте не нужен):

```bash
make init-dev    # для dev_data/
make init-prod   # для prod_data/
```

Эти таргеты выполняются автоматически как зависимости `make up-dev` / `make up-prod`.

Если нужно поправить вручную (обрати внимание на UID):

```bash
sudo chown -R 472:472 dev_data/grafana
sudo chown -R 65534:65534 dev_data/prometheus
sudo chown -R 10001:10001 dev_data/loki
```

Затем перезапустить сервисы:

```bash
docker-compose -f docker-compose.dev.yml up -d prometheus grafana loki
```

Проверить, что владелец установлен верно (UID вместо имён):

```bash
ls -ln dev_data
```

## 🚢 Продакшен (Docker)

Prod-стек описан в `docker-compose.yml`, образ приложения собирается `Dockerfile`
(база `oven/bun`, multi-stage: зависимости + `prisma generate`, затем рантайм).

Состав стека: `nginx`, `app`, `migrate` (одноразовый, применяет миграции), `db`,
`adminer`, `prometheus`, `postgres-exporter`, `grafana`, `loki`, `alloy`.
Данные — в `./prod_data` (в `.gitignore`).

### Запуск

```bash
cp .env.prod.example .env.prod   # или make init-prod
# отредактируйте .env.prod: DB_PASS, GRAFANA_PASSWORD, NGINX_PORT и др.
make up-prod                     # init-prod + build + up
```

Сервис `migrate` прогоняет `prisma migrate deploy` **до** старта `app`, так что ручные
миграции не нужны.

### Переменные окружения (prod)

| Переменная          | Описание                        |
| ------------------- | ------------------------------- |
| `NODE_ENV`          | `prod`                          |
| `APP_VERSION`       | Версия приложения (в ответах)   |
| `APP_PORT`          | Внутренний порт приложения      |
| `DB_NAME/DB_USER/DB_PASS` | Доступ к PostgreSQL       |
| `REDIS_HOST/PORT/PASS` | Доступ к Redis (в prod `REDIS_HOST=redis`) |
| `PGSQL_VERSION`     | Версия образа PostgreSQL        |
| `NGINX_PORT`        | Публичный порт nginx стека      |
| `GRAFANA_PORT`      | Loopback-порт Grafana           |
| `ADMINER_PORT`      | Loopback-порт Adminer           |
| `GRAFANA_USER` / `GRAFANA_PASSWORD` | Учётка администратора Grafana |

### Схема портов

- Наружу публикуется только `nginx` (`${NGINX_PORT}`). На сервере перед ним обычно
  стоит системный nginx.
- `grafana` и `adminer` привязаны к `127.0.0.1` — снаружи недоступны.
- Остальные сервисы доступны только внутри docker-сети.

### 🔐 Доступ к Grafana и Adminer через SSH

Так как порты привязаны к `127.0.0.1`, заходить нужно через SSH-туннель. Локальные
порты выбирайте `> 1024` (иначе потребуется root на своей машине):

```bash
ssh -N \
  -L 3001:127.0.0.1:3001 \
  -L 1795:127.0.0.1:795 \
  <user>@<your-server>
```

После подключения:

- Grafana → `http://localhost:3001`
- Adminer → `http://localhost:1795` (Server: `db`)

Значения правых портов должны совпадать с `GRAFANA_PORT` / `ADMINER_PORT` в `.env.prod`.

### Размещение за системным nginx

На хосте системный nginx слушает 80/443 и проксирует на контейнерный nginx
(`http://127.0.0.1:${NGINX_PORT}`):

```nginx
server {
    listen 80;
    server_name <your-domain-or-ip>;

    location / {
        proxy_pass http://127.0.0.1:<NGINX_PORT>;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

> Внутренний nginx уже умеет runtime-резолвинг `app` через Docker DNS
> (`resolver 127.0.0.11`), поэтому пересоздание контейнера `app` не роняет прокси.

## 🔧 Обработка ошибок

Приложение использует централизованный обработчик ошибок в `bootstrap.ts`:

- **AppError** — кастомные ошибки приложения с кодом статуса
- **ValidationError** — ошибки валидации от `class-validator`
- **Internal Server Error** — необработанные ошибки сервера (500)

## 📦 Зависимости

### Основные

- `fastify` — веб-фреймворк
- `@prisma/client` — ORM клиент
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
