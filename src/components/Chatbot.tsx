
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { MessageSquare, Phone, X, SendHorizontal, User } from 'lucide-react';

interface Message {
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { 
      text: "Hi there! I'm your SpendSmart assistant. How can I help you today?", 
      sender: 'bot',
      timestamp: new Date() 
    }
  ]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      text: input,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    
    // Simulate thinking
    setTimeout(() => {
      const botResponse = getBotResponse(input.trim().toLowerCase());
      setMessages(prev => [...prev, {
        text: botResponse,
        sender: 'bot',
        timestamp: new Date()
      }]);
    }, 1000);
  };
  
  const getBotResponse = (message: string): string => {
    // Common financial questions and answers
    if (message.includes('budget') || message.includes('how to save')) {
      return "Creating a budget starts with tracking your income and expenses. Try our expense tracker to categorize your spending and identify areas to save. You could also use the 50/30/20 rule: 50% for needs, 30% for wants, and 20% for savings and debt repayment.";
    }
    
    if (message.includes('debt') || message.includes('loan')) {
      return "To tackle debt, consider the snowball method (paying off smallest debts first) or the avalanche method (highest interest first). Our goals feature can help you plan your debt repayment.";
    }
    
    if (message.includes('invest') || message.includes('investing')) {
      return "Investment strategies depend on your goals and risk tolerance. For retirement, consider tax-advantaged accounts. Would you like to speak with a financial expert? Contact our team at 6374564418.";
    }
    
    if (message.includes('expense') || message.includes('track')) {
      return "You can track your expenses using our Expenses feature. Just go to the Expenses page, add each expense with a category, and we'll visualize your spending patterns.";
    }
    
    if (message.includes('goal') || message.includes('saving')) {
      return "Set financial goals in the Goals section. Define a target amount, date, and we'll help you track progress. You can create short-term goals like a vacation or long-term ones like retirement.";
    }
    
    if (message.includes('piggy bank') || message.includes('savings')) {
      return "Our Piggy Bank feature helps you save money securely. You can deposit, withdraw, and track your savings growth over time.";
    }
    
    if (message.includes('help') || message.includes('support') || message.includes('contact')) {
      return "For personalized assistance, please call our financial experts at 6374564418 or send an email to dhanashrir2006@gmail.com. We're here to help!";
    }
    
    // Fallback response for questions the bot can't answer
    return "I'm not sure I understand that question. For personalized assistance, please contact our financial experts at 6374564418 or email dhanashrir2006@gmail.com.";
  };
  
  const handleCallExpert = () => {
    toast({
      title: "Contact Information",
      description: "Call our financial experts at 6374564418 for personalized assistance.",
    });
  };
  
  return (
    <>
      {isOpen && (
        <div className="fixed bottom-20 right-4 w-80 sm:w-96 bg-white shadow-xl rounded-lg flex flex-col z-50 border border-gray-200 h-[500px] max-h-[80vh]">
          <div className="p-3 bg-purple text-white flex justify-between items-center rounded-t-lg">
            <div className="flex items-center">
              <MessageSquare className="mr-2 h-5 w-5" />
              <h3 className="font-medium">SpendSmart Assistant</h3>
            </div>
            <button onClick={toggleChat} className="text-white hover:text-gray-200">
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <div className="flex-grow p-3 overflow-y-auto bg-gray-50">
            {messages.map((msg, index) => (
              <div 
                key={index} 
                className={`mb-3 flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[75%] p-3 rounded-lg ${
                    msg.sender === 'user' 
                      ? 'bg-purple text-white rounded-tr-none' 
                      : 'bg-white text-gray-800 rounded-tl-none shadow'
                  }`}
                >
                  <p className="text-sm">{msg.text}</p>
                  <p className="text-xs mt-1 opacity-70">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          
          <div className="p-3 border-t">
            <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-grow"
              />
              <Button type="submit" size="icon" className="bg-purple hover:bg-purple-dark">
                <SendHorizontal className="h-4 w-4" />
              </Button>
            </form>
            <div className="mt-2 flex justify-between">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full text-xs" 
                onClick={handleCallExpert}
              >
                <Phone className="h-3 w-3 mr-1" />
                Talk to Expert (6374564418)
              </Button>
            </div>
          </div>
        </div>
      )}
      
      <button
        onClick={toggleChat}
        className="fixed bottom-4 right-4 w-14 h-14 rounded-full bg-purple hover:bg-purple-dark text-white shadow-lg flex items-center justify-center transition-all z-40"
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6" />}
      </button>
    </>
  );
};

export default Chatbot;
