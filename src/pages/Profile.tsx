import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import Navbar from '../components/Navbar';
import { UserCircle, Mail, DollarSign, Trash, Save } from 'lucide-react';

const Profile: React.FC = () => {
  const { user, isLoggedIn, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [income, setIncome] = useState(user?.income || 0);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteReason, setDeleteReason] = useState('');

  React.useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [isLoggedIn, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Update user info in localStorage
    const users = JSON.parse(localStorage.getItem('spendsmartUsers') || '[]');
    const updatedUsers = users.map((u: any) => {
      if (u.id === user?.id) {
        return { ...u, name, email };
      }
      return u;
    });
    localStorage.setItem('spendsmartUsers', JSON.stringify(updatedUsers));
    
    toast({
      title: "Profile Updated",
      description: "Your profile has been successfully updated.",
    });
  };
  
  const requestAccountDeletion = () => {
    if (!deleteReason) {
      toast({
        title: "Error",
        description: "Please provide a reason for deleting your account.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Create deletion request with correct format
      const deletionRequest = {
        id: `request-${Date.now()}`,
        userId: user?.id,
        userName: user?.name,
        userEmail: user?.email,
        reason: deleteReason,
        requestDate: new Date().toISOString()
      };
      
      // Use 'accountDeletionRequests' key to match what the owner dashboard is checking
      const existingRequests = JSON.parse(localStorage.getItem('accountDeletionRequests') || '[]');
      const updatedRequests = [...existingRequests, deletionRequest];
      localStorage.setItem('accountDeletionRequests', JSON.stringify(updatedRequests));
      
      console.log('Account deletion request submitted:', deletionRequest);
      console.log('All deletion requests:', updatedRequests);
      
      toast({
        title: "Deletion Request Sent",
        description: "Your account deletion request has been sent to the owner for review.",
      });
      
      setShowDeleteDialog(false);
      
      // Logout after a brief delay
      setTimeout(() => {
        logout();
        navigate('/');
      }, 2000);
    } catch (error) {
      console.error('Error submitting account deletion request:', error);
      toast({
        title: "Error",
        description: "Failed to submit your deletion request. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!isLoggedIn) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar 
        isLoggedIn={true} 
        userInitials={user?.name?.[0]?.toUpperCase() || 'U'} 
        onLogout={() => {
          logout();
          navigate('/');
        }} 
      />
      
      <main className="flex-grow container-custom py-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCircle className="h-6 w-6" />
                Edit Profile
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Your email"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="income">Monthly Income</Label>
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-4 w-4 text-gray-500" />
                    <Input
                      id="income"
                      type="number"
                      value={income}
                      onChange={(e) => setIncome(Number(e.target.value))}
                      placeholder="Your monthly income"
                    />
                  </div>
                </div>
                
                <Button type="submit" className="w-full bg-purple hover:bg-purple-dark">
                  <Save className="h-4 w-4 mr-2" /> Save Changes
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col">
              <Button 
                variant="destructive" 
                className="w-full mt-4"
                onClick={() => setShowDeleteDialog(true)}
              >
                <Trash className="h-4 w-4 mr-2" /> Request Account Deletion
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>
      
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Request Account Deletion</AlertDialogTitle>
            <AlertDialogDescription className="space-y-4">
              <p>Please provide a reason for deleting your account. This request will be reviewed by the owner within 2 days.</p>
              <Textarea
                value={deleteReason}
                onChange={(e) => setDeleteReason(e.target.value)}
                placeholder="Enter your reason for account deletion..."
                className="mt-2"
                required
              />
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={requestAccountDeletion} className="bg-red-500 hover:bg-red-600">
              Submit Request
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Profile;
