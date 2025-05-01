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

- 📚 **API Documentation**
    - Swagger UI for API exploration and testing (in development mode)

## Prerequisites

- [Bun](https://bun.sh/) (latest version)
- [Redis](https://redis.io/) for session storage
- PostgreSQL database

## Installation

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
```
