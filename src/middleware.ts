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

  // 1) API / TRPC – skip locale handling
  if (pathname.startsWith("/api") || pathname.startsWith("/trpc")) {
    if (isProtectedRoute(request) && !isPublicRoute(request)) {
      await auth.protect();
    }
    return NextResponse.next();
  }

  // 2) Skip intl redirect for paths that will be rewritten (let rewrites handle locale)
  const noRedirectPaths = [
    '/onboarding',
    '/dashboard',
    '/messages',
    '/notifications',
    '/payments',
    '/settings',
    '/projects',
    '/browse',
    '/post-project',
    '/submit-proposal',
    '/freelancer',
    '/client',
  ];

  if (noRedirectPaths.some(path => pathname.startsWith(path))) {
    // Check auth for protected routes
    if (isProtectedRoute(request) && !isPublicRoute(request)) {
      await auth.protect();
    }
    return NextResponse.next();
  }

  // 3) Other routes – apply intl middleware
  if (isProtectedRoute(request) && !isPublicRoute(request)) {
    await auth.protect();
  }

  return intlMiddleware(request);
});

export const config = {
  matcher: [
    "/((?!_next|api|trpc|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/api/(.*)",
    "/trpc/(.*)",
  ],
};