import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import type { UserRole } from '../types/auth';

/**
 * Server-side Supabase Auth utilities
 * Use these in Server Components, Server Actions, and Route Handlers
 */

/**
 * Get the current session on the server
 * Returns null if not authenticated
 */
export async function getServerSession() {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session;
}

/**
 * Get the current user on the server
 * Returns null if not authenticated
 */
export async function getServerUser() {
  const supabase = await createClient();
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
    role: profile.role as UserRole,
    companyName: profile.company_name,
  };
}

/**
 * Require authentication on the server
 * Redirects to login if not authenticated
 */
export async function requireAuth(redirectTo: string = '/login') {
  const session = await getServerSession();
  if (!session) {
    redirect(redirectTo);
  }
  return session;
}

/**
 * Check if user is authenticated
 * Returns boolean
 */
export async function isAuthenticated() {
  const session = await getServerSession();
  return !!session;
}

/**
 * Require specific role on the server
 * Redirects if role doesn't match
 */
export async function requireRole(role: UserRole, redirectTo: string = '/unauthorized') {
  const user = await getServerUser();
  if (!user || user.role !== role) {
    redirect(redirectTo);
  }
  return user;
}
