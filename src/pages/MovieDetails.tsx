
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Header from '@/components/Header';
import MoviePlayer from '@/components/MoviePlayer';
import MovieRating from '@/components/MovieRating';
import WatchParty from '@/components/WatchParty';
import SocialShare from '@/components/SocialShare';
import MovieSocial from '@/components/SocialFeatures/MovieSocial';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Plus, Heart, Share2 } from 'lucide-react';
import { movieService } from '@/services/movieService';
import ProtectedContent from '@/components/ProtectedContent';
import SubscriptionModal from '@/components/SubscriptionModal';
import { useSubscription } from '@/contexts/SubscriptionContext';

const MovieDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { isSubscribed, checkSubscription } = useSubscription();
  const [showPlayer, setShowPlayer] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);

  const { data: movie, isLoading } = useQuery({
    queryKey: ['movie', id],
    queryFn: () => movieService.getMovieDetails(Number(id)),
    enabled: !!id,
  });

  const handleWatchClick = () => {
    if (!isSubscribed) {
      setShowSubscriptionModal(true);
    } else {
      setShowPlayer(true);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-500"></div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-black">
        <Header />
        <div className="pt-24 pb-16 text-center text-white">
          <h1 className="text-2xl">Movie not found</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <Header />
      
      {showPlayer ? (
        <ProtectedContent>
          <MoviePlayer 
            movieId={movie.id}
            title={movie.title}
            onClose={() => setShowPlayer(false)}
          />
        </ProtectedContent>
      ) : (
        <div className="pt-16">
          {/* Hero Section */}
          <div 
            className="relative h-screen bg-cover bg-center"
            style={{
              backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`
            }}
          >
            <div className="absolute inset-0 bg-black bg-opacity-60" />
            <div className="absolute inset-0 flex items-center">
              <div className="container mx-auto px-4">
                <div className="max-w-2xl">
                  <h1 className="text-5xl font-bold text-white mb-4">{movie.title}</h1>
                  <p className="text-xl text-gray-300 mb-6">{movie.overview}</p>
                  
                  <div className="flex items-center space-x-4 mb-8">
                    <Badge variant="secondary">{movie.release_date?.split('-')[0]}</Badge>
                    <div className="flex items-center">
                      <span className="text-yellow-500 mr-1">★</span>
                      <span className="text-white">{movie.vote_average?.toFixed(1)}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <Button 
                      size="lg" 
                      className="bg-red-600 hover:bg-red-700"
                      onClick={handleWatchClick}
                    >
                      <Play className="w-5 h-5 mr-2" />
                      {isSubscribed ? 'Watch Now' : 'Subscribe to Watch'}
                    </Button>
                    <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-black">
                      <Plus className="w-5 h-5 mr-2" />
                      My List
                    </Button>
                    <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-black">
                      <Heart className="w-5 h-5 mr-2" />
                      Like
                    </Button>
                    <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-black">
                      <Share2 className="w-5 h-5 mr-2" />
                      Share
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content Sections */}
          <div className="py-12">
            <div className="container mx-auto px-4 space-y-12">
              <ProtectedContent showSubscriptionPrompt={false}>
                <MovieRating movieId={movie.id} movieTitle={movie.title} />
                <WatchParty movieId={movie.id} movieTitle={movie.title} />
                <SocialShare 
                  movieId={movie.id}
                  movieTitle={movie.title}
                  description={movie.overview || ''}
                />
                <MovieSocial movieId={movie.id} />
              </ProtectedContent>
            </div>
          </div>
        </div>
      )}

      <SubscriptionModal
        isOpen={showSubscriptionModal}
        onClose={() => setShowSubscriptionModal(false)}
        onSubscribe={() => {
          checkSubscription();
          setShowSubscriptionModal(false);
        }}
      />
    </div>
  );
};

export default MovieDetails;
