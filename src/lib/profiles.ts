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
  const { data: profile, error } = await supabaseAdmin
    .from('profiles')
    .select('id, clerk_user_id, email, full_name, avatar_url, role, company_name')
    .eq('clerk_user_id', clerkUserId)
    .maybeSingle();

  if (error && error.code !== 'PGRST116') {
    return { profile: null, error };
  }

  return { profile, error: null };
}

export async function upsertProfileFromClerk(
  clerkUserId: string,
  clerkUser: ClerkProfileSource | null,
) {
  const profileData = buildProfilePayload(clerkUserId, clerkUser);
  const lookupResult = await findProfileByClerkId(clerkUserId);

  if (lookupResult.error) {
    return { profile: null, error: lookupResult.error };
  }

  if (lookupResult.profile) {
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .update({
        email: profileData.email,
        full_name: profileData.full_name,
        avatar_url: profileData.avatar_url,
        role: profileData.role,
        company_name: profileData.company_name,
      })
      .eq('clerk_user_id', clerkUserId)
      .select('id, clerk_user_id, email, full_name, avatar_url, role, company_name')
      .single();

    return { profile: data, error };
  }

  const { data, error } = await supabaseAdmin
    .from('profiles')
    .insert({
      clerk_user_id: clerkUserId,
      email: profileData.email,
      full_name: profileData.full_name,
      avatar_url: profileData.avatar_url,
      role: profileData.role,
      company_name: profileData.company_name,
    })
    .select('id, clerk_user_id, email, full_name, avatar_url, role, company_name')
    .single();

  return { profile: data, error };
}

export async function fetchProfileByClerkId(clerkUserId: string) {
  const { data, error } = await supabaseAdmin
    .from('profiles')
    .select('id, clerk_user_id, email, full_name, avatar_url, role, company_name')
    .eq('clerk_user_id', clerkUserId)
    .maybeSingle();

  return { data, error };
}

export async function updateProfileByClerkId(
  clerkUserId: string,
  updates: Record<string, unknown>,
) {
  const { data, error } = await supabaseAdmin
    .from('profiles')
    .update(updates)
    .eq('clerk_user_id', clerkUserId)
    .select('id, clerk_user_id, email, full_name, avatar_url, role, company_name')
    .single();

  return { data, error };
}
