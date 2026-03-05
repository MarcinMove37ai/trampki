# ─────────────────────────────────────────────
# Trampki na Giełdzie — Dockerfile
# Next.js 16 · multi-stage build (deps → build → runner)
# ─────────────────────────────────────────────

# ── STAGE 1: zależności ──────────────────────
FROM node:20-alpine AS deps

WORKDIR /app

# Kopiuj tylko pliki potrzebne do instalacji
COPY package.json package-lock.json* ./

# Instalacja zależności produkcyjnych + devDeps (potrzebne do build)
RUN npm ci --frozen-lockfile

# ── STAGE 2: build ───────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Kopiuj zależności z poprzedniego stage
COPY --from=deps /app/node_modules ./node_modules

# Kopiuj cały kod źródłowy
COPY . .

# Wyłącz telemetrię Next.js
ENV NEXT_TELEMETRY_DISABLED=1

# Build produkcyjny
RUN npm run build

# ── STAGE 3: runner (minimalny obraz) ────────
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Utwórz użytkownika bez uprawnień roota
RUN addgroup --system --gid 1001 nodejs \
 && adduser  --system --uid 1001 nextjs

# Kopiuj pliki publiczne
COPY --from=builder /app/public ./public

# Kopiuj output Next.js standalone
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME=0.0.0.0

CMD ["node", "server.js"]