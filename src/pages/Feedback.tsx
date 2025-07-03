
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import Navbar from '../components/Navbar';
import FeedbackForm from '../components/FeedbackForm';
import Chatbot from '../components/Chatbot';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

const Feedback: React.FC = () => {
  const { user, isLoggedIn, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

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
      <Navbar 
        isLoggedIn={isLoggedIn} 
        userInitials={user?.name?.[0] || 'U'} 
        onLogout={handleLogout} 
      />
      
      <main className="flex-grow container-custom py-12">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">We Value Your Feedback</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Your opinions help us improve SpendSmart. Share your thoughts, suggestions, or report any issues you've encountered.
          </p>
        </div>
        
        <FeedbackForm />
      </main>
      
      <Chatbot />
    </div>
  );
};

export default Feedback;
