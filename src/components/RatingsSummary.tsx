
import React from 'react';
import { Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const RatingsSummary: React.FC = () => {
  const feedback = JSON.parse(localStorage.getItem('feedback') || '[]');
  
  const averageRating = feedback.length > 0
    ? feedback.reduce((acc: number, curr: any) => acc + curr.rating, 0) / feedback.length
    : 0;
  
  const ratingCounts = [1, 2, 3, 4, 5].map(rating => ({
    rating,
    count: feedback.filter((f: any) => f.rating === rating).length
  }));

  return (
    <Card className="w-full max-w-2xl mx-auto mt-8">
      <CardHeader>
        <CardTitle className="text-center">User Ratings Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center mb-6">
          <div className="text-4xl font-bold mb-2">{averageRating.toFixed(1)}</div>
          <div className="flex justify-center space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={24}
                className={`${
                  star <= Math.round(averageRating)
                    ? 'text-yellow-400 fill-yellow-400'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <div className="text-sm text-gray-500 mt-2">
            Based on {feedback.length} ratings
          </div>
        </div>

        <div className="space-y-2">
          {ratingCounts.reverse().map(({ rating, count }) => (
            <div key={rating} className="flex items-center space-x-4">
              <div className="w-16 text-right">{rating} stars</div>
              <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-400"
                  style={{
                    width: `${feedback.length ? (count / feedback.length) * 100 : 0}%`
                  }}
                />
              </div>
              <div className="w-16 text-sm text-gray-500">{count}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RatingsSummary;
