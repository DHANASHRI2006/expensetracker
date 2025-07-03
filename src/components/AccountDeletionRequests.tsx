
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle, Trash, UserX, Shield, ShieldX, ShieldCheck } from 'lucide-react';

interface AccountDeletionRequest {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  reason: string;
  requestDate: string;
}

const AccountDeletionRequests: React.FC = () => {
  const [deletionRequests, setDeletionRequests] = useState<AccountDeletionRequest[]>([]);
  const { toast } = useToast();
  
  useEffect(() => {
    // Load deletion requests from localStorage
    const loadRequests = () => {
      try {
        const requests = JSON.parse(localStorage.getItem('accountDeletionRequests') || '[]');
        console.log('Loaded deletion requests from component:', requests);
        setDeletionRequests(requests);
      } catch (error) {
        console.error('Error loading deletion requests:', error);
        toast({
          title: "Error",
          description: "Failed to load account deletion requests",
          variant: "destructive"
        });
      }
    };

    // Initial load
    loadRequests();
    
    // Set up interval to refresh data every 5 seconds
    const intervalId = setInterval(loadRequests, 5000);
    
    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, [toast]);
  
  const handleApprove = (requestId: string, userId: string, userName: string) => {
    // Remove the user's data from localStorage
    try {
      localStorage.removeItem(`user-${userId}`);
      localStorage.removeItem(`expenses-${userId}`);
      localStorage.removeItem(`goals-${userId}`);
      localStorage.removeItem(`piggyBank-${userId}`);
      
      // Update users list - using spendsmartUsers instead of users
      const users = JSON.parse(localStorage.getItem('spendsmartUsers') || '[]');
      const updatedUsers = users.filter((user: any) => user.id !== userId);
      localStorage.setItem('spendsmartUsers', JSON.stringify(updatedUsers));
      
      // Remove the request from the list
      const updatedRequests = deletionRequests.filter(req => req.id !== requestId);
      localStorage.setItem('accountDeletionRequests', JSON.stringify(updatedRequests));
      setDeletionRequests(updatedRequests);
      
      toast({
        title: "Account Deleted",
        description: `${userName}'s account has been successfully deleted.`
      });
    } catch (error) {
      console.error('Error approving deletion request:', error);
      toast({
        title: "Error",
        description: "Failed to delete account. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const handleDeny = (requestId: string, userName: string) => {
    try {
      // Remove the request from the list
      const updatedRequests = deletionRequests.filter(req => req.id !== requestId);
      localStorage.setItem('accountDeletionRequests', JSON.stringify(updatedRequests));
      setDeletionRequests(updatedRequests);
      
      toast({
        title: "Request Denied",
        description: `${userName}'s account deletion request has been denied.`
      });
    } catch (error) {
      console.error('Error denying deletion request:', error);
      toast({
        title: "Error",
        description: "Failed to deny request. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  // Debug information - log the current requests when component renders
  useEffect(() => {
    console.log('Current deletion requests state:', deletionRequests);
  }, [deletionRequests]);
  
  if (deletionRequests.length === 0) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="text-green-500" size={20} />
            <CardTitle>Account Deletion Requests</CardTitle>
          </div>
          <CardDescription>
            No pending account deletion requests
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }
  
  return (
    <Card className="border-red-200">
      <CardHeader className="bg-red-50">
        <div className="flex items-center gap-2">
          <ShieldX className="text-red-500" size={20} />
          <CardTitle>Account Deletion Requests</CardTitle>
        </div>
        <CardDescription>
          Users who have requested to delete their accounts
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {deletionRequests.map(request => (
            <div key={request.id} className="p-4 border rounded-lg bg-gray-50">
              <div className="flex justify-between">
                <div>
                  <h4 className="font-semibold">{request.userName}</h4>
                  <p className="text-sm text-gray-500">{request.userEmail}</p>
                  <p className="text-sm mt-2">Reason: {request.reason || 'No reason provided'}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Requested on: {new Date(request.requestDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button 
                    variant="destructive" 
                    onClick={() => handleApprove(request.id, request.userId, request.userName)}
                  >
                    <UserX size={16} className="mr-1" /> Approve
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => handleDeny(request.id, request.userName)}
                  >
                    <ShieldCheck size={16} className="mr-1" /> Deny
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AccountDeletionRequests;
