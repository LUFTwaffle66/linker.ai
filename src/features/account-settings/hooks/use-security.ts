import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getSecuritySettings,
  changePassword,
  enableTwoFactor,
  disableTwoFactor,
  revokeSession,
} from '../api/settings';
import type { PasswordChangeFormData } from '../types';
import { settingsKeys } from './use-profile';

/**
 * Hook to fetch security settings
 */
export function useSecuritySettings() {
  return useQuery({
    queryKey: settingsKeys.security(),
    queryFn: getSecuritySettings,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

/**
 * Hook to change password
 */
export function useChangePassword() {
  return useMutation({
    mutationFn: (data: PasswordChangeFormData) => changePassword(data),
  });
}

/**
 * Hook to enable two-factor authentication
 */
export function useEnableTwoFactor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (verificationCode: string) => enableTwoFactor(verificationCode),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingsKeys.security() });
    },
  });
}

/**
 * Hook to disable two-factor authentication
 */
export function useDisableTwoFactor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: disableTwoFactor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingsKeys.security() });
    },
  });
}

/**
 * Hook to revoke a session
 */
export function useRevokeSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sessionId: string) => revokeSession(sessionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingsKeys.security() });
    },
  });
}
