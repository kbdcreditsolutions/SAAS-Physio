<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:saas-physio-rules -->
# Edge Runtime Constraints

- Do not use Node.js specific libraries (e.g., `jsonwebtoken`, `crypto`) in `middleware.ts` or any code it imports, as it runs on the Edge runtime in Vercel. Use Edge-compatible alternatives like `jose`.
- `export const runtime = "nodejs";` is invalid for middleware in App Router.
<!-- END:saas-physio-rules -->

