# syntax=docker/dockerfile:1

# ---------- BASE ----------
FROM node:22.13-alpine AS base

WORKDIR /app

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN apk add --no-cache libc6-compat openssl \
    && corepack enable \
    && corepack prepare pnpm@11.17.0 --activate

# ---------- DEPENDENCIES ----------
FROM base AS deps

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

RUN pnpm install --frozen-lockfile

# ---------- BUILDER ----------
FROM base AS builder

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN pnpm build

# ---------- RUNNER ----------
FROM base AS runner

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

RUN addgroup -S nodejs \
    && adduser -S nextjs -G nodejs

COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=builder /app/pnpm-workspace.yaml ./pnpm-workspace.yaml

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts
COPY --from=builder /app/tsconfig.json ./tsconfig.json
COPY --from=builder /app/generated ./generated

# Next.js standalone
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

COPY start.sh ./start.sh

RUN chmod +x ./start.sh \
    && chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

CMD ["/bin/sh", "/app/start.sh"]