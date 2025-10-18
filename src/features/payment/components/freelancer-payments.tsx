'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Wallet,
  Clock,
  CheckCircle,
  TrendingUp,
  Briefcase,
  History,
  ArrowDownLeft,
  ArrowUpRight,
  AlertCircle,
  DollarSign,
  Download,
  Plus,
  Building,
  FileText,
} from 'lucide-react';
import {
  useFreelancerEarnings,
  useFreelancerContracts,
  useFreelancerTransactions,
  usePaymentMethods,
  useTaxDocuments,
  useWithdrawFunds,
} from '../hooks';
import { toast } from 'sonner';

export function FreelancerPayments() {
  const [selectedMethod, setSelectedMethod] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');

  const { data: earnings, isLoading: earningsLoading } = useFreelancerEarnings();
  const { data: contracts, isLoading: contractsLoading } = useFreelancerContracts();
  const { data: transactions, isLoading: transactionsLoading } = useFreelancerTransactions();
  const { data: paymentMethods } = usePaymentMethods();
  const { data: taxDocuments } = useTaxDocuments();
  const withdrawMutation = useWithdrawFunds();

  const handleWithdraw = () => {
    const amount = parseFloat(withdrawAmount);
    if (!amount || amount < 10 || !selectedMethod) {
      toast.error('Please enter a valid amount and select a payment method');
      return;
    }

    withdrawMutation.mutate(
      { amount, paymentMethodId: selectedMethod },
      {
        onSuccess: () => {
          toast.success('Withdrawal initiated successfully');
          setWithdrawAmount('');
        },
        onError: (error) => {
          toast.error(error.message || 'Failed to process withdrawal');
        },
      }
    );
  };

  if (earningsLoading) return <div className="p-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl mb-2">Payments & Earnings</h1>
          <p className="text-muted-foreground">
            Manage your earnings, withdrawals, and payment methods
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">Available Balance</p>
                <Wallet className="w-5 h-5 text-primary" />
              </div>
              <p className="text-3xl mb-1">${earnings?.availableBalance.toLocaleString()}</p>
              <p className="text-xs text-success-green">Ready to withdraw</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">Pending</p>
                <Clock className="w-5 h-5 text-amber-500" />
              </div>
              <p className="text-3xl mb-1">${earnings?.pendingClearance.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">In review</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">This Period</p>
                <CheckCircle className="w-5 h-5 text-cyan-500" />
              </div>
              <p className="text-3xl mb-1">${earnings?.totalEarnings.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Current earnings</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">Total Earned</p>
                <TrendingUp className="w-5 h-5 text-success-green" />
              </div>
              <p className="text-3xl mb-1">${earnings?.lifetimeEarnings.toLocaleString()}</p>
              <p className="text-xs text-success-green">All time</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Tabs defaultValue="withdraw" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="withdraw" className="flex items-center gap-2">
                  <Wallet className="w-4 h-4" />
                  <span className="hidden sm:inline">Withdraw</span>
                </TabsTrigger>
                <TabsTrigger value="contracts" className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4" />
                  <span className="hidden sm:inline">Contracts</span>
                </TabsTrigger>
                <TabsTrigger value="history" className="flex items-center gap-2">
                  <History className="w-4 h-4" />
                  <span className="hidden sm:inline">History</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="withdraw">
                <Card>
                  <CardHeader>
                    <CardTitle>Withdraw Funds</CardTitle>
                    <CardDescription>Transfer your available balance to your payment method</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-muted/50 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Available to Withdraw</p>
                          <p className="text-2xl">${earnings?.availableBalance.toLocaleString()}</p>
                        </div>
                        <Wallet className="w-8 h-8 text-primary" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="amount">Withdrawal Amount</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input
                          id="amount"
                          type="number"
                          placeholder="0.00"
                          value={withdrawAmount}
                          onChange={(e) => setWithdrawAmount(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Minimum withdrawal: $10 • Maximum: ${earnings?.availableBalance.toLocaleString()}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="method">Payment Method</Label>
                      <Select value={selectedMethod} onValueChange={setSelectedMethod}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select payment method" />
                        </SelectTrigger>
                        <SelectContent>
                          {paymentMethods?.map((method) => (
                            <SelectItem key={method.id} value={method.id}>
                              {method.type} ****{method.last4}
                              {method.isDefault && ' (Default)'}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-lg p-4">
                      <div className="flex gap-3">
                        <AlertCircle className="w-5 h-5 text-cyan-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium mb-1">Processing Time</p>
                          <p className="text-sm text-muted-foreground">
                            Bank transfers take 3-5 business days. PayPal transfers are instant.
                          </p>
                        </div>
                      </div>
                    </div>

                    <Button
                      className="w-full"
                      size="lg"
                      onClick={handleWithdraw}
                      disabled={!withdrawAmount || parseFloat(withdrawAmount) < 10 || withdrawMutation.isPending}
                    >
                      <ArrowDownLeft className="w-4 h-4 mr-2" />
                      {withdrawMutation.isPending ? 'Processing...' : 'Withdraw Funds'}
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="contracts">
                <Card>
                  <CardHeader>
                    <CardTitle>Active Contracts</CardTitle>
                    <CardDescription>Track payments for your ongoing projects</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {contractsLoading ? (
                      <p>Loading...</p>
                    ) : (
                      contracts?.map((contract, idx) => (
                        <div key={contract.id}>
                          <div className="space-y-4">
                            <div>
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <h4 className="font-medium mb-1">{contract.projectName}</h4>
                                  <p className="text-sm text-muted-foreground">{contract.clientName}</p>
                                </div>
                                <Badge variant="secondary">${contract.totalBudget.toLocaleString()}</Badge>
                              </div>
                              <div className="flex items-center gap-4 text-sm mb-2">
                                <span className="text-muted-foreground">
                                  Earned: <span className="text-foreground font-medium">${contract.amountPaid.toLocaleString()}</span>
                                </span>
                                <span className="text-muted-foreground">•</span>
                                <span className="text-muted-foreground">Status: {contract.status}</span>
                              </div>
                              <Progress value={(contract.amountPaid / contract.totalBudget) * 100} className="h-2" />
                            </div>
                          </div>
                          {idx !== (contracts?.length || 0) - 1 && <Separator className="mt-6" />}
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="history">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Transaction History</CardTitle>
                        <CardDescription>All your payments and withdrawals</CardDescription>
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Export
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {transactionsLoading ? (
                        <p>Loading...</p>
                      ) : (
                        transactions?.map((transaction) => (
                          <div
                            key={transaction.id}
                            className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                          >
                            <div className="flex items-center gap-4 flex-1">
                              <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                  transaction.type === 'payment' ? 'bg-success-green/10' : 'bg-primary/10'
                                }`}
                              >
                                {transaction.type === 'payment' ? (
                                  <ArrowUpRight className="w-5 h-5 text-success-green" />
                                ) : (
                                  <ArrowDownLeft className="w-5 h-5 text-primary" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium mb-1 truncate">{transaction.description}</p>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                  <span>{new Date(transaction.date).toLocaleDateString()}</span>
                                  {transaction.clientName && (
                                    <>
                                      <span>•</span>
                                      <span>{transaction.clientName}</span>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="text-right flex-shrink-0">
                              <p className={`font-medium ${transaction.amount > 0 ? 'text-success-green' : 'text-foreground'}`}>
                                {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toLocaleString()}
                              </p>
                              <Badge variant="secondary" className="mt-1">
                                {transaction.status}
                              </Badge>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Payment Methods</CardTitle>
                  <Button variant="ghost" size="sm">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {paymentMethods?.map((method) => (
                  <div
                    key={method.id}
                    className={`p-4 rounded-lg border ${method.isDefault ? 'border-primary bg-primary/5' : 'border-border'}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${method.isDefault ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                        <Building className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium mb-1">{method.type}</p>
                        <p className="text-sm text-muted-foreground">****{method.last4}</p>
                        {method.isDefault && (
                          <Badge variant="secondary" className="mt-2">
                            Primary
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tax Documents</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {taxDocuments?.map((doc) => (
                  <Button key={doc.id} variant="outline" className="w-full justify-start">
                    <FileText className="w-4 h-4 mr-2" />
                    {doc.type} {doc.year}
                    <Download className="w-4 h-4 ml-auto" />
                  </Button>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
