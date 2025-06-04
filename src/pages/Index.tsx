
import { useState } from 'react';
import { Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import MovieGrid from '@/components/MovieGrid';
import SmartRecommendations from '@/components/SmartRecommendations';
import ContactSection from '@/components/ContactSection';
import AdminMovieUpload from '@/components/AdminMovieUpload';

const Index = () => {
  const [showAdminPanel, setShowAdminPanel] = useState(false);

  return (
    <div className="min-h-screen bg-black">
      <Header />
      
      <main>
        <HeroSection />
        
        <div className="py-16">
          <div className="container mx-auto">
            <MovieGrid title="Trending Now" category="popular" />
            <MovieGrid title="Top Rated" category="top_rated" />
            <MovieGrid title="Upcoming" category="upcoming" />
          </div>
        </div>
        
        <SmartRecommendations />
        
        {/* Admin Panel Toggle */}
        <div className="py-8 bg-gray-900">
          <div className="container mx-auto px-4 text-center">
            <Button
              onClick={() => setShowAdminPanel(!showAdminPanel)}
              variant="outline"
              className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
            >
              <Upload size={16} className="mr-2" />
              {showAdminPanel ? 'Hide' : 'Show'} Admin Panel
            </Button>
          </div>
        </div>

        {/* Admin Upload Panel */}
        {showAdminPanel && (
          <div className="py-8 bg-gray-800">
            <div className="container mx-auto px-4 max-w-2xl">
              <AdminMovieUpload />
            </div>
          </div>
        )}
        
        <ContactSection />
      </main>
    </div>
  );
};

export default Index;
