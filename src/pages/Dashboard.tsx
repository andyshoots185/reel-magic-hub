
import React from 'react';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import MovieGrid from '@/components/MovieGrid';
import ContinueWatching from '@/components/ContinueWatching/ContinueWatching';
import SmartRecommendations from '@/components/SmartRecommendations';

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-black">
      <Header />
      <HeroSection />
      <ContinueWatching />
      <SmartRecommendations />
      
      <section className="py-12">
        <div className="container mx-auto px-4">
          <MovieGrid title="Popular Movies" category="popular" />
          <MovieGrid title="Trending This Week" category="trending" />
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
