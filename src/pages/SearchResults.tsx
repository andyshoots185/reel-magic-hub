
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import MovieCard from '@/components/MovieCard';

const API_KEY = '4e44d9029b1270a757cddc766a1bcb63';
const BASE_URL = 'https://api.themoviedb.org/3';

const searchMovies = async (query: string) => {
  const response = await fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`);
  if (!response.ok) {
    throw new Error('Failed to search movies');
  }
  const data = await response.json();
  return data.results;
};

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get('q') || '';

  const { data: movies = [], isLoading, error } = useQuery({
    queryKey: ['search', query],
    queryFn: () => searchMovies(query),
    enabled: !!query,
  });

  return (
    <div className="min-h-screen bg-black">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center mb-8">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/')}
              className="text-white hover:text-red-400 mr-4"
            >
              <ArrowLeft className="mr-2" size={20} />
              Back
            </Button>
            <h1 className="text-3xl font-bold text-white">
              Search Results for "{query}"
            </h1>
          </div>
          
          {isLoading && (
            <div className="text-center text-white text-xl">
              Searching movies...
            </div>
          )}
          
          {error && (
            <div className="text-center text-red-400 text-xl">
              Error searching movies. Please try again.
            </div>
          )}
          
          {!isLoading && !error && movies.length === 0 && (
            <div className="text-center text-gray-400 text-xl">
              No movies found for "{query}"
            </div>
          )}
          
          {!isLoading && !error && movies.length > 0 && (
            <>
              <p className="text-gray-400 mb-8">
                Found {movies.length} results
              </p>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                {movies.map((movie: any) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default SearchResults;
