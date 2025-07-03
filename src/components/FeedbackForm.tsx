"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Star } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';

const FeedbackForm: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackId, setFeedbackId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!feedback || rating === 0) {
      toast({
        title: "Error",
        description: "Please provide feedback and a rating",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await axios.post('http://localhost:5000/api/feedback', {
        name: name || 'Anonymous',
        email: email || 'Not provided',
        feedback,
        rating,
        userId: user?.id || null,
      });

      setFeedback('');
      setRating(0);
      setFeedbackId(res.data._id); // save feedback id for update/delete

      toast({
        title: "Thank You!",
        description: "Your feedback has been submitted successfully.",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to submit feedback.",
        variant: "destructive",
      });
    }

    setIsSubmitting(false);
  };

  const saveToMongoDB = handleSubmit; // just aliasing

  const showFromMongoDB = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/feedback');
      console.log('Feedbacks:', res.data);
      toast({ title: "Fetched", description: "Feedbacks fetched (see console)" });
    } catch (error) {
      console.error(error);
      toast({ title: "Error", description: "Failed to fetch feedbacks", variant: "destructive" });
    }
  };

  const updateMongoDB = async () => {
    if (!feedbackId) {
      toast({ title: "Error", description: "No feedback selected for update", variant: "destructive" });
      return;
    }
    try {
      await axios.put(`http://localhost:5000/api/feedback/${feedbackId}`, {
        name,
        email,
        feedback,
        rating,
      });
      toast({ title: "Updated", description: "Feedback updated successfully" });
    } catch (error) {
      console.error(error);
      toast({ title: "Error", description: "Failed to update feedback", variant: "destructive" });
    }
  };

  const deleteFromMongoDB = async () => {
    if (!feedbackId) {
      toast({ title: "Error", description: "No feedback selected for delete", variant: "destructive" });
      return;
    }
    try {
      await axios.delete(`http://localhost:5000/api/feedback/${feedbackId}`);
      setFeedbackId(null);
      toast({ title: "Deleted", description: "Feedback deleted successfully" });
    } catch (error) {
      console.error(error);
      toast({ title: "Error", description: "Failed to delete feedback", variant: "destructive" });
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Share Your Thoughts</CardTitle>
        <CardDescription>We value your feedback to improve our services.</CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Name (Optional)</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name (optional)"
              />
              <p className="text-xs text-gray-500">This information will be visible to the owner.</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email (Optional)</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address (optional)"
              />
              <p className="text-xs text-gray-500">This information will be visible to the owner.</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label>How would you rate your experience?</Label>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="focus:outline-none"
                >
                  <Star
                    size={32}
                    className={`${
                      (hoveredRating ? hoveredRating >= star : rating >= star)
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-300'
                    } transition-colors`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="feedback">Your Feedback</Label>
            <Textarea
              id="feedback"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Share your thoughts, suggestions, or issues..."
              rows={5}
              required
            />
          </div>
        </form>
      </CardContent>

      <CardFooter className="flex flex-col space-y-3">
        <Button
          onClick={saveToMongoDB}
          className="w-full bg-purple hover:bg-purple-dark"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit Feedback"}
        </Button>

        <div className="flex flex-col space-y-2 w-full">
          <Button onClick={showFromMongoDB} className="w-full bg-blue-600 hover:bg-blue-700">
            Show Feedbacks
          </Button>
          <Button onClick={updateMongoDB} className="w-full bg-yellow-500 hover:bg-yellow-600">
            Update Feedback
          </Button>
          <Button onClick={deleteFromMongoDB} className="w-full bg-red-600 hover:bg-red-700">
            Delete Feedback
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default FeedbackForm;
