
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Trash } from 'lucide-react';

interface FeedbackItem {
  id: string;
  name: string;
  email: string;
  feedback: string;
  rating: number;
  date: string;
  userId: string | null;
}

const FeedbackManagement: React.FC = () => {
  const [feedbackItems, setFeedbackItems] = useState<FeedbackItem[]>([]);
  const { toast } = useToast();
  
  useEffect(() => {
    // Load feedback from localStorage
    const feedback = JSON.parse(localStorage.getItem('feedback') || '[]');
    setFeedbackItems(feedback);
  }, []);
  
  const handleDelete = (feedbackId: string) => {
    // Remove the feedback from the list
    const updatedFeedback = feedbackItems.filter(item => item.id !== feedbackId);
    localStorage.setItem('feedback', JSON.stringify(updatedFeedback));
    setFeedbackItems(updatedFeedback);
    
    toast({
      title: "Feedback Deleted",
      description: "The feedback has been successfully removed."
    });
  };
  
  if (feedbackItems.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>User Feedback</CardTitle>
          <CardDescription>
            No feedback has been submitted yet
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>User Feedback</CardTitle>
        <CardDescription>
          Manage feedback from your users
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {feedbackItems.map(item => (
            <div key={item.id} className="p-4 border rounded-lg bg-gray-50">
              <div className="flex justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">{item.name || 'Anonymous'}</h4>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleDelete(item.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-100"
                    >
                      <Trash size={16} />
                    </Button>
                  </div>
                  <p className="text-sm text-gray-500">{item.email || 'No email provided'}</p>
                  <div className="flex my-2">
                    {[...Array(5)].map((_, i) => (
                      <svg 
                        key={i} 
                        className={`w-4 h-4 ${i < item.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" />
                      </svg>
                    ))}
                    <span className="text-xs text-gray-500 ml-2">
                      {new Date(item.date).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-700 mt-2">{item.feedback}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default FeedbackManagement;
