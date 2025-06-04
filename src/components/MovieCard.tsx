
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Video, Plus, Check, Download, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

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
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useState(() => {
    // Check if movie is in watchlist
    const watchlist = JSON.parse(localStorage.getItem('reelflix-watchlist') || '[]');
    setIsInWatchlist(watchlist.some((item: any) => item.id === movie.id));
  });

  const addToWatchlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    const watchlist = JSON.parse(localStorage.getItem('reelflix-watchlist') || '[]');
    
    if (isInWatchlist) {
      // Remove from watchlist
      const updatedList = watchlist.filter((item: any) => item.id !== movie.id);
      localStorage.setItem('reelflix-watchlist', JSON.stringify(updatedList));
      setIsInWatchlist(false);
      toast({
        title: "Removed from My List",
        description: `${movie.title} has been removed from your watchlist.`,
      });
    } else {
      // Add to watchlist
      const newItem = {
        ...movie,
        addedAt: new Date().toISOString(),
      };
      watchlist.push(newItem);
      localStorage.setItem('reelflix-watchlist', JSON.stringify(watchlist));
      setIsInWatchlist(true);
      toast({
        title: "Added to My List",
        description: `${movie.title} has been added to your watchlist.`,
      });
    }
  };

  const shareMovie = (e: React.MouseEvent) => {
    e.stopPropagation();
    const shareUrl = `${window.location.origin}/movie/${movie.id}`;
    navigator.clipboard.writeText(shareUrl);
    toast({
      title: "Link Copied!",
      description: "Movie link has been copied to your clipboard.",
    });
  };

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
            
            <div className="grid grid-cols-2 gap-2">
              <Button 
                size="sm" 
                className="bg-red-600 hover:bg-red-700 text-white"
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
                onClick={addToWatchlist}
              >
                {isInWatchlist ? <Check size={16} /> : <Plus size={16} />}
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="border-green-500 text-green-400 hover:bg-green-500 hover:text-white"
                onClick={(e) => {
                  e.stopPropagation();
                  toast({
                    title: "Download Started",
                    description: `Downloading ${movie.title}...`,
                  });
                }}
              >
                <Download size={16} />
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white"
                onClick={shareMovie}
              >
                <Share2 size={16} />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieCard;
