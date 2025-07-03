import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  PiggyBank, 
  Linkedin, 
  MessageCircle, 
  Phone, 
  Mail,
  Facebook,
  Twitter,
  Instagram,
  Send,
  ArrowRight
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

const Footer: React.FC = () => {
  const { toast } = useToast();
  const [feedback, setFeedback] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.trim()) {
      toast({
        title: "Error",
        description: "Please enter your feedback",
        variant: "destructive",
      });
      return;
    }
    
    // In a real app, this would send the feedback to a backend
    toast({
      title: "Thank you!",
      description: "Your feedback has been submitted successfully.",
    });
    setFeedback('');
  };

  return (
    <footer className="bg-gray-900 text-white" id="contact">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <PiggyBank className="h-8 w-8 text-purple-light" />
              <h2 className="text-xl font-bold">SpendSmart</h2>
            </div>
            <p className="text-gray-400">
              Helping individuals and families take control of their finances with smart budgeting tools.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" className="text-gray-400 hover:text-purple-light transition-colors">
                <Facebook size={20} />
              </a>
              <a href="https://twitter.com" className="text-gray-400 hover:text-purple-light transition-colors">
                <Twitter size={20} />
              </a>
              <a href="https://instagram.com" className="text-gray-400 hover:text-purple-light transition-colors">
                <Instagram size={20} />
              </a>
              <a href="https://www.linkedin.com/in/dhanashri-r-07a962291" className="text-gray-400 hover:text-purple-light transition-colors">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-purple-light transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/#features" className="text-gray-400 hover:text-purple-light transition-colors">Features</Link>
              </li>
              <li>
                <Link to="/login" className="text-gray-400 hover:text-purple-light transition-colors">Login</Link>
              </li>
              <li>
                <Link to="/signup" className="text-gray-400 hover:text-purple-light transition-colors">Sign Up</Link>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Us</h3>
            <ul className="space-y-2">
              <li className="flex items-center space-x-2">
                <Phone size={16} className="text-gray-400" />
                <a href="tel:6374564418" className="text-gray-400 hover:text-purple-light transition-colors">+91 6374564418</a>
              </li>
              <li className="flex items-center space-x-2">
                <Mail size={16} className="text-gray-400" />
                <a href="mailto:dhanashrir2006@gmail.com" className="text-gray-400 hover:text-purple-light transition-colors">dhanashrir2006@gmail.com</a>
              </li>
              <li className="flex items-center space-x-2">
                <Linkedin size={16} className="text-gray-400" />
                <a href="https://www.linkedin.com/in/dhanashri-r-07a962291" className="text-gray-400 hover:text-purple-light transition-colors">LinkedIn Profile</a>
              </li>
              <li className="flex items-center space-x-2">
                <MessageCircle size={16} className="text-gray-400" />
                <button className="text-gray-400 hover:text-purple-light transition-colors">Chat with us</button>
              </li>
            </ul>
          </div>

          {/* Quick Feedback Form - Replacing Newsletter Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Share Your Thoughts</h3>
            <p className="text-gray-400">We value your feedback to improve our services.</p>
            <form onSubmit={handleSubmit} className="space-y-2">
              <Textarea 
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Your feedback..."
                className="bg-gray-800 border-gray-700 text-white resize-none"
                rows={3}
              />
              <Button 
                type="submit" 
                className="w-full bg-purple hover:bg-purple-dark"
              >
                Send Feedback <Send className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} SpendSmart. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
