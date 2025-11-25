import createIntlMiddleware from 'next-intl/middleware';
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { routing } from './i18n/routing';

const intlMiddleware = createIntlMiddleware(routing);

const isPublicRoute = createRouteMatcher([
  '/:locale/(auth)(.*)',
  '/:locale/login',
  '/:locale/signup',
  '/api/webhooks/clerk(.*)',
  '/:locale',
]);

const isProtectedRoute = createRouteMatcher([
  '/:locale/(protected)(.*)',
  '/api/profile(.*)',
]);

export default clerkMiddleware((auth, request) => {
  if (isProtectedRoute(request) && !isPublicRoute(request)) {
    auth().protect();
  }

  return intlMiddleware(request);
});

export const config = {
  matcher: [
    '/((?!.*\\..*|_next|_vercel).*)',
    '/(api|trpc)(.*)',
  ],
};
