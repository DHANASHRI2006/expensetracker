
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from '@/context/AuthContext';
import { DollarSign } from 'lucide-react';

const SetIncomeForm: React.FC = () => {
  const [income, setIncome] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { setIncome: updateIncome } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!income || Number(income) <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid income amount",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      updateIncome(Number(income));
      toast({
        title: "Income Set!",
        description: "Your monthly income has been successfully set.",
      });
      navigate('/expenses');
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-light/10 to-soft-green/30 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 rounded-full bg-purple flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl text-center font-bold">Set Your Monthly Income</CardTitle>
          <CardDescription className="text-center">
            This helps us create a personalized budget for you
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="income">Monthly Income</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                <Input 
                  id="income" 
                  type="number" 
                  className="pl-8"
                  placeholder="0.00" 
                  value={income}
                  onChange={(e) => setIncome(e.target.value)}
                  required
                  min="1"
                  step="0.01"
                />
              </div>
              <p className="text-sm text-gray-500 mt-1">Enter your total monthly income after taxes</p>
            </div>
            <Button type="submit" className="w-full bg-purple hover:bg-purple-dark" disabled={isLoading}>
              {isLoading ? "Saving..." : "Continue"}
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <p className="text-xs text-gray-500 w-full text-center">
            You can always update your income later in your profile settings.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SetIncomeForm;
