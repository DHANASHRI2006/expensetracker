
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import AccountDeletionRequests from '@/components/AccountDeletionRequests';
import FeedbackManagement from '@/components/FeedbackManagement';
import { AlertCircle, User, Activity, UserX, Shield, ShieldX, Trash } from 'lucide-react';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const OwnerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletionRequests, setDeletionRequests] = useState<any[]>([]);
  const [loginActivity, setLoginActivity] = useState<any[]>([]);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  useEffect(() => {
    // Check if owner is logged in
    if (localStorage.getItem('ownerLoggedIn') !== 'true') {
      navigate('/owner-login');
      return;
    }
    
    // Force refresh of data
    loadDashboardData();
    
    // Set up an interval to refresh data every 5 seconds
    const intervalId = setInterval(loadDashboardData, 5000);
    
    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, [navigate]);
  
  const loadDashboardData = () => {
    console.log('Loading dashboard data...');
    
    try {
      // Load users data - Use 'spendsmartUsers' instead of 'users'
      const usersData = JSON.parse(localStorage.getItem('spendsmartUsers') || '[]');
      console.log('Users data:', usersData);
      setUsers(usersData);
      
      // Load deletion requests
      const requests = JSON.parse(localStorage.getItem('accountDeletionRequests') || '[]');
      console.log('Deletion requests:', requests);
      setDeletionRequests(requests);
      
      // Load login activity
      const userLogins = JSON.parse(localStorage.getItem('userLogins') || '[]');
      console.log('Login activity:', userLogins);
      
      // Process login activity to remove duplicates and ensure consistent format
      const processedLogins = userLogins
        .filter((login: any) => login.email && login.date) // Ensure required fields exist
        .map((login: any) => ({
          userId: login.userId || 'unknown',
          name: login.name || login.email.split('@')[0],
          email: login.email,
          date: login.date
        }))
        .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
      
      // Create a Map to deduplicate login entries that occur within the same second
      const uniqueLogins = new Map();
      processedLogins.forEach((login: any) => {
        const key = `${login.email}-${login.date}`;
        if (!uniqueLogins.has(key)) {
          uniqueLogins.set(key, login);
        }
      });
      
      setLoginActivity(Array.from(uniqueLogins.values()));
      setIsLoading(false);
      
      // Check for inactive users (not used the app for more than a month)
      const inactiveUsers = usersData.filter((user: any) => {
        const lastLogin = user.lastLogin ? new Date(user.lastLogin) : null;
        if (!lastLogin) return false;
        
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        
        return lastLogin < oneMonthAgo;
      });
      
      if (inactiveUsers.length > 0) {
        toast({
          title: "Inactive Users",
          description: `${inactiveUsers.length} users have not used the app for over a month.`,
          duration: 5000,
        });
      }
      
      if (requests.length > 0) {
        toast({
          title: "Account Deletion Requests",
          description: `You have ${requests.length} pending account deletion requests to review.`,
          duration: 5000,
        });
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
    }
  };

  const handleDeleteUser = (userId: string) => {
    setUserToDelete(userId);
    setIsDialogOpen(true);
  };
  
  const confirmDeleteUser = () => {
    if (!userToDelete) return;
    
    try {
      // Find user by ID
      const user = users.find(u => u.id === userToDelete);
      if (!user) {
        toast({
          title: "Error",
          description: "User not found.",
          variant: "destructive",
        });
        return;
      }
      
      // Remove user data
      localStorage.removeItem(`user-${userToDelete}`);
      localStorage.removeItem(`expenses-${userToDelete}`);
      localStorage.removeItem(`goals-${userToDelete}`);
      localStorage.removeItem(`piggyBank-${userToDelete}`);
      
      // Update users list
      const updatedUsers = users.filter(u => u.id !== userToDelete);
      localStorage.setItem('spendsmartUsers', JSON.stringify(updatedUsers));
      setUsers(updatedUsers);
      
      toast({
        title: "Success",
        description: `User ${user.name} has been deleted.`,
      });
      
      // Reset state
      setUserToDelete(null);
      setIsDialogOpen(false);
      
      // Reload data
      loadDashboardData();
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        title: "Error",
        description: "Failed to delete user. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }
  
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Owner Dashboard</h1>
          <Button
            variant="outline"
            onClick={() => {
              localStorage.removeItem('ownerLoggedIn');
              navigate('/owner-login');
            }}
          >
            Logout
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <User className="text-purple-500" size={20} />
                <CardTitle>User Management</CardTitle>
              </div>
              <CardDescription>
                Manage users on SpendSmart
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-semibold mb-4">Total Users: {users.length}</p>
              <div className="border rounded-md overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Last Login</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.length > 0 ? (
                      users.map((user: any) => {
                        const lastLogin = user.lastLogin ? new Date(user.lastLogin) : null;
                        const oneMonthAgo = new Date();
                        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
                        const isInactive = lastLogin && lastLogin < oneMonthAgo;
                        
                        return (
                          <TableRow key={user.id}>
                            <TableCell>{user.name}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>
                              {lastLogin ? lastLogin.toLocaleDateString() : 'Never'}
                            </TableCell>
                            <TableCell>
                              <span className={`px-2 py-1 rounded-full text-xs ${isInactive ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                                {isInactive ? 'Inactive' : 'Active'}
                              </span>
                            </TableCell>
                            <TableCell>
                              <Button 
                                variant="destructive" 
                                size="sm"
                                onClick={() => handleDeleteUser(user.id)}
                              >
                                <Trash size={16} className="mr-1" /> Delete
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-4">
                          No users found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Activity className="text-blue-500" size={20} />
                <CardTitle>Recent Login Activity</CardTitle>
              </div>
              <CardDescription>
                Recent user login events
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-md overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loginActivity.length > 0 ? (
                      loginActivity
                        .slice(0, 15) // Show only latest 15 logins
                        .map((login: any, index: number) => (
                          <TableRow key={`login-${index}`}>
                            <TableCell>{login.name || login.email.split('@')[0]}</TableCell>
                            <TableCell>{login.email}</TableCell>
                            <TableCell>{new Date(login.date).toLocaleString()}</TableCell>
                          </TableRow>
                        ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center py-4">
                          No login activity found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-8">
          <AccountDeletionRequests />
          <FeedbackManagement />
        </div>
      </div>

      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User Account</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this user account? This action cannot be undone
              and all user data will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setUserToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteUser} className="bg-red-500 hover:bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default OwnerDashboard;
