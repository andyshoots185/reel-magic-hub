
import { Mail, Phone, MapPin, MessageCircle, Send } from 'lucide-react';
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
    <section className="bg-gray-800 py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">Get In Touch</h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Have questions, suggestions, or just want to say hello? We'd love to hear from you!
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Info */}
          <div className="space-y-8">
            <div className="flex items-center space-x-4">
              <div className="bg-red-600 p-3 rounded-full">
                <Mail className="text-white" size={24} />
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg">Email Us</h3>
                <p className="text-gray-400">contact@reelflix.com</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="bg-red-600 p-3 rounded-full">
                <Phone className="text-white" size={24} />
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg">Call Us</h3>
                <p className="text-gray-400">+1 (555) 123-4567</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="bg-red-600 p-3 rounded-full">
                <MapPin className="text-white" size={24} />
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg">Visit Us</h3>
                <p className="text-gray-400">123 Entertainment Blvd<br />Hollywood, CA 90210</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="bg-red-600 p-3 rounded-full">
                <MessageCircle className="text-white" size={24} />
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg">Live Chat</h3>
                <p className="text-gray-400">Available 24/7 for instant support</p>
              </div>
            </div>
          </div>
          
          {/* Contact Form */}
          <div className="bg-gray-900 p-8 rounded-lg">
            <h3 className="text-2xl font-bold text-white mb-6">Send us a Message</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-gray-300 mb-2">Your Email</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-red-500"
                  placeholder="your@email.com"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-gray-300 mb-2">Your Message</label>
                <textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={5}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-red-500 resize-none"
                  placeholder="Tell us what's on your mind..."
                  required
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg flex items-center justify-center space-x-2"
              >
                <Send size={20} />
                <span>Send Message</span>
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
