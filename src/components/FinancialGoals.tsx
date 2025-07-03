
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { Target, CheckCircle2, AlertCircle, Trophy, Calendar, CalendarIcon, Award } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { format, differenceInDays, isBefore } from 'date-fns';
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from '@/lib/utils';

interface Goal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  startDate: string;
  endDate: string;
  description: string;
  badge?: string;
}

const BADGES = [
  { name: "Financial Rookie", threshold: 1 },
  { name: "Budget Apprentice", threshold: 3 },
  { name: "Savings Enthusiast", threshold: 5 },
  { name: "Money Master", threshold: 10 },
  { name: "Financial Guru", threshold: 20 },
];

const FinancialGoals: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  // State
  const [goals, setGoals] = useState<Goal[]>([]);
  const [title, setTitle] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [badges, setBadges] = useState<string[]>([]);
  const [streakDays, setStreakDays] = useState(0);
  const [lastCheckDate, setLastCheckDate] = useState<string | null>(null);

  // Load goals from localStorage on component mount
  useEffect(() => {
    if (user) {
      const savedGoals = localStorage.getItem(`goals-${user.id}`);
      if (savedGoals) {
        setGoals(JSON.parse(savedGoals));
      }
      
      const savedBadges = localStorage.getItem(`badges-${user.id}`);
      if (savedBadges) {
        setBadges(JSON.parse(savedBadges));
      }
      
      const savedStreak = localStorage.getItem(`streak-${user.id}`);
      if (savedStreak) {
        const { days, lastCheck } = JSON.parse(savedStreak);
        setStreakDays(days);
        setLastCheckDate(lastCheck);
      }
    }
  }, [user]);

  // Update streak daily
  useEffect(() => {
    if (user && lastCheckDate) {
      const today = new Date().toISOString().split('T')[0];
      const lastCheck = new Date(lastCheckDate).toISOString().split('T')[0];
      
      if (today !== lastCheck) {
        // If it's a new day, update streak
        const newLastCheck = new Date().toISOString();
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];
        
        if (lastCheck === yesterdayStr) {
          // If last check was yesterday, increment streak
          const newStreak = streakDays + 1;
          setStreakDays(newStreak);
          setLastCheckDate(newLastCheck);
          
          localStorage.setItem(`streak-${user.id}`, JSON.stringify({
            days: newStreak,
            lastCheck: newLastCheck
          }));
          
          // Check if streak earns a badge
          if (newStreak === 7) {
            addBadge("7-Day Streak");
          } else if (newStreak === 30) {
            addBadge("Monthly Dedication");
          }
        } else {
          // Streak broken
          setStreakDays(1);
          setLastCheckDate(newLastCheck);
          
          localStorage.setItem(`streak-${user.id}`, JSON.stringify({
            days: 1,
            lastCheck: newLastCheck
          }));
        }
      }
    } else if (user) {
      // Initialize streak
      const newLastCheck = new Date().toISOString();
      setStreakDays(1);
      setLastCheckDate(newLastCheck);
      
      localStorage.setItem(`streak-${user.id}`, JSON.stringify({
        days: 1,
        lastCheck: newLastCheck
      }));
    }
  }, [user, lastCheckDate, streakDays]);

  // Check goal badge achievements
  useEffect(() => {
    if (user && goals.length > 0) {
      const completedGoals = goals.filter(goal => goal.currentAmount >= goal.targetAmount).length;
      
      // Find the highest badge earned
      for (let i = BADGES.length - 1; i >= 0; i--) {
        if (completedGoals >= BADGES[i].threshold && !badges.includes(BADGES[i].name)) {
          addBadge(BADGES[i].name);
          break;
        }
      }
    }
  }, [user, goals, badges]);

  const addBadge = (badgeName: string) => {
    if (!badges.includes(badgeName)) {
      const newBadges = [...badges, badgeName];
      setBadges(newBadges);
      
      if (user) {
        localStorage.setItem(`badges-${user.id}`, JSON.stringify(newBadges));
      }
      
      toast({
        title: "🏆 New Badge Earned!",
        description: `Congratulations! You've earned the "${badgeName}" badge.`,
      });
    }
  };

  const handleAddGoal = () => {
    if (!title || !targetAmount || !description) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    const targetAmountValue = parseFloat(targetAmount);
    
    if (isNaN(targetAmountValue) || targetAmountValue <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid positive amount",
        variant: "destructive",
      });
      return;
    }
    
    if (isBefore(endDate, startDate)) {
      toast({
        title: "Error",
        description: "End date must be after start date",
        variant: "destructive",
      });
      return;
    }
    
    const newGoal: Goal = {
      id: `goal-${Date.now()}`,
      title,
      targetAmount: targetAmountValue,
      currentAmount: 0,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      description
    };
    
    const updatedGoals = [...goals, newGoal];
    setGoals(updatedGoals);
    
    // Save to localStorage
    if (user) {
      localStorage.setItem(`goals-${user.id}`, JSON.stringify(updatedGoals));
    }
    
    // Reset form
    setTitle('');
    setTargetAmount('');
    setDescription('');
    setStartDate(new Date());
    setEndDate(new Date());
    setIsDialogOpen(false);
    
    toast({
      title: "Goal Added",
      description: "Your financial goal has been successfully added.",
    });
    
    // Award first goal badge if this is the first goal
    if (goals.length === 0) {
      addBadge("Goal Setter");
    }
  };

  const handleUpdateGoal = (id: string, newAmount: number) => {
    const updatedGoals = goals.map(goal => {
      if (goal.id === id) {
        const updatedAmount = goal.currentAmount + newAmount;
        const isComplete = updatedAmount >= goal.targetAmount;
        
        // If goal is completed and wasn't before, assign a badge
        if (isComplete && goal.currentAmount < goal.targetAmount) {
          const goalBadge = "Goal Achieved";
          return {
            ...goal,
            currentAmount: updatedAmount,
            badge: goalBadge
          };
        }
        
        return {
          ...goal,
          currentAmount: updatedAmount
        };
      }
      return goal;
    });
    
    setGoals(updatedGoals);
    
    // Save to localStorage
    if (user) {
      localStorage.setItem(`goals-${user.id}`, JSON.stringify(updatedGoals));
    }
    
    toast({
      title: "Goal Updated",
      description: `$${newAmount.toFixed(2)} has been added to your goal.`,
    });
  };

  const handleDeleteGoal = (id: string) => {
    const updatedGoals = goals.filter(goal => goal.id !== id);
    setGoals(updatedGoals);
    
    // Save to localStorage
    if (user) {
      localStorage.setItem(`goals-${user.id}`, JSON.stringify(updatedGoals));
    }
    
    toast({
      title: "Goal Deleted",
      description: "Your goal has been successfully deleted.",
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold">Financial Goals</h2>
          <p className="text-gray-500">
            Set, track, and achieve your financial dreams
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-purple hover:bg-purple-dark">
              <Target className="mr-2 h-4 w-4" /> Add New Goal
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create a New Financial Goal</DialogTitle>
              <DialogDescription>
                Define your goal with a target amount and deadline.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Goal Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., Emergency Fund, Vacation, New Car"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">Target Amount ($)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  value={targetAmount}
                  onChange={(e) => setTargetAmount(e.target.value)}
                  min="0.01"
                  step="0.01"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <CalendarComponent
                        mode="single"
                        selected={startDate}
                        onSelect={(date) => date && setStartDate(date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label>End Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <CalendarComponent
                        mode="single"
                        selected={endDate}
                        onSelect={(date) => date && setEndDate(date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  placeholder="Why is this goal important to you?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddGoal} className="bg-purple hover:bg-purple-dark">
                Create Goal
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Badges and Streak Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Award className="mr-2 h-5 w-5 text-purple" />
              Your Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {badges.length > 0 ? (
                badges.map((badge, index) => (
                  <div 
                    key={index} 
                    className="bg-purple/10 rounded-lg p-3 text-center flex flex-col items-center justify-center"
                  >
                    <div className="w-12 h-12 rounded-full bg-purple/20 flex items-center justify-center mb-2">
                      <Trophy className="h-6 w-6 text-purple" />
                    </div>
                    <p className="text-sm font-medium">{badge}</p>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-6 text-gray-500">
                  <p>Complete goals to earn badges and achievements!</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="mr-2 h-5 w-5 text-purple" />
              Goal Streak
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="w-24 h-24 rounded-full bg-purple/20 flex items-center justify-center mx-auto mb-3">
              <h3 className="text-3xl font-bold text-purple">{streakDays}</h3>
            </div>
            <p className="text-sm text-gray-600 mb-2">days in a row</p>
            <p className="text-xs text-gray-500">
              Check your goals daily to maintain your streak!
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Goals List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {goals.length > 0 ? (
          goals.map((goal) => {
            const progress = Math.min(Math.round((goal.currentAmount / goal.targetAmount) * 100), 100);
            const daysLeft = differenceInDays(new Date(goal.endDate), new Date());
            
            return (
              <Card key={goal.id} className={cn(
                "transform transition-transform hover:scale-105",
                progress === 100 ? "border-2 border-green-500" : ""
              )}>
                <CardHeader className={cn(
                  progress === 100 ? "bg-green-500/10" : ""
                )}>
                  <CardTitle className="text-xl flex items-center justify-between">
                    <span className="truncate">{goal.title}</span>
                    {progress === 100 && <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />}
                  </CardTitle>
                  <CardDescription>
                    {format(new Date(goal.startDate), "MMM d, yyyy")} - {format(new Date(goal.endDate), "MMM d, yyyy")}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <p className="text-sm text-gray-500">Current</p>
                      <p className="font-semibold">${goal.currentAmount.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Target</p>
                      <p className="font-semibold">${goal.targetAmount.toFixed(2)}</p>
                    </div>
                  </div>
                  
                  <div className="text-sm">
                    <p className="text-gray-500">{goal.description}</p>
                  </div>
                  
                  <div className="flex items-center space-x-1 text-sm">
                    {daysLeft > 0 ? (
                      <>
                        <Calendar className="h-4 w-4 text-purple" />
                        <span>
                          {daysLeft} {daysLeft === 1 ? 'day' : 'days'} remaining
                        </span>
                      </>
                    ) : (
                      <span className="flex items-center text-yellow-600">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        Goal deadline passed
                      </span>
                    )}
                  </div>
                  
                  {goal.badge && (
                    <div className="bg-purple/10 text-purple text-xs rounded-full px-3 py-1 font-medium inline-flex items-center">
                      <Trophy className="h-3 w-3 mr-1" />
                      {goal.badge}
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex flex-col space-y-3">
                  {progress < 100 && (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="w-full border-purple text-purple hover:bg-purple hover:text-white">
                          Add Progress
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Update Goal Progress</DialogTitle>
                          <DialogDescription>
                            Add funds to your "{goal.title}" goal.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="py-4">
                          <div className="space-y-2">
                            <Label htmlFor="progressAmount">Amount ($)</Label>
                            <Input
                              id="progressAmount"
                              type="number"
                              placeholder="0.00"
                              min="0.01"
                              step="0.01"
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline">Cancel</Button>
                          <Button
                            className="bg-purple hover:bg-purple-dark"
                            onClick={(e) => {
                              const input = document.getElementById('progressAmount') as HTMLInputElement;
                              const amount = parseFloat(input.value);
                              if (!isNaN(amount) && amount > 0) {
                                handleUpdateGoal(goal.id, amount);
                                (e.target as HTMLElement).closest('dialog')?.close();
                              }
                            }}
                          >
                            Add Funds
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  )}
                  
                  <Button 
                    variant="ghost" 
                    className="text-sm text-red-500/70 hover:text-red-500 hover:bg-red-50 w-full"
                    onClick={() => handleDeleteGoal(goal.id)}
                  >
                    Delete Goal
                  </Button>
                </CardFooter>
              </Card>
            );
          })
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
            <Target className="h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Goals Yet</h3>
            <p className="text-gray-500 max-w-md mb-6">
              Start by creating your first financial goal. Whether it's an emergency fund,
              a dream vacation, or a new car, setting goals helps you stay on track.
            </p>
            <Button 
              onClick={() => setIsDialogOpen(true)}
              className="bg-purple hover:bg-purple-dark"
            >
              <Target className="mr-2 h-4 w-4" /> Create Your First Goal
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FinancialGoals;
