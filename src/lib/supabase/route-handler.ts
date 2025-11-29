// src/lib/supabase/route-handler.ts

import { auth, currentUser } from '@clerk/nextjs/server';
import { supabaseAdmin } from './admin';
import type { UserRole } from '@/features/auth/types/auth';

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

  let profile: any = null;

  try {
    // 1) zkusíme client_profiles
    const { data: clientProfile, error: clientError } = await supabaseAdmin
      .from('client_profiles')
      .select('clerk_user_id, email, full_name, avatar_url, role, company_name')
      .eq('clerk_user_id', userId)
      .maybeSingle();

    if (clientError && clientError.code !== 'PGRST116') {
      console.error('getRouteHandlerUser client profile error', clientError);
    }

    // 2) zkusíme freelancer_profiles, jen když není client profil
    const { data: freelancerProfile, error: freelancerError } = !clientProfile
      ? await supabaseAdmin
          .from('freelancer_profiles')
          .select('clerk_user_id, email, full_name, avatar_url, role')
          .eq('clerk_user_id', userId)
          .maybeSingle()
      : { data: null, error: null };

    if (freelancerError && freelancerError.code !== 'PGRST116') {
      console.error('getRouteHandlerUser freelancer profile error', freelancerError);
    }

    profile = clientProfile ?? freelancerProfile ?? null;
  } catch (err) {
    console.error('getRouteHandlerUser unexpected error', err);
  }

  const role =
    (profile?.role as UserRole | undefined) ??
    (clerkUser?.publicMetadata?.role as UserRole | undefined) ??
    null;

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
