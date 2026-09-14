.PHONY: dev prod init init-dev up-dev ps-dev down-dev app-dev app-prod up-prod ps-prod down-prod logs-prod build-prod init-prod

# === Development ===

init-dev:
	@docker run --rm --user root -v "$(CURDIR)/dev_data:/data" --entrypoint sh grafana/grafana:latest -c '\
		mkdir -p /data/db /data/prometheus /data/grafana /data/loki && \
		chown 1000:1000 /data && \
		chown -R 65534:65534 /data/prometheus && \
		chown -R 472:472 /data/grafana && \
		chown -R 10001:10001 /data/loki'

up-dev: init-dev
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
	@docker run --rm --user root -v "$(CURDIR)/prod_data:/data" --entrypoint sh grafana/grafana:latest -c '\
		mkdir -p /data/db /data/prometheus /data/grafana /data/loki /data/nginx_logs /data/alloy && \
		chown 1000:1000 /data && \
		chown -R 65534:65534 /data/prometheus && \
		chown -R 472:472 /data/grafana && \
		chown -R 10001:10001 /data/loki && \
		touch /data/nginx_logs/access.log /data/nginx_logs/error.log'

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
