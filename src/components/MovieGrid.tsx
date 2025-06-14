
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
  title: string;
  movies: Movie[];
}

const MovieGrid = ({ title, movies }: MovieGridProps) => {
  if (!movies || movies.length === 0) {
    return null;
  }

  return (
    <section className="mb-12">
      <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 px-4">
        {title}
      </h2>
      
      <div className="px-4 overflow-x-auto">
        <div className="flex space-x-4 pb-4">
          {movies.map((movie) => (
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
