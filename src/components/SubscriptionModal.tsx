
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, CreditCard, Smartphone } from 'lucide-react';
import { useAuth } from '@/components/Auth/AuthProvider';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubscribe: () => void;
}

const SubscriptionModal: React.FC<SubscriptionModalProps> = ({ isOpen, onClose, onSubscribe }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('monthly');
  const [paymentMethod, setPaymentMethod] = useState<'mtn' | 'airtel' | 'card'>('mtn');
  const [loading, setLoading] = useState(false);

  const plans = {
    monthly: {
      name: 'Monthly Plan',
      price: 20000,
      duration: '30 days',
      savings: null,
    },
    yearly: {
      name: 'Yearly Plan',
      price: 180000,
      duration: '365 days',
      savings: 'Save 60,000 UGX',
    },
  };

  const handleSubscribe = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const plan = plans[selectedPlan];
      const subscriptionEnd = new Date();
      subscriptionEnd.setDate(subscriptionEnd.getDate() + (selectedPlan === 'yearly' ? 365 : 30));

      // Create subscription record
      const { error } = await supabase
        .from('subscribers')
        .upsert({
          user_id: user.id,
          email: user.email || '',
          subscription_tier: selectedPlan,
          subscription_start: new Date().toISOString(),
          subscription_end: subscriptionEnd.toISOString(),
          payment_method: paymentMethod,
          subscribed: true,
          amount_paid: plan.price,
          currency: 'UGX',
        });

      if (error) throw error;

      toast({
        title: 'Subscription Successful!',
        description: `You've successfully subscribed to the ${plan.name}`,
      });

      onSubscribe();
      onClose();
    } catch (error) {
      console.error('Subscription error:', error);
      toast({
        title: 'Subscription Failed',
        description: 'There was an error processing your subscription. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl bg-gray-900 text-white border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">Choose Your Plan</DialogTitle>
          <DialogDescription className="text-center text-gray-400">
            Unlock unlimited access to thousands of movies and TV shows
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* Monthly Plan */}
          <Card 
            className={`cursor-pointer transition-all ${
              selectedPlan === 'monthly' 
                ? 'border-red-500 bg-red-500/10' 
                : 'border-gray-700 bg-gray-800'
            }`}
            onClick={() => setSelectedPlan('monthly')}
          >
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Monthly Plan
                {selectedPlan === 'monthly' && <Badge className="bg-red-500">Selected</Badge>}
              </CardTitle>
              <CardDescription>
                <span className="text-3xl font-bold text-white">20,000 UGX</span>
                <span className="text-gray-400">/month</span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-center"><Check className="w-4 h-4 mr-2 text-green-500" />Unlimited Movies & TV Shows</li>
                <li className="flex items-center"><Check className="w-4 h-4 mr-2 text-green-500" />Watch on any device</li>
                <li className="flex items-center"><Check className="w-4 h-4 mr-2 text-green-500" />No ads</li>
                <li className="flex items-center"><Check className="w-4 h-4 mr-2 text-green-500" />Cancel anytime</li>
              </ul>
            </CardContent>
          </Card>

          {/* Yearly Plan */}
          <Card 
            className={`cursor-pointer transition-all relative ${
              selectedPlan === 'yearly' 
                ? 'border-red-500 bg-red-500/10' 
                : 'border-gray-700 bg-gray-800'
            }`}
            onClick={() => setSelectedPlan('yearly')}
          >
            <Badge className="absolute -top-2 -right-2 bg-green-500">Best Value</Badge>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Yearly Plan
                {selectedPlan === 'yearly' && <Badge className="bg-red-500">Selected</Badge>}
              </CardTitle>
              <CardDescription>
                <span className="text-3xl font-bold text-white">180,000 UGX</span>
                <span className="text-gray-400">/year</span>
                <div className="text-green-500 text-sm font-semibold">Save 60,000 UGX</div>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-center"><Check className="w-4 h-4 mr-2 text-green-500" />Everything in Monthly</li>
                <li className="flex items-center"><Check className="w-4 h-4 mr-2 text-green-500" />2 months free</li>
                <li className="flex items-center"><Check className="w-4 h-4 mr-2 text-green-500" />Priority support</li>
                <li className="flex items-center"><Check className="w-4 h-4 mr-2 text-green-500" />Early access to new content</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Payment Methods */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-4">Payment Method</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant={paymentMethod === 'mtn' ? 'default' : 'outline'}
              className={`h-16 ${paymentMethod === 'mtn' ? 'bg-yellow-500 hover:bg-yellow-600' : ''}`}
              onClick={() => setPaymentMethod('mtn')}
            >
              <Smartphone className="w-6 h-6 mr-2" />
              MTN Mobile Money
            </Button>
            <Button
              variant={paymentMethod === 'airtel' ? 'default' : 'outline'}
              className={`h-16 ${paymentMethod === 'airtel' ? 'bg-red-500 hover:bg-red-600' : ''}`}
              onClick={() => setPaymentMethod('airtel')}
            >
              <Smartphone className="w-6 h-6 mr-2" />
              Airtel Money
            </Button>
            <Button
              variant={paymentMethod === 'card' ? 'default' : 'outline'}
              className={`h-16 ${paymentMethod === 'card' ? 'bg-blue-500 hover:bg-blue-600' : ''}`}
              onClick={() => setPaymentMethod('card')}
            >
              <CreditCard className="w-6 h-6 mr-2" />
              Credit/Debit Card
            </Button>
          </div>
        </div>

        {/* Subscribe Button */}
        <div className="mt-6 flex justify-center">
          <Button
            size="lg"
            className="bg-red-600 hover:bg-red-700 px-12"
            onClick={handleSubscribe}
            disabled={loading}
          >
            {loading ? 'Processing...' : `Subscribe for ${plans[selectedPlan].price.toLocaleString()} UGX`}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SubscriptionModal;
