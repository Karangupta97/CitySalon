# 🏭 Industrial-Level Backend — TypeScript & Node.js Standards Guide

> **Purpose:** This is the single source of truth for all backend development.
> Every function, file, folder, class, and logic block MUST follow these rules — no exceptions.
> This file is written for an AI agent to read and strictly follow.

---

## 📁 1. Project File & Folder Structure

```
project-root/
│
├── src/
│   ├── api/
│   │   └── v1/
│   │       ├── routes/
│   │       │   ├── auth.routes.ts
│   │       │   ├── user.routes.ts
│   │       │   └── health.routes.ts
│   │       └── index.ts               # Mounts all v1 routes
│   │
│   ├── config/
│   │   ├── env.ts                     # Zod-validated env schema
│   │   ├── db.ts                      # DB connection & pool setup
│   │   └── app.ts                     # Express app setup (no listen here)
│   │
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   └── user.controller.ts
│   │
│   ├── services/
│   │   ├── auth.service.ts
│   │   └── user.service.ts
│   │
│   ├── repositories/
│   │   ├── base.repository.ts
│   │   └── user.repository.ts
│   │
│   ├── models/
│   │   └── user.model.ts              # ORM/DB schema model
│   │
│   ├── schemas/
│   │   ├── user.schema.ts             # Zod input validation schemas
│   │   └── common.schema.ts
│   │
│   ├── middlewares/
│   │   ├── auth.middleware.ts         # JWT verification
│   │   ├── error.middleware.ts        # Global error handler
│   │   ├── validate.middleware.ts     # Zod schema validator
│   │   ├── rateLimit.middleware.ts
│   │   └── logger.middleware.ts       # Request logging
│   │
│   ├── types/
│   │   ├── express.d.ts               # Extend Express Request type
│   │   ├── common.types.ts            # Shared interfaces & types
│   │   └── env.types.ts
│   │
│   ├── utils/
│   │   ├── logger.ts                  # Winston/Pino structured logger
│   │   ├── response.ts                # Standard API response builder
│   │   ├── asyncHandler.ts            # Wrap async route handlers
│   │   ├── token.ts                   # JWT sign/verify helpers
│   │   └── hash.ts                    # bcrypt hash/compare helpers
│   │
│   ├── errors/
│   │   ├── AppError.ts                # Base custom error class
│   │   └── HttpError.ts               # HTTP-specific error subclasses
│   │
│   └── server.ts                      # Entry point — app.listen() lives here
│
├── tests/
│   ├── unit/
│   │   ├── services/
│   │   └── utils/
│   ├── integration/
│   │   └── routes/
│   └── setup.ts
│
├── scripts/
│   └── seed.ts                        # DB seeding
│
├── .env                               # Local secrets — NEVER commit
├── .env.example                       # Template with dummy values — commit this
├── .env.test                          # Test environment variables
├── .gitignore
├── package.json
├── tsconfig.json
├── tsconfig.build.json
├── jest.config.ts
├── Dockerfile
├── docker-compose.yml
└── README.md
```

---

## ⚙️ 2. TypeScript Configuration — `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2021",
    "module": "CommonJS",
    "lib": ["ES2021"],
    "rootDir": "./src",
    "outDir": "./dist",
    "baseUrl": "./src",
    "paths": {
      "@config/*": ["config/*"],
      "@controllers/*": ["controllers/*"],
      "@services/*": ["services/*"],
      "@repositories/*": ["repositories/*"],
      "@models/*": ["models/*"],
      "@schemas/*": ["schemas/*"],
      "@middlewares/*": ["middlewares/*"],
      "@utils/*": ["utils/*"],
      "@errors/*": ["errors/*"],
      "@types/*": ["types/*"]
    },
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "tests"]
}
```

---

## 🔐 3. Environment & Config Rules

### Rule: ALL secrets and config come from environment variables via Zod validation. NEVER hardcode.

```ts
// src/config/env.ts
import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.string().default("3000").transform(Number),

  // Database — Supabase PostgreSQL
  DB_HOST: z.string(),
  DB_PORT: z.string().default("5432").transform(Number),
  DB_NAME: z.string(),
  DB_USER: z.string(),
  DB_PASSWORD: z.string(),
  DB_SSL: z.string().default("require"),
  DB_POOL_MIN: z.string().default("2").transform(Number),
  DB_POOL_MAX: z.string().default("10").transform(Number),

  // Auth
  JWT_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: z.string().default("15m"),
  JWT_REFRESH_SECRET: z.string().min(32),
  JWT_REFRESH_EXPIRES_IN: z.string().default("7d"),

  // App
  ALLOWED_ORIGINS: z.string().default("http://localhost:3000"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ Invalid environment variables:", parsed.error.format());
  process.exit(1);
}

export const env = parsed.data;
```

### `.env.example` (commit this, NOT `.env`)
```
NODE_ENV=development
PORT=3000

DB_HOST=
DB_PORT=5432
DB_NAME=
DB_USER=
DB_PASSWORD=
DB_SSL=require
DB_POOL_MIN=2
DB_POOL_MAX=10

JWT_SECRET=
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=
JWT_REFRESH_EXPIRES_IN=7d

ALLOWED_ORIGINS=http://localhost:3000
```

---

## 🗄️ 4. Database Connection — Supabase PostgreSQL (Secure)

### Rules
- Always use **connection pooling** — never raw single connections in production
- Always enforce **SSL** (`ssl: { rejectUnauthorized: false }` for Supabase, or `require`)
- Use **Knex.js** or **Drizzle ORM** (preferred for TypeScript) or **pg** pool directly
- DB config is read from `env` — never inline values

```ts
// src/config/db.ts  (using Knex.js example)
import knex from "knex";
import { env } from "@config/env";
import { logger } from "@utils/logger";

export const db = knex({
  client: "pg",
  connection: {
    host: env.DB_HOST,
    port: env.DB_PORT,
    database: env.DB_NAME,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    ssl: { rejectUnauthorized: false }, // Required for Supabase
  },
  pool: {
    min: env.DB_POOL_MIN,
    max: env.DB_POOL_MAX,
    acquireTimeoutMillis: 30000,
    idleTimeoutMillis: 600000,
  },
  acquireConnectionTimeout: 10000,
});

export async function connectDB(): Promise<void> {
  try {
    await db.raw("SELECT 1");
    logger.info("✅ Database connected successfully");
  } catch (error) {
    logger.error("❌ Database connection failed", { error });
    process.exit(1);
  }
}

export async function disconnectDB(): Promise<void> {
  await db.destroy();
  logger.info("Database connection closed");
}
```

---

## 🚀 5. Application Entry Points

### `src/config/app.ts` — Express setup only (no listen)
```ts
import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import { env } from "@config/env";
import { errorMiddleware } from "@middlewares/error.middleware";
import { loggerMiddleware } from "@middlewares/logger.middleware";
import { rateLimitMiddleware } from "@middlewares/rateLimit.middleware";
import v1Routes from "@api/v1";

export function createApp(): Application {
  const app = express();

  // Security middlewares
  app.use(helmet());
  app.use(cors({
    origin: env.ALLOWED_ORIGINS.split(","),
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  }));

  // Body parsing
  app.use(express.json({ limit: "10kb" }));
  app.use(express.urlencoded({ extended: true }));
  app.use(compression());

  // Request logging & rate limiting
  app.use(loggerMiddleware);
  app.use(rateLimitMiddleware);

  // API routes
  app.use("/api/v1", v1Routes);

  // Health check
  app.get("/health", (_req, res) => res.json({ status: "ok" }));

  // Global error handler — MUST be last
  app.use(errorMiddleware);

  return app;
}
```

### `src/server.ts` — Entry point only
```ts
import { createApp } from "@config/app";
import { connectDB } from "@config/db";
import { env } from "@config/env";
import { logger } from "@utils/logger";

async function bootstrap(): Promise<void> {
  await connectDB();

  const app = createApp();

  const server = app.listen(env.PORT, () => {
    logger.info(`🚀 Server running on port ${env.PORT} in ${env.NODE_ENV} mode`);
  });

  // Graceful shutdown
  const shutdown = async (signal: string) => {
    logger.info(`Received ${signal}. Shutting down gracefully...`);
    server.close(async () => {
      const { disconnectDB } = await import("@config/db");
      await disconnectDB();
      process.exit(0);
    });
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));

  process.on("unhandledRejection", (reason) => {
    logger.error("Unhandled Rejection", { reason });
    process.exit(1);
  });
}

bootstrap();
```

---

## 🚨 6. Error Classes

```ts
// src/errors/AppError.ts
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number = 500, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

// src/errors/HttpError.ts
import { AppError } from "./AppError";

export class BadRequestError extends AppError {
  constructor(message = "Bad Request") { super(message, 400); }
}
export class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized") { super(message, 401); }
}
export class ForbiddenError extends AppError {
  constructor(message = "Forbidden") { super(message, 403); }
}
export class NotFoundError extends AppError {
  constructor(message = "Not Found") { super(message, 404); }
}
export class ConflictError extends AppError {
  constructor(message = "Conflict") { super(message, 409); }
}
export class InternalServerError extends AppError {
  constructor(message = "Internal Server Error") { super(message, 500); }
}
```

---

## 📤 7. Standard API Response Format

Every single endpoint MUST return this exact shape — no exceptions.

```json
{
  "success": true,
  "message": "User created successfully",
  "data": { ... },
  "errors": null,
  "meta": {
    "timestamp": "2024-01-01T00:00:00.000Z",
    "version": "v1"
  }
}
```

```ts
// src/utils/response.ts
import { Response } from "express";

interface ApiMeta {
  timestamp: string;
  version: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
  errors: unknown | null;
  meta: ApiMeta;
}

const buildMeta = (extra?: Partial<ApiMeta>): ApiMeta => ({
  timestamp: new Date().toISOString(),
  version: "v1",
  ...extra,
});

export const sendSuccess = <T>(
  res: Response,
  data: T,
  message = "Success",
  statusCode = 200,
  meta?: Partial<ApiMeta>
): Response => {
  const body: ApiResponse<T> = {
    success: true,
    message,
    data,
    errors: null,
    meta: buildMeta(meta),
  };
  return res.status(statusCode).json(body);
};

export const sendError = (
  res: Response,
  message = "Error",
  statusCode = 400,
  errors: unknown = null
): Response => {
  const body: ApiResponse<null> = {
    success: false,
    message,
    data: null,
    errors,
    meta: buildMeta(),
  };
  return res.status(statusCode).json(body);
};
```

---

## 🛡️ 8. Middleware Layer

### Async Handler Wrapper
```ts
// src/utils/asyncHandler.ts
import { Request, Response, NextFunction, RequestHandler } from "express";

export const asyncHandler = (fn: RequestHandler): RequestHandler =>
  (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
```

### Global Error Middleware
```ts
// src/middlewares/error.middleware.ts
import { Request, Response, NextFunction } from "express";
import { AppError } from "@errors/AppError";
import { sendError } from "@utils/response";
import { logger } from "@utils/logger";

export const errorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (err instanceof AppError) {
    logger.warn("Operational error", {
      message: err.message,
      statusCode: err.statusCode,
      path: req.path,
    });
    sendError(res, err.message, err.statusCode);
    return;
  }

  // Unknown/unexpected error
  logger.error("Unexpected error", { error: err, path: req.path });
  sendError(res, "Internal Server Error", 500);
};
```

### Zod Validation Middleware
```ts
// src/middlewares/validate.middleware.ts
import { Request, Response, NextFunction } from "express";
import { AnyZodObject, ZodError } from "zod";
import { BadRequestError } from "@errors/HttpError";

export const validate = (schema: AnyZodObject) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const messages = err.errors.map((e) => `${e.path.join(".")}: ${e.message}`);
        next(new BadRequestError(messages.join(", ")));
      } else {
        next(err);
      }
    }
  };
```

### JWT Auth Middleware
```ts
// src/middlewares/auth.middleware.ts
import { Request, Response, NextFunction } from "express";
import { verifyToken } from "@utils/token";
import { UnauthorizedError } from "@errors/HttpError";

export const authenticate = (req: Request, _res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) throw new UnauthorizedError("No token provided");

  const token = authHeader.split(" ")[1];
  const decoded = verifyToken(token);
  if (!decoded) throw new UnauthorizedError("Invalid or expired token");

  req.user = decoded; // Requires extended Express Request type
  next();
};
```

---

## 📦 9. Repository Layer Rules

- The repository is the **ONLY layer** that writes DB queries
- No DB queries in services, controllers, or routes
- Always typed — every method has explicit return types
- Use generic `BaseRepository` and extend per domain

```ts
// src/repositories/base.repository.ts
import { db } from "@config/db";

export abstract class BaseRepository<T> {
  constructor(protected readonly tableName: string) {}

  async findById(id: string): Promise<T | undefined> {
    return db<T>(this.tableName).where({ id }).first();
  }

  async findAll(limit = 100, offset = 0): Promise<T[]> {
    return db<T>(this.tableName).limit(limit).offset(offset);
  }

  async create(data: Partial<T>): Promise<T> {
    const [record] = await db<T>(this.tableName).insert(data).returning("*");
    return record;
  }

  async update(id: string, data: Partial<T>): Promise<T | undefined> {
    const [record] = await db<T>(this.tableName)
      .where({ id })
      .update({ ...data, updated_at: new Date() })
      .returning("*");
    return record;
  }

  async delete(id: string): Promise<boolean> {
    const count = await db(this.tableName).where({ id }).delete();
    return count > 0;
  }
}
```

```ts
// src/repositories/user.repository.ts
import { BaseRepository } from "./base.repository";
import { db } from "@config/db";
import { User } from "@models/user.model";

export class UserRepository extends BaseRepository<User> {
  constructor() {
    super("users");
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return db<User>(this.tableName).where({ email }).first();
  }
}
```

---

## ⚙️ 10. Service Layer Rules

- Services contain **all business logic** — nothing else
- Services call repositories — never DB directly
- Services raise custom `AppError` subclasses — never `res.status()` or HTTP codes
- Every service method must be async and fully typed

```ts
// src/services/user.service.ts
import { UserRepository } from "@repositories/user.repository";
import { CreateUserDto } from "@schemas/user.schema";
import { ConflictError, NotFoundError } from "@errors/HttpError";
import { hashPassword } from "@utils/hash";
import { User } from "@models/user.model";
import { logger } from "@utils/logger";

export class UserService {
  constructor(private readonly userRepo: UserRepository) {}

  async createUser(dto: CreateUserDto): Promise<User> {
    logger.info("Creating user", { email: dto.email });

    const existing = await this.userRepo.findByEmail(dto.email);
    if (existing) throw new ConflictError(`Email ${dto.email} is already registered`);

    const hashedPassword = await hashPassword(dto.password);
    const user = await this.userRepo.create({ ...dto, password: hashedPassword });

    logger.info("User created", { userId: user.id });
    return user;
  }

  async getUserById(id: string): Promise<User> {
    const user = await this.userRepo.findById(id);
    if (!user) throw new NotFoundError(`User ${id} not found`);
    return user;
  }

  async getAllUsers(limit: number, offset: number): Promise<User[]> {
    return this.userRepo.findAll(limit, offset);
  }

  async deleteUser(id: string): Promise<void> {
    const user = await this.userRepo.findById(id);
    if (!user) throw new NotFoundError(`User ${id} not found`);
    await this.userRepo.delete(id);
    logger.info("User deleted", { userId: id });
  }
}
```

---

## 🌐 11. Controller Layer Rules

- Controllers handle **HTTP request/response only** — no business logic
- Always wrap in `asyncHandler` — never raw async in routes
- Destructure from `req.body`, `req.params`, `req.query` — always typed
- Always call `sendSuccess` or `sendError` from utils

```ts
// src/controllers/user.controller.ts
import { Request, Response } from "express";
import { UserService } from "@services/user.service";
import { UserRepository } from "@repositories/user.repository";
import { sendSuccess } from "@utils/response";
import { asyncHandler } from "@utils/asyncHandler";

const userService = new UserService(new UserRepository());

export const createUser = asyncHandler(async (req: Request, res: Response) => {
  const user = await userService.createUser(req.body);
  sendSuccess(res, user, "User created successfully", 201);
});

export const getUserById = asyncHandler(async (req: Request, res: Response) => {
  const user = await userService.getUserById(req.params.id);
  sendSuccess(res, user, "User fetched successfully");
});

export const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
  const limit = Number(req.query.limit) || 100;
  const offset = Number(req.query.offset) || 0;
  const users = await userService.getAllUsers(limit, offset);
  sendSuccess(res, users, "Users fetched successfully");
});

export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  await userService.deleteUser(req.params.id);
  sendSuccess(res, null, "User deleted successfully");
});
```

---

## 🗺️ 12. Route Layer Rules

- Routes only wire HTTP verbs + paths to controllers
- Always apply `validate(schema)` middleware before controller
- Always apply `authenticate` before protected routes
- Group by domain, mount under versioned prefix

```ts
// src/api/v1/routes/user.routes.ts
import { Router } from "express";
import { createUser, getUserById, getAllUsers, deleteUser } from "@controllers/user.controller";
import { validate } from "@middlewares/validate.middleware";
import { authenticate } from "@middlewares/auth.middleware";
import { createUserSchema, getUserSchema } from "@schemas/user.schema";

const router = Router();

router.post("/", validate(createUserSchema), createUser);
router.get("/", authenticate, getAllUsers);
router.get("/:id", authenticate, validate(getUserSchema), getUserById);
router.delete("/:id", authenticate, validate(getUserSchema), deleteUser);

export default router;
```

```ts
// src/api/v1/index.ts
import { Router } from "express";
import userRoutes from "./routes/user.routes";
import authRoutes from "./routes/auth.routes";
import healthRoutes from "./routes/health.routes";

const router = Router();

router.use("/users", userRoutes);
router.use("/auth", authRoutes);
router.use("/health", healthRoutes);

export default router;
```

---

## ✅ 13. Zod Schema Validation

```ts
// src/schemas/user.schema.ts
import { z } from "zod";

export const createUserSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(100),
    email: z.string().email(),
    password: z.string().min(8).max(128),
  }),
});

export const getUserSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
});

export type CreateUserDto = z.infer<typeof createUserSchema>["body"];
export type GetUserDto = z.infer<typeof getUserSchema>["params"];
```

---

## 📝 14. Logging Rules

- Use **Pino** (preferred for Node.js) or **Winston** for structured logging
- NEVER use `console.log` — always use `logger`
- Log format in production: **JSON**. Development: pretty print
- Always include `userId`, `action`, `path`, `method` where relevant

```ts
// src/utils/logger.ts
import pino from "pino";
import { env } from "@config/env";

export const logger = pino({
  level: env.NODE_ENV === "production" ? "info" : "debug",
  transport:
    env.NODE_ENV !== "production"
      ? { target: "pino-pretty", options: { colorize: true } }
      : undefined,
  base: { service: "backend-api", env: env.NODE_ENV },
  timestamp: pino.stdTimeFunctions.isoTime,
});
```

---

## 🔑 15. Security Rules (Non-Negotiable)

| Rule | Implementation |
|------|----------------|
| No hardcoded secrets | `env.ts` with Zod validation |
| SSL enforced on DB | `ssl: { rejectUnauthorized: false }` for Supabase |
| Passwords hashed | `bcrypt` with saltRounds ≥ 12 |
| JWT short-lived | Access: 15m, Refresh: 7d |
| All inputs validated | Zod schema on every route |
| Rate limiting | `express-rate-limit` on all routes |
| CORS restricted | Whitelist via `ALLOWED_ORIGINS` env var |
| SQL injection safe | ORM/query builder only — no raw string interpolation |
| Helmet applied | All HTTP security headers via `helmet` |
| Request size limited | `express.json({ limit: "10kb" })` |
| No sensitive data in logs | Never log `password`, `token`, `secret` fields |

---

## 🧪 16. Testing Standards

- **Unit tests** — test services in isolation, mock all repositories
- **Integration tests** — test routes end-to-end with a real test DB
- Test file mirrors source: `tests/unit/services/user.service.test.ts`
- Minimum **80% coverage** before merging to `main`
- Use `Jest` + `ts-jest` + `supertest` for integration

```ts
// tests/unit/services/user.service.test.ts
import { UserService } from "@services/user.service";
import { ConflictError } from "@errors/HttpError";

const mockUserRepo = {
  findByEmail: jest.fn(),
  create: jest.fn(),
  findById: jest.fn(),
  findAll: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

const userService = new UserService(mockUserRepo as any);

describe("UserService", () => {
  beforeEach(() => jest.clearAllMocks());

  describe("createUser", () => {
    it("should throw ConflictError if email already exists", async () => {
      mockUserRepo.findByEmail.mockResolvedValue({ id: "123", email: "a@b.com" });

      await expect(
        userService.createUser({ name: "Test", email: "a@b.com", password: "pass1234" })
      ).rejects.toThrow(ConflictError);
    });

    it("should create and return user on success", async () => {
      mockUserRepo.findByEmail.mockResolvedValue(undefined);
      mockUserRepo.create.mockResolvedValue({ id: "123", email: "a@b.com" });

      const result = await userService.createUser({
        name: "Test",
        email: "a@b.com",
        password: "pass1234",
      });

      expect(result).toHaveProperty("id", "123");
    });
  });
});
```

---

## 🐳 17. Docker & Deployment Rules

- Run as **non-root user** in Docker
- Use **multi-stage builds** to keep images lean
- Never bake secrets into Docker image — inject at runtime

```dockerfile
# Dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY tsconfig*.json ./
COPY src ./src
RUN npm run build

FROM node:20-alpine
WORKDIR /app
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=builder /app/dist ./dist
USER appuser
EXPOSE 3000
CMD ["node", "dist/server.js"]
```

```yaml
# docker-compose.yml
services:
  api:
    build: .
    ports:
      - "3000:3000"
    env_file:
      - .env
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
```

---

## 📋 18. `package.json` — Required Scripts & Dependencies

```json
{
  "scripts": {
    "dev": "tsx watch src/server.ts",
    "build": "tsc -p tsconfig.build.json",
    "start": "node dist/server.js",
    "lint": "eslint src --ext .ts",
    "format": "prettier --write src",
    "test": "jest --passWithNoTests",
    "test:coverage": "jest --coverage",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "express": "^4.18.2",
    "knex": "^3.1.0",
    "pg": "^8.11.3",
    "zod": "^3.22.4",
    "pino": "^8.17.2",
    "pino-pretty": "^10.3.1",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "helmet": "^7.1.0",
    "cors": "^2.8.5",
    "compression": "^1.7.4",
    "express-rate-limit": "^7.1.5",
    "dotenv": "^16.3.1"
  },
  "devDependencies": {
    "typescript": "^5.3.3",
    "tsx": "^4.7.0",
    "@types/express": "^4.17.21",
    "@types/node": "^20.11.0",
    "@types/bcryptjs": "^2.4.6",
    "@types/jsonwebtoken": "^9.0.5",
    "@types/cors": "^2.8.17",
    "@types/compression": "^1.7.5",
    "ts-jest": "^29.1.2",
    "jest": "^29.7.0",
    "@types/jest": "^29.5.11",
    "supertest": "^6.3.4",
    "@types/supertest": "^6.0.2",
    "eslint": "^8.56.0",
    "@typescript-eslint/eslint-plugin": "^6.19.0",
    "@typescript-eslint/parser": "^6.19.0",
    "prettier": "^3.2.4"
  }
}
```

---

## ✅ 19. Agent Checklist — Before Writing Any File

Before generating any file, verify every item below:

- [ ] Is this code in the correct layer? (`route → controller → service → repository`)
- [ ] Are ALL secrets/config sourced from `env.ts` only?
- [ ] Is the DB accessed only through a repository class?
- [ ] Is SSL enforced on the DB connection?
- [ ] Is every route input validated with a Zod schema?
- [ ] Is every async route handler wrapped in `asyncHandler`?
- [ ] Is the response using `sendSuccess` / `sendError` from `utils/response.ts`?
- [ ] Are custom `AppError` subclasses thrown (not raw `Error` or `res.status()` in services)?
- [ ] Is structured logging added at key steps (no `console.log`)?
- [ ] Are TypeScript types explicit — no untyped `any` without justification?
- [ ] Does this function have at least one test?
- [ ] Is the file named and placed in the correct folder per the structure in Section 1?

---

## 🚫 20. Hard Anti-Patterns — NEVER Do These

```ts
// ❌ NEVER — hardcoded secrets
const db = knex({ connection: { password: "mypassword123" } });

// ❌ NEVER — console.log in production code
console.log("user created:", user);

// ❌ NEVER — business logic in a controller
app.post("/users", async (req, res) => {
  const existing = await db("users").where({ email: req.body.email }).first();
  if (existing) return res.status(409).json({ error: "exists" });
});

// ❌ NEVER — raw SQL string interpolation (SQL injection risk)
await db.raw(`SELECT * FROM users WHERE email = '${email}'`);

// ❌ NEVER — unhandled async in routes
router.get("/users", async (req, res) => {
  const users = await userService.getAll(); // no try/catch, no asyncHandler
  res.json(users);
});

// ❌ NEVER — HTTP status codes inside a service
class UserService {
  async getUser(id: string) {
    const user = await this.repo.findById(id);
    if (!user) return res.status(404).json({ error: "not found" }); // WRONG
  }
}

// ✅ ALWAYS — throw a typed error from the service
if (!user) throw new NotFoundError(`User ${id} not found`);
```

---

> **This document is the law of this codebase.**
> If any generated code conflicts with these standards, the standards win.
> When in doubt — read this file before writing a single line.
