import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getUserProfile,
  updateUserProfile,
  uploadProfilePicture,
  removeProfilePicture,
} from '../api/settings';
import type { ProfileUpdateFormData } from '../types';

export const settingsKeys = {
  all: ['settings'] as const,
  profile: () => [...settingsKeys.all, 'profile'] as const,
  security: () => [...settingsKeys.all, 'security'] as const,
  notifications: () => [...settingsKeys.all, 'notifications'] as const,
  preferences: () => [...settingsKeys.all, 'preferences'] as const,
};

/**
 * Hook to fetch user profile
 */
export function useUserProfile() {
  return useQuery({
    queryKey: settingsKeys.profile(),
    queryFn: getUserProfile,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook to update user profile
 */
export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<ProfileUpdateFormData>) => updateUserProfile(data),
    onSuccess: (updatedProfile) => {
      queryClient.setQueryData(settingsKeys.profile(), updatedProfile);
    },
  });
}

/**
 * Hook to upload profile picture
 */
export function useUploadProfilePicture() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => uploadProfilePicture(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingsKeys.profile() });
    },
  });
}

/**
 * Hook to remove profile picture
 */
export function useRemoveProfilePicture() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeProfilePicture,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingsKeys.profile() });
    },
  });
}
