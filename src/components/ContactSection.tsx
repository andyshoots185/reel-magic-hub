
import { Mail, Phone, MessageCircle, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

const ContactSection = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !message) return;
    
    // Simulate sending message
    toast({
      title: "Message Sent!",
      description: "Thank you for reaching out. We'll get back to you soon!",
    });
    
    setEmail('');
    setMessage('');
  };

  return (
    <section className="bg-gray-800 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">Get In Touch</h2>
          <p className="text-gray-400 text-sm">
            Questions or feedback? We'd love to hear from you!
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Contact Info - Compact */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="bg-red-600 p-2 rounded-full">
                  <Mail className="text-white" size={16} />
                </div>
                <div>
                  <h3 className="text-white font-medium">Email</h3>
                  <p className="text-gray-400 text-sm">contact@reelflix.com</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="bg-red-600 p-2 rounded-full">
                  <Phone className="text-white" size={16} />
                </div>
                <div>
                  <h3 className="text-white font-medium">Support</h3>
                  <p className="text-gray-400 text-sm">24/7 Live Chat Available</p>
                </div>
              </div>
            </div>
            
            {/* Compact Contact Form */}
            <div className="bg-gray-900 p-4 rounded-lg">
              <form onSubmit={handleSubmit} className="space-y-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white text-sm focus:outline-none focus:border-red-500"
                  placeholder="your@email.com"
                  required
                />
                
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white text-sm focus:outline-none focus:border-red-500 resize-none"
                  placeholder="Your message..."
                  required
                />
                
                <Button 
                  type="submit" 
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 rounded flex items-center justify-center space-x-2"
                >
                  <Send size={16} />
                  <span>Send</span>
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
