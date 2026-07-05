# PhysioCare — Project Context for AI Agents

> **Read this first.** This file captures every critical architectural decision, past bug fix, environment setup, and coding constraint for the SAAS-Physio project. An AI agent working on this project MUST read this file before making any changes.

---

## 1. What This Project Is

**PhysioCare Clinic OS** — a multi-tenant SaaS platform for physiotherapy clinics. It manages patients, appointments, GST invoices, staff attendance, doctor performance ratings, and marketing campaigns.

- **Live URL:** https://saas-physio.vercel.app
- **GitHub:** https://github.com/kbdcreditsolutions/SAAS-Physio
- **Team:** kbdcreditsolutions-projects on Vercel

## 2. Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16.2.10 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 |
| Database | PostgreSQL via **Neon** (serverless) |
| ORM | Prisma 6.x |
| Auth | `jose` (JWT) + `bcryptjs` (passwords) |
| Deployment | Vercel (kbdcreditsolutions-projects team) |
| Charts | Recharts |

---

## 3. ⚠️ Critical Runtime Constraint — Edge vs Node.js

**This is the most common source of bugs in this project.**

Next.js `middleware.ts` runs on the **Vercel Edge Runtime** — NOT Node.js. This means:

### NEVER do this in middleware.ts or any file it imports:
- ❌ `import jwt from "jsonwebtoken"` — Node.js only, crashes on Edge
- ❌ `import crypto from "crypto"` — Node.js only
- ❌ `import fs from "fs"` — Node.js only
- ❌ `export const runtime = "nodejs"` — INVALID in middleware, silently ignored or errors

### ALWAYS use instead:
- ✅ `import * as jose from "jose"` — Edge-compatible JWT library
- ✅ `bcryptjs` is fine in API routes (Node.js runtime) but NOT in middleware

### How it manifests when broken:
- The login API returns `HTTP 500` with an **empty body** (no JSON)
- The middleware crashes silently on Vercel Edge
- Locally it may work fine because `next dev` runs differently

---

## 4. Authentication Architecture

```
Client (browser)
  → POST /api/auth/login  (Node.js runtime — can use Prisma, bcryptjs)
    → verifyPassword() with bcryptjs
    → setSessionCookie() → signs JWT with jose, sets httpOnly cookie
  
middleware.ts  (Edge runtime — only jose allowed)
  → reads "physiocare_session" cookie
  → await verifySession(token) → jose.jwtVerify()
  → redirects /app → /login if no valid session
  → redirects /login → /app if already authenticated
```

**Key files:**
- [`lib/auth.ts`](lib/auth.ts) — JWT sign/verify with `jose`, cookie management
- [`middleware.ts`](middleware.ts) — route protection (Edge runtime)
- [`lib/guard.ts`](lib/guard.ts) — `requireSession()` helper for API routes
- [`app/api/auth/login/route.ts`](app/api/auth/login/route.ts) — login handler
- [`app/api/auth/logout/route.ts`](app/api/auth/logout/route.ts) — logout handler

**Cookie name:** `physiocare_session`  
**JWT algorithm:** HS256  
**JWT expiry:** 7 days  

---

## 5. Database Setup — Neon + Prisma

### Neon Project Details
- **Project name:** neon-cinereous-lens
- **Project ID:** silent-forest-23150019
- **Org:** org-blue-poetry-93504632
- **Endpoint:** `ep-nameless-meadow-at954vlp.c-9.us-east-1.aws.neon.tech`
- **Region:** us-east-1

### Critical: Neon uses PgBouncer connection pooling

Prisma requires **two** separate connection strings:

| Variable | URL type | Used for |
|---|---|---|
| `DATABASE_URL` | **Pooled** (has `-pooler.` in hostname) | App runtime queries |
| `DATABASE_URL_UNPOOLED` | **Direct** (no `-pooler.`) | Prisma migrations (`directUrl`) |

### schema.prisma MUST have:
```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DATABASE_URL_UNPOOLED")
}
```
If `directUrl` is missing, `prisma migrate deploy` will fail or behave unpredictably.

### Running migrations:
```bash
npx prisma generate         # regenerate client after schema changes
npx prisma migrate deploy   # apply pending migrations to Neon
npm run seed                # seed demo data (idempotent-ish)
```

### Prisma schema location: `prisma/schema.prisma`

---

## 6. Required Environment Variables

### On Vercel (kbdcreditsolutions-projects/saas-physio → Settings → Env Vars)
| Variable | Source | Notes |
|---|---|---|
| `DATABASE_URL` | Auto-injected by Neon integration | Pooled connection |
| `DATABASE_URL_UNPOOLED` | Auto-injected by Neon integration | Direct connection |
| `JWT_SECRET` | **Manually added** | Generate: `openssl rand -hex 32` |

### Local `.env` file (not committed to git):
```env
DATABASE_URL="postgresql://neondb_owner:PASSWORD@ep-nameless-meadow-at954vlp-pooler.c-9.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
DATABASE_URL_UNPOOLED="postgresql://neondb_owner:PASSWORD@ep-nameless-meadow-at954vlp.c-9.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
JWT_SECRET="b5ab39adeef1340dd10dc66e9c10ab33502f1cfd1f5627dd97847c234887023e"
```

---

## 7. Demo Accounts (seeded via `prisma/seed.ts`)

**Password for all accounts:** `Admin@123`

| Email | Name | Role | Tenant |
|---|---|---|---|
| `superadmin@physiocare.io` | Platform Super Admin | SUPER_ADMIN | — (platform level) |
| `admin@sunrisephysio.in` | Priya Menon | CLINIC_ADMIN | Sunrise Physio |
| `dr.arjun@sunrisephysio.in` | Dr. Arjun Iyer | DOCTOR | Sunrise Physio |
| `reception@sunrisephysio.in` | Reception Staff | STAFF | Sunrise Physio |

---

## 8. Multi-Tenant Data Model

The app is multi-tenant. Key scoping rules:

- `SUPER_ADMIN` → no `tenantId`, sees ALL clinics via `/app/clinics`
- `CLINIC_ADMIN`, `DOCTOR`, `STAFF` → scoped to their `tenantId`
- All queries must use `tenantScope(session)` from [`lib/scope.ts`](lib/scope.ts) to prevent cross-tenant data leakage
- Branches belong to a Tenant; Users and Patients belong to a Tenant + optionally a Branch

### Core data models (in `prisma/schema.prisma`):
`Tenant` → `Branch` → `User`, `Patient`  
`Patient` → `Package`, `Invoice`, `Appointment`, `ClinicalNote`, `AttendanceRecord`  
`Invoice` → `InvoiceLineItem`, `Payment`  
`Doctor (User)` → `Appointment` → `ClinicalNote`, `Rating`

---

## 9. App Route Structure

```
/                     → Landing page (public)
/login                → Auth page (redirects to /app if logged in)
/app                  → Dashboard (protected)
/app/patients         → Patient list + add
/app/patients/[id]    → Patient detail (notes, packages, invoices)
/app/appointments     → Appointment calendar/list
/app/invoices         → Invoice list
/app/invoices/[id]    → Invoice detail + payment
/app/staff            → Staff management
/app/attendance       → Attendance tracking
/app/ratings          → Doctor rating dashboard
/app/marketing        → Campaign management
/app/clinics          → SUPER_ADMIN only — all tenant management
```

---

## 10. Known Issues Fixed (Bug Log)

### 2026-07-06 — Login 500 Error on Vercel
**Symptom:** Login page loaded but clicking "Sign in" returned HTTP 500 with empty body.  
**Root cause:** `lib/auth.ts` used `jsonwebtoken` which is Node.js-only. `middleware.ts` imported it, causing the Edge runtime to crash silently.  
**Fix:**
1. Replaced `jsonwebtoken` with `jose` in `lib/auth.ts`
2. Made `signSession()` and `verifySession()` async (jose is Promise-based)
3. Removed `export const runtime = "nodejs"` from `middleware.ts` (invalid)
4. Made `middleware()` function `async` to properly `await verifySession()`
5. Added `directUrl = env("DATABASE_URL_UNPOOLED")` to `prisma/schema.prisma` for Neon PgBouncer compatibility
6. Seeded Neon DB with `npm run seed` after setting up real env vars

---

## 11. Vercel CLI Notes

The Vercel CLI (`vercel`) is authenticated as `manojsuperb09-7598` which belongs to team `manojsuperb09-7598s-projects`. The actual production project lives under `kbdcreditsolutions-projects` team (different account). Use the Vercel dashboard UI for env var management on the production project.

---

## 12. Middleware Deprecation Warning

Next.js 16.x shows:
```
⚠ The "middleware" file convention is deprecated. Please use "proxy" instead.
```
This is a warning only — `middleware.ts` still works. Migration to `proxy.ts` can be done in a future sprint. Do NOT rename it yet without testing.

---

## 13. Scripts

```bash
npm run dev       # start dev server (Turbopack)
npm run build     # production build
npm run lint      # ESLint
npm run seed      # seed demo data to DB (tsx prisma/seed.ts)
```

---

*Last updated: 2026-07-06 by AI agent after fixing Vercel login bug and setting up Neon database.*
