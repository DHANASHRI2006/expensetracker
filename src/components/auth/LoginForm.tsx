import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/context/AuthContext';
import { Eye, EyeOff, PiggyBank } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import BackButton from '@/components/BackButton';
import axios from 'axios'; // ✅ add this import

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [userType, setUserType] = useState('user');
  const [loginAttempts, setLoginAttempts] = useState(0);
  
  const { login, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    if (userType === 'owner') {
      if (email === "dhanashrir2006@gmail.com" && password === "dhana") {
        const ownerLogins = JSON.parse(localStorage.getItem('ownerLogins') || '[]');
        ownerLogins.push({
          date: new Date().toISOString(),
          email
        });
        localStorage.setItem('ownerLogins', JSON.stringify(ownerLogins));
        localStorage.setItem('ownerLoggedIn', 'true');

        // ✅ send login to MongoDB
        try {
          await axios.post('http://localhost:5000/api/logins', {
            email,
            userType: 'owner',
            loginTime: new Date().toISOString(),
          });
        } catch (error) {
          console.error('MongoDB save error:', error);
        }
        
        toast({
          title: "Welcome Owner!",
          description: "You've successfully logged in to the owner dashboard.",
        });
        
        navigate('/owner-dashboard');
      } else {
        toast({
          title: "Owner Login Failed",
          description: "Invalid owner credentials.",
          variant: "destructive",
        });

        const failedAttempts = JSON.parse(localStorage.getItem('failedLoginAttempts') || '[]');
        failedAttempts.push({
          date: new Date().toISOString(),
          email,
          userType: 'owner'
        });
        localStorage.setItem('failedLoginAttempts', JSON.stringify(failedAttempts));
        setLoginAttempts(prev => prev + 1);
      }

      setIsLoading(false);
      return;
    }

    try {
      await login(email, password);

      const spendsmartUsers = JSON.parse(localStorage.getItem('spendsmartUsers') || '[]');
      const currentUser = JSON.parse(localStorage.getItem('spendsmartUser') || '{}');

      const userExists = spendsmartUsers.some((u: any) => u.id === currentUser.id);
      if (!userExists && currentUser.id) {
        spendsmartUsers.push({
          id: currentUser.id,
          name: currentUser.name,
          email: currentUser.email,
          password: password,
          income: currentUser.income || 0,
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString()
        });
        localStorage.setItem('spendsmartUsers', JSON.stringify(spendsmartUsers));
        console.log("Added missing user to spendsmartUsers:", currentUser);
      }

      const userLogins = JSON.parse(localStorage.getItem('userLogins') || '[]');
      userLogins.push({
        date: new Date().toISOString(),
        email
      });
      localStorage.setItem('userLogins', JSON.stringify(userLogins));

      const userData = JSON.parse(localStorage.getItem('users') || '[]').find((u: any) => u.email === email);
      const userId = userData?.id || currentUser.id;

      if (userId) {
        const savedGoals = localStorage.getItem(`goals-${userId}`);
        if (savedGoals) {
          const goals = JSON.parse(savedGoals);
          goals.forEach((goal: any) => {
            if (goal.currentAmount < goal.targetAmount) {
              toast({
                title: "Goal Reminder",
                description: `You're ${((goal.currentAmount / goal.targetAmount) * 100).toFixed(1)}% of the way to your "${goal.title}" goal!`,
              });
            }
          });
        }
      }

      // ✅ send login to MongoDB
      try {
        await axios.post('http://localhost:5000/api/logins', {
          email,
          userType: 'user',
          loginTime: new Date().toISOString(),
        });
      } catch (error) {
        console.error('MongoDB save error:', error);
      }

      toast({
        title: "Success!",
        description: "You've successfully logged in.",
      });
      navigate('/expenses');
    } catch (error) {
      toast({
        title: "Login Failed",
        description: "Invalid email or password. Please try again.",
        variant: "destructive",
      });

      setLoginAttempts(prev => prev + 1);

      const failedAttempts = JSON.parse(localStorage.getItem('failedLoginAttempts') || '[]');
      failedAttempts.push({
        email,
        date: new Date().toISOString()
      });
      localStorage.setItem('failedLoginAttempts', JSON.stringify(failedAttempts));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-light/10 to-soft-green/30 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <PiggyBank className="h-12 w-12 text-purple" />
          </div>
          <CardTitle className="text-2xl text-center font-bold">Welcome back</CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Login as</Label>
              <RadioGroup 
                defaultValue="user" 
                value={userType} 
                onValueChange={setUserType}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="user" id="user" />
                  <Label htmlFor="user">User</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="owner" id="owner" />
                  <Label htmlFor="owner">Owner</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="name@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="password">Password</Label>
                <Link to="/forgot-password" className="text-xs text-purple hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Input 
                  id="password" 
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button 
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full bg-purple hover:bg-purple-dark" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link to="/signup" className="text-purple hover:underline">
              Sign up
            </Link>
          </div>
          <BackButton className="mx-auto" />
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginForm;
