---
name: project-context
description: Context and best practices specific to the SAAS-Physio Next.js workspace. Use when working on authentication, Edge runtime debugging, or architecture in this project.
---

# SAAS-Physio Project Context

This is the self-learning brain for the SAAS-Physio project. Updated as new issues are resolved.

## 1. Next.js Edge Runtime vs Node.js
- `middleware.ts` runs on the **Edge Runtime** in Vercel — NEVER use Node.js-only libraries here.
- **NEVER** add `export const runtime = "nodejs";` in `middleware.ts`.
- **NEVER** import `jsonwebtoken`, `crypto`, `fs`, or any Node.js native module in `middleware.ts` or files it imports.
- **Use `jose`** (Edge-compatible) instead of `jsonwebtoken` for JWT signing/verification.
- `verifySession()` in `lib/auth.ts` is now `async` — always `await` it.

## 2. Authentication Flow
- Session stored in `physiocare_session` httpOnly cookie.
- JWTs signed/verified using `jose` with `HS256` algorithm.
- `lib/auth.ts` exports: `signSession`, `verifySession`, `setSessionCookie`, `clearSessionCookie`, `getSession`.
- API routes use `requireSession()` from `lib/guard.ts` for auth checks.
- Password hashing uses `bcryptjs` (Node.js compatible, not used in Edge).

## 3. Database — Neon PostgreSQL via Prisma
- **Provider:** Neon (serverless PostgreSQL), integrated directly with Vercel.
- **Neon Project:** `silent-forest-23150019` (neon-cinereous-lens), org `org-blue-poetry-93504632`.
- **Endpoint:** `ep-nameless-meadow-at954vlp.c-9.us-east-1.aws.neon.tech`
- Neon uses PgBouncer connection pooling. Prisma requires BOTH:
  - `DATABASE_URL` → **pooled** URL (`-pooler.` in hostname) — for app runtime
  - `DATABASE_URL_UNPOOLED` → **direct** URL (no `-pooler.`) — for migrations via `directUrl` in schema.prisma
- schema.prisma must have:
  ```prisma
  datasource db {
    provider  = "postgresql"
    url       = env("DATABASE_URL")
    directUrl = env("DATABASE_URL_UNPOOLED")
  }
  ```

## 4. Vercel Environment Variables Required
| Variable | Description |
|---|---|
| `DATABASE_URL` | Neon **pooled** connection string (auto-injected by Neon integration) |
| `DATABASE_URL_UNPOOLED` | Neon **direct** connection string (auto-injected by Neon integration) |
| `JWT_SECRET` | Random hex string — generate with `openssl rand -hex 32` |

## 5. Demo Accounts (password: `Admin@123`)
| Email | Role |
|---|---|
| `superadmin@physiocare.io` | SUPER_ADMIN |
| `admin@sunrisephysio.in` | CLINIC_ADMIN |
| `dr.arjun@sunrisephysio.in` | DOCTOR |
| `reception@sunrisephysio.in` | STAFF |

## 6. Deployment History / Bug Log
- **2026-07-06:** Fixed login 500 error caused by `jsonwebtoken` (Node.js only) being imported into `middleware.ts` (Edge runtime). Replaced with `jose`. Also removed invalid `export const runtime = "nodejs"` from middleware. Added `directUrl` for Neon PgBouncer compatibility. Seeded Neon DB with demo data.

