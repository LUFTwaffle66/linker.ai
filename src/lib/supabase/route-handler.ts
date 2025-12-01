// src/lib/supabase/route-handler.ts

import { auth, currentUser } from '@clerk/nextjs/server';
import { upsertProfileFromClerk } from '../profiles';
import { supabaseAdmin } from './admin';
import type { UserRole } from '@/features/auth/types/auth';

export interface RouteHandlerUser {
  clerkId: string;
  profileId: string | null;
  email?: string | null;
  fullName?: string | null;
  avatarUrl?: string | null;
  role?: UserRole | null;
  companyName?: string | null;
}

export async function getRouteHandlerUser(): Promise<RouteHandlerUser | null> {
  const { userId } = await auth();
  if (!userId) return null;

  const clerkUser = await currentUser();

  const { profile, error } = await upsertProfileFromClerk(userId, clerkUser);

  if (error) {
    console.error('getRouteHandlerUser profile error', error);
  }

  const role =
    (profile?.role as UserRole | undefined) ??
    (clerkUser?.publicMetadata?.role as UserRole | undefined) ??
    null;

  return {
    clerkId: userId,
    profileId: profile?.id ?? null,
    email: profile?.email ?? clerkUser?.primaryEmailAddress?.emailAddress ?? null,
    fullName:
      profile?.full_name ??
      (clerkUser?.fullName
        ? clerkUser.fullName
        : clerkUser?.firstName || clerkUser?.lastName
          ? `${clerkUser?.firstName ?? ''} ${clerkUser?.lastName ?? ''}`.trim()
          : clerkUser?.username ?? null),
    avatarUrl: profile?.avatar_url ?? clerkUser?.imageUrl ?? null,
    role,
    companyName: profile?.company_name ?? null,
  };
}

export async function createRouteHandlerClient() {
  return supabaseAdmin;
}
