/**
 * Supabase Client for API Route Handlers with Clerk Auth
 * Uses Clerk for authentication and Supabase only for data
 */

import { auth } from '@clerk/nextjs/server';
import { supabaseAdmin } from './admin';
import type { UserRole } from '@/features/auth/types/auth';

/**
 * Create Supabase client for API route handlers
 * This uses the admin client since we're not using Supabase Auth
 */
export async function createRouteHandlerClient() {
  return supabaseAdmin;
}

/**
 * Get authenticated user in API route using Clerk
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

  const { data: profile, error } = await supabaseAdmin
    .from('profiles')
    .select('clerk_user_id, email, full_name, avatar_url, role, company_name')
    .eq('clerk_user_id', userId)
    .maybeSingle();

  // pokud je jiná chyba než "nenalezeno", logni ji
  if (error && error.code !== 'PGRST116') {
    console.error('getRouteHandlerUser profile error', error);
    throw error;
  }

  // profil ještě neexistuje – vrať jen základní info
  if (!profile) {
    return {
      id: userId,
      email: null,
      fullName: null,
      avatarUrl: null,
      role: null,
      companyName: null,
    };
  }

  return {
    id: profile.clerk_user_id,
    email: profile.email ?? null,
    fullName: profile.full_name ?? null,
    avatarUrl: profile.avatar_url ?? null,
    role: (profile.role as UserRole | null) ?? null,
    companyName: profile.company_name ?? null,
  };
}