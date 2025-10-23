import { useMutation, useQuery } from '@tanstack/react-query';
import {
  sendPasswordResetEmail,
  resetPassword,
  verifyResetToken,
  type ForgotPasswordParams,
  type ResetPasswordParams,
} from '../api/password-reset';
import { toast } from 'sonner';

/**
 * Hook to send password reset email
 */
export function useForgotPassword() {
  return useMutation({
    mutationFn: (params: ForgotPasswordParams) => sendPasswordResetEmail(params),
    onSuccess: (data) => {
      toast.success(data.message);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to send reset email');
    },
  });
}

/**
 * Hook to reset password
 */
export function useResetPassword() {
  return useMutation({
    mutationFn: (params: ResetPasswordParams) => resetPassword(params),
    onSuccess: (data) => {
      toast.success(data.message);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to reset password');
    },
  });
}

/**
 * Hook to verify reset token validity
 */
export function useVerifyResetToken() {
  return useQuery({
    queryKey: ['verify-reset-token'],
    queryFn: verifyResetToken,
    retry: false,
    staleTime: 0,
  });
}
