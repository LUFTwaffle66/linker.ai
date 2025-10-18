import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getNotificationSettings, updateNotificationSettings } from '../api/settings';
import type { NotificationSettingsFormData } from '../types';
import { settingsKeys } from './use-profile';

/**
 * Hook to fetch notification settings
 */
export function useNotificationSettings() {
  return useQuery({
    queryKey: settingsKeys.notifications(),
    queryFn: getNotificationSettings,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

/**
 * Hook to update notification settings
 */
export function useUpdateNotificationSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<NotificationSettingsFormData>) =>
      updateNotificationSettings(data),
    onSuccess: (updatedSettings) => {
      queryClient.setQueryData(settingsKeys.notifications(), updatedSettings);
    },
  });
}
