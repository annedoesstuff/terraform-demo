FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
# --------------------------------------------------------------------
FROM node:18-alpine
WORKDIR /app
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser
COPY package*.json ./
RUN npm ci --omit=dev
COPY --chown=appuser:appgroup . .
EXPOSE 3000
CMD ["node", "server.js"]