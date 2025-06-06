
import React, { useState, useEffect } from 'react';
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

  // Popular movie posters from TMDB
  const moviePosters = [
    // Column 1
    [
      'https://image.tmdb.org/t/p/w500/rktDFPbfHfUbArZ6OOOKsXcv0Bm.jpg', // The Batman
      'https://image.tmdb.org/t/p/w500/8UlWHLMpgZm9bx6QYh0NFoq67TZ.jpg', // Top Gun Maverick
      'https://image.tmdb.org/t/p/w500/74xTEgt7R36Fpooo50r9T25onhq.jpg', // Batman Begins
      'https://image.tmdb.org/t/p/w500/qAZ0pzat24kLdO3o8ejmbLxyOac.jpg', // Interstellar
    ],
    // Column 2
    [
      'https://image.tmdb.org/t/p/w500/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg', // Fight Club
      'https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg', // Parasite
      'https://image.tmdb.org/t/p/w500/6DrHO1jr3qVrViUO6s6kFiAGM7.jpg', // Fury Road
      'https://image.tmdb.org/t/p/w500/e1mjopzAS2KNsvpbpahQ1a6SkSn.jpg', // The Matrix
    ],
    // Column 3
    [
      'https://image.tmdb.org/t/p/w500/8WUVHemHFH2ZIP6NWkwlHWsyrEL.jpg', // Pulp Fiction
      'https://image.tmdb.org/t/p/w500/adOzdWS35KAo21r9R4BuFCkLer6.jpg', // Goodfellas
      'https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg', // The Dark Knight
      'https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg', // The Godfather
    ],
    // Column 4
    [
      'https://image.tmdb.org/t/p/w500/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg', // Forrest Gump
      'https://image.tmdb.org/t/p/w500/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg', // Spirited Away
      'https://image.tmdb.org/t/p/w500/lmZFxXgJE3vgrciwuDib0N8CfQo.jpg', // The Shawshank Redemption
      'https://image.tmdb.org/t/p/w500/cezWGskPY5x7GaglTiHwaTXgLn8.jpg', // The Grand Budapest Hotel
    ]
  ];

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
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Moving Movie Posters Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {moviePosters.map((column, columnIndex) => (
          <div
            key={columnIndex}
            className={`absolute top-0 h-full flex flex-col gap-4 ${
              columnIndex % 2 === 0 ? 'animate-[slideUp_25s_linear_infinite]' : 'animate-[slideDown_30s_linear_infinite]'
            }`}
            style={{
              left: `${columnIndex * 25}%`,
              width: '20%',
              transform: `translateY(${columnIndex % 2 === 0 ? '-100%' : '100%'})`,
              animationDelay: `${columnIndex * 2}s`,
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
        <div className="absolute top-1/4 left-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-700"></div>
        <div className="absolute top-3/4 left-1/2 w-48 h-48 sm:w-64 sm:h-64 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Floating movie icons */}
      <div className="absolute inset-0 hidden md:block">
        <Film className="absolute top-20 left-20 text-white/10 w-8 h-8 animate-bounce" />
        <Film className="absolute top-40 right-32 text-white/10 w-6 h-6 animate-bounce delay-300" />
        <Film className="absolute bottom-32 left-40 text-white/10 w-10 h-10 animate-bounce delay-500" />
        <Film className="absolute bottom-20 right-20 text-white/10 w-7 h-7 animate-bounce delay-700" />
      </div>

      <Card className="w-full max-w-md bg-gray-900/95 border-gray-800 backdrop-blur-lg relative z-10 shadow-2xl mx-4">
        <CardHeader className="text-center space-y-4 p-4 sm:p-6">
          <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
            <Film className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
          </div>
          <CardTitle className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-gray-400 text-sm sm:text-base">
            Sign in to continue your streaming journey
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white text-sm sm:text-base">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-gray-800 border-gray-700 text-white focus:border-purple-500 focus:ring-purple-500 h-10 sm:h-11"
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
                  className="bg-gray-800 border-gray-700 text-white focus:border-purple-500 focus:ring-purple-500 pr-10 h-10 sm:h-11"
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
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all duration-200 h-10 sm:h-11 text-sm sm:text-base"
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
                className="bg-gray-800 border-gray-700 hover:bg-gray-700 transition-colors h-10 sm:h-11"
              >
                <Chrome className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                onClick={() => handleProviderSignIn('github')}
                className="bg-gray-800 border-gray-700 hover:bg-gray-700 transition-colors h-10 sm:h-11"
              >
                <Github className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                onClick={() => handleProviderSignIn('twitter')}
                className="bg-gray-800 border-gray-700 hover:bg-gray-700 transition-colors h-10 sm:h-11"
              >
                <Twitter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="mt-6 text-center">
            <span className="text-gray-400 text-sm sm:text-base">Don't have an account? </span>
            <Link to="/register" className="text-purple-400 hover:text-purple-300 font-medium transition-colors text-sm sm:text-base">
              Sign up
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

export default LoginForm;
