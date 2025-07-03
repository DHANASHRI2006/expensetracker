import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowRight, Image } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <div className="bg-gradient-to-br from-purple-light/10 to-soft-green/30 py-20">
      <div className="container-custom grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            <span className="gradient-text">Smart Spending,</span> <br />
            Better Savings
          </h1>
          <p className="text-lg text-gray-600 max-w-lg">
            Take control of your finances with SpendSmart. Track expenses, set budgets, save with our Piggy Bank, and achieve your financial goals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="bg-purple hover:bg-purple-dark" asChild>
              <Link to="/signup">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-purple text-purple hover:bg-purple hover:text-white" asChild>
              <Link to="/login">
                Login
              </Link>
            </Button>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Free to try. No credit card required.</span>
          </div>
        </div>
        <div className="relative flex justify-center items-center">
          <img 
            src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=800&q=80" 
            alt="SpendSmart App Dashboard" 
            className="rounded-lg shadow-xl max-w-md w-full object-cover transform hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              const imgElement = e.target as HTMLImageElement;
              imgElement.src = 'https://via.placeholder.com/800x600?text=SpendSmart+Dashboard';
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Hero;
