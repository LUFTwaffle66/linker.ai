import { supabase } from '@/lib/supabase';

export interface ResendVerificationEmailParams {
  email: string;
}

/**
 * Resend verification email
 */
export async function resendVerificationEmail(params: ResendVerificationEmailParams) {
  const { email } = params;

  const { error } = await supabase.auth.resend({
    type: 'signup',
    email,
    options: {
      emailRedirectTo: `${window.location.origin}/auth/callback`,
    },
  });

  if (error) {
    throw new Error(error.message);
  }

  return { success: true, message: 'Verification email sent successfully' };
}

/**
 * Check if user's email is verified
 */
export async function checkEmailVerified() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Error('User not found');
  }

  return {
    isVerified: !!user.email_confirmed_at,
    email: user.email,
    user,
  };
}

/**
 * Check if user has completed onboarding
 */
export async function checkOnboardingStatus(userId: string) {
  try {
    // Check if user has a profile in either client_profiles or freelancer_profiles
    const { data: clientProfile, error: clientError } = await supabase
      .from('client_profiles')
      .select('clerk_user_id')
      .eq('clerk_user_id', userId)
      .maybeSingle();

    if (clientError && clientError.code !== 'PGRST116') {
      // TODO: tighten onboarding checks once Supabase onboarding tables are reliable
      console.error('Failed to check client profile', clientError);
    }

    const { data: freelancerProfile, error: freelancerError } = await supabase
      .from('freelancer_profiles')
      .select('clerk_user_id')
      .eq('clerk_user_id', userId)
      .maybeSingle();

    if (freelancerError && freelancerError.code !== 'PGRST116') {
      // TODO: tighten onboarding checks once Supabase onboarding tables are reliable
      console.error('Failed to check freelancer profile', freelancerError);
    }

    return {
      // Temporarily treat onboarding as complete even if Supabase tables are missing
      hasCompletedOnboarding: true,
      profileType: clientProfile ? 'client' : freelancerProfile ? 'freelancer' : null,
    };
  } catch (error) {
    // TODO: tighten onboarding checks once Supabase onboarding tables are reliable
    console.error('Unexpected onboarding status check error', error);
    return {
      hasCompletedOnboarding: true,
      profileType: null,
    };
  }
}
