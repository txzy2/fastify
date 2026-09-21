FROM debian:bookworm-slim AS base

# 1. Системные утилиты
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    unzip \
    ca-certificates \
    openssl \
    && rm -rf /var/lib/apt/lists/*

# 2. Node.js LTS (нужен для Prisma)
RUN curl -fsSL https://deb.nodesource.com/setup_22.x | bash - \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

# 3. Baseline-сборка Bun (без AVX2)
RUN curl -fsSL https://github.com/oven-sh/bun/releases/download/bun-v1.2.11/bun-linux-x64-baseline.zip -o /tmp/bun.zip \
    && unzip /tmp/bun.zip -d /tmp \
    && mv /tmp/bun-linux-x64-baseline/bun /usr/local/bin/bun \
    && chmod +x /usr/local/bin/bun \
    && ln -s /usr/local/bin/bun /usr/local/bin/bunx \
    && rm -rf /tmp/bun.zip /tmp/bun-linux-x64-baseline

WORKDIR /app

FROM base AS deps
COPY package.json bun.lock ./
COPY prisma.config.ts ./
COPY prisma ./prisma
ENV DATABASE_URL="postgresql://user:pass@localhost:5432/db?schema=public"
ENV PRISMA_ENGINES_MIRROR="https://cdn.npmmirror.com/binaries/prisma"
RUN bun install --frozen-lockfile --production && bun x prisma generate

FROM base AS runner
ENV NODE_ENV=production

COPY --from=deps /app/node_modules ./node_modules
COPY package.json bun.lock tsconfig.json prisma.config.ts index.ts ./
COPY prisma ./prisma
COPY src ./src

EXPOSE 3000
CMD ["bun", "index.ts"]