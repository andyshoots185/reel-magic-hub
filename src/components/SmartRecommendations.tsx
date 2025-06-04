
import { useState, useEffect } from 'react';
import { TrendingUp, Clock, Heart, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import MovieCard from './MovieCard';

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  overview: string;
  release_date: string;
  vote_average: number;
}

interface SmartRecommendationsProps {
  currentMovie?: Movie;
  userPreferences?: string[];
}

const SmartRecommendations = ({ currentMovie, userPreferences = [] }: SmartRecommendationsProps) => {
  const [recommendations, setRecommendations] = useState<Movie[]>([]);
  const [recommendationType, setRecommendationType] = useState<'trending' | 'similar' | 'personalized' | 'continue_watching'>('trending');

  useEffect(() => {
    fetchRecommendations();
  }, [currentMovie, recommendationType]);

  const fetchRecommendations = async () => {
    const API_KEY = '4e44d9029b1270a757cddc766a1bcb63';
    const BASE_URL = 'https://api.themoviedb.org/3';
    
    try {
      let endpoint = '';
      
      switch (recommendationType) {
        case 'trending':
          endpoint = '/trending/movie/day';
          break;
        case 'similar':
          endpoint = currentMovie ? `/movie/${currentMovie.id}/similar` : '/movie/popular';
          break;
        case 'personalized':
          endpoint = '/discover/movie?sort_by=popularity.desc';
          break;
        case 'continue_watching':
          // Get from localStorage (movies with watch progress)
          const watchHistory = JSON.parse(localStorage.getItem('reelflix-watch-history') || '[]');
          setRecommendations(watchHistory.filter((movie: any) => movie.watchProgress > 0 && movie.watchProgress < 90));
          return;
      }
      
      const response = await fetch(`${BASE_URL}${endpoint}?api_key=${API_KEY}`);
      const data = await response.json();
      setRecommendations(data.results?.slice(0, 6) || []);
    } catch (error) {
      console.error('Failed to fetch recommendations:', error);
    }
  };

  const recommendationTypes = [
    { key: 'trending', label: 'Trending Now', icon: TrendingUp, color: 'bg-red-600' },
    { key: 'similar', label: 'Similar Movies', icon: Heart, color: 'bg-pink-600' },
    { key: 'personalized', label: 'For You', icon: Zap, color: 'bg-yellow-600' },
    { key: 'continue_watching', label: 'Continue Watching', icon: Clock, color: 'bg-blue-600' },
  ];

  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-white">Smart Recommendations</h2>
          <div className="flex space-x-2">
            {recommendationTypes.map((type) => {
              const Icon = type.icon;
              return (
                <button
                  key={type.key}
                  onClick={() => setRecommendationType(type.key as any)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    recommendationType === type.key
                      ? `${type.color} text-white`
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  <Icon size={16} />
                  <span className="text-sm font-medium">{type.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {recommendations.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {recommendations.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        )}

        {recommendations.length === 0 && recommendationType === 'continue_watching' && (
          <div className="text-center py-12">
            <Clock className="mx-auto mb-4 text-gray-600" size={64} />
            <h3 className="text-xl font-bold text-white mb-2">No movies in progress</h3>
            <p className="text-gray-400">Start watching a movie to see it here!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SmartRecommendations;
