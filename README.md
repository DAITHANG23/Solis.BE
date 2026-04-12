# Solis.BE - Admin Manager API

## 🚀 Overview

**Solis.BE** is the central **Admin Manager API** and **API Gateway** for the Restaurant Booking Ecosystem. It orchestrates communication between the frontend and various downstream microservices (such as `Luna.BE`), while managing core identity and access controls.

Built with **NestJS**, it leverages **Fastify** for high-performance request handling and **Redis** for scalable session and state management.

---

## 🏗️ Architecture & Logical Structure

The project is designed with a modular architecture focused on scalability and maintainability:

### 1. **Gateway Layer (`src/gateway`)**

Acts as the entry point for cross-service operations. It uses the **Proxy Pattern** to forward requests to specialized microservices:

- **BookingProxy**: Orchestrates restaurant reservations.
- **ConceptProxy**: Manages restaurant concepts and themes.
- **ClientProxy**: Interfaces with client-specific logic.

### 2. **Identity & Access Management (IAM)**

- **Auth Module (`src/auth`)**: Handles JWT-based authentication, Passport strategies, and secure hashing with **Argon2**.
- **User Module (`src/user`)**: Manages administrative and end-user profiles.
- **Otplib Integration**: Provides two-factor authentication (2FA) capabilities for enhanced security.

### 3. **Infrastructure & Persistence**

- **Prisma Module (`src/prisma`)**: Type-safe ORM for PostgreSQL.
- **Redis Module (`src/redis`)**: Centralized caching and shared state abstraction.
- **Config Module (`src/config`)**: Environment-based configuration management.

### 4. **Business Logic**

- **Clients Module (`src/client`)**: Specific business domains related to restaurant clients and owners.

---

## 🛠️ Tech Stack ("Flow Scale")

- **Framework**: [NestJS](https://nestjs.com/) (Modular Node.js framework)
- **HTTP Engine**: [Fastify](https://www.fastify.io/) (Maximum performance)
- **Database**: [PostgreSQL](https://www.postgresql.org/) with [Prisma ORM](https://www.prisma.io/)
- **Caching**: [Redis](https://redis.io/)
- **Documentation**: [Swagger](https://swagger.io/)
- **DevOps**: [Docker](https://www.docker.com/) & [Docker Compose](https://docs.docker.com/compose/)

---

## 🚦 Getting Started

### Prerequisites

- Node.js (v18+)
- Yarn or NPM
- Docker and Docker Compose

### Environment Setup

Copy the example environment file and fill in the required values:

```bash
cp .env.example .env
```

### Installation

```bash
yarn install
```

### Running the Project

#### 🐳 Development (Docker - Recommended)

The project is optimized for Docker-based development:

```bash
# Start all services (Backend, DB, Redis)
npm run dev

# Rebuild and start
npm run dev:build

# Clean stop
npm run dev:clean
```

#### 💻 Local Development

```bash
# Development mode
npm run start:dev

# Production mode
npm run start:prod
```

---

## 🗄️ Database Management (Prisma)

- **Generate Client**: `npm run db:generate`
- **Push Schema**: `npm run db:push`
- **Studio (GUI)**: `npm run db:studio`
- **Run Migrations (Docker)**: `npm run db:migrate`

---

## 📖 API Documentation

Once the application is running, you can access the interactive Swagger documentation at:
`http://localhost:3000/api-docs`

_Base API Prefix:_ `api/v1`

---

## 🛡️ Scalability & Quality Control

- **Scalability**: Stateless architecture ready for horizontal scaling via Docker and Redis.
- **Code Quality**: ESLint, Prettier, and Pre-commit hooks via **Husky**.
- **Commits**: Conventional commits enforced by **Commitlint**.

---

## 📄 License

This project is [UNLICENSED](LICENSE).
