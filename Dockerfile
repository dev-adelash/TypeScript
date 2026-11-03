FROM node:22-alpine AS build
WORKDIR /app/typescript
COPY typescript/package*.json ./
RUN npm ci
COPY typescript/ ./
RUN npm run build
FROM node:22-alpine
WORKDIR /app/typescript
COPY --from=build --chown=node:node /app/typescript /app/typescript
COPY --chown=node:node ui/ /app/ui/
ENV HOST=0.0.0.0
USER node
EXPOSE 8000
CMD ["node","dist/server.js","ecommerce-fulfillment-and-component-portal-typescript/project.json"]
