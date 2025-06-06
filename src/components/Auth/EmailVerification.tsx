
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from './AuthProvider';
import { useToast } from '@/hooks/use-toast';
import { Mail, RefreshCw, CheckCircle } from 'lucide-react';

const EmailVerification = () => {
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const { user, signOut } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const resendVerification = async () => {
    if (countdown > 0) return;
    
    setIsResending(true);
    // In a real app, you would call your resend verification API here
    // For demo purposes, we'll just show a success message
    
    setTimeout(() => {
      setIsResending(false);
      setCountdown(60);
      toast({
        title: 'Verification email sent',
        description: 'Please check your inbox and spam folder.',
      });
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center px-4">
      <Card className="w-full max-w-md bg-gray-900/90 border-gray-800 backdrop-blur-sm">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
            <Mail className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-white">
            Verify Your Email
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center space-y-2">
            <p className="text-gray-300">
              We've sent a verification link to:
            </p>
            <p className="font-semibold text-blue-400">{user?.email}</p>
            <p className="text-sm text-gray-400">
              Click the link in your email to verify your account and start streaming.
            </p>
          </div>

          <div className="space-y-3">
            <Button
              onClick={resendVerification}
              disabled={isResending || countdown > 0}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
            >
              {isResending ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : countdown > 0 ? (
                `Resend in ${countdown}s`
              ) : (
                'Resend verification email'
              )}
            </Button>

            <Button
              onClick={signOut}
              variant="outline"
              className="w-full border-gray-700 text-gray-300 hover:bg-gray-800"
            >
              Sign out
            </Button>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-400">
              <CheckCircle className="w-4 h-4" />
              <span>Check your spam folder if you don't see the email</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailVerification;
