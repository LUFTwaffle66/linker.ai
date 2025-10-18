import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getPreferenceSettings, updatePreferenceSettings } from '../api/settings';
import type { PreferenceSettingsFormData } from '../types';
import { settingsKeys } from './use-profile';

/**
 * Hook to fetch preference settings
 */
export function usePreferenceSettings() {
  return useQuery({
    queryKey: settingsKeys.preferences(),
    queryFn: getPreferenceSettings,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

/**
 * Hook to update preference settings
 */
export function useUpdatePreferenceSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<PreferenceSettingsFormData>) => updatePreferenceSettings(data),
    onSuccess: (updatedSettings) => {
      queryClient.setQueryData(settingsKeys.preferences(), updatedSettings);
    },
  });
}
