
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/context/AuthContext';

const DeleteAccountRequest: React.FC = () => {
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, logout } = useAuth();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setIsSubmitting(true);
    
    try {
      // Create a deletion request
      const deletionRequest = {
        id: `request-${Date.now()}`,
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        reason: reason.trim(),
        requestDate: new Date().toISOString()
      };
      
      // Add to localStorage - using 'accountDeletionRequests' to match what the owner dashboard is reading
      const existingRequests = JSON.parse(localStorage.getItem('accountDeletionRequests') || '[]');
      const updatedRequests = [...existingRequests, deletionRequest];
      localStorage.setItem('accountDeletionRequests', JSON.stringify(updatedRequests));
      
      // Log for debugging
      console.log('Account deletion request submitted:', deletionRequest);
      console.log('All deletion requests:', updatedRequests);
      
      setIsSubmitting(false);
      
      toast({
        title: "Request Submitted",
        description: "Your account deletion request has been submitted. An administrator will review it shortly.",
      });
      
      // Optionally log the user out
      setTimeout(() => {
        logout();
      }, 2000);
    } catch (error) {
      console.error('Error submitting account deletion request:', error);
      setIsSubmitting(false);
      
      toast({
        title: "Error",
        description: "Failed to submit your account deletion request. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Textarea
          placeholder="Please tell us why you want to delete your account (optional)"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          rows={4}
        />
      </div>
      <Button 
        type="submit" 
        variant="destructive"
        disabled={isSubmitting}
        className="w-full"
      >
        {isSubmitting ? "Submitting..." : "Request Account Deletion"}
      </Button>
    </form>
  );
};

export default DeleteAccountRequest;
