#!/bin/bash

# Ждем, пока база данных будет готова
echo "Waiting for database to be ready..."
while ! nc -z db 5432; do
  sleep 1
done
echo "Database is ready!"

# Применяем миграции
echo "Applying database migrations..."
npx prisma db push

# Запускаем приложение
echo "Starting application..."
node dist/main 