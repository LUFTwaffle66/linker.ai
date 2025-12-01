/**
 * Supabase Client for Server Components and Server Actions
 * Uses @supabase/ssr for proper auth handling in Next.js App Router
 */

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createClient() {
  const cookieStore = await cookies();

  const removeSupabaseCookies = () => {
    const authCookieNames = cookieStore
      .getAll()
      .map((cookie) => cookie.name)
      .filter(
        (name) =>
          name.startsWith('sb-') ||
          name.includes('supabase-auth-token') ||
          name.includes('supabase-session'),
      );

    for (const name of authCookieNames) {
      try {
        cookieStore.set(name, '', { path: '/', maxAge: 0 });
      } catch (error) {
        // Readonly cookies in some rendering modes; best-effort cleanup.
        console.warn('Unable to clear Supabase auth cookie', name, error);
      }
    }
  };

  const getClient = () =>
    createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch {
              // The `setAll` method was called from a Server Component.
              // This can be ignored if you have middleware refreshing
              // user sessions.
            }
          },
        },
      }
    );

  try {
    return getClient();
  } catch (error) {
    if (error instanceof SyntaxError) {
      // Corrupted auth cookies can break JSON parsing in Supabase helpers.
      removeSupabaseCookies();
      return getClient();
    }
    throw error;
  }
}
