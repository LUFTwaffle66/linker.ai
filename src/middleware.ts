import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import createIntlMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";
import { routing } from "./i18n/routing";

const intlMiddleware = createIntlMiddleware(routing);

const isPublicRoute = createRouteMatcher([
  "/:locale/(auth)(.*)",
  "/:locale/login(.*)",
  "/:locale/signup(.*)",
  "/api/webhooks/clerk(.*)",
  "/:locale",
]);

const isProtectedRoute = createRouteMatcher([
  "/:locale/(protected)(.*)",
  "/api/profile(.*)",
  "/api/onboarding/(.*)",
]);

export default clerkMiddleware(async (auth, request) => {
  const { pathname } = request.nextUrl;

  // 1) API / TRPC – no intl, optional auth, then let Next handle the route.ts
  if (pathname.startsWith("/api") || pathname.startsWith("/trpc")) {
    if (isProtectedRoute(request) && !isPublicRoute(request)) {
      await auth.protect();
    }
    return NextResponse.next();
  }

  // 2) Other routes – protection + intl
  if (isProtectedRoute(request) && !isPublicRoute(request)) {
    await auth.protect();
  }

  return intlMiddleware(request);
});

// Matcher: exclude /api and /trpc completely
export const config = {
  matcher: [
    "/((?!_next|api|trpc|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
  ],
};
