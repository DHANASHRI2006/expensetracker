
import React from 'react';
import { 
  PiggyBank, 
  BarChart2, 
  Users, 
  Target, 
  Bell,
  CreditCard,
  Lock,
  Award
} from 'lucide-react';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => {
  return (
    <div className="card-custom group hover:-translate-y-2">
      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-purple-light/20 text-purple mb-4 group-hover:bg-purple group-hover:text-white transition-colors duration-300">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

const Features: React.FC = () => {
  const features = [
    {
      icon: <BarChart2 size={24} />,
      title: "Budget Tracking",
      description: "Track your income and expenses with detailed categorization and interactive charts.",
    },
    {
      icon: <PiggyBank size={24} />,
      title: "Piggy Bank Savings",
      description: "Secure your savings with password protection and watch your money grow over time.",
    },
    {
      icon: <Target size={24} />,
      title: "Financial Goals",
      description: "Set personalized goals and track your progress with milestone celebrations.",
    },
    {
      icon: <Users size={24} />,
      title: "Family Sharing",
      description: "Invite family members to contribute and manage household finances together.",
    },
    {
      icon: <Bell size={24} />,
      title: "Smart Notifications",
      description: "Get timely reminders for bill payments and alerts for spending limits.",
    },
    {
      icon: <Award size={24} />,
      title: "Achievement Badges",
      description: "Earn badges as you complete financial challenges and maintain saving streaks.",
    },
    {
      icon: <CreditCard size={24} />,
      title: "Expense Insights",
      description: "Receive personalized suggestions to reduce spending based on your habits.",
    },
    {
      icon: <Lock size={24} />,
      title: "Secure Access",
      description: "Your financial data is protected with multiple security layers.",
    },
  ];

  return (
    <div className="py-20 bg-gray-50" id="features">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Features That <span className="gradient-text">Help You Save</span></h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            SpendSmart provides all the tools you need to manage your finances effectively.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <FeatureCard 
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Features;
