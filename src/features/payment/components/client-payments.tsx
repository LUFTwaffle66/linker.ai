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
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
  Wallet,
  Shield,
  DollarSign,
  Briefcase,
  History,
  ArrowDownLeft,
  ArrowUpRight,
  Download,
  Plus,
  Building,
  FileText,
  CheckCircle,
  Lock,
  Clock,
  AlertCircle,
} from 'lucide-react';
import {
  useClientBalance,
  useClientProjects,
  useClientTransactions,
  usePaymentMethods,
  useAddFunds,
  useReleaseFinalPayment,
} from '../hooks';
import { toast } from 'sonner';

export function ClientPayments() {
  const [addFundsAmount, setAddFundsAmount] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [showAddFunds, setShowAddFunds] = useState(false);

  const { data: balance, isLoading: balanceLoading } = useClientBalance();
  const { data: projects, isLoading: projectsLoading } = useClientProjects();
  const { data: transactions, isLoading: transactionsLoading } = useClientTransactions();
  const { data: paymentMethods } = usePaymentMethods();
  const addFundsMutation = useAddFunds();
  const releaseMutation = useReleaseFinalPayment();

  const handleAddFunds = () => {
    const amount = parseFloat(addFundsAmount);
    if (!amount || amount < 10 || !selectedPaymentMethod) {
      toast.error('Please enter a valid amount and select a payment method');
      return;
    }

    addFundsMutation.mutate(
      { amount, paymentMethodId: selectedPaymentMethod },
      {
        onSuccess: () => {
          toast.success('Funds added successfully');
          setShowAddFunds(false);
          setAddFundsAmount('');
        },
        onError: (error) => {
          toast.error(error.message || 'Failed to add funds');
        },
      }
    );
  };

  if (balanceLoading) return <div className="p-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl mb-2">Payments & Billing</h1>
          <p className="text-muted-foreground">
            Manage your payments, escrow accounts, and billing information
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">Account Balance</p>
                <Wallet className="w-5 h-5 text-primary" />
              </div>
              <p className="text-3xl mb-1">${balance?.availableBalance.toLocaleString()}</p>
              <Dialog open={showAddFunds} onOpenChange={setShowAddFunds}>
                <DialogTrigger asChild>
                  <Button variant="link" size="sm" className="h-auto p-0 text-xs text-primary">
                    <Plus className="w-3 h-3 mr-1" />
                    Add Funds
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Funds to Account</DialogTitle>
                    <DialogDescription>Add funds to your account for faster project funding</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="addAmount">Amount</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input
                          id="addAmount"
                          type="number"
                          placeholder="0.00"
                          value={addFundsAmount}
                          onChange={(e) => setAddFundsAmount(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">Minimum: $10 • Maximum: $100,000</p>
                    </div>
                    <div className="space-y-2">
                      <Label>Payment Method</Label>
                      <Select value={selectedPaymentMethod} onValueChange={setSelectedPaymentMethod}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select payment method" />
                        </SelectTrigger>
                        <SelectContent>
                          {paymentMethods?.map((method) => (
                            <SelectItem key={method.id} value={method.id}>
                              {method.type} ****{method.last4}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowAddFunds(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddFunds} disabled={addFundsMutation.isPending}>
                      {addFundsMutation.isPending ? 'Processing...' : 'Add Funds'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">In Escrow</p>
                <Shield className="w-5 h-5 text-cyan-500" />
              </div>
              <p className="text-3xl mb-1">${balance?.escrowBalance.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Protected funds</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">Pending Payments</p>
                <DollarSign className="w-5 h-5 text-muted-foreground" />
              </div>
              <p className="text-3xl mb-1">${balance?.pendingPayments.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Processing</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">Total Spent</p>
                <DollarSign className="w-5 h-5 text-muted-foreground" />
              </div>
              <p className="text-3xl mb-1">${balance?.totalSpent.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Tabs defaultValue="projects" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="projects" className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4" />
                  <span className="hidden sm:inline">Active Projects</span>
                  <span className="sm:hidden">Projects</span>
                </TabsTrigger>
                <TabsTrigger value="history" className="flex items-center gap-2">
                  <History className="w-4 h-4" />
                  <span className="hidden sm:inline">Transaction History</span>
                  <span className="sm:hidden">History</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="projects">
                <Card>
                  <CardHeader>
                    <CardTitle>Active Projects & Escrow</CardTitle>
                    <CardDescription>Manage payments for your ongoing projects</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {projectsLoading ? (
                      <p>Loading...</p>
                    ) : (
                      projects?.map((project, idx) => (
                        <div key={project.id}>
                          <div className="space-y-4">
                            <div>
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <h4 className="font-medium mb-1">{project.projectName}</h4>
                                  <p className="text-sm text-muted-foreground">{project.freelancerName}</p>
                                </div>
                                <div className="text-right">
                                  <Badge variant="secondary">${project.totalBudget.toLocaleString()}</Badge>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    ${project.amountInEscrow.toLocaleString()} in escrow
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-4 text-sm mb-2">
                                <span className="text-muted-foreground">
                                  Paid: <span className="text-foreground font-medium">${project.amountPaid.toLocaleString()}</span>
                                </span>
                                <span className="text-muted-foreground">•</span>
                                <span className="text-muted-foreground">Status: {project.status}</span>
                              </div>
                              <Progress value={(project.amountPaid / project.totalBudget) * 100} className="h-2" />
                            </div>

                            {project.amountInEscrow > 0 && project.status === 'active' && (
                              <Button
                                size="sm"
                                onClick={() => {
                                  releaseMutation.mutate(
                                    { contractId: project.id, amount: project.amountInEscrow },
                                    {
                                      onSuccess: () => toast.success('Payment released successfully'),
                                      onError: (error) => toast.error(error.message || 'Failed to release payment'),
                                    }
                                  );
                                }}
                                disabled={releaseMutation.isPending}
                              >
                                Release Final Payment (${project.amountInEscrow.toLocaleString()})
                              </Button>
                            )}
                          </div>
                          {idx !== (projects?.length || 0) - 1 && <Separator className="mt-6" />}
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
                        <CardDescription>All payments and account activity</CardDescription>
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
                                  transaction.amount > 0
                                    ? 'bg-success-green/10'
                                    : transaction.type === 'deposit'
                                    ? 'bg-cyan-500/10'
                                    : 'bg-primary/10'
                                }`}
                              >
                                {transaction.amount > 0 ? (
                                  <ArrowUpRight className="w-5 h-5 text-success-green" />
                                ) : transaction.type === 'deposit' ? (
                                  <Shield className="w-5 h-5 text-cyan-500" />
                                ) : (
                                  <ArrowDownLeft className="w-5 h-5 text-primary" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium mb-1 truncate">{transaction.description}</p>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                  <span>{new Date(transaction.date).toLocaleDateString()}</span>
                                  {transaction.freelancerName && (
                                    <>
                                      <span>•</span>
                                      <span>{transaction.freelancerName}</span>
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
                        <p className="font-medium mb-1">{method.brand || method.type}</p>
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

            <Card className="border-cyan-500/20 bg-cyan-500/5">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-cyan-600" />
                  <CardTitle>Escrow Protection</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">Your payments are protected by our secure escrow system</p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-cyan-600 mt-0.5 flex-shrink-0" />
                    <span>Funds held securely until project completion</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-cyan-600 mt-0.5 flex-shrink-0" />
                    <span>Release payments only when satisfied</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-cyan-600 mt-0.5 flex-shrink-0" />
                    <span>Dispute resolution support</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
