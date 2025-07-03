import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { PiggyBank as PiggyBankIcon, ArrowUpCircle, ArrowDownCircle, History, LockKeyhole, ArrowRight, DollarSign, Euro, PoundSterling, IndianRupee, JapaneseYen } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { format } from 'date-fns';

interface Transaction {
  id: string;
  amount: number;
  type: 'deposit' | 'withdrawal';
  date: string;
}

interface PiggyBankState {
  balance: number;
  password: string | null;
  transactions: Transaction[];
}

const currencies = [
  { symbol: '$', code: 'USD', icon: DollarSign },
  { symbol: '€', code: 'EUR', icon: Euro },
  { symbol: '£', code: 'GBP', icon: PoundSterling },
  { symbol: '₹', code: 'INR', icon: IndianRupee },
  { symbol: '¥', code: 'JPY', icon: JapaneseYen },
];

const exchangeRates = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  INR: 83.24,
  JPY: 151.61,
};

const PiggyBank: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const [piggyBank, setPiggyBank] = useState<PiggyBankState>({
    balance: 0,
    password: null,
    transactions: []
  });
  const [amount, setAmount] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [isDepositDialogOpen, setIsDepositDialogOpen] = useState(false);
  const [isWithdrawDialogOpen, setIsWithdrawDialogOpen] = useState(false);
  const [isHistoryDialogOpen, setIsHistoryDialogOpen] = useState(false);
  const [transactionPassword, setTransactionPassword] = useState('');
  const [transactionType, setTransactionType] = useState<'deposit' | 'withdrawal'>('deposit');
  const [selectedCurrency, setSelectedCurrency] = useState('USD');

  const convertAmount = (amount: number, fromCurrency: string, toCurrency: string) => {
    const inUSD = amount / exchangeRates[fromCurrency as keyof typeof exchangeRates];
    return inUSD * exchangeRates[toCurrency as keyof typeof exchangeRates];
  };

  const formatAmount = (amount: number) => {
    const currency = currencies.find(c => c.code === selectedCurrency);
    const convertedAmount = convertAmount(amount, 'USD', selectedCurrency);
    return `${currency?.symbol}${convertedAmount.toFixed(2)}`;
  };

  const displayBalance = formatAmount(piggyBank.balance);

  useEffect(() => {
    if (user) {
      const savedPiggyBank = localStorage.getItem(`piggyBank-${user.id}`);
      if (savedPiggyBank) {
        setPiggyBank(JSON.parse(savedPiggyBank));
      }
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(`piggyBank-${user.id}`, JSON.stringify(piggyBank));
    }
  }, [piggyBank, user]);

  const handleSetPassword = () => {
    if (password !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please ensure your passwords match.",
        variant: "destructive"
      });
      return;
    }

    if (password.length < 4) {
      toast({
        title: "Password too short",
        description: "Please use a password with at least 4 characters.",
        variant: "destructive"
      });
      return;
    }

    setPiggyBank({
      ...piggyBank,
      password
    });

    setPassword('');
    setConfirmPassword('');
    setIsPasswordDialogOpen(false);

    toast({
      title: "Password Set",
      description: "Your Piggy Bank is now password protected.",
    });
  };

  const handleTransaction = () => {
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid positive amount.",
        variant: "destructive"
      });
      return;
    }

    if (piggyBank.password && piggyBank.password !== transactionPassword) {
      toast({
        title: "Incorrect Password",
        description: "The password you entered is incorrect.",
        variant: "destructive"
      });
      return;
    }

    const amountValue = parseFloat(amount);

    if (transactionType === 'withdrawal' && amountValue > piggyBank.balance) {
      toast({
        title: "Insufficient Funds",
        description: "You don't have enough money in your Piggy Bank.",
        variant: "destructive"
      });
      return;
    }

    const newTransaction: Transaction = {
      id: `transaction-${Date.now()}`,
      amount: amountValue,
      type: transactionType,
      date: new Date().toISOString()
    };

    const newBalance = transactionType === 'deposit' 
      ? piggyBank.balance + amountValue 
      : piggyBank.balance - amountValue;

    setPiggyBank({
      ...piggyBank,
      balance: newBalance,
      transactions: [...piggyBank.transactions, newTransaction]
    });

    setAmount('');
    setTransactionPassword('');
    setIsDepositDialogOpen(false);
    setIsWithdrawDialogOpen(false);

    toast({
      title: transactionType === 'deposit' ? "Deposit Successful" : "Withdrawal Successful",
      description: `$${amountValue.toFixed(2)} has been ${transactionType === 'deposit' ? 'added to' : 'withdrawn from'} your Piggy Bank.`,
    });
  };

  const handleDialogOpen = (type: 'deposit' | 'withdrawal') => {
    setTransactionType(type);
    setAmount('');
    setTransactionPassword('');
    
    if (type === 'deposit') {
      setIsDepositDialogOpen(true);
    } else {
      setIsWithdrawDialogOpen(true);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold">Piggy Bank</h2>
        <p className="text-gray-500">
          Securely save and manage your money
        </p>
      </div>

      <Card className="border-2 border-purple/30">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 rounded-full bg-purple/20 flex items-center justify-center">
              <PiggyBankIcon className="h-10 w-10 text-purple" />
            </div>
          </div>
          <CardTitle className="text-2xl">Your Savings</CardTitle>
          <CardDescription>
            {piggyBank.password 
              ? "Your Piggy Bank is password protected" 
              : "Set a password to protect your Piggy Bank"}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center pb-6">
          <div className="mb-4">
            <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
              <SelectTrigger className="w-[180px] mx-auto">
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                {currencies.map((currency) => (
                  <SelectItem key={currency.code} value={currency.code}>
                    <div className="flex items-center">
                      <currency.icon className="mr-2 h-4 w-4" />
                      {currency.code} - {currency.symbol}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <h3 className="text-5xl font-bold gradient-text mb-6">
            {displayBalance}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              variant="outline" 
              className="border-purple text-purple hover:bg-purple hover:text-white"
              onClick={() => handleDialogOpen('deposit')}
            >
              <ArrowUpCircle className="mr-2 h-4 w-4" /> Deposit
            </Button>
            <Button 
              variant="outline" 
              className="border-purple text-purple hover:bg-purple hover:text-white"
              onClick={() => handleDialogOpen('withdrawal')}
              disabled={piggyBank.balance <= 0}
            >
              <ArrowDownCircle className="mr-2 h-4 w-4" /> Withdraw
            </Button>
            <Button 
              variant="outline" 
              className="border-purple text-purple hover:bg-purple hover:text-white"
              onClick={() => setIsHistoryDialogOpen(true)}
            >
              <History className="mr-2 h-4 w-4" /> History
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          {!piggyBank.password ? (
            <Button 
              onClick={() => setIsPasswordDialogOpen(true)}
              className="bg-purple hover:bg-purple-dark"
            >
              <LockKeyhole className="mr-2 h-4 w-4" /> Set Password Protection
            </Button>
          ) : (
            <Button 
              variant="ghost"
              onClick={() => setIsPasswordDialogOpen(true)}
              className="text-sm text-gray-500 hover:text-purple"
            >
              Change Password
            </Button>
          )}
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Savings Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-soft-green/30 border border-purple/20">
              <h4 className="font-semibold mb-2">The 50/30/20 Rule</h4>
              <p className="text-sm text-gray-600">
                Allocate 50% of your income to needs, 30% to wants, and 20% to savings. 
                This simple rule helps maintain a balanced budget.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-soft-yellow/30 border border-purple/20">
              <h4 className="font-semibold mb-2">Pay Yourself First</h4>
              <p className="text-sm text-gray-600">
                Before paying bills or other expenses, set aside a portion of your income for savings. 
                This ensures that saving becomes a priority.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-soft-orange/30 border border-purple/20">
              <h4 className="font-semibold mb-2">Create an Emergency Fund</h4>
              <p className="text-sm text-gray-600">
                Aim to save 3-6 months of living expenses in an emergency fund. 
                This provides financial security during unexpected situations.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {piggyBank.password ? "Change Password" : "Set Password Protection"}
            </DialogTitle>
            <DialogDescription>
              {piggyBank.password 
                ? "Enter your current password and create a new password for your Piggy Bank." 
                : "Create a password to protect your Piggy Bank."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {piggyBank.password && (
              <div className="space-y-2">
                <label htmlFor="currentPassword" className="text-sm font-medium">
                  Current Password
                </label>
                <Input
                  id="currentPassword"
                  type="password"
                  placeholder="Enter current password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </div>
            )}
            <div className="space-y-2">
              <label htmlFor="newPassword" className="text-sm font-medium">
                {piggyBank.password ? "New Password" : "Password"}
              </label>
              <Input
                id="newPassword"
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="confirmNewPassword" className="text-sm font-medium">
                Confirm Password
              </label>
              <Input
                id="confirmNewPassword"
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPasswordDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSetPassword} className="bg-purple hover:bg-purple-dark">
              {piggyBank.password ? "Update Password" : "Set Password"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDepositDialogOpen} onOpenChange={setIsDepositDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Deposit to Piggy Bank</DialogTitle>
            <DialogDescription>
              Add money to your savings.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="depositAmount" className="text-sm font-medium">
                Amount ($)
              </label>
              <Input
                id="depositAmount"
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="0.01"
                step="0.01"
              />
            </div>
            {piggyBank.password && (
              <div className="space-y-2">
                <label htmlFor="depositPassword" className="text-sm font-medium">
                  Piggy Bank Password
                </label>
                <Input
                  id="depositPassword"
                  type="password"
                  placeholder="Enter your password"
                  value={transactionPassword}
                  onChange={(e) => setTransactionPassword(e.target.value)}
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDepositDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleTransaction} className="bg-purple hover:bg-purple-dark">
              Deposit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isWithdrawDialogOpen} onOpenChange={setIsWithdrawDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Withdraw from Piggy Bank</DialogTitle>
            <DialogDescription>
              Take money from your savings.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="withdrawAmount" className="text-sm font-medium">
                Amount ($)
              </label>
              <Input
                id="withdrawAmount"
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="0.01"
                step="0.01"
                max={piggyBank.balance.toString()}
              />
              <p className="text-xs text-gray-500">
                Available Balance: ${piggyBank.balance.toFixed(2)}
              </p>
            </div>
            {piggyBank.password && (
              <div className="space-y-2">
                <label htmlFor="withdrawPassword" className="text-sm font-medium">
                  Piggy Bank Password
                </label>
                <Input
                  id="withdrawPassword"
                  type="password"
                  placeholder="Enter your password"
                  value={transactionPassword}
                  onChange={(e) => setTransactionPassword(e.target.value)}
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsWithdrawDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleTransaction} className="bg-purple hover:bg-purple-dark">
              Withdraw
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isHistoryDialogOpen} onOpenChange={setIsHistoryDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Transaction History</DialogTitle>
            <DialogDescription>
              View all your Piggy Bank deposits and withdrawals.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 max-h-[50vh] overflow-y-auto">
            {piggyBank.transactions.length > 0 ? (
              <div className="space-y-3">
                {piggyBank.transactions
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .map((transaction) => (
                    <div 
                      key={transaction.id} 
                      className="flex justify-between items-center p-3 rounded-md border border-gray-200"
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          transaction.type === 'deposit' ? 'bg-green-100' : 'bg-red-100'
                        }`}>
                          {transaction.type === 'deposit' ? (
                            <ArrowUpCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <ArrowDownCircle className="h-4 w-4 text-red-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-sm">
                            {transaction.type === 'deposit' ? 'Deposit' : 'Withdrawal'}
                          </p>
                          <p className="text-xs text-gray-500">
                            {format(new Date(transaction.date), 'MMM d, yyyy - h:mm a')}
                          </p>
                        </div>
                      </div>
                      <span className={`font-semibold ${
                        transaction.type === 'deposit' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.type === 'deposit' ? '+' : '-'}${transaction.amount.toFixed(2)}
                      </span>
                    </div>
                  ))
                }
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No transactions yet.
              </div>
            )}
          </div>
          <DialogFooter>
            <Button onClick={() => setIsHistoryDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PiggyBank;
