.PHONY: dev prod init up-dev down-dev app-dev app-prod

up-dev:
	docker-compose -f docker-compose.dev.yml up -d

ps-dev:
	docker-compose -f docker-compose.dev.yml ps

down-dev:
	docker-compose -f docker-compose.dev.yml down

app-dev:
	bun run dev

app-prod:
	bun run prod

init:
	cp .env.example .env && bun install && bunx prisma generate && bunx prisma migrate dev

