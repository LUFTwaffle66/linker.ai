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
  try {
    const user = await getRouteHandlerUser();

    if (!user) {
      return { success: false, error: 'Unauthorized' };
    }

    if (user.role !== 'freelancer') {
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
    const existingProfile = await getFreelancerProfile(supabase, user.id);

    const profile = existingProfile
      ? await updateFreelancerProfile(supabase, user.id, validationResult.data)
      : await createFreelancerProfile(supabase, user.id, validationResult.data);

    revalidatePath('/dashboard');
    revalidatePath('/onboarding');

    return { success: true, profile };
  } catch (error) {
    console.error('Freelancer onboarding error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to save freelancer profile',
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
    const profile = await getFreelancerProfile(supabase, user.id);

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
