
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Play, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import MovieGrid from '@/components/MovieGrid';

const API_KEY = '4e44d9029b1270a757cddc766a1bcb63';
const BASE_URL = 'https://api.themoviedb.org/3';

const fetchMovieDetails = async (id: string) => {
  const response = await fetch(`${BASE_URL}/movie/${id}?api_key=${API_KEY}&append_to_response=credits,videos,similar`);
  if (!response.ok) {
    throw new Error('Failed to fetch movie details');
  }
  return response.json();
};

const MovieDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: movie, isLoading, error } = useQuery({
    queryKey: ['movie', id],
    queryFn: () => fetchMovieDetails(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-2xl animate-pulse">Loading movie details...</div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <h2 className="text-2xl mb-4">Movie not found</h2>
          <Button onClick={() => navigate('/')} variant="outline">
            <ArrowLeft className="mr-2" size={20} />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  const formatRuntime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-black">
      <Header />
      
      <main className="pt-20">
        {/* Hero Section */}
        <div className="relative h-screen overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
          
          <div className="relative z-10 h-full flex items-center">
            <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
              <div className="lg:col-span-2">
                <Button 
                  variant="ghost" 
                  onClick={() => navigate('/')}
                  className="text-white hover:text-red-400 mb-6"
                >
                  <ArrowLeft className="mr-2" size={20} />
                  Back to Home
                </Button>
                
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                  {movie.title}
                </h1>
                
                <div className="flex flex-wrap items-center gap-4 mb-6">
                  <Badge variant="outline" className="text-yellow-400 border-yellow-400">
                    ⭐ {movie.vote_average.toFixed(1)}
                  </Badge>
                  <Badge variant="outline" className="text-blue-400 border-blue-400">
                    {new Date(movie.release_date).getFullYear()}
                  </Badge>
                  <Badge variant="outline" className="text-green-400 border-green-400">
                    {formatRuntime(movie.runtime)}
                  </Badge>
                  <Badge variant="outline" className="text-purple-400 border-purple-400">
                    {movie.status}
                  </Badge>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {movie.genres.map((genre: any) => (
                    <Badge key={genre.id} variant="secondary" className="bg-red-600 text-white">
                      {genre.name}
                    </Badge>
                  ))}
                </div>
                
                <p className="text-xl text-gray-200 mb-8 leading-relaxed max-w-3xl">
                  {movie.overview}
                </p>
                
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-8">
                  <Button 
                    size="lg" 
                    className="bg-red-600 hover:bg-red-700 text-white font-semibold px-8 py-3 rounded-lg flex items-center space-x-2 transition-all duration-300 transform hover:scale-105"
                  >
                    <Play size={24} />
                    <span>Watch Now</span>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="border-white text-white hover:bg-white hover:text-black font-semibold px-8 py-3 rounded-lg flex items-center space-x-2 transition-all duration-300"
                  >
                    <Video size={24} />
                    <span>Watch Trailer</span>
                  </Button>
                </div>
                
                {/* Movie Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-white">{formatCurrency(movie.budget)}</div>
                    <div className="text-gray-400">Budget</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">{formatCurrency(movie.revenue)}</div>
                    <div className="text-gray-400">Revenue</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">{movie.popularity.toFixed(0)}</div>
                    <div className="text-gray-400">Popularity</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">{movie.vote_count}</div>
                    <div className="text-gray-400">Votes</div>
                  </div>
                </div>
              </div>
              
              <div className="lg:col-span-1 flex justify-center">
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  className="rounded-lg shadow-2xl max-w-sm w-full"
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Cast Section */}
        <section className="py-16 bg-gray-900">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-white mb-8">Cast</h2>
            <div className="overflow-x-auto">
              <div className="flex space-x-4 pb-4">
                {movie.credits.cast.slice(0, 10).map((actor: any) => (
                  <div key={actor.id} className="flex-none w-32 text-center">
                    <img
                      src={actor.profile_path 
                        ? `https://image.tmdb.org/t/p/w185${actor.profile_path}`
                        : '/placeholder.svg'
                      }
                      alt={actor.name}
                      className="w-full h-48 object-cover rounded-lg mb-2"
                    />
                    <h3 className="text-white font-semibold text-sm">{actor.name}</h3>
                    <p className="text-gray-400 text-xs">{actor.character}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
        
        {/* Similar Movies */}
        <div className="py-16">
          <div className="container mx-auto">
            <MovieGrid title="Similar Movies" movies={movie.similar.results.slice(0, 12)} />
          </div>
        </div>
        
        <footer className="bg-gray-900 text-white py-12">
          <div className="container mx-auto px-4 text-center">
            <h3 className="text-2xl font-bold mb-4 text-red-500">ReelFlix</h3>
            <p className="text-gray-400">Your ultimate movie streaming destination</p>
            <p className="text-gray-500 text-sm mt-4">© 2024 ReelFlix. All rights reserved.</p>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default MovieDetails;
