
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  overview: string;
  release_date: string;
  vote_average: number;
}

const MovieCard = ({ movie }: { movie: Movie }) => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  return (
    <div 
      className="relative group cursor-pointer transition-all duration-300 transform hover:scale-110 hover:z-20"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => navigate(`/movie/${movie.id}`)}
    >
      <div className="relative overflow-hidden rounded-lg bg-gray-800">
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          className="w-full h-64 sm:h-80 object-cover transition-transform duration-300 group-hover:scale-110"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/placeholder.svg';
          }}
        />
        
        {isHovered && (
          <div className="absolute inset-0 bg-black/80 flex flex-col justify-end p-4 transition-opacity duration-300">
            <h3 className="text-white font-bold text-lg mb-2 line-clamp-2">
              {movie.title}
            </h3>
            
            <p className="text-gray-300 text-sm mb-3 line-clamp-3">
              {movie.overview}
            </p>
            
            <div className="flex items-center justify-between mb-3">
              <Badge variant="outline" className="text-yellow-400 border-yellow-400 text-xs">
                ⭐ {movie.vote_average.toFixed(1)}
              </Badge>
              <Badge variant="outline" className="text-blue-400 border-blue-400 text-xs">
                {new Date(movie.release_date).getFullYear()}
              </Badge>
            </div>
            
            <div className="flex space-x-2">
              <Button 
                size="sm" 
                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/movie/${movie.id}`);
                }}
              >
                <Play size={16} className="mr-1" />
                Watch
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="border-white text-white hover:bg-white hover:text-black"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/movie/${movie.id}`);
                }}
              >
                <Video size={16} />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieCard;
