import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getFreelancerEarnings,
  getFreelancerContracts,
  getFreelancerTransactions,
  withdrawFunds,
} from '../api/payment';
import type { Transaction, WithdrawalFormData } from '../types';
import { paymentKeys } from './use-shared-payments';

export function useFreelancerEarnings() {
  return useQuery({
    queryKey: paymentKeys.freelancerEarnings(),
    queryFn: getFreelancerEarnings,
    staleTime: 1 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
}

export function useFreelancerContracts() {
  return useQuery({
    queryKey: paymentKeys.freelancerContracts(),
    queryFn: getFreelancerContracts,
    staleTime: 1 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
}

export function useFreelancerTransactions() {
  return useQuery({
    queryKey: paymentKeys.freelancerTransactions(),
    queryFn: getFreelancerTransactions,
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
  });
}

export function useWithdrawFunds() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: WithdrawalFormData) => withdrawFunds(data),
    onSuccess: (newTransaction) => {
      queryClient.setQueryData<Transaction[]>(
        paymentKeys.freelancerTransactions(),
        (old) => {
          if (!old) return [newTransaction];
          return [newTransaction, ...old];
        },
      );
      queryClient.invalidateQueries({ queryKey: paymentKeys.freelancerEarnings() });
    },
  });
}
