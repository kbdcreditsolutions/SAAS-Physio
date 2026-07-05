import { SessionPayload } from "@/lib/auth";

/** Returns a Prisma where-clause fragment scoping by tenant, or {} for Super Admin (platform-wide). */
export function tenantScope(session: SessionPayload) {
  if (session.role === "SUPER_ADMIN") return {};
  return { tenantId: session.tenantId! };
}
