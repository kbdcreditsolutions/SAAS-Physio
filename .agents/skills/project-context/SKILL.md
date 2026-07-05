---
name: project-context
description: Context and best practices specific to the SAAS-Physio Next.js workspace. Use when working on authentication, Edge runtime debugging, or architecture in this project.
---

# SAAS-Physio Project Context

This skill serves as the self-learning brain for the SAAS-Physio project. As you solve bugs, uncover architectural nuances, or learn about deployment environments, document them here.

## 1. Next.js Edge Runtime vs Node.js
- The middleware in this project (`middleware.ts`) runs on the Next.js Edge Runtime when deployed to Vercel.
- **NEVER** use `export const runtime = "nodejs";` in `middleware.ts`. Next.js App Router enforces Edge for middleware.
- **NEVER** import or use Node.js specific libraries (like `crypto`, `fs`, `jsonwebtoken`) in `middleware.ts` or any code that the middleware imports.
- **Authentication:** Use `jose` instead of `jsonwebtoken` for signing and verifying JWTs on the edge.

## 2. Authentication Flow
- Handled via cookies (`physiocare_session`) using `jose` for JWTs.
- Server Actions and API routes (which run in Node.js runtime) can access Prisma.
- Client components should not access `jsonwebtoken` or Node.js logic.

## 3. Deployment (Vercel)
- Vercel deployments will fail silently at runtime (500 Internal Server Error) if Edge functions crash due to Node.js library imports. Always check Edge compatibility when adding imports to shared libs (like `lib/auth.ts`) that might be consumed by middleware.

*(Self-learning: Append new architectural rules and debugging patterns to this skill file as the project evolves.)*
