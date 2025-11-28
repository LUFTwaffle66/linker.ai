import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getClientBalance,
  getClientProjects,
  getClientTransactions,
  addFunds,
  releaseFinalPayment,
} from '../api/payment';
import type { AddFundsFormData, ReleaseFinalPaymentFormData, Transaction } from '../types';
import { paymentKeys } from './use-shared-payments';

export function useClientBalance() {
  return useQuery({
    queryKey: paymentKeys.clientBalance(),
    queryFn: getClientBalance,
    staleTime: 1 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
}

export function useClientProjects() {
  return useQuery({
    queryKey: paymentKeys.clientProjects(),
    queryFn: getClientProjects,
    staleTime: 1 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
}

export function useClientTransactions() {
  return useQuery({
    queryKey: paymentKeys.clientTransactions(),
    queryFn: getClientTransactions,
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
  });
}

export function useAddFunds() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: AddFundsFormData) => addFunds(data),
    onSuccess: (newTransaction) => {
      queryClient.setQueryData<Transaction[]>(
        paymentKeys.clientTransactions(),
        (old) => {
          if (!old) return [newTransaction];
          return [newTransaction, ...old];
        },
      );
      queryClient.invalidateQueries({ queryKey: paymentKeys.clientBalance() });
    },
  });
}

export function useReleaseFinalPayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ReleaseFinalPaymentFormData) => releaseFinalPayment(data),
    onSuccess: (newTransaction) => {
      queryClient.setQueryData<Transaction[]>(
        paymentKeys.clientTransactions(),
        (old) => {
          if (!old) return [newTransaction];
          return [newTransaction, ...old];
        },
      );
      queryClient.invalidateQueries({ queryKey: paymentKeys.clientBalance() });
      queryClient.invalidateQueries({ queryKey: paymentKeys.clientProjects() });
    },
  });
}
