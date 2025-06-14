
import React, { useState } from 'react';
import { useAuth } from '@/components/Auth/AuthProvider';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, Play } from 'lucide-react';
import SubscriptionModal from './SubscriptionModal';

interface ProtectedContentProps {
  children: React.ReactNode;
  showSubscriptionPrompt?: boolean;
}

const ProtectedContent: React.FC<ProtectedContentProps> = ({ 
  children, 
  showSubscriptionPrompt = true 
}) => {
  const { user } = useAuth();
  const { isSubscribed, loading, checkSubscription } = useSubscription();
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <Card className="bg-gray-900 border-gray-700 text-white max-w-md mx-auto">
        <CardHeader className="text-center">
          <Lock className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <CardTitle>Authentication Required</CardTitle>
          <CardDescription className="text-gray-400">
            Please sign in to access this content
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Button className="bg-red-600 hover:bg-red-700" onClick={() => window.location.href = '/login'}>
            Sign In
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!isSubscribed && showSubscriptionPrompt) {
    return (
      <>
        <Card className="bg-gray-900 border-gray-700 text-white max-w-md mx-auto">
          <CardHeader className="text-center">
            <Play className="w-16 h-16 mx-auto mb-4 text-red-500" />
            <CardTitle>Premium Content</CardTitle>
            <CardDescription className="text-gray-400">
              Subscribe to watch unlimited movies and TV shows
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="text-sm text-gray-400">
              <p>✓ Unlimited streaming</p>
              <p>✓ No ads</p>
              <p>✓ Watch on any device</p>
              <p>✓ Cancel anytime</p>
            </div>
            <Button 
              className="bg-red-600 hover:bg-red-700" 
              onClick={() => setShowSubscriptionModal(true)}
            >
              Subscribe Now
            </Button>
          </CardContent>
        </Card>
        
        <SubscriptionModal
          isOpen={showSubscriptionModal}
          onClose={() => setShowSubscriptionModal(false)}
          onSubscribe={() => {
            checkSubscription();
            setShowSubscriptionModal(false);
          }}
        />
      </>
    );
  }

  return <>{children}</>;
};

export default ProtectedContent;
