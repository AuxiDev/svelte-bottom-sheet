# Dockerfile for building and running docs page
FROM node:22-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
COPY package/package.json ./package/
COPY docs/package.json ./docs/

RUN npm install --include=optional --package-lock=false

COPY package ./package
COPY docs ./docs

RUN npm run package --workspace=package
RUN npm run build --workspace=docs

FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000

COPY --from=builder /app/docs/build ./docs/build

EXPOSE 3000

CMD ["node", "docs/build/index.js"]
