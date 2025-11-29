import { auth, currentUser } from '@clerk/nextjs/server';
import { supabaseAdmin } from './supabase/admin';
import type { UserRole } from '@/features/auth/types/auth';

export interface ClerkProfile {
  id?: string;
  clerk_user_id: string;
  email?: string | null;
  full_name?: string | null;
  avatar_url?: string | null;
  company_name?: string | null;
  role?: UserRole | null;
}

export async function getCurrentUser() {
  const { userId } = await auth();
  if (!userId) return null;

  const clerkUser = await currentUser();

  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('*')
    .eq('clerk_user_id', userId)
    .maybeSingle();

  return {
    clerkUser,
    profile,
  };
}

export async function requireAuth() {
  const { userId } = await auth();
  if (!userId) {
    throw new Error('Unauthorized');
  }
  return userId;
}

export async function requireRole(role: UserRole) {
  const current = await getCurrentUser();

  if (!current) {
    throw new Error('Unauthorized');
  }

  const { profile } = current;

  if (!profile || profile.role !== role) {
    throw new Error('Unauthorized');
  }

  return profile;
}
