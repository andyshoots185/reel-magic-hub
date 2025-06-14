
import { useState, useEffect } from 'react';
import { Play, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

interface Movie {
  id: number;
  title: string;
  overview: string;
  backdrop_path: string;
  release_date: string;
  vote_average: number;
  genre_ids: number[];
}

const HeroSection = ({ movies }: { movies?: Movie[] }) => {
  const [currentMovie, setCurrentMovie] = useState<Movie | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (movies && movies.length > 0) {
      const randomMovie = movies[Math.floor(Math.random() * Math.min(5, movies.length))];
      setCurrentMovie(randomMovie);
    }
  }, [movies]);

  if (!currentMovie) {
    return (
      <div className="relative h-screen bg-gradient-to-r from-gray-900 to-black flex items-center justify-center">
        <div className="animate-pulse text-white text-2xl">Loading...</div>
      </div>
    );
  }

  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <div className="relative h-screen overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(https://image.tmdb.org/t/p/original${currentMovie.backdrop_path})`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
      
      <div className="relative z-10 h-full flex items-center">
        <div className="container mx-auto px-4 max-w-2xl">
          <Badge variant="secondary" className="mb-4 bg-red-600 text-white">
            Featured Movie
          </Badge>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            {currentMovie.title}
          </h1>
          
          <p className="text-xl text-gray-200 mb-8 leading-relaxed">
            {truncateText(currentMovie.overview, 200)}
          </p>
          
          <div className="flex items-center space-x-4 mb-8">
            <Badge variant="outline" className="text-yellow-400 border-yellow-400">
              ⭐ {currentMovie.vote_average.toFixed(1)}
            </Badge>
            <Badge variant="outline" className="text-blue-400 border-blue-400">
              {new Date(currentMovie.release_date).getFullYear()}
            </Badge>
          </div>
          
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <Button 
              size="lg" 
              className="bg-red-600 hover:bg-red-700 text-white font-semibold px-8 py-3 rounded-lg flex items-center space-x-2 transition-all duration-300 transform hover:scale-105"
              onClick={() => navigate(`/movie/${currentMovie.id}`)}
            >
              <Play size={24} />
              <span>Watch Now</span>
            </Button>
            
            <Button 
              variant="outline" 
              size="lg" 
              className="border-white text-white hover:bg-white hover:text-black font-semibold px-8 py-3 rounded-lg flex items-center space-x-2 transition-all duration-300"
              onClick={() => navigate(`/movie/${currentMovie.id}`)}
            >
              <Video size={24} />
              <span>More Info</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
