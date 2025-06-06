
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from './AuthProvider';
import { useToast } from '@/hooks/use-toast';
import { Github, Chrome, Twitter, Eye, EyeOff, Film } from 'lucide-react';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signIn, signInWithProvider } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await signIn(email, password);

    if (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Success',
        description: 'Successfully logged in!',
      });
      navigate('/');
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-700"></div>
        <div className="absolute top-3/4 left-1/2 w-64 h-64 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Floating movie icons */}
      <div className="absolute inset-0">
        <Film className="absolute top-20 left-20 text-white/10 w-8 h-8 animate-bounce" />
        <Film className="absolute top-40 right-32 text-white/10 w-6 h-6 animate-bounce delay-300" />
        <Film className="absolute bottom-32 left-40 text-white/10 w-10 h-10 animate-bounce delay-500" />
        <Film className="absolute bottom-20 right-20 text-white/10 w-7 h-7 animate-bounce delay-700" />
      </div>

      <Card className="w-full max-w-md bg-gray-900/90 border-gray-800 backdrop-blur-sm relative z-10 shadow-2xl">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
            <Film className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-gray-400">
            Sign in to continue your streaming journey
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-gray-800 border-gray-700 text-white focus:border-purple-500 focus:ring-purple-500"
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
                  className="bg-gray-800 border-gray-700 text-white focus:border-purple-500 focus:ring-purple-500 pr-10"
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
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all duration-200"
            >
              {loading ? 'Signing in...' : 'Sign In'}
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
                className="bg-gray-800 border-gray-700 hover:bg-gray-700 transition-colors"
              >
                <Chrome className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                onClick={() => handleProviderSignIn('github')}
                className="bg-gray-800 border-gray-700 hover:bg-gray-700 transition-colors"
              >
                <Github className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                onClick={() => handleProviderSignIn('twitter')}
                className="bg-gray-800 border-gray-700 hover:bg-gray-700 transition-colors"
              >
                <Twitter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="mt-6 text-center">
            <span className="text-gray-400">Don't have an account? </span>
            <Link to="/register" className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginForm;
