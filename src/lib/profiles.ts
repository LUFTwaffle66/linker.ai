import { supabaseAdmin } from './supabase/admin';
import type { UserRole } from '@/features/auth/types/auth';

type ClerkProfileSource = {
  emailAddresses?: { emailAddress?: string | null }[];
  email_addresses?: { email_address?: string | null }[];
  fullName?: string | null;
  firstName?: string | null;
  first_name?: string | null;
  lastName?: string | null;
  last_name?: string | null;
  username?: string | null;
  imageUrl?: string | null;
  image_url?: string | null;
  publicMetadata?: Record<string, unknown> | null;
  public_metadata?: Record<string, unknown> | null;
};

export interface BaseProfile {
  id: string;
  clerk_user_id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  role: UserRole | null;
  company_name: string | null;
}

function buildProfilePayload(clerkUserId: string, clerkUser: ClerkProfileSource | null) {
  const email =
    clerkUser?.emailAddresses?.[0]?.emailAddress ??
    clerkUser?.email_addresses?.[0]?.email_address ??
    null;

  const firstName = clerkUser?.fullName
    ? null
    : clerkUser?.firstName ?? clerkUser?.first_name ?? '';
  const lastName = clerkUser?.fullName
    ? null
    : clerkUser?.lastName ?? clerkUser?.last_name ?? '';
  const hasNameParts = !!(`${firstName}`.trim() || `${lastName}`.trim());

  const fullName =
    clerkUser?.fullName ??
    (hasNameParts
      ? `${firstName ?? ''} ${lastName ?? ''}`.trim()
      : clerkUser?.username ?? email);

  return {
    clerk_user_id: clerkUserId,
    email,
    full_name: fullName ?? null,
    avatar_url: clerkUser?.imageUrl ?? clerkUser?.image_url ?? null,
    role:
      ((clerkUser?.publicMetadata ?? clerkUser?.public_metadata)?.role as UserRole | null) ??
      null,
    company_name:
      ((clerkUser?.publicMetadata ?? clerkUser?.public_metadata)?.companyName as
        string | null) ?? null,
  } satisfies Partial<BaseProfile>;
}

async function findProfileByClerkId(clerkUserId: string) {
  const { data: freelancerProfile, error: freelancerError } = await supabaseAdmin
    .from('freelancer_profiles')
    .select('id, user_id, clerk_user_id')
    .eq('clerk_user_id', clerkUserId)
    .maybeSingle();

  if (freelancerProfile) {
    return { profile: freelancerProfile, table: 'freelancer_profiles' as const, error: null };
  }

  const { data: clientProfile, error: clientError } = await supabaseAdmin
    .from('client_profiles')
    .select('id, user_id, clerk_user_id')
    .eq('clerk_user_id', clerkUserId)
    .maybeSingle();

  if (clientProfile) {
    return { profile: clientProfile, table: 'client_profiles' as const, error: null };
  }

  const firstError =
    freelancerError && freelancerError.code !== 'PGRST116'
      ? freelancerError
      : clientError && clientError.code !== 'PGRST116'
        ? clientError
        : null;

  return { profile: null, table: null, error: firstError } as const;
}

export async function upsertProfileFromClerk(
  clerkUserId: string,
  clerkUser: ClerkProfileSource | null,
) {
  const profileData = buildProfilePayload(clerkUserId, clerkUser);
  const lookupResult = await findProfileByClerkId(clerkUserId);

  if (lookupResult.error) {
    return { profile: profileData as BaseProfile, error: lookupResult.error };
  }

  return {
    profile: lookupResult.profile
      ? ({
          id: lookupResult.profile.id,
          clerk_user_id: clerkUserId,
          email: profileData.email ?? null,
          full_name: profileData.full_name ?? null,
          avatar_url: profileData.avatar_url ?? null,
          role: profileData.role ?? null,
          company_name: profileData.company_name ?? null,
        } satisfies BaseProfile)
      : ({ id: clerkUserId, ...profileData } satisfies BaseProfile),
    error: null,
  };
}

export async function fetchProfileByClerkId(clerkUserId: string) {
  const lookupResult = await findProfileByClerkId(clerkUserId);

  if (!lookupResult.profile) {
    return { data: null, error: lookupResult.error };
  }

  const { data: user, error } = await supabaseAdmin
    .from('users')
    .select('id, email, full_name, avatar_url, role, company_name')
    .eq('id', lookupResult.profile.user_id)
    .maybeSingle();

  return {
    data: user
      ? ({
          ...user,
          clerk_user_id: clerkUserId,
        } satisfies BaseProfile)
      : null,
    error,
  };
}

export async function updateProfileByClerkId(
  clerkUserId: string,
  updates: Record<string, unknown>,
) {
  const lookupResult = await findProfileByClerkId(clerkUserId);

  if (!lookupResult.profile) {
    return { data: null, error: lookupResult.error };
  }

  const { data, error } = await supabaseAdmin
    .from('users')
    .update(updates)
    .eq('id', lookupResult.profile.user_id)
    .select('id, email, full_name, avatar_url, role, company_name')
    .single();

  return {
    data: data
      ? ({
          ...data,
          clerk_user_id: clerkUserId,
        } satisfies BaseProfile)
      : null,
    error,
  };
}
