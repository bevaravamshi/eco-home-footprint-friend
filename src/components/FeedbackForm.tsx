
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calculator, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const FeedbackForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    rating: 0,
    category: '',
    message: ''
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.message.trim()) {
      toast({
        title: "Feedback Required",
        description: "Please share your thoughts about the carbon calculation.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('Carbon calculation feedback submitted:', formData);
    
    toast({
      title: "Thank You!",
      description: "Your feedback helps us improve our carbon footprint calculations.",
    });
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      rating: 0,
      category: '',
      message: ''
    });
    
    setIsSubmitting(false);
  };

  const handleRatingClick = (rating: number) => {
    setFormData(prev => ({ ...prev, rating }));
  };

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="w-5 h-5 text-eco-600" />
          Feedback on Carbon Calculation
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Name (Optional)</Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Your name"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="email">Email (Optional)</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="your.email@example.com"
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <Label>How accurate do you think this calculation is?</Label>
            <div className="flex gap-1 mt-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleRatingClick(star)}
                  className="p-1 hover:scale-110 transition-transform"
                >
                  <Star
                    className={`w-6 h-6 ${
                      star <= formData.rating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="category">What aspect would you like to comment on?</Label>
            <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select an aspect" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="accuracy">Calculation Accuracy</SelectItem>
                <SelectItem value="missing-factors">Missing Factors</SelectItem>
                <SelectItem value="methodology">Calculation Method</SelectItem>
                <SelectItem value="recommendations">Recommendations Quality</SelectItem>
                <SelectItem value="data-inputs">Data Input Options</SelectItem>
                <SelectItem value="results-display">Results Presentation</SelectItem>
                <SelectItem value="general">General Feedback</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="message">Your Feedback on Carbon Calculation *</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
              placeholder="Share your thoughts on the calculation accuracy, missing factors, or suggestions for improvement..."
              className="mt-1 min-h-[100px]"
              required
            />
          </div>

          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-eco-600 hover:bg-eco-700"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Calculation Feedback'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default FeedbackForm;
