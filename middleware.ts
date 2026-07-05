import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/lib/auth";

const COOKIE_NAME = "physiocare_session";

export async function middleware(req: NextRequest) {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  const session = token ? await verifySession(token) : null;
  const { pathname } = req.nextUrl;

  const isAppRoute = pathname.startsWith("/app");
  const isLoginRoute = pathname === "/login";

  if (isAppRoute && !session) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (isAppRoute && pathname.startsWith("/app/clinics") && session?.role !== "SUPER_ADMIN") {
    return NextResponse.redirect(new URL("/app", req.url));
  }

  if (isLoginRoute && session) {
    return NextResponse.redirect(new URL("/app", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/app/:path*", "/login"],
};
