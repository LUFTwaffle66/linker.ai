import { supabase } from '@/lib/supabase';

export interface ForgotPasswordParams {
  email: string;
}

export interface ResetPasswordParams {
  password: string;
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(params: ForgotPasswordParams) {
  const { email } = params;

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });

  if (error) {
    throw new Error(error.message);
  }

  return { success: true, message: 'Password reset email sent successfully' };
}

/**
 * Reset password with new password
 * This is called after user clicks the link in their email
 */
export async function resetPassword(params: ResetPasswordParams) {
  const { password } = params;

  const { error } = await supabase.auth.updateUser({
    password,
  });

  if (error) {
    throw new Error(error.message);
  }

  return { success: true, message: 'Password updated successfully' };
}

/**
 * Verify if user has a valid reset token
 */
export async function verifyResetToken() {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error || !session) {
    throw new Error('Invalid or expired reset link');
  }

  return { valid: true, session };
}
