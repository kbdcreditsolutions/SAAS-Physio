<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:saas-physio-rules -->
# MANDATORY: Read CONTEXT.md First

Before making ANY changes to this project, read `CONTEXT.md` at the project root. It contains the full architecture, bug log, environment setup, and all critical constraints. Failure to read it risks re-introducing bugs that were already fixed.

# Edge Runtime Constraints

- Do not use Node.js specific libraries (e.g., `jsonwebtoken`, `crypto`, `fs`) in `middleware.ts` or any code it imports, as it runs on the Edge runtime in Vercel. Use Edge-compatible alternatives like `jose`.
- `export const runtime = "nodejs";` is INVALID for middleware in App Router. Do not add it.
- `verifySession()` in `lib/auth.ts` is async — always `await` it.
- The `middleware()` function must be `async` because it awaits `verifySession()`.

# Database Rules (Neon + Prisma)

- Always ensure `prisma/schema.prisma` has BOTH `url` AND `directUrl`:
  ```prisma
  datasource db {
    provider  = "postgresql"
    url       = env("DATABASE_URL")
    directUrl = env("DATABASE_URL_UNPOOLED")
  }
  ```
- Never run `prisma migrate dev` against production. Use `prisma migrate deploy` only.
- After any schema change, run `npx prisma generate` to regenerate the client.

# Multi-Tenant Data Isolation

- All database queries MUST use `tenantScope(session)` from `lib/scope.ts` to filter by tenant.
- Never query across tenants unless the user role is `SUPER_ADMIN`.
- `SUPER_ADMIN` has no `tenantId` (it is `null`).

# Security

- Never expose JWT_SECRET, DATABASE_URL passwords, or any secrets in code, logs, or error responses.
- API error responses must not include stack traces or internal error details in production.
<!-- END:saas-physio-rules -->
