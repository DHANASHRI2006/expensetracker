
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Mail, PiggyBank, Lock } from 'lucide-react';
import BackButton from '@/components/BackButton';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }
    
    if (!newPassword || !confirmPassword) {
      toast({
        title: "Error",
        description: "Please enter and confirm your new password",
        variant: "destructive",
      });
      return;
    }
    
    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    // Find the user and update their password
    const users = JSON.parse(localStorage.getItem('spendsmartUsers') || '[]');
    const userIndex = users.findIndex((user: any) => user.email === email);
    
    if (userIndex === -1) {
      // For security reasons, don't tell the user if the email exists or not
      setTimeout(() => {
        toast({
          title: "Password Reset Completed",
          description: "If an account with this email exists, the password has been reset.",
        });
        setIsLoading(false);
        navigate('/login');
      }, 1500);
      return;
    }
    
    // Update the password
    users[userIndex].password = newPassword;
    localStorage.setItem('spendsmartUsers', JSON.stringify(users));
    
    // Show success message
    setTimeout(() => {
      toast({
        title: "Password Reset Completed",
        description: "Your password has been successfully reset. You can now log in with your new password.",
      });
      setIsLoading(false);
      navigate('/login');
    }, 1500);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-light/10 to-soft-green/30 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <PiggyBank className="h-12 w-12 text-purple" />
          </div>
          <CardTitle className="text-2xl text-center font-bold">Reset Password</CardTitle>
          <CardDescription className="text-center">
            Enter your email and new password to reset your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-gray-500" />
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="name@example.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <div className="flex items-center space-x-2">
                <Lock className="h-4 w-4 text-gray-500" />
                <Input 
                  id="newPassword" 
                  type="password" 
                  placeholder="••••••••" 
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <div className="flex items-center space-x-2">
                <Lock className="h-4 w-4 text-gray-500" />
                <Input 
                  id="confirmPassword" 
                  type="password" 
                  placeholder="••••••••" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <Button type="submit" className="w-full bg-purple hover:bg-purple-dark" disabled={isLoading}>
              {isLoading ? "Resetting..." : "Reset Password"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <BackButton />
        </CardFooter>
      </Card>
    </div>
  );
};

export default ForgotPassword;
