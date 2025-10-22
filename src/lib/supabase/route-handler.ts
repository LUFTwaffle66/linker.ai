/**
 * Supabase Client for API Route Handlers
 * Uses @supabase/ssr for proper auth handling in Next.js API routes
 */

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { NextRequest } from 'next/server';

/**
 * Create Supabase client for API route handlers
 * This version properly handles cookies in API routes
 */
export async function createRouteHandlerClient(request?: NextRequest) {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            try {
              cookieStore.set(name, value, options);
            } catch (error) {
              // Handle cookie setting errors
              console.error('Error setting cookie:', error);
            }
          });
        },
      },
    }
  );
}

/**
 * Get authenticated user in API route
 */
export async function getRouteHandlerUser() {
  const supabase = await createRouteHandlerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  // Get full user profile from database
  const { data: profile } = await supabase
    .from('users')
    .select('id, email, full_name, avatar_url, role, company_name')
    .eq('id', user.id)
    .single();

  if (!profile) return null;

  return {
    id: profile.id,
    email: profile.email,
    fullName: profile.full_name,
    avatarUrl: profile.avatar_url,
    role: profile.role,
    companyName: profile.company_name,
  };
}
