import { z } from 'zod';

export type PaymentMethodType = 'card' | 'bank' | 'paypal';
export type TransactionType = 'payment' | 'withdrawal' | 'deposit' | 'refund' | 'fee';
export type TransactionStatus = 'completed' | 'pending' | 'failed';
export type ContractStatus = 'active' | 'completed' | 'pending';

export interface PaymentMethod {
  id: string;
  type: PaymentMethodType;
  last4: string;
  brand?: string;
  accountName?: string;
  email?: string;
  isDefault: boolean;
  expiryDate?: string;
  createdAt: Date;
}

export interface FreelancerEarnings {
  totalEarnings: number;
  availableBalance: number;
  pendingClearance: number;
  lifetimeEarnings: number;
  lastPayout?: {
    amount: number;
    date: Date;
  };
}

export interface ClientBalance {
  availableBalance: number;
  escrowBalance: number;
  totalSpent: number;
  pendingPayments: number;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  status: TransactionStatus;
  description: string;
  date: Date;
  projectName?: string;
  clientName?: string;
  freelancerName?: string;
  paymentMethod?: string;
}

export interface ActiveContract {
  id: string;
  projectName: string;
  clientName?: string;
  freelancerName?: string;
  totalBudget: number;
  amountPaid: number;
  amountInEscrow: number;
  status: ContractStatus;
  startDate: Date;
  endDate?: Date;
}

export interface TaxDocument {
  id: string;
  year: number;
  type: string;
  amount: number;
  downloadUrl: string;
  generatedAt: Date;
}

export const withdrawalSchema = z.object({
  amount: z.number().min(10, 'Minimum withdrawal is $10').max(100000),
  paymentMethodId: z.string().min(1, 'Payment method is required'),
});

export type WithdrawalFormData = z.infer<typeof withdrawalSchema>;

export const addFundsSchema = z.object({
  amount: z.number().min(10, 'Minimum amount is $10').max(100000),
  paymentMethodId: z.string().min(1, 'Payment method is required'),
});

export type AddFundsFormData = z.infer<typeof addFundsSchema>;

export const addPaymentMethodSchema = z.object({
  type: z.enum(['card', 'bank', 'paypal']),
  cardNumber: z.string().optional(),
  expiryDate: z.string().optional(),
  cvv: z.string().optional(),
  accountNumber: z.string().optional(),
  routingNumber: z.string().optional(),
  accountName: z.string().optional(),
  email: z.string().email().optional(),
  isDefault: z.boolean().default(false),
});

export type AddPaymentMethodFormData = z.infer<typeof addPaymentMethodSchema>;

export const releaseFinalPaymentSchema = z.object({
  contractId: z.string().min(1),
  amount: z.number().min(1),
  rating: z.number().min(1).max(5).optional(),
  review: z.string().max(1000).optional(),
});

export type ReleaseFinalPaymentFormData = z.infer<typeof releaseFinalPaymentSchema>;
