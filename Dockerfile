FROM node:20.17.0-alpine AS base

RUN apk add --no-cache bash curl
RUN apk add --no-cache libc6-compat

RUN curl -fsSL https://bun.sh/install | bash && \
    mv /root/.bun/bin/bun /usr/local/bin/bun


WORKDIR /app

COPY package.json ./

RUN bun install

FROM base AS build

COPY . .

RUN npx prisma generate

RUN bun run build

FROM base AS production

ENV NODE_ENV=production

WORKDIR /app

COPY --from=build /app/package.json /app/

RUN bun install

COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma/__generated__ ./prisma/__generated__

VOLUME /app/uploads

CMD ["node", "dist/main"]