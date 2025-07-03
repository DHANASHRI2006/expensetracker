
import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { CalendarIcon, Plus, ArrowDownCircle, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { format } from 'date-fns';
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from '@/lib/utils';

interface MonthlyIncome {
  month: number;
  year: number;
  amount: number;
}

interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  month?: number;
  year?: number;
}

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

const SPENDING_SUGGESTIONS = {
  "Food": "Try meal prepping to reduce eating out expenses.",
  "Housing": "Consider negotiating your rent or refinancing your mortgage.",
  "Transportation": "Use public transportation or carpooling when possible.",
  "Utilities": "Switch to energy-efficient appliances and bulbs.",
  "Entertainment": "Look for free local events or streaming service deals.",
  "Healthcare": "Check for generic medication options and preventive care.",
  "Shopping": "Wait 24 hours before making non-essential purchases.",
  "Education": "Research scholarships and financial aid options.",
  "Personal Care": "DIY some of your personal care routines.",
  "Debt": "Focus on high-interest debt first and consider consolidation.",
  "Savings": "Set up automatic transfers to your savings account.",
  "Other": "Review these expenses to see if they can be categorized or reduced."
};

// Helper function to get random motivational quotes
const getRandomQuote = () => {
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
  return quotes[Math.floor(Math.random() * quotes.length)];
};

const ExpenseTracker: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState<Date>(new Date());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [quote, setQuote] = useState(getRandomQuote());
  const [highestCategory, setHighestCategory] = useState('');
  const [savingsSuggestion, setSavingsSuggestion] = useState('');
  const [monthlyIncomes, setMonthlyIncomes] = useState<MonthlyIncome[]>([]);
  const [yearlyInsights, setYearlyInsights] = useState<string>('');
  const [recentExpenses, setRecentExpenses] = useState<Expense[]>([]);

  // Load expenses from localStorage on component mount
  useEffect(() => {
    if (user) {
      const savedExpenses = localStorage.getItem(`expenses-${user.id}`);
      if (savedExpenses) {
        setExpenses(JSON.parse(savedExpenses));
      }
    }
  }, [user]);

  // Load monthly incomes from localStorage
  useEffect(() => {
    if (user) {
      const savedIncomes = localStorage.getItem(`monthly-incomes-${user.id}`);
      if (savedIncomes) {
        setMonthlyIncomes(JSON.parse(savedIncomes));
      }
    }
  }, [user]);

  // Calculate highest spending category and set suggestion
  useEffect(() => {
    if (expenses.length > 0) {
      const categorySums = categories.map(cat => ({
        category: cat.name,
        total: expenses
          .filter(exp => exp.category === cat.name)
          .reduce((sum, exp) => sum + exp.amount, 0)
      }));
      
      const highest = categorySums.reduce((prev, current) => 
        (prev.total > current.total) ? prev : current
      );
      
      setHighestCategory(highest.category);
      setSavingsSuggestion(SPENDING_SUGGESTIONS[highest.category as keyof typeof SPENDING_SUGGESTIONS]);
    }
  }, [expenses]);

  // Calculate yearly insights showing which month had highest spending
  useEffect(() => {
    const calculateYearlyInsights = () => {
      if (expenses.length === 0) return;

      // Group expenses by month
      const monthlyExpenses = expenses.reduce((acc: { [key: string]: number }, expense) => {
        const date = new Date(expense.date);
        const monthYear = `${date.getMonth()}-${date.getFullYear()}`;
        acc[monthYear] = (acc[monthYear] || 0) + expense.amount;
        return acc;
      }, {});

      // Find the month with highest spending
      const entries = Object.entries(monthlyExpenses);
      if (entries.length === 0) return;
      
      const highestMonth = entries.sort(([, a], [, b]) => b - a)[0];
      const [monthYearKey, amount] = highestMonth;
      const [month, year] = monthYearKey.split('-').map(Number);
      
      // Get month name
      const monthName = new Date(year, month).toLocaleString('default', { month: 'long' });

      // Category breakdown for the year
      const yearExpenses = expenses.reduce((acc: { [key: string]: number }, expense) => {
        const category = expense.category;
        acc[category] = (acc[category] || 0) + expense.amount;
        return acc;
      }, {});

      const highestCategory = Object.entries(yearExpenses)
        .sort(([, a], [, b]) => b - a)[0];

      let categoryInsight = '';
      if (highestCategory) {
        const [category, catAmount] = highestCategory;
        const suggestion = SPENDING_SUGGESTIONS[category as keyof typeof SPENDING_SUGGESTIONS];
        categoryInsight = `Throughout the year, you've spent the most on ${category} ($${(catAmount as number).toFixed(2)}). ${suggestion}`;
      }

      setYearlyInsights(
        `Your highest spending was in ${monthName} ${year} with $${amount.toFixed(2)}. ${categoryInsight}`
      );
    };

    calculateYearlyInsights();
  }, [expenses]);

  // Update recent expenses to include all months
  useEffect(() => {
    if (expenses.length > 0) {
      const sorted = [...expenses].sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      setRecentExpenses(sorted);
    } else {
      setRecentExpenses([]);
    }
  }, [expenses]);

  // Filter expenses for current month/year
  const currentMonthExpenses = expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
  });

  // Calculate total for current month
  const currentMonthTotal = currentMonthExpenses.reduce((total, expense) => total + expense.amount, 0);

  // Group expenses by category for chart
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

  const handleAddExpense = () => {
    if (!amount || !category || !description || !date) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const amountValue = parseFloat(amount);
    
    if (isNaN(amountValue) || amountValue <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }

    const expenseDate = new Date(date);
    
    const newExpense: Expense = {
      id: `expense-${Date.now()}`,
      amount: amountValue,
      category,
      description,
      date: expenseDate.toISOString(),
      month: expenseDate.getMonth(),
      year: expenseDate.getFullYear(),
    };

    const updatedExpenses = [...expenses, newExpense];
    setExpenses(updatedExpenses);
    
    if (user) {
      localStorage.setItem(`expenses-${user.id}`, JSON.stringify(updatedExpenses));
    }

    // Reset form
    setAmount('');
    setCategory('');
    setDescription('');
    setDate(new Date());
    setIsDialogOpen(false);
    
    toast({
      title: "Expense Added",
      description: "Your expense has been successfully added.",
    });
    
    setQuote(getRandomQuote());
  };

  const handleDeleteExpense = (id: string) => {
    const updatedExpenses = expenses.filter(expense => expense.id !== id);
    setExpenses(updatedExpenses);
    
    // Save to localStorage
    if (user) {
      localStorage.setItem(`expenses-${user.id}`, JSON.stringify(updatedExpenses));
    }
    
    toast({
      title: "Expense Deleted",
      description: "Your expense has been successfully deleted.",
    });
  };

  const changeMonth = (offset: number) => {
    let newMonth = currentMonth + offset;
    let newYear = currentYear;
    
    if (newMonth > 11) {
      newMonth = 0;
      newYear += 1;
    } else if (newMonth < 0) {
      newMonth = 11;
      newYear -= 1;
    }
    
    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
  };

  const setMonthlyIncome = (amount: number) => {
    const newIncome: MonthlyIncome = {
      month: currentMonth,
      year: currentYear,
      amount,
    };

    const updatedIncomes = [
      ...monthlyIncomes.filter(
        income => income.month !== currentMonth || income.year !== currentYear
      ),
      newIncome,
    ];

    setMonthlyIncomes(updatedIncomes);
    
    if (user) {
      localStorage.setItem(`monthly-incomes-${user.id}`, JSON.stringify(updatedIncomes));
    }

    toast({
      title: "Income Set",
      description: `Monthly income for ${new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long', year: 'numeric' })} has been set.`,
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold">Expense Tracker</h2>
          <p className="text-gray-500">
            Track and manage your monthly expenses
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-purple hover:bg-purple-dark">
              <Plus className="mr-2 h-4 w-4" /> Add Expense
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Expense</DialogTitle>
              <DialogDescription>
                Enter the details of your expense below.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount ($)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min="0.01"
                  step="0.01"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={category} onValueChange={setCategory} required>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.name} value={cat.name}>
                        <div className="flex items-center">
                          <div 
                            className="w-3 h-3 rounded-full mr-2" 
                            style={{ backgroundColor: cat.color }}
                          ></div>
                          {cat.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  placeholder="What was this expense for?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={(date) => date && setDate(date)}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddExpense} className="bg-purple hover:bg-purple-dark">
                Add Expense
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Monthly Income Dialog */}
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" className="mb-4">
            Set Monthly Income
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Set Monthly Income</DialogTitle>
            <DialogDescription>
              Set your income for {new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long', year: 'numeric' })}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="monthly-income">Monthly Income ($)</Label>
              <Input
                id="monthly-income"
                type="number"
                min="0"
                step="0.01"
                placeholder="Enter your monthly income"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    const input = e.target as HTMLInputElement;
                    setMonthlyIncome(parseFloat(input.value));
                  }
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={(e) => {
              const input = document.getElementById('monthly-income') as HTMLInputElement;
              setMonthlyIncome(parseFloat(input.value));
            }}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Monthly Overview Card */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="text-xl flex justify-between items-center">
              <button 
                onClick={() => changeMonth(-1)}
                className="text-gray-500 hover:text-purple"
              >
                &lt;
              </button>
              <span>
                {new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long', year: 'numeric' })}
              </span>
              <button 
                onClick={() => changeMonth(1)}
                className="text-gray-500 hover:text-purple"
              >
                &gt;
              </button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center py-4">
                <p className="text-gray-500 text-sm">Total Spent</p>
                <h3 className="text-4xl font-bold gradient-text">
                  ${currentMonthTotal.toFixed(2)}
                </h3>
                {user?.income && (
                  <p className="text-sm text-gray-500 mt-2">
                    {((currentMonthTotal / user.income) * 100).toFixed(0)}% of income
                  </p>
                )}
              </div>
              
              {user?.income && currentMonthTotal > 0 && (
                <div className="space-y-2 bg-soft-green/30 p-4 rounded-lg">
                  <h4 className="font-semibold">Spending Insights</h4>
                  {highestCategory && (
                    <p className="text-sm">
                      You've spent the most on <span className="font-medium">{highestCategory}</span>.
                    </p>
                  )}
                  {savingsSuggestion && (
                    <p className="text-sm mt-2">{savingsSuggestion}</p>
                  )}
                </div>
              )}
              
              <div className="text-center py-2 px-4 bg-purple/10 rounded-lg">
                <p className="text-sm italic text-gray-600">"{quote}"</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Expense Chart Card */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-xl">Spending Breakdown</CardTitle>
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
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[300px] text-center">
                <ArrowDownCircle className="h-12 w-12 text-gray-300 mb-4" />
                <p className="text-gray-500">No expenses recorded this month.</p>
                <p className="text-gray-500">Add an expense to see your spending breakdown.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Yearly Insights */}
      {yearlyInsights && (
        <Card>
          <CardHeader>
            <CardTitle>Yearly Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">{yearlyInsights}</p>
          </CardContent>
        </Card>
      )}

      {/* Recent Expenses */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentExpenses.length > 0 ? (
              recentExpenses
                .slice(0, 10) // Limit to 10 most recent expenses
                .map((expense) => {
                  const categoryObj = categories.find(cat => cat.name === expense.category) || categories[categories.length - 1];
                  return (
                    <div 
                      key={expense.id} 
                      className="flex justify-between items-center p-4 rounded-lg border border-gray-200 hover:shadow-sm transition-shadow"
                    >
                      <div className="flex items-center space-x-4">
                        <div 
                          className="w-10 h-10 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: `${categoryObj.color}20` }}
                        >
                          <div 
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: categoryObj.color }}
                          ></div>
                        </div>
                        <div>
                          <h4 className="font-medium">{expense.description}</h4>
                          <div className="flex space-x-2 text-sm text-gray-500">
                            <span>{expense.category}</span>
                            <span>•</span>
                            <span>{format(new Date(expense.date), 'MMM d, yyyy')}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="font-semibold">${expense.amount.toFixed(2)}</span>
                        <button 
                          onClick={() => handleDeleteExpense(expense.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </div>
                  );
                })
            ) : (
              <div className="text-center py-8 text-gray-500">
                No expenses recorded.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExpenseTracker;
