FROM mirror.gcr.io/oven/bun:1-slim AS base
WORKDIR /app

FROM base AS deps
COPY package.json bun.lock ./
COPY prisma.config.ts ./
COPY prisma ./prisma
ENV DATABASE_URL="postgresql://user:pass@localhost:5432/db?schema=public"
RUN bun install --frozen-lockfile --production && bunx prisma generate

FROM base AS runner
ENV NODE_ENV=production
RUN apt-get update \
    && apt-get install -y --no-install-recommends openssl ca-certificates \
    && rm -rf /var/lib/apt/lists/*

COPY --from=deps /app/node_modules ./node_modules
COPY package.json bun.lock tsconfig.json prisma.config.ts index.ts ./
COPY prisma ./prisma
COPY src ./src

EXPOSE 3000
CMD ["bun", "index.ts"]
