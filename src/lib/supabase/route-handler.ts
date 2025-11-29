/**
 * Supabase Client for API Route Handlers
 * Uses @supabase/ssr for proper auth handling in Next.js API routes
 */

import { createServerClient } from '@supabase/ssr';
import { auth, currentUser } from '@clerk/nextjs/server';
import { cookies } from 'next/headers';
import type { NextRequest } from 'next/server';
import type { UserRole } from '@/features/auth/types/auth';
import { supabaseAdmin } from './admin';

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
export async function getRouteHandlerUser(): Promise<{
  id: string;
  email?: string | null;
  fullName?: string | null;
  avatarUrl?: string | null;
  role?: UserRole | null;
  companyName?: string | null;
} | null> {
  const { userId } = await auth();

  if (!userId) return null;

  const clerkUser = await currentUser();

  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('email, full_name, avatar_url, role, company_name')
    .eq('clerk_user_id', userId)
    .maybeSingle();

  const role = (profile?.role ?? (clerkUser?.publicMetadata?.role as UserRole | undefined)) ?? null;

  return {
    id: userId,
    email: profile?.email ?? clerkUser?.primaryEmailAddress?.emailAddress ?? null,
    fullName:
      profile?.full_name ??
      (clerkUser?.firstName || clerkUser?.lastName
        ? `${clerkUser?.firstName ?? ''} ${clerkUser?.lastName ?? ''}`.trim()
        : clerkUser?.username ?? null),
    avatarUrl: profile?.avatar_url ?? clerkUser?.imageUrl ?? null,
    role,
    companyName: profile?.company_name ?? null,
  };
}
