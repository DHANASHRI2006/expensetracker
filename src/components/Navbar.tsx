
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Bell, 
  Home, 
  BarChart2, 
  Target, 
  PiggyBank, 
  CreditCard, 
  Settings,
  MessageCircle,
  Menu,
  X,
  User
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface NavbarProps {
  isLoggedIn: boolean;
  userInitials?: string;
  onLogout?: () => void;
  onFeatureClick?: () => void;
  onContactClick?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ 
  isLoggedIn = false, 
  userInitials = "U", 
  onLogout,
  onFeatureClick,
  onContactClick
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { toast } = useToast();
  const [notificationCount, setNotificationCount] = useState(0);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleNotificationClick = () => {
    // Removed specific notification messages as requested
    toast({
      title: "Notifications",
      description: "No new notifications at this time.",
      duration: 5000,
    });
    setNotificationCount(0);
  };

  return (
    <nav className="bg-white shadow-sm py-4">
      <div className="container-custom flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Link to="/" className="flex items-center space-x-2">
            <PiggyBank className="h-8 w-8 text-purple" />
            <h1 className="text-xl font-bold text-purple">SpendSmart</h1>
          </Link>
        </div>

        {/* Mobile menu button */}
        <button 
          className="md:hidden text-gray-600 focus:outline-none"
          onClick={toggleMobileMenu}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          {isLoggedIn ? (
            <>
              <Link to="/home" className="flex items-center space-x-1 text-gray-600 hover:text-purple transition-colors">
                <Home size={18} />
                <span>Home</span>
              </Link>
              <Link to="/expenses" className="flex items-center space-x-1 text-gray-600 hover:text-purple transition-colors">
                <CreditCard size={18} />
                <span>Expenses</span>
              </Link>
              <Link to="/goals" className="flex items-center space-x-1 text-gray-600 hover:text-purple transition-colors">
                <Target size={18} />
                <span>Goals</span>
              </Link>
              <Link to="/piggy-bank" className="flex items-center space-x-1 text-gray-600 hover:text-purple transition-colors">
                <PiggyBank size={18} />
                <span>Piggy Bank</span>
              </Link>
              <button 
                className="relative"
                onClick={handleNotificationClick}
              >
                <Bell size={20} className="text-gray-600 hover:text-purple transition-colors" />
                {notificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {notificationCount}
                  </span>
                )}
              </button>
              <div className="flex items-center space-x-2">
                <Link to="/profile">
                  <Avatar className="h-8 w-8 bg-purple text-white cursor-pointer hover:bg-purple-dark transition-colors">
                    <AvatarFallback className="text-sm font-medium">{userInitials}</AvatarFallback>
                  </Avatar>
                </Link>
                <button 
                  className="text-sm text-gray-600 hover:text-purple"
                  onClick={onLogout}
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/" className="text-gray-600 hover:text-purple transition-colors">Home</Link>
              <button 
                onClick={onFeatureClick}
                className="text-gray-600 hover:text-purple transition-colors"
              >
                Features
              </button>
              <button
                onClick={onContactClick}
                className="text-gray-600 hover:text-purple transition-colors"
              >
                Contact
              </button>
              <div className="flex items-center space-x-2">
                <Button variant="outline" asChild>
                  <Link to="/login">Login</Link>
                </Button>
                <Button asChild>
                  <Link to="/signup">Sign Up</Link>
                </Button>
              </div>
            </>
          )}
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="absolute top-16 left-0 w-full bg-white shadow-md py-4 px-4 md:hidden z-50 animate-fade-in">
            {isLoggedIn ? (
              <>
                <Link to="/home" className="block py-2 px-4 text-gray-600 hover:bg-purple-light hover:text-white rounded-md">
                  <div className="flex items-center space-x-2">
                    <Home size={18} />
                    <span>Home</span>
                  </div>
                </Link>
                <Link to="/expenses" className="block py-2 px-4 text-gray-600 hover:bg-purple-light hover:text-white rounded-md">
                  <div className="flex items-center space-x-2">
                    <CreditCard size={18} />
                    <span>Expenses</span>
                  </div>
                </Link>
                <Link to="/goals" className="block py-2 px-4 text-gray-600 hover:bg-purple-light hover:text-white rounded-md">
                  <div className="flex items-center space-x-2">
                    <Target size={18} />
                    <span>Goals</span>
                  </div>
                </Link>
                <Link to="/piggy-bank" className="block py-2 px-4 text-gray-600 hover:bg-purple-light hover:text-white rounded-md">
                  <div className="flex items-center space-x-2">
                    <PiggyBank size={18} />
                    <span>Piggy Bank</span>
                  </div>
                </Link>
                <button 
                  className="flex items-center space-x-2 w-full text-left py-2 px-4 text-gray-600 hover:bg-purple-light hover:text-white rounded-md"
                  onClick={handleNotificationClick}
                >
                  <Bell size={18} />
                  <span>Notifications {notificationCount > 0 && `(${notificationCount})`}</span>
                </button>
                <Link to="/profile" className="block py-2 px-4 text-gray-600 hover:bg-purple-light hover:text-white rounded-md">
                  <div className="flex items-center space-x-2">
                    <User size={18} />
                    <span>Profile</span>
                  </div>
                </Link>
                <button 
                  className="flex items-center space-x-2 w-full text-left py-2 px-4 text-gray-600 hover:bg-purple-light hover:text-white rounded-md"
                  onClick={onLogout}
                >
                  <Settings size={18} />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link to="/" className="block py-2 px-4 text-gray-600 hover:bg-purple-light hover:text-white rounded-md">Home</Link>
                <button 
                  onClick={() => {
                    onFeatureClick?.();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left block py-2 px-4 text-gray-600 hover:bg-purple-light hover:text-white rounded-md"
                >
                  Features
                </button>
                <button
                  onClick={() => {
                    onContactClick?.();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left block py-2 px-4 text-gray-600 hover:bg-purple-light hover:text-white rounded-md"
                >
                  Contact
                </button>
                <div className="mt-4 space-y-2">
                  <Button variant="outline" className="w-full" asChild>
                    <Link to="/login">Login</Link>
                  </Button>
                  <Button className="w-full" asChild>
                    <Link to="/signup">Sign Up</Link>
                  </Button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
