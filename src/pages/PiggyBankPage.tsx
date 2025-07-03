
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";
import Navbar from '../components/Navbar';
import PiggyBank from '../components/PiggyBank';
import Chatbot from '../components/Chatbot';

const PiggyBankPage: React.FC = () => {
  const { user, isLoggedIn, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Redirect if not logged in
  React.useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [isLoggedIn, navigate]);

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    navigate('/');
  };

  if (!isLoggedIn) {
    return null; // Don't render anything if not logged in (will redirect)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar isLoggedIn={true} userInitials={user?.name?.[0] || 'U'} onLogout={handleLogout} />
      
      <main className="flex-grow container-custom py-8">
        <PiggyBank />
      </main>
      
      <Chatbot />
    </div>
  );
};

export default PiggyBankPage;
