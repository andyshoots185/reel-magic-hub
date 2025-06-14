
import React from 'react';
import Header from '@/components/Header';
import MovieGrid from '@/components/MovieGrid';
import ProtectedContent from '@/components/ProtectedContent';

const Movies = () => {
  return (
    <div className="min-h-screen bg-black">
      <Header />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-white mb-8">Movies</h1>
          <ProtectedContent>
            <MovieGrid title="Popular Movies" category="popular" />
            <MovieGrid title="Trending Movies" category="trending" />
          </ProtectedContent>
        </div>
      </div>
    </div>
  );
};

export default Movies;
