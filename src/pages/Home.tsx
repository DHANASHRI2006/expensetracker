import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Chatbot from '../components/Chatbot';
import FeedbackForm from '../components/FeedbackForm';
import RatingsSummary from '../components/RatingsSummary';
import { ArrowUpRight, DollarSign, PiggyBank, Target, TrendingUp } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const Home: React.FC = () => {
  const { user, isLoggedIn, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState<any[]>([]);
  const [piggyBankBalance, setPiggyBankBalance] = useState(0);
  const [goalsCount, setGoalsCount] = useState(0);
  const [quote, setQuote] = useState('');

  const quotes = [
    "The habit of saving is itself an education; it fosters every virtue, teaches self-denial, cultivates the sense of order, trains to forethought, and so broadens the mind.",
    "Do not save what is left after spending, but spend what is left after saving.",
    "Financial peace isn't the acquisition of stuff. It's learning to live on less than you make, so you can give money back and have money to invest.",
    "A budget is telling your money where to go instead of wondering where it went.",
    "The price of anything is the amount of life you exchange for it.",
    "Money looks better in the bank than on your feet.",
    "You can be young without money, but you can't be old without it.",
    "Never spend your money before you have it.",
    "Beware of little expenses; a small leak will sink a great ship.",
    "It's not your salary that makes you rich, it's your spending habits."
  ];

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    if (user) {
      const savedExpenses = localStorage.getItem(`expenses-${user.id}`);
      if (savedExpenses) {
        setExpenses(JSON.parse(savedExpenses));
      }

      const savedPiggyBank = localStorage.getItem(`piggyBank-${user.id}`);
      if (savedPiggyBank) {
        const { balance } = JSON.parse(savedPiggyBank);
        setPiggyBankBalance(balance);
      }

      const savedGoals = localStorage.getItem(`goals-${user.id}`);
      if (savedGoals) {
        const goals = JSON.parse(savedGoals);
        setGoalsCount(goals.length);
        
        goals.forEach(goal => {
          const isGoalCompleted = goal.currentAmount >= goal.targetAmount;
          
          if (!isGoalCompleted) {
            toast({
              title: "Goal Reminder",
              description: `You're ${((goal.currentAmount / goal.targetAmount) * 100).toFixed(1)}% of the way to your "${goal.title}" goal!`,
              duration: 5000,
            });
          }
        });
      }
    }

    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
  }, [isLoggedIn, navigate, user, toast]);

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const currentMonthExpenses = expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
  });
  
  const totalExpenses = currentMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  
  const categories = [
    { name: "Food", color: "#9b87f5" },
    { name: "Housing", color: "#7E69AB" },
    { name: "Transportation", color: "#6E59A5" },
    { name: "Utilities", color: "#4CAF50" },
    { name: "Entertainment", color: "#FF9800" },
    { name: "Healthcare", color: "#F44336" },
    { name: "Shopping", color: "#3F51B5" },
    { name: "Education", color: "#2196F3" },
    { name: "Personal Care", color: "#009688" },
    { name: "Debt", color: "#795548" },
    { name: "Savings", color: "#607D8B" },
    { name: "Other", color: "#9E9E9E" },
  ];
  
  const chartData = categories.map(category => {
    const categoryTotal = currentMonthExpenses
      .filter(expense => expense.category === category.name)
      .reduce((total, expense) => total + expense.amount, 0);
    
    return {
      name: category.name,
      value: categoryTotal,
      color: category.color
    };
  }).filter(item => item.value > 0);

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar isLoggedIn={true} userInitials={user?.name?.[0] || 'U'} onLogout={handleLogout} />
      
      <main className="flex-grow container-custom py-8">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold">
              Welcome, {user?.name || 'User'}!
            </h1>
            <p className="text-gray-500">
              Here's an overview of your finances
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Monthly Income</CardTitle>
                <DollarSign className="h-4 w-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${user?.income?.toFixed(2) || '0.00'}</div>
                <p className="text-xs text-gray-500 mt-1">Your monthly income after taxes</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Current Expenses</CardTitle>
                <TrendingUp className="h-4 w-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${totalExpenses.toFixed(2)}</div>
                <p className="text-xs text-gray-500 mt-1">
                  {user?.income 
                    ? `${((totalExpenses / user.income) * 100).toFixed(0)}% of your income` 
                    : 'Current month expenses'}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Savings</CardTitle>
                <PiggyBank className="h-4 w-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${piggyBankBalance.toFixed(2)}</div>
                <p className="text-xs text-gray-500 mt-1">Total in your Piggy Bank</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Financial Goals</CardTitle>
                <Target className="h-4 w-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{goalsCount}</div>
                <p className="text-xs text-gray-500 mt-1">
                  {goalsCount === 0 
                    ? 'No goals set yet' 
                    : goalsCount === 1 
                      ? 'Active financial goal' 
                      : 'Active financial goals'}
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Spending Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                {chartData.length > 0 ? (
                  <div className="w-full h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={chartData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                          nameKey="name"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value) => [`$${Number(value).toFixed(2)}`, 'Amount']}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-[300px] text-center">
                    <p className="text-gray-500">No expenses recorded this month.</p>
                    <p className="text-gray-500">Add an expense to see your spending breakdown.</p>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Financial Wisdom</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex flex-col justify-center items-center px-4 text-center">
                  <p className="italic text-gray-600">"{quote}"</p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-purple-light/10 hover:bg-purple-light/20 transition-colors cursor-pointer" onClick={() => navigate('/expenses')}>
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg">Track Expenses</h3>
                  <p className="text-sm text-gray-600">Add and manage your spending</p>
                </div>
                <ArrowUpRight className="h-5 w-5 text-purple" />
              </CardContent>
            </Card>
            
            <Card className="bg-purple-light/10 hover:bg-purple-light/20 transition-colors cursor-pointer" onClick={() => navigate('/piggy-bank')}>
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg">Piggy Bank</h3>
                  <p className="text-sm text-gray-600">Grow your savings securely</p>
                </div>
                <ArrowUpRight className="h-5 w-5 text-purple" />
              </CardContent>
            </Card>
            
            <Card className="bg-purple-light/10 hover:bg-purple-light/20 transition-colors cursor-pointer" onClick={() => navigate('/goals')}>
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg">Set Goals</h3>
                  <p className="text-sm text-gray-600">Plan for your financial future</p>
                </div>
                <ArrowUpRight className="h-5 w-5 text-purple" />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <div className="container-custom py-8 mb-16">
        <h2 className="text-2xl font-bold mb-6">Share Your Thoughts</h2>
        <FeedbackForm />
        <div className="mt-8">
          <RatingsSummary />
        </div>
      </div>
      
      <Chatbot />
    </div>
  );
};

export default Home;
