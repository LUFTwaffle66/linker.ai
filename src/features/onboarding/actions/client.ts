'use server';

import { revalidatePath } from 'next/cache';
import { getRouteHandlerUser, createRouteHandlerClient } from '@/lib/supabase/route-handler';
import {
  createClientProfile,
  updateClientProfile,
  getClientProfile,
  type ClientProfile,
} from '../lib/onboarding-utils';
import {
  clientOnboardingSchema,
  type ClientOnboardingData,
} from '../lib/validations';

export async function saveClientOnboarding(
  formData: ClientOnboardingData,
): Promise<{ success: boolean; profile?: ClientProfile; error?: string; details?: any }> {
  try {
    const user = await getRouteHandlerUser();

    if (!user) {
      return { success: false, error: 'Unauthorized' };
    }

    if (user.role !== 'client') {
      return { success: false, error: 'Only clients can create client profiles' };
    }

    const validationResult = clientOnboardingSchema.safeParse(formData);

    if (!validationResult.success) {
      return {
        success: false,
        error: 'Validation failed',
        details: validationResult.error.format(),
      };
    }

    const supabase = await createRouteHandlerClient();
    const existingProfile = await getClientProfile(
      supabase,
      user.profileId,
      user.clerkId,
    );

    const profile = existingProfile
      ? await updateClientProfile(
          supabase,
          user.profileId,
          user.clerkId,
          validationResult.data,
        )
      : await createClientProfile(
          supabase,
          user.profileId,
          user.clerkId,
          validationResult.data,
        );

    revalidatePath('/dashboard');
    revalidatePath('/onboarding');

    return { success: true, profile };
  } catch (error) {
    console.error('Client onboarding error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to save client profile',
    };
  }
}

export async function getClientOnboardingData(): Promise<{
  profile?: ClientProfile;
  error?: string;
}> {
  try {
    const user = await getRouteHandlerUser();

    if (!user) {
      return { error: 'Unauthorized' };
    }

    if (user.role !== 'client') {
      return { error: 'Only clients can access client profiles' };
    }

    const supabase = await createRouteHandlerClient();
    const profile = await getClientProfile(supabase, user.profileId, user.clerkId);

    if (!profile) {
      return { error: 'Profile not found' };
    }

    return { profile };
  } catch (error) {
    console.error('Get client profile error:', error);
    return {
      error: error instanceof Error ? error.message : 'Failed to get client profile',
    };
  }
}
