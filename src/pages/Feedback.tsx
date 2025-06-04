
import { useState } from 'react';
import { Send, Star, MessageSquare, ThumbsUp, Bug, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';

const Feedback = () => {
  const [feedbackType, setFeedbackType] = useState('');
  const [rating, setRating] = useState(0);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const feedbackTypes = [
    { value: 'general', label: 'General Feedback', icon: MessageSquare },
    { value: 'bug', label: 'Bug Report', icon: Bug },
    { value: 'feature', label: 'Feature Request', icon: Lightbulb },
    { value: 'compliment', label: 'Compliment', icon: ThumbsUp },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Store feedback locally (in a real app, send to backend)
    const feedback = {
      id: Date.now(),
      type: feedbackType,
      rating,
      name,
      email,
      subject,
      message,
      timestamp: new Date().toISOString(),
    };

    const existingFeedback = JSON.parse(localStorage.getItem('reelflix-feedback') || '[]');
    existingFeedback.push(feedback);
    localStorage.setItem('reelflix-feedback', JSON.stringify(existingFeedback));

    // Reset form
    setFeedbackType('');
    setRating(0);
    setName('');
    setEmail('');
    setSubject('');
    setMessage('');
    setIsSubmitting(false);

    toast({
      title: "Feedback Submitted!",
      description: "Thank you for your feedback. We'll review it shortly.",
    });
  };

  return (
    <div className="min-h-screen bg-black">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              We Value Your Feedback
            </h1>
            <p className="text-gray-400 text-lg">
              Help us improve ReelFlix by sharing your thoughts, suggestions, or reporting issues.
            </p>
          </div>

          <div className="bg-gray-900 rounded-lg p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Feedback Type */}
              <div>
                <label className="block text-white font-semibold mb-3">
                  What type of feedback are you providing?
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {feedbackTypes.map((type) => {
                    const Icon = type.icon;
                    return (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => setFeedbackType(type.value)}
                        className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                          feedbackType === type.value
                            ? 'border-red-500 bg-red-500/20 text-white'
                            : 'border-gray-600 bg-gray-800 text-gray-300 hover:border-gray-500'
                        }`}
                      >
                        <Icon size={24} className="mx-auto mb-2" />
                        <div className="text-sm font-medium">{type.label}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Rating */}
              <div>
                <label className="block text-white font-semibold mb-3">
                  How would you rate your overall experience?
                </label>
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className={`transition-colors duration-200 ${
                        star <= rating ? 'text-yellow-400' : 'text-gray-600'
                      }`}
                    >
                      <Star size={32} fill={star <= rating ? 'currentColor' : 'none'} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Name and Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white font-semibold mb-2">
                    Name (Optional)
                  </label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-gray-800 border-gray-600 text-white"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-white font-semibold mb-2">
                    Email (Optional)
                  </label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-gray-800 border-gray-600 text-white"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className="block text-white font-semibold mb-2">
                  Subject
                </label>
                <Input
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="bg-gray-800 border-gray-600 text-white"
                  placeholder="Brief summary of your feedback"
                  required
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-white font-semibold mb-2">
                  Message
                </label>
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="bg-gray-800 border-gray-600 text-white min-h-32"
                  placeholder="Please provide detailed feedback..."
                  required
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting || !feedbackType || !subject || !message}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-3 text-lg font-semibold"
              >
                {isSubmitting ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Submitting...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Send size={20} />
                    <span>Submit Feedback</span>
                  </div>
                )}
              </Button>
            </form>
          </div>

          {/* Additional Features */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-900 rounded-lg p-6 text-center">
              <MessageSquare className="mx-auto mb-4 text-blue-400" size={48} />
              <h3 className="text-white font-bold mb-2">Live Chat</h3>
              <p className="text-gray-400 text-sm">
                Get instant help from our support team
              </p>
            </div>
            <div className="bg-gray-900 rounded-lg p-6 text-center">
              <Bug className="mx-auto mb-4 text-red-400" size={48} />
              <h3 className="text-white font-bold mb-2">Bug Reports</h3>
              <p className="text-gray-400 text-sm">
                Help us fix issues and improve the app
              </p>
            </div>
            <div className="bg-gray-900 rounded-lg p-6 text-center">
              <Lightbulb className="mx-auto mb-4 text-yellow-400" size={48} />
              <h3 className="text-white font-bold mb-2">Feature Ideas</h3>
              <p className="text-gray-400 text-sm">
                Suggest new features you'd love to see
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Feedback;
