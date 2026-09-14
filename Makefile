.PHONY: dev prod init up-dev ps-dev down-dev app-dev app-prod up-prod ps-prod down-prod logs-prod build-prod init-prod

# === Development ===

up-dev:
	docker compose -f docker-compose.dev.yml up -d

ps-dev:
	docker compose -f docker-compose.dev.yml ps

down-dev:
	docker compose -f docker-compose.dev.yml down

app-dev:
	bun run dev

app-prod:
	bun run prod

init:
	cp .env.example .env && bun install && bunx prisma generate && bunx prisma migrate dev

# === Production ===

init-prod:
	@test -f .env.prod || cp .env.prod.example .env.prod
	@mkdir -p prod_data/db prod_data/prometheus prod_data/grafana prod_data/loki prod_data/nginx_logs prod_data/alloy
	@docker run --rm --user root -v "$(CURDIR)/prod_data/prometheus:/data" --entrypoint chown grafana/grafana:latest -R 65534:65534 /data
	@docker run --rm --user root -v "$(CURDIR)/prod_data/grafana:/data" --entrypoint chown grafana/grafana:latest -R 472:472 /data
	@docker run --rm --user root -v "$(CURDIR)/prod_data/loki:/data" --entrypoint chown grafana/grafana:latest -R 10001:10001 /data

build-prod:
	docker compose --env-file .env.prod -f docker-compose.yml build

up-prod: init-prod
	docker compose --env-file .env.prod -f docker-compose.yml up -d --build

ps-prod:
	docker compose --env-file .env.prod -f docker-compose.yml ps

logs-prod:
	docker compose --env-file .env.prod -f docker-compose.yml logs -f

down-prod:
	docker compose --env-file .env.prod -f docker-compose.yml down
