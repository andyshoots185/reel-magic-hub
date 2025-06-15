import { useQuery } from '@tanstack/react-query';
import Header from '@/components/Header';
import MovieGrid from '@/components/MovieGrid';
import SubscriptionModal from "@/components/Subscription/SubscriptionModal";

const API_KEY = '4e44d9029b1270a757cddc766a1bcb63';
const BASE_URL = 'https://api.themoviedb.org/3';

const fetchMovies = async (endpoint: string) => {
  const response = await fetch(`${BASE_URL}${endpoint}?api_key=${API_KEY}`);
  if (!response.ok) {
    throw new Error('Failed to fetch movies');
  }
  const data = await response.json();
  return data.results;
};

const fetchMoviesByGenre = async (genreId: number) => {
  const response = await fetch(`${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genreId}&sort_by=popularity.desc`);
  if (!response.ok) {
    throw new Error('Failed to fetch movies by genre');
  }
  const data = await response.json();
  return data.results;
};

const Movies = () => {
  const { data: actionMovies = [], isLoading: loadingAction } = useQuery({
    queryKey: ['movies', 'action'],
    queryFn: () => fetchMoviesByGenre(28), // Action genre ID
  });

  const { data: comedyMovies = [], isLoading: loadingComedy } = useQuery({
    queryKey: ['movies', 'comedy'],
    queryFn: () => fetchMoviesByGenre(35), // Comedy genre ID
  });

  const { data: dramaMovies = [], isLoading: loadingDrama } = useQuery({
    queryKey: ['movies', 'drama'],
    queryFn: () => fetchMoviesByGenre(18), // Drama genre ID
  });

  const { data: horrorMovies = [], isLoading: loadingHorror } = useQuery({
    queryKey: ['movies', 'horror'],
    queryFn: () => fetchMoviesByGenre(27), // Horror genre ID
  });

  const { data: romanceMovies = [], isLoading: loadingRomance } = useQuery({
    queryKey: ['movies', 'romance'],
    queryFn: () => fetchMoviesByGenre(10749), // Romance genre ID
  });

  const { data: thrillerMovies = [], isLoading: loadingThriller } = useQuery({
    queryKey: ['movies', 'thriller'],
    queryFn: () => fetchMoviesByGenre(53), // Thriller genre ID
  });

  const { data: sciFiMovies = [], isLoading: loadingSciFi } = useQuery({
    queryKey: ['movies', 'sci-fi'],
    queryFn: () => fetchMoviesByGenre(878), // Sci-Fi genre ID
  });

  const { data: animationMovies = [], isLoading: loadingAnimation } = useQuery({
    queryKey: ['movies', 'animation'],
    queryFn: () => fetchMoviesByGenre(16), // Animation genre ID
  });

  const { data: documentaryMovies = [], isLoading: loadingDocumentary } = useQuery({
    queryKey: ['movies', 'documentary'],
    queryFn: () => fetchMoviesByGenre(99), // Documentary genre ID
  });

  const { data: familyMovies = [], isLoading: loadingFamily } = useQuery({
    queryKey: ['movies', 'family'],
    queryFn: () => fetchMoviesByGenre(10751), // Family genre ID
  });

  const { data: fantasyMovies = [], isLoading: loadingFantasy } = useQuery({
    queryKey: ['movies', 'fantasy'],
    queryFn: () => fetchMoviesByGenre(14), // Fantasy genre ID
  });

  const { data: mysteryMovies = [], isLoading: loadingMystery } = useQuery({
    queryKey: ['movies', 'mystery'],
    queryFn: () => fetchMoviesByGenre(9648), // Mystery genre ID
  });

  const isLoading = loadingAction || loadingComedy || loadingDrama || loadingHorror || 
                   loadingRomance || loadingThriller || loadingSciFi || loadingAnimation ||
                   loadingDocumentary || loadingFamily || loadingFantasy || loadingMystery;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-2xl animate-pulse">Loading Movies...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <Header />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-12 text-center">
            Movies Collection
          </h1>
          {/* Subscription section - can move to dedicated page/modal as needed */}
          <div className="mb-12 flex justify-center">
            <SubscriptionModal />
          </div>
          <MovieGrid title="🎬 Action & Adventure" movies={actionMovies} />
          <MovieGrid title="😂 Comedy" movies={comedyMovies} />
          <MovieGrid title="🎭 Drama" movies={dramaMovies} />
          <MovieGrid title="👻 Horror" movies={horrorMovies} />
          <MovieGrid title="💕 Romance" movies={romanceMovies} />
          <MovieGrid title="🔥 Thriller" movies={thrillerMovies} />
          <MovieGrid title="🚀 Science Fiction" movies={sciFiMovies} />
          <MovieGrid title="🎨 Animation" movies={animationMovies} />
          <MovieGrid title="📚 Documentary" movies={documentaryMovies} />
          <MovieGrid title="👨‍👩‍👧‍👦 Family" movies={familyMovies} />
          <MovieGrid title="🔮 Fantasy" movies={fantasyMovies} />
          <MovieGrid title="🔍 Mystery" movies={mysteryMovies} />
        </div>
      </main>
    </div>
  );
};

export default Movies;
