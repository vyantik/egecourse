# EgeCourse

A modern backend application built with NestJS and Bun runtime.

## Description

EgeCourse is a robust backend service that provides authentication, user management, and other core functionalities for applications. Built with NestJS and powered by Bun for enhanced performance.

## Features

- 🔐 **Authentication System**

    - Email/Password authentication
    - Two-factor authentication
    - Session management with Redis
    - Role-based access control

- 👤 **User Management**

    - User registration and profile management
    - Email verification
    - Password recovery

- 📧 **Email Services**

    - Email confirmation
    - Password recovery notifications

- 🔄 **Database Integration**

    - Prisma ORM for type-safe database access
    - Data validation and transformation
    - Automatic database seeding

- 📚 **API Documentation**
    - Swagger UI for API exploration and testing (in development mode)

## Prerequisites

- [Bun](https://bun.sh/) (latest version)
- [Redis](https://redis.io/) for session storage
- PostgreSQL database
- [Docker](https://docker.com/) and [Docker Compose](https://docs.docker.com/compose/)

## Installation

### Local Development

```bash
# Clone the repository
git clone https://github.com/vyantik/egecourse.git

# Navigate to the project directory
cd egecourse

# Install dependencies
bun install --frozen-lockfile

# Prisma generate
npx prisma generate
npx prisma db push

# Run seed (optional)
bun run prisma:seed

# Start development server
bun run start:dev
```

### Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose up -d

# View logs
docker-compose logs -f app
```

### Portainer Deployment

1. **Создайте стек в Portainer:**

    - Перейдите в раздел "Stacks"
    - Нажмите "Add stack"
    - Вставьте содержимое `docker-compose.yml`

2. **Настройте переменные окружения:**

    - Создайте файл `.env` или настройте переменные в Portainer
    - Убедитесь, что все переменные окружения заполнены

3. **Запустите стек:**
    - Нажмите "Deploy the stack"
    - Дождитесь запуска всех сервисов

## Troubleshooting

### База данных не заполняется

Если база данных не заполняется при запуске в Portainer:

1. **Проверьте логи приложения:**

    ```bash
    docker-compose logs app
    ```

2. **Убедитесь, что переменные окружения корректны:**

    - `POSTGRES_DB` должен быть одинаковым в сервисах `app` и `db`
    - `POSTGRES_URI` должен указывать на правильную базу данных

3. **Проверьте подключение к базе данных:**

    ```bash
    docker-compose exec app nc -z db 5432
    ```

4. **Принудительно примените миграции:**

    ```bash
    docker-compose exec app npx prisma db push --force-reset
    ```

5. **Запустите seed вручную:**
    ```bash
    docker-compose exec app bun run prisma:seed
    ```

### Тестовые данные

После успешного запуска в базе данных будут созданы:

- **Администратор:** `admin@example.com` / `test`
- **Преподаватель:** Иван Иванов (математика)
- **FAQ:** "Как записаться на курс?"
- **Курс:** "Подготовка к ЕГЭ по математике"

## API Documentation

После запуска приложения документация API доступна по адресу:

- Swagger UI: `http://localhost:10001/api/docs`
- Основная страница: `http://localhost:10001/`

## Environment Variables

Создайте файл `.env` на основе `.env.example` и заполните необходимые переменные:

```env
# Application
APPLICATION_PORT=10001
APPLICATION_URL=http://localhost:10001
ALLOWED_ORIGIN=http://localhost:10001

# Database
POSTGRES_USER=postgres
POSTGRES_PASSWORD=password
POSTGRES_HOST=db
POSTGRES_PORT=5432
POSTGRES_DB=egecourse
POSTGRES_URI=postgresql://postgres:password@db:5432/egecourse

# Redis
REDIS_PASSWORD=redis_password
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_URI=redis://:redis_password@redis:6379

# Session
COOKIES_SECRET=your_cookies_secret_here
SESSION_SECRET=your_session_secret_here
SESSION_NAME=session
SESSION_DOMAIN=localhost
SESSION_MAX_AGE=86400000
SESSION_HTTP_ONLY=true
SESSION_SECURE=false
SESSION_FOLDER=./sessions

# Mail (заполните своими данными)
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_LOGIN=your_email@gmail.com
MAIL_PASSWORD=your_app_password
```
