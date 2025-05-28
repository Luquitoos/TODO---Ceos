# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Production stage
FROM node:18-alpine AS runner
WORKDIR /app

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodeuser

# Copy dependencies
COPY --from=builder /app/node_modules ./node_modules
COPY . .

# Change ownership
RUN chown -R nodeuser:nodejs /app
USER nodeuser

EXPOSE 5000

CMD ["npm", "start"]