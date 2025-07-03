
import React, { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";
import Navbar from '../components/Navbar';
import FinancialGoals from '../components/FinancialGoals';
import Chatbot from '../components/Chatbot';

const Goals: React.FC = () => {
  const { user, isLoggedIn, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn && user) {
      const savedGoals = localStorage.getItem(`goals-${user.id}`);
      if (savedGoals) {
        const goals = JSON.parse(savedGoals);
        goals.forEach(goal => {
          // Check if the goal has a completion date and if it's in the future
          const goalDate = goal.targetDate ? new Date(goal.targetDate) : null;
          const isGoalActive = !goalDate || goalDate > new Date();
          
          if (isGoalActive) {
            toast({
              title: "Goal Progress",
              description: `${goal.title}: ${((goal.currentAmount / goal.targetAmount) * 100).toFixed(1)}% complete`,
              duration: 5000,
            });
          }
        });
      }
    }
  }, [isLoggedIn, user, toast]);

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    navigate('/');
  };

  if (!isLoggedIn) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar isLoggedIn={true} userInitials={user?.name?.[0] || 'U'} onLogout={handleLogout} />
      
      <main className="flex-grow container-custom py-8">
        <FinancialGoals />
      </main>
      
      <Chatbot />
    </div>
  );
};

export default Goals;
