import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  saveClientOnboarding,
  saveFreelancerOnboarding,
  getClientOnboardingData,
  getFreelancerOnboardingData,
} from '../actions';
import type {
  ClientOnboardingData,
  FreelancerOnboardingData,
} from '../lib/validations';
import type { ClientProfile, FreelancerProfile } from '../lib/onboarding-utils';

// =============================================
// Query Keys
// =============================================

export const onboardingKeys = {
  all: ['onboarding'] as const,
  client: () => [...onboardingKeys.all, 'client'] as const,
  freelancer: () => [...onboardingKeys.all, 'freelancer'] as const,
};

// =============================================
// Client Onboarding Hooks
// =============================================

type UseSaveClientOnboardingOptions = {
  onSuccess?: (data: { success: boolean; profile: ClientProfile }) => void | Promise<void>;
  onError?: (error: Error) => void;
};

export const useSaveClientOnboarding = ({
  onSuccess,
  onError,
}: UseSaveClientOnboardingOptions = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ClientOnboardingData) => {
      const result = await saveClientOnboarding(data);

      if (!result.success) {
        throw new Error(result.error || 'Failed to save client profile');
      }

      return result as { success: true; profile: ClientProfile };
    },
    onSuccess: async (data) => {
      // Invalidate and refetch client onboarding query
      await queryClient.invalidateQueries({ queryKey: onboardingKeys.client() });
      if (onSuccess) {
        await onSuccess(data);
      }
    },
    onError: (error: Error) => {
      if (onError) {
        onError(error);
      }
    },
  });
};

export const useClientOnboarding = () => {
  return useQuery({
    queryKey: onboardingKeys.client(),
    queryFn: async () => {
      const result = await getClientOnboardingData();

      if (result.error || !result.profile) {
        throw new Error(result.error || 'Client profile not found');
      }

      return result.profile;
    },
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// =============================================
// Freelancer Onboarding Hooks
// =============================================

type UseSaveFreelancerOnboardingOptions = {
  onSuccess?: (data: { success: boolean; profile: FreelancerProfile }) => void | Promise<void>;
  onError?: (error: Error) => void;
};

export const useSaveFreelancerOnboarding = ({
  onSuccess,
  onError,
}: UseSaveFreelancerOnboardingOptions = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: FreelancerOnboardingData) => {
      console.log('FREELANCER SUBMIT DATA', data);
      const result = await saveFreelancerOnboarding(data);
      console.log('FREELANCER SUBMIT RESULT', result);

      if (!result.success) {
        throw new Error(result.error || 'Failed to save freelancer profile');
      }

      return result as { success: true; profile: FreelancerProfile };
    },
    onSuccess: async (data) => {
      console.log('FREELANCER SUBMIT SUCCESS', data);
      // Invalidate and refetch freelancer onboarding query
      await queryClient.invalidateQueries({ queryKey: onboardingKeys.freelancer() });
      if (onSuccess) {
        await onSuccess(data);
      }
    },
    onError: (error: Error) => {
      console.error('FREELANCER SUBMIT ERROR', error);
      if (onError) {
        onError(error);
      }
    },
  });
};

export const useFreelancerOnboarding = () => {
  return useQuery({
    queryKey: onboardingKeys.freelancer(),
    queryFn: async () => {
      const result = await getFreelancerOnboardingData();

      if (result.error || !result.profile) {
        throw new Error(result.error || 'Freelancer profile not found');
      }

      return result.profile;
    },
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
