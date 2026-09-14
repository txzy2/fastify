# Конвенции

## Стиль кода

- TypeScript, ESM, Path alias `@/*` → `src/*` (см. `tsconfig.json`).
- Отступ — 4 пробела, точка с запятой, одинарные кавычки, ширина строки ~100.
- Не добавляйте комментарии-«шум». JSDoc — только на публичных методах классов
  (в проекте уже есть такой стиль).
- Внешние зависимости не добавляйте без необходимости; сначала проверьте, нет ли уже
  подходящей в `package.json`.

## Именование

- Файлы модуля: `<domain>.controller.ts`, `<domain>.service.ts`, `<domain>.repository.ts`,
  `<domain>.mapper.ts`.
- Интерфейсы зависимостей: `I<Name>` (`IUserService`, `IUserRepository`).
- Use-case: `<Action><Domain>UseCase` (`RegisterUserUseCase`), папка `use-case/`.
- DTO: в `dto/`, суффиксы `*Request*Dto` / `*ResponseDto`.
- Ошибки: тексты только через `ApiErrors` (`src/utils/enums/errors.ts`).

## Правила слоёв

- Контроллер не знает про Prisma и не содержит бизнес-логики.
- Сервис не знает про `FastifyRequest`/`FastifyReply`; отдаёт/принимает DTO.
- Prisma вызывается только в репозиториях.
- Репозиторий принимает `tx?: Prisma.TransactionClient` и пишет
  `const client = tx ?? this.prisma`.
- `ILogger` импортируйте из `@/core/logger`, а не из `@/core/container`.
- Новые зависимости инжектятся через конструктор и собираются в `core/container.ts`.

## Как добавить новый модуль

1. Создайте `src/modules/<domain>/` со слоями:
   `dto/`, `<domain>.repository.ts`, `<domain>.service.ts`, `<domain>.controller.ts`.
2. Определите интерфейсы `I<Domain>Service` / `I<Domain>Repository` и при необходимости
   экспортируйте публичный API через `index.ts`.
3. Опишите DTO запроса/ответа и маппер `Prisma-модель → DTO`.
4. Добавьте JSON-схемы в `src/http/v1/schemas/<domain>.schema.ts`.
5. Создайте `src/http/v1/routes/<domain>.routes.ts` с функцией
   `register<Domain>Routes(instance, controller)`.
6. Подключите роуты в `src/http/v1/routes/index.ts`.
7. Соберите граф в `src/core/container.ts` (repos → services → use-cases → controllers)
   и добавьте нужные контроллеры в `Container` и в вызов `registerRoutes`.

## Как добавить маршрут

```ts
fastifyInstance.get<{Params: SomeParamsDto; Reply: ApiResponse<SomeResponseDto>}>(
    '/path/:id',
    {preHandler: [logRequest], schema: someSchema},
    controller.someHandler
);
```

Типизируйте `Params`/`Querystring`/`Body`/`Reply` через DTO и `ApiResponse<T>` из
`@/types`.

## Как добавить use-case

Нужен, когда сценарий затрагивает несколько сервисов или требует транзакции.

```ts
export class SomeUseCase implements ISomeUseCase {
    constructor(
        private readonly userService: IUserService,
        private readonly prisma: PrismaService,
        private readonly logger: ILogger
    ) {}

    public async execute(dto: SomeDto): Promise<SomeResponseDto> {
        return this.prisma.$transaction(async tx => {
            // ... вызовы сервисов с tx
        });
    }
}
```

## Проверки перед коммитом

```bash
bunx tsc --noEmit                 # типы
bun build index.ts --target bun   # проверка резолва импортов/алиасов
```

Автотестов и линтера в проекте пока нет. Если добавляете — обновите этот файл.
