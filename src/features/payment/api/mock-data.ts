import type {
  PaymentMethod,
  FreelancerEarnings,
  ClientBalance,
  Transaction,
  ActiveContract,
  TaxDocument,
} from '../types';

export const MOCK_PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: 'pm-1',
    type: 'card',
    last4: '4242',
    brand: 'Visa',
    isDefault: true,
    expiryDate: '12/25',
    createdAt: new Date('2024-01-01'),
  },
  {
    id: 'pm-2',
    type: 'bank',
    last4: '6789',
    accountName: 'Chase Checking',
    isDefault: false,
    createdAt: new Date('2024-02-15'),
  },
  {
    id: 'pm-3',
    type: 'paypal',
    last4: '',
    email: 'user@example.com',
    isDefault: false,
    createdAt: new Date('2024-03-10'),
  },
];

export const MOCK_FREELANCER_EARNINGS: FreelancerEarnings = {
  totalEarnings: 45250.75,
  availableBalance: 12450.5,
  pendingClearance: 8300.25,
  lifetimeEarnings: 125680.0,
  lastPayout: {
    amount: 5000.0,
    date: new Date('2024-01-10'),
  },
};

export const MOCK_CLIENT_BALANCE: ClientBalance = {
  availableBalance: 25000.0,
  escrowBalance: 15750.0,
  totalSpent: 87950.5,
  pendingPayments: 3250.0,
};

export const MOCK_FREELANCER_CONTRACTS: ActiveContract[] = [
  {
    id: 'contract-1',
    projectName: 'E-commerce Website Redesign',
    clientName: 'Sarah Johnson',
    totalBudget: 15000.0,
    amountPaid: 10000.0,
    amountInEscrow: 5000.0,
    status: 'active',
    startDate: new Date('2024-01-15'),
    endDate: new Date('2024-03-15'),
  },
  {
    id: 'contract-2',
    projectName: 'Mobile App Development',
    clientName: 'Tech Startup Inc',
    totalBudget: 25000.0,
    amountPaid: 15000.0,
    amountInEscrow: 10000.0,
    status: 'active',
    startDate: new Date('2023-12-01'),
    endDate: new Date('2024-04-01'),
  },
];

export const MOCK_CLIENT_PROJECTS: ActiveContract[] = [
  {
    id: 'project-1',
    projectName: 'Website Redesign',
    freelancerName: 'Michael Chen',
    totalBudget: 12000.0,
    amountPaid: 8000.0,
    amountInEscrow: 4000.0,
    status: 'active',
    startDate: new Date('2024-01-10'),
    endDate: new Date('2024-03-10'),
  },
  {
    id: 'project-2',
    projectName: 'Content Writing',
    freelancerName: 'Emily Davis',
    totalBudget: 3000.0,
    amountPaid: 1500.0,
    amountInEscrow: 1500.0,
    status: 'active',
    startDate: new Date('2024-01-20'),
  },
];

export const MOCK_FREELANCER_TRANSACTIONS: Transaction[] = [
  {
    id: 'txn-f1',
    type: 'payment',
    amount: 5000.0,
    status: 'completed',
    description: 'Milestone 3 payment',
    date: new Date('2024-01-15T10:30:00'),
    projectName: 'E-commerce Website Redesign',
    clientName: 'Sarah Johnson',
    paymentMethod: 'Escrow Release',
  },
  {
    id: 'txn-f2',
    type: 'withdrawal',
    amount: -2500.0,
    status: 'completed',
    description: 'Bank withdrawal',
    date: new Date('2024-01-14T14:20:00'),
    paymentMethod: 'Chase Checking ****6789',
  },
  {
    id: 'txn-f3',
    type: 'payment',
    amount: 3500.0,
    status: 'pending',
    description: 'Milestone 2 payment',
    date: new Date('2024-01-13T09:15:00'),
    projectName: 'Mobile App Development',
    clientName: 'Tech Startup Inc',
    paymentMethod: 'Pending Clearance',
  },
];

export const MOCK_CLIENT_TRANSACTIONS: Transaction[] = [
  {
    id: 'txn-c1',
    type: 'deposit',
    amount: 4000.0,
    status: 'completed',
    description: 'Milestone 3 funding',
    date: new Date('2024-01-15T08:00:00'),
    projectName: 'Website Redesign',
    freelancerName: 'Michael Chen',
    paymentMethod: 'Visa ****4242',
  },
  {
    id: 'txn-c2',
    type: 'payment',
    amount: -4000.0,
    status: 'completed',
    description: 'Milestone 2 release',
    date: new Date('2024-01-14T11:30:00'),
    projectName: 'Website Redesign',
    freelancerName: 'Michael Chen',
    paymentMethod: 'Escrow',
  },
];

export const MOCK_TAX_DOCUMENTS: TaxDocument[] = [
  {
    id: 'tax-1',
    year: 2024,
    type: '1099-K',
    amount: 125680.0,
    downloadUrl: '/api/tax-documents/2024-1099k.pdf',
    generatedAt: new Date('2024-01-31'),
  },
];
