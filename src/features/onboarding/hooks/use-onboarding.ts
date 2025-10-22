import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  saveClientOnboarding,
  saveFreelancerOnboarding,
  getClientOnboarding,
  getFreelancerOnboarding,
} from '../api/onboarding';
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
    mutationFn: (data: ClientOnboardingData) => saveClientOnboarding(data),
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
    queryFn: getClientOnboarding,
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
    mutationFn: (data: FreelancerOnboardingData) => saveFreelancerOnboarding(data),
    onSuccess: async (data) => {
      // Invalidate and refetch freelancer onboarding query
      await queryClient.invalidateQueries({ queryKey: onboardingKeys.freelancer() });
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

export const useFreelancerOnboarding = () => {
  return useQuery({
    queryKey: onboardingKeys.freelancer(),
    queryFn: getFreelancerOnboarding,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
