# faz a build
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

FROM node:18-alpine AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodeuser

# copia as dependencias
COPY --from=builder /app/node_modules ./node_modules
COPY . .

RUN chown -R nodeuser:nodejs /app
USER nodeuser

EXPOSE 5000

CMD ["npm", "start"]
