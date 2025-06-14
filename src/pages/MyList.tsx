
import { useState, useEffect } from 'react';
import { Play, Download, Trash2, Clock, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import MoviePlayer from '@/components/MoviePlayer';
import { getMovieStreamingData, MovieStreamData } from '@/services/movieService';

interface WatchListItem {
  id: number;
  title: string;
  poster_path: string;
  overview: string;
  release_date: string;
  vote_average: number;
  addedAt: string;
  watchProgress?: number;
  isDownloaded?: boolean;
  downloadProgress?: number;
}

const MyList = () => {
  const [watchList, setWatchList] = useState<WatchListItem[]>([]);
  const [currentMovie, setCurrentMovie] = useState<MovieStreamData | null>(null);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const [downloadingMovies, setDownloadingMovies] = useState<Set<number>>(new Set());
  const { toast } = useToast();

  useEffect(() => {
    // Load watchlist from localStorage
    const savedWatchlist = localStorage.getItem('reelflix-watchlist');
    if (savedWatchlist) {
      setWatchList(JSON.parse(savedWatchlist));
    }
  }, []);

  const removeFromWatchlist = (movieId: number) => {
    const updatedList = watchList.filter(movie => movie.id !== movieId);
    setWatchList(updatedList);
    localStorage.setItem('reelflix-watchlist', JSON.stringify(updatedList));
    toast({
      title: "Removed from My List",
      description: "Movie has been removed from your watchlist.",
    });
  };

  const watchMovie = async (movie: WatchListItem) => {
    try {
      const streamData = await getMovieStreamingData(movie.id);
      setCurrentMovie(streamData);
      setIsPlayerOpen(true);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load movie stream. Please try again.",
        variant: "destructive",
      });
    }
  };

  const downloadMovie = (movie: WatchListItem) => {
    if (movie.isDownloaded) {
      toast({
        title: "Already Downloaded",
        description: "This movie is already in your downloads.",
      });
      return;
    }

    setDownloadingMovies(prev => new Set(prev).add(movie.id));
    
    // Simulate download progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        
        // Mark as downloaded
        const updatedList = watchList.map(item => 
          item.id === movie.id 
            ? { ...item, isDownloaded: true, downloadProgress: 100 }
            : item
        );
        setWatchList(updatedList);
        localStorage.setItem('reelflix-watchlist', JSON.stringify(updatedList));
        setDownloadingMovies(prev => {
          const newSet = new Set(prev);
          newSet.delete(movie.id);
          return newSet;
        });
        
        toast({
          title: "Download Complete",
          description: `${movie.title} has been downloaded successfully.`,
        });
      } else {
        // Update progress
        const updatedList = watchList.map(item => 
          item.id === movie.id 
            ? { ...item, downloadProgress: Math.floor(progress) }
            : item
        );
        setWatchList(updatedList);
      }
    }, 500);

    toast({
      title: "Download Started",
      description: `Downloading ${movie.title}...`,
    });
  };

  if (watchList.length === 0) {
    return (
      <div className="min-h-screen bg-black">
        <Header />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-8">My List</h1>
            <div className="text-gray-400 text-lg">
              <p>Your watchlist is empty.</p>
              <p className="mt-2">Start adding movies you want to watch later!</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-12 text-center">
            My List
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {watchList.map((movie) => (
              <div key={movie.id} className="bg-gray-900 rounded-lg overflow-hidden group hover:scale-105 transition-transform duration-300">
                <div className="relative">
                  <img
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    className="w-full h-64 object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder.svg';
                    }}
                  />
                  
                  {movie.watchProgress && movie.watchProgress > 0 && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-600">
                      <div 
                        className="h-full bg-red-600 transition-all duration-300"
                        style={{ width: `${movie.watchProgress}%` }}
                      />
                    </div>
                  )}
                  
                  {movie.isDownloaded && (
                    <Badge className="absolute top-2 left-2 bg-green-600 text-white">
                      Downloaded
                    </Badge>
                  )}
                  
                  {downloadingMovies.has(movie.id) && (
                    <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                      <div className="text-center text-white">
                        <div className="text-sm mb-2">Downloading...</div>
                        <div className="w-24 h-2 bg-gray-600 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-blue-600 transition-all duration-300"
                            style={{ width: `${movie.downloadProgress || 0}%` }}
                          />
                        </div>
                        <div className="text-xs mt-1">{movie.downloadProgress || 0}%</div>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="p-4">
                  <h3 className="text-white font-bold text-lg mb-2 line-clamp-1">
                    {movie.title}
                  </h3>
                  
                  <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                    {movie.overview}
                  </p>
                  
                  <div className="flex items-center justify-between mb-3 text-xs text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Calendar size={12} />
                      <span>Added {new Date(movie.addedAt).toLocaleDateString()}</span>
                    </div>
                    {movie.watchProgress && movie.watchProgress > 0 && (
                      <div className="flex items-center space-x-1">
                        <Clock size={12} />
                        <span>{movie.watchProgress}% watched</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                      onClick={() => watchMovie(movie)}
                    >
                      <Play size={16} className="mr-1" />
                      {movie.watchProgress && movie.watchProgress > 0 ? 'Continue' : 'Watch'}
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="border-gray-600 text-gray-300 hover:bg-gray-800"
                      onClick={() => downloadMovie(movie)}
                      disabled={downloadingMovies.has(movie.id)}
                    >
                      <Download size={16} />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                      onClick={() => removeFromWatchlist(movie.id)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      
      {isPlayerOpen && currentMovie && (
        <MoviePlayer
          streamData={currentMovie}
          onClose={() => {
            setIsPlayerOpen(false);
            setCurrentMovie(null);
          }}
        />
      )}
    </div>
  );
};

export default MyList;
