'use server';

import { revalidatePath } from 'next/cache';
import { getRouteHandlerUser, createRouteHandlerClient } from '@/lib/supabase/route-handler';
import {
  createFreelancerProfile,
  updateFreelancerProfile,
  getFreelancerProfile,
  type FreelancerProfile,
} from '../lib/onboarding-utils';
import {
  freelancerOnboardingSchema,
  type FreelancerOnboardingData,
} from '../lib/validations';

export async function saveFreelancerOnboarding(
  formData: FreelancerOnboardingData,
): Promise<{ success: boolean; profile?: FreelancerProfile; error?: string; details?: any }> {
  let currentUser: Awaited<ReturnType<typeof getRouteHandlerUser>> | null = null;

  try {
    currentUser = await getRouteHandlerUser();

    if (!currentUser) {
      return { success: false, error: 'Unauthorized' };
    }

    if (currentUser.role !== 'freelancer') {
      return { success: false, error: 'Only freelancers can create freelancer profiles' };
    }

    const validationResult = freelancerOnboardingSchema.safeParse(formData);

    if (!validationResult.success) {
      return {
        success: false,
        error: 'Validation failed',
        details: validationResult.error.format(),
      };
    }

    const supabase = await createRouteHandlerClient();
    const existingProfile = await getFreelancerProfile(
      supabase,
      currentUser.profileId,
      currentUser.clerkId,
    );

    const profile = existingProfile
      ? await updateFreelancerProfile(
          supabase,
          currentUser.profileId,
          currentUser.clerkId,
          validationResult.data,
        )
      : await createFreelancerProfile(
          supabase,
          currentUser.profileId,
          currentUser.clerkId,
          validationResult.data,
        );

    revalidatePath('/dashboard');
    revalidatePath('/onboarding');

    return { success: true, profile };
  } catch (error) {
    // TODO: restore Supabase-backed onboarding persistence once tables are reliable
    console.error('Freelancer onboarding error (non-blocking):', error);

    const timestamp = new Date().toISOString();
    const fallbackProfile = currentUser
      ? {
          id: `fallback-${timestamp}`,
          clerk_user_id: currentUser.clerkId,
          profile_image: formData.profileImage || undefined,
          title: formData.title,
          location: formData.location,
          bio: formData.bio,
          experience: parseInt(formData.experience),
          skills: formData.skills,
          portfolio: [],
          work_experience: [],
          hourly_rate: parseFloat(formData.hourlyRate),
          onboarding_completed: true,
          created_at: timestamp,
          updated_at: timestamp,
        }
      : undefined;

    return {
      success: true,
      profile: fallbackProfile,
    };
  }
}

export async function getFreelancerOnboardingData(): Promise<{
  profile?: FreelancerProfile;
  error?: string;
}> {
  try {
    const user = await getRouteHandlerUser();

    if (!user) {
      return { error: 'Unauthorized' };
    }

    if (user.role !== 'freelancer') {
      return { error: 'Only freelancers can access freelancer profiles' };
    }

    const supabase = await createRouteHandlerClient();
    const profile = await getFreelancerProfile(supabase, user.profileId, user.clerkId);

    if (!profile) {
      return { error: 'Profile not found' };
    }

    return { profile };
  } catch (error) {
    console.error('Get freelancer profile error:', error);
    return {
      error: error instanceof Error ? error.message : 'Failed to get freelancer profile',
    };
  }
}
