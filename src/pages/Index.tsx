
import { useState } from 'react';
import { Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import MovieGrid from '@/components/MovieGrid';
import SmartRecommendations from '@/components/SmartRecommendations';
import ContactSection from '@/components/ContactSection';

const Index = () => {
  return (
    <div className="min-h-screen bg-black">
      <Header />
      
      <main>
        <HeroSection />
        
        <div className="py-16">
          <div className="container mx-auto">
            <MovieGrid movies={[]} />
          </div>
        </div>
        
        <SmartRecommendations />
        <ContactSection />
      </main>
    </div>
  );
};

export default Index;
