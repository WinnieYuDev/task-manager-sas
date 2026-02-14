import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Route protection: redirect unauthenticated users from dashboard routes to login.
// Convex Auth session is client-side; for full server-side protection, add
// @convex-dev/auth Next.js adapter when available for your Convex Auth version.
const PROTECTED_PATHS = ["/dashboard", "/tasks", "/analytics", "/settings", "/upgrade"];

function isProtected(pathname: string) {
  return PROTECTED_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"));
}

function isAuthPage(pathname: string) {
  return pathname === "/login" || pathname === "/signup";
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  // Optional: redirect authenticated users away from login/signup (requires auth cookie from Convex Auth)
  if (isProtected(pathname)) {
    // Without Convex Auth Next.js server, we can't read auth state here.
    // Dashboard layout will redirect to /login when useQuery(api.users.getCurrentUser) returns null.
    return NextResponse.next();
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
