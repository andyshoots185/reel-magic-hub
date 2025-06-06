
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from './AuthProvider';
import { useToast } from '@/hooks/use-toast';
import { Github, Chrome, Twitter, Eye, EyeOff } from 'lucide-react';
import { validatePassword, isPasswordStrong } from '@/utils/passwordValidation';
import PasswordStrengthIndicator from './PasswordStrengthIndicator';

const RegisterForm = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordRequirements, setPasswordRequirements] = useState(validatePassword(''));
  const [loading, setLoading] = useState(false);
  const { signUp, signInWithProvider } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    setPasswordRequirements(validatePassword(password));
  }, [password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isPasswordStrong(password)) {
      toast({
        title: 'Password too weak',
        description: 'Please ensure your password meets all requirements.',
        variant: 'destructive',
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: 'Error',
        description: 'Passwords do not match',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    const { error } = await signUp(email, password, fullName);

    if (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Success',
        description: 'Account created! Please check your email to verify your account.',
      });
      navigate('/login');
    }

    setLoading(false);
  };

  const handleProviderSignIn = async (provider: 'google' | 'github' | 'twitter') => {
    const { error } = await signInWithProvider(provider);
    if (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-r from-purple-500/20 to-transparent rounded-full animate-pulse"></div>
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-l from-blue-500/20 to-transparent rounded-full animate-pulse delay-1000"></div>
      </div>

      <Card className="w-full max-w-md bg-gray-900/90 border-gray-800 backdrop-blur-sm relative z-10">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Join CineStream
          </CardTitle>
          <CardDescription className="text-gray-400">
            Create your account and start streaming amazing content
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-white">Full Name</Label>
              <Input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="bg-gray-800 border-gray-700 text-white focus:border-purple-500"
                placeholder="Enter your full name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-gray-800 border-gray-700 text-white focus:border-purple-500"
                placeholder="Enter your email"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-gray-800 border-gray-700 text-white focus:border-purple-500 pr-10"
                  placeholder="Enter your password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-white"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </Button>
              </div>
              {password && (
                <PasswordStrengthIndicator requirements={passwordRequirements} />
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-white">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="bg-gray-800 border-gray-700 text-white focus:border-purple-500 pr-10"
                  placeholder="Confirm your password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-white"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </Button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading || !isPasswordStrong(password)}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-50"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </Button>
          </form>

          <div className="mt-6 space-y-3">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-900 text-gray-400">Or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <Button
                variant="outline"
                onClick={() => handleProviderSignIn('google')}
                className="bg-gray-800 border-gray-700 hover:bg-gray-700"
              >
                <Chrome className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                onClick={() => handleProviderSignIn('github')}
                className="bg-gray-800 border-gray-700 hover:bg-gray-700"
              >
                <Github className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                onClick={() => handleProviderSignIn('twitter')}
                className="bg-gray-800 border-gray-700 hover:bg-gray-700"
              >
                <Twitter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="mt-6 text-center">
            <span className="text-gray-400">Already have an account? </span>
            <Link to="/login" className="text-purple-400 hover:text-purple-300 font-medium">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterForm;
