FROM node:20-alpine AS base
WORKDIR /app

# =====================================================
# Stage 1: Install dependencies
# =====================================================
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

# =====================================================
# Stage 2: Build Next.js app
# =====================================================
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Build với biến môi trường: các URL backend trỏ đến tên service trong Docker network
ENV NEXT_PUBLIC_API_URL=http://localhost:8080
ENV PRODUCT_SERVICE_URL=http://productservice:8087
ENV USER_SERVICE_URL=http://userservice:8085
ENV ORDER_SERVICE_URL=http://orderservice:8088
ENV STORE_SERVICE_URL=http://storeservice:8090
ENV GATEWAY_URL=http://apigateway:8080
ENV LIVESTREAM_SERVICE_URL=http://livestreamservice:8086
ENV NEXT_PUBLIC_FASTAPI_LIVESTREAM_URL=http://localhost:30050
RUN npm run build

# =====================================================
# Stage 3: Production server
# =====================================================
FROM base AS runner
ENV NODE_ENV=production

# Tạo user non-root để chạy app (best practice bảo mật)
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
CMD ["node", "server.js"]
