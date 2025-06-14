
import { useQuery } from '@tanstack/react-query';
import { movieService } from '@/services/movieService';
import MovieCard from './MovieCard';

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  overview: string;
  release_date: string;
  vote_average: number;
}

interface MovieGridProps {
  title?: string;
  movies?: Movie[];
  category?: 'popular' | 'trending';
}

const MovieGrid = ({ title = "Movies", movies, category = 'popular' }: MovieGridProps) => {
  const { data: fetchedMovies, isLoading } = useQuery({
    queryKey: ['movies', category],
    queryFn: () => category === 'popular' ? movieService.getPopularMovies() : movieService.getTrendingMovies(),
    enabled: !movies, // Only fetch if movies are not provided
  });

  const displayMovies = movies || fetchedMovies || [];

  if (isLoading) {
    return (
      <section className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 px-4">
          {title}
        </h2>
        <div className="px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-700 aspect-[2/3] rounded-lg"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!displayMovies || displayMovies.length === 0) {
    return null;
  }

  return (
    <section className="mb-12">
      <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 px-4">
        {title}
      </h2>
      
      <div className="px-4 overflow-x-auto">
        <div className="flex space-x-4 pb-4">
          {displayMovies.map((movie) => (
            <div key={movie.id} className="flex-none w-48 sm:w-56">
              <MovieCard movie={movie} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MovieGrid;
