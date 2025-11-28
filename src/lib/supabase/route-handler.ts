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
export async function getRouteHandlerUser() {
  const { userId } = auth();

  if (!userId) return null;

  // Get user profile from Supabase using Clerk user ID
  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('id, clerk_user_id, email, full_name, avatar_url, role, company_name')
    .eq('clerk_user_id', userId)
    .maybeSingle();

  if (!profile) return null;

  return {
    id: profile.clerk_user_id, // Use Clerk user ID as the primary ID
    email: profile.email,
    fullName: profile.full_name,
    avatarUrl: profile.avatar_url,
    role: profile.role as UserRole,
    companyName: profile.company_name,
  };
}
