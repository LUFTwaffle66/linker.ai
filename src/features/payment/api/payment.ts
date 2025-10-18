import type {
  PaymentMethod,
  FreelancerEarnings,
  ClientBalance,
  Transaction,
  ActiveContract,
  TaxDocument,
  WithdrawalFormData,
  AddFundsFormData,
  AddPaymentMethodFormData,
  ReleaseFinalPaymentFormData,
} from '../types';
import {
  MOCK_PAYMENT_METHODS,
  MOCK_FREELANCER_EARNINGS,
  MOCK_CLIENT_BALANCE,
  MOCK_FREELANCER_CONTRACTS,
  MOCK_CLIENT_PROJECTS,
  MOCK_FREELANCER_TRANSACTIONS,
  MOCK_CLIENT_TRANSACTIONS,
  MOCK_TAX_DOCUMENTS,
} from './mock-data';

const simulateDelay = (ms: number = 500) => new Promise((resolve) => setTimeout(resolve, ms));

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

let paymentMethods = [...MOCK_PAYMENT_METHODS];
let freelancerEarnings = { ...MOCK_FREELANCER_EARNINGS };
let clientBalance = { ...MOCK_CLIENT_BALANCE };
let freelancerContracts = [...MOCK_FREELANCER_CONTRACTS];
let clientProjects = [...MOCK_CLIENT_PROJECTS];
let freelancerTransactions = [...MOCK_FREELANCER_TRANSACTIONS];
let clientTransactions = [...MOCK_CLIENT_TRANSACTIONS];
let taxDocuments = [...MOCK_TAX_DOCUMENTS];

export const getFreelancerEarnings = async (): Promise<FreelancerEarnings> => {
  await simulateDelay();
  return freelancerEarnings;
};

export const getFreelancerContracts = async (): Promise<ActiveContract[]> => {
  await simulateDelay();
  return freelancerContracts.sort(
    (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  );
};

export const getFreelancerTransactions = async (): Promise<Transaction[]> => {
  await simulateDelay();
  return freelancerTransactions.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
};

export const withdrawFunds = async (data: WithdrawalFormData): Promise<Transaction> => {
  await simulateDelay(800);
  if (data.amount > freelancerEarnings.availableBalance) {
    throw new ApiError(400, 'Insufficient balance');
  }
  const paymentMethod = paymentMethods.find((pm) => pm.id === data.paymentMethodId);
  if (!paymentMethod) {
    throw new ApiError(404, 'Payment method not found');
  }
  const newTransaction: Transaction = {
    id: `txn-${Date.now()}`,
    type: 'withdrawal',
    amount: -data.amount,
    status: 'pending',
    description: 'Withdrawal to payment method',
    date: new Date(),
    paymentMethod: `${paymentMethod.type} ****${paymentMethod.last4}`,
  };
  freelancerTransactions.unshift(newTransaction);
  freelancerEarnings.availableBalance -= data.amount;
  return newTransaction;
};

export const getClientBalance = async (): Promise<ClientBalance> => {
  await simulateDelay();
  return clientBalance;
};

export const getClientProjects = async (): Promise<ActiveContract[]> => {
  await simulateDelay();
  return clientProjects.sort(
    (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  );
};

export const getClientTransactions = async (): Promise<Transaction[]> => {
  await simulateDelay();
  return clientTransactions.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
};

export const addFunds = async (data: AddFundsFormData): Promise<Transaction> => {
  await simulateDelay(800);
  const paymentMethod = paymentMethods.find((pm) => pm.id === data.paymentMethodId);
  if (!paymentMethod) {
    throw new ApiError(404, 'Payment method not found');
  }
  const newTransaction: Transaction = {
    id: `txn-${Date.now()}`,
    type: 'deposit',
    amount: data.amount,
    status: 'completed',
    description: 'Account funding',
    date: new Date(),
    paymentMethod: `${paymentMethod.brand || paymentMethod.type} ****${paymentMethod.last4}`,
  };
  clientTransactions.unshift(newTransaction);
  clientBalance.availableBalance += data.amount;
  return newTransaction;
};

export const releaseFinalPayment = async (
  data: ReleaseFinalPaymentFormData
): Promise<Transaction> => {
  await simulateDelay(800);
  const project = clientProjects.find((p) => p.id === data.contractId);
  if (!project) {
    throw new ApiError(404, 'Project not found');
  }
  if (data.amount > project.amountInEscrow) {
    throw new ApiError(400, 'Amount exceeds escrow balance');
  }
  const newTransaction: Transaction = {
    id: `txn-${Date.now()}`,
    type: 'payment',
    amount: -data.amount,
    status: 'completed',
    description: 'Final payment release',
    date: new Date(),
    projectName: project.projectName,
    freelancerName: project.freelancerName,
    paymentMethod: 'Escrow',
  };
  clientTransactions.unshift(newTransaction);
  project.amountPaid += data.amount;
  project.amountInEscrow -= data.amount;
  clientBalance.escrowBalance -= data.amount;
  if (project.amountInEscrow === 0) {
    project.status = 'completed';
  }
  return newTransaction;
};

export const getPaymentMethods = async (): Promise<PaymentMethod[]> => {
  await simulateDelay();
  return paymentMethods.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
};

export const addPaymentMethod = async (
  data: AddPaymentMethodFormData
): Promise<PaymentMethod> => {
  await simulateDelay(800);
  if (data.isDefault) {
    paymentMethods = paymentMethods.map((pm) => ({ ...pm, isDefault: false }));
  }
  let last4 = '';
  let brand: string | undefined;
  let accountName: string | undefined;
  let email: string | undefined;
  let expiryDate: string | undefined;
  if (data.type === 'card' && data.cardNumber) {
    last4 = data.cardNumber.slice(-4);
    brand = 'Visa';
    expiryDate = data.expiryDate;
  } else if (data.type === 'bank' && data.accountNumber) {
    last4 = data.accountNumber.slice(-4);
    accountName = data.accountName;
  } else if (data.type === 'paypal') {
    email = data.email;
  }
  const newPaymentMethod: PaymentMethod = {
    id: `pm-${Date.now()}`,
    type: data.type,
    last4,
    brand,
    accountName,
    email,
    isDefault: data.isDefault,
    expiryDate,
    createdAt: new Date(),
  };
  paymentMethods.unshift(newPaymentMethod);
  return newPaymentMethod;
};

export const getTaxDocuments = async (): Promise<TaxDocument[]> => {
  await simulateDelay();
  return taxDocuments.sort((a, b) => b.year - a.year);
};
