
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from './AuthProvider';
import { useToast } from '@/hooks/use-toast';
import { Github, Chrome, Twitter, Eye, EyeOff, Film } from 'lucide-react';
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

  // Different movie posters for register page
  const moviePosters = [
    // Column 1
    [
      'https://image.tmdb.org/t/p/w500/pFlaoHTZeyNkG83vxsAJiGzfSsa.jpg', // Avatar
      'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg', // Interstellar
      'https://image.tmdb.org/t/p/w500/xBHvZcjRiWyobQ9kxBhO6B2dtRI.jpg', // The Avengers
      'https://image.tmdb.org/t/p/w500/iQFcwSGbZXMkeyKrxbPnwnRo5fl.jpg', // X-Men
    ],
    // Column 2
    [
      'https://image.tmdb.org/t/p/w500/nBNZadXqJSdt05SHLqgT0HuC5Gm.jpg', // Inception
      'https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg', // The Shining
      'https://image.tmdb.org/t/p/w500/9xjZS2rlVxm8SFx8kPC3aIGCOYQ.jpg', // Looper
      'https://image.tmdb.org/t/p/w500/5VTN0pR8gcqV3EPUHHfMGnJYN9L.jpg', // Live Die Repeat
    ],
    // Column 3
    [
      'https://image.tmdb.org/t/p/w500/5UkzNIwS6ikmCDJOvJkQz6f6DWZ.jpg', // Star Wars
      'https://image.tmdb.org/t/p/w500/68Mn6XfxNaI6DUr6KdLsNdAAhqb.jpg', // Iron Man
      'https://image.tmdb.org/t/p/w500/k68nPLbIST6NP96JmTxmZijEvCA.jpg', // Gladiator
      'https://image.tmdb.org/t/p/w500/cGOPbv9wA5gEejkUN892JrveARt.jpg', // Spider-Man
    ],
    // Column 4
    [
      'https://image.tmdb.org/t/p/w500/8I37NtDffNV7AZlDa7uDvvqhovU.jpg', // Blade Runner 2049
      'https://image.tmdb.org/t/p/w500/r2J02Z2OpNTctfOSN1Ydgii51I3.jpg', // Scarface
      'https://image.tmdb.org/t/p/w500/2lECpi35Hnbpa4y46JX0aY3AWTy.jpg', // Joker
      'https://image.tmdb.org/t/p/w500/BfJjYHdD1m10C8VYaGdFoWA7Mbc.jpg', // Casino
    ]
  ];

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
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Moving Movie Posters Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {moviePosters.map((column, columnIndex) => (
          <div
            key={columnIndex}
            className={`absolute top-0 h-full flex flex-col gap-4 ${
              columnIndex % 2 === 0 ? 'animate-[slideDown_30s_linear_infinite]' : 'animate-[slideUp_25s_linear_infinite]'
            }`}
            style={{
              left: `${columnIndex * 25}%`,
              width: '20%',
              transform: `translateY(${columnIndex % 2 === 0 ? '100%' : '-100%'})`,
              animationDelay: `${columnIndex * 2.5}s`,
            }}
          >
            {/* Repeat posters for continuous scroll */}
            {[...column, ...column, ...column].map((poster, posterIndex) => (
              <div
                key={`${columnIndex}-${posterIndex}`}
                className="relative group"
                style={{ minHeight: '300px' }}
              >
                <img
                  src={poster}
                  alt={`Movie Poster ${posterIndex + 1}`}
                  className="w-full h-72 sm:h-80 md:h-96 object-cover rounded-lg shadow-2xl opacity-20 hover:opacity-40 transition-opacity duration-500 border border-white/10"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-lg opacity-60"></div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Additional animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-64 h-64 sm:w-full sm:h-full bg-gradient-to-r from-purple-500/10 to-transparent rounded-full animate-pulse"></div>
        <div className="absolute -bottom-1/2 -right-1/2 w-64 h-64 sm:w-full sm:h-full bg-gradient-to-l from-blue-500/10 to-transparent rounded-full animate-pulse delay-1000"></div>
      </div>

      {/* Floating movie icons */}
      <div className="absolute inset-0 hidden md:block">
        <Film className="absolute top-20 left-20 text-white/10 w-8 h-8 animate-bounce" />
        <Film className="absolute top-40 right-32 text-white/10 w-6 h-6 animate-bounce delay-300" />
        <Film className="absolute bottom-32 left-40 text-white/10 w-10 h-10 animate-bounce delay-500" />
        <Film className="absolute bottom-20 right-20 text-white/10 w-7 h-7 animate-bounce delay-700" />
      </div>

      <Card className="w-full max-w-md bg-gray-900/95 border-gray-800 backdrop-blur-lg relative z-10 shadow-2xl mx-4">
        <CardHeader className="text-center p-4 sm:p-6">
          <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
            <Film className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
          </div>
          <CardTitle className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Join CineStream
          </CardTitle>
          <CardDescription className="text-gray-400 text-sm sm:text-base">
            Create your account and start streaming amazing content
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-white text-sm sm:text-base">Full Name</Label>
              <Input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="bg-gray-800 border-gray-700 text-white focus:border-purple-500 h-10 sm:h-11"
                placeholder="Enter your full name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-white text-sm sm:text-base">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-gray-800 border-gray-700 text-white focus:border-purple-500 h-10 sm:h-11"
                placeholder="Enter your email"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white text-sm sm:text-base">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-gray-800 border-gray-700 text-white focus:border-purple-500 pr-10 h-10 sm:h-11"
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
              <Label htmlFor="confirmPassword" className="text-white text-sm sm:text-base">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="bg-gray-800 border-gray-700 text-white focus:border-purple-500 pr-10 h-10 sm:h-11"
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
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 h-10 sm:h-11 text-sm sm:text-base"
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
                className="bg-gray-800 border-gray-700 hover:bg-gray-700 h-10 sm:h-11"
              >
                <Chrome className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                onClick={() => handleProviderSignIn('github')}
                className="bg-gray-800 border-gray-700 hover:bg-gray-700 h-10 sm:h-11"
              >
                <Github className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                onClick={() => handleProviderSignIn('twitter')}
                className="bg-gray-800 border-gray-700 hover:bg-gray-700 h-10 sm:h-11"
              >
                <Twitter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="mt-6 text-center">
            <span className="text-gray-400 text-sm sm:text-base">Already have an account? </span>
            <Link to="/login" className="text-purple-400 hover:text-purple-300 font-medium transition-colors text-sm sm:text-base">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>

      <style>{`
        @keyframes slideUp {
          0% {
            transform: translateY(100vh);
          }
          100% {
            transform: translateY(-100vh);
          }
        }
        
        @keyframes slideDown {
          0% {
            transform: translateY(-100vh);
          }
          100% {
            transform: translateY(100vh);
          }
        }
      `}</style>
    </div>
  );
};

export default RegisterForm;
