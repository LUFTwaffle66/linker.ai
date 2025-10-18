import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getPaymentMethods, addPaymentMethod, getTaxDocuments } from '../api/payment';
import type { AddPaymentMethodFormData } from '../types';

export const paymentKeys = {
  all: ['payment'] as const,
  freelancerEarnings: () => [...paymentKeys.all, 'freelancer', 'earnings'] as const,
  freelancerContracts: () => [...paymentKeys.all, 'freelancer', 'contracts'] as const,
  freelancerTransactions: () => [...paymentKeys.all, 'freelancer', 'transactions'] as const,
  clientBalance: () => [...paymentKeys.all, 'client', 'balance'] as const,
  clientProjects: () => [...paymentKeys.all, 'client', 'projects'] as const,
  clientTransactions: () => [...paymentKeys.all, 'client', 'transactions'] as const,
  paymentMethods: () => [...paymentKeys.all, 'payment-methods'] as const,
  taxDocuments: () => [...paymentKeys.all, 'tax-documents'] as const,
};

export function usePaymentMethods() {
  return useQuery({
    queryKey: paymentKeys.paymentMethods(),
    queryFn: getPaymentMethods,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useAddPaymentMethod() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: AddPaymentMethodFormData) => addPaymentMethod(data),
    onSuccess: (newPaymentMethod) => {
      queryClient.setQueryData(paymentKeys.paymentMethods(), (old: any) => {
        if (!old) return [newPaymentMethod];
        if (newPaymentMethod.isDefault) {
          const updated = old.map((pm: any) => ({ ...pm, isDefault: false }));
          return [newPaymentMethod, ...updated];
        }
        return [newPaymentMethod, ...old];
      });
    },
  });
}

export function useTaxDocuments() {
  return useQuery({
    queryKey: paymentKeys.taxDocuments(),
    queryFn: getTaxDocuments,
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
}
