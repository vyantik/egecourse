FROM node:20.17.0-alpine AS base

# Устанавливаем необходимые пакеты
RUN apk add --no-cache bash curl netcat-openbsd libc6-compat

# Устанавливаем Bun
RUN curl -fsSL https://bun.sh/install | bash && \
    mv /root/.bun/bin/bun /usr/local/bin/bun

WORKDIR /app

# Копируем только файлы зависимостей сначала
COPY package.json bun.lockb ./

# Устанавливаем зависимости
RUN bun install --frozen-lockfile

FROM base AS build

# Копируем исходный код
COPY . .

# Генерируем Prisma клиент
RUN npx prisma generate

# Собираем приложение
RUN bun run build

FROM base AS production

ENV NODE_ENV=production

WORKDIR /app

# Копируем только production зависимости
COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile --production

# Копируем собранное приложение
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma/__generated__ ./prisma/__generated__
COPY --from=build /app/prisma ./prisma

# Создаем директорию для uploads
RUN mkdir -p /app/uploads

VOLUME /app/uploads

# Указываем порт
EXPOSE 10001

# Копируем и настраиваем скрипт запуска
COPY start.sh /app/start.sh
RUN chmod +x /app/start.sh

CMD ["/app/start.sh"]