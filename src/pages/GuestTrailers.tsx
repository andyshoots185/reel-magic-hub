
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Play, User, LogIn } from 'lucide-react';
import TrailersSection from '@/components/TrailersSection';

const GuestTrailers = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Guest Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-sm border-b border-gray-800">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-red-500">CineStream</h1>
          <div className="flex items-center space-x-4">
            <Link to="/login">
              <Button variant="ghost" className="text-white hover:text-red-500">
                <LogIn className="w-4 h-4 mr-2" />
                Login
              </Button>
            </Link>
            <Link to="/register">
              <Button className="bg-red-600 hover:bg-red-700">
                <User className="w-4 h-4 mr-2" />
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-20 pb-12 bg-gradient-to-b from-gray-900 to-black">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Unlimited Movies & TV Shows
          </h2>
          <p className="text-xl md:text-2xl mb-8 text-gray-300">
            Watch anywhere. Cancel anytime.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" className="bg-red-600 hover:bg-red-700">
                Get Started
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-black">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Trailers Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold mb-8 text-center">Latest Trailers</h3>
          <TrailersSection />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-gray-900">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold mb-12 text-center">Why Choose CineStream?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-6 text-center">
                <Play className="w-12 h-12 mx-auto mb-4 text-red-500" />
                <h4 className="text-xl font-semibold mb-2">Unlimited Streaming</h4>
                <p className="text-gray-400">Watch as much as you want, whenever you want</p>
              </CardContent>
            </Card>
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 mx-auto mb-4 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">HD</span>
                </div>
                <h4 className="text-xl font-semibold mb-2">High Quality</h4>
                <p className="text-gray-400">Enjoy movies and shows in stunning HD quality</p>
              </CardContent>
            </Card>
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 mx-auto mb-4 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">📱</span>
                </div>
                <h4 className="text-xl font-semibold mb-2">Any Device</h4>
                <p className="text-gray-400">Watch on your phone, tablet, laptop, or TV</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-12 text-center">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold mb-4">Ready to watch?</h3>
          <p className="text-xl mb-8 text-gray-300">
            Create your account to access thousands of movies and TV shows
          </p>
          <Link to="/register">
            <Button size="lg" className="bg-red-600 hover:bg-red-700">
              Start Your Journey
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default GuestTrailers;
