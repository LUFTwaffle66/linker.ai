import type { SupabaseClient } from '@supabase/supabase-js';
import type {
  ClientOnboardingData,
  FreelancerOnboardingData,
} from './validations';

// =============================================
// Client Profile Functions
// =============================================

export interface ClientProfile {
  id: string;
  user_id?: string | null;
  clerk_user_id: string | null;
  profile_image?: string;
  location?: string;
  website?: string;
  industry?: string;
  company_size?: string;
  about_company?: string;
  project_goals?: string[];
  project_description?: string;
  budget_range?: 'small' | 'medium' | 'large' | 'enterprise';
  timeline?: 'urgent' | 'short' | 'medium' | 'long';
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
}

export async function createClientProfile(
  supabase: SupabaseClient,
  profileId: string | null,
  clerkUserId: string,
  data: ClientOnboardingData,
): Promise<ClientProfile> {
  const { data: profile, error } = await supabase
    .from('profiles')
    .insert({
      clerk_user_id: clerkUserId,
      avatar_url: data.profileImage || null,
      role: 'client',
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create client profile: ${error.message}`);
  }

  return profile as any;
}

export async function updateClientProfile(
  supabase: SupabaseClient,
  profileId: string | null,
  clerkUserId: string,
  data: Partial<ClientOnboardingData>,
): Promise<ClientProfile> {
  const updateData: Record<string, unknown> = {};

  if (data.profileImage !== undefined) updateData.avatar_url = data.profileImage;

  const { data: profile, error } = await supabase
    .from('profiles')
    .update(updateData)
    .eq('clerk_user_id', clerkUserId)
    .eq('role', 'client')
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update client profile: ${error.message}`);
  }

  return profile as any;
}

export async function getClientProfile(
  supabase: SupabaseClient,
  profileId: string | null,
  clerkUserId: string,
): Promise<ClientProfile | null> {
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('clerk_user_id', clerkUserId)
    .eq('role', 'client')
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    throw new Error(`Failed to get client profile: ${error.message}`);
  }

  return profile as any;
}

// =============================================
// Freelancer Profile Functions
// =============================================

export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  tags: string[];
  imageUrl?: string;
  url?: string;
}

export interface WorkExperience {
  position: string;
  company: string;
  period: string;
  description: string;
}

export interface FreelancerProfile {
  id: string;
  user_id?: string | null;
  clerk_user_id: string | null;
  profile_image?: string;
  title?: string;
  location?: string;
  bio?: string;
  experience?: number;
  skills?: string[];
  portfolio?: PortfolioItem[]; // JSONB array field
  work_experience?: WorkExperience[]; // JSONB array field
  hourly_rate?: number;
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
}

export async function createFreelancerProfile(
  supabase: SupabaseClient,
  profileId: string | null,
  clerkUserId: string,
  data: FreelancerOnboardingData,
): Promise<FreelancerProfile> {
  const { data: profile, error } = await supabase
    .from('profiles')
    .insert({
      clerk_user_id: clerkUserId,
      avatar_url: data.profileImage || null,
      role: 'freelancer',
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create freelancer profile: ${error.message}`);
  }

  return profile as any;
}

export async function updateFreelancerProfile(
  supabase: SupabaseClient,
  profileId: string | null,
  clerkUserId: string,
  data: Partial<FreelancerOnboardingData>,
): Promise<FreelancerProfile> {
  const updateData: Record<string, unknown> = {};

  if (data.profileImage !== undefined) updateData.avatar_url = data.profileImage;

  const { data: profile, error } = await supabase
    .from('profiles')
    .update(updateData)
    .eq('clerk_user_id', clerkUserId)
    .eq('role', 'freelancer')
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update freelancer profile: ${error.message}`);
  }

  return profile as any;
}

export async function getFreelancerProfile(
  supabase: SupabaseClient,
  profileId: string | null,
  clerkUserId: string,
): Promise<FreelancerProfile | null> {
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('clerk_user_id', clerkUserId)
    .eq('role', 'freelancer')
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    throw new Error(`Failed to get freelancer profile: ${error.message}`);
  }

  return profile as any;
}
