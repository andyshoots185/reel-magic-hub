import { useQuery } from '@tanstack/react-query';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import MovieGrid from '@/components/MovieGrid';
import SmartRecommendations from '@/components/SmartRecommendations';
import ContactSection from '@/components/ContactSection';

const API_KEY = '4e44d9029b1270a757cddc766a1bcb63'; // TMDB API key (public)
const BASE_URL = 'https://api.themoviedb.org/3';

const fetchMovies = async (endpoint: string) => {
  const response = await fetch(`${BASE_URL}${endpoint}?api_key=${API_KEY}`);
  if (!response.ok) {
    throw new Error('Failed to fetch movies');
  }
  const data = await response.json();
  return data.results;
};

const Index = () => {
  const { data: trendingMovies = [], isLoading: loadingTrending } = useQuery({
    queryKey: ['movies', 'trending'],
    queryFn: () => fetchMovies('/trending/movie/week'),
  });

  const { data: popularMovies = [], isLoading: loadingPopular } = useQuery({
    queryKey: ['movies', 'popular'],
    queryFn: () => fetchMovies('/movie/popular'),
  });

  const { data: topRatedMovies = [], isLoading: loadingTopRated } = useQuery({
    queryKey: ['movies', 'top_rated'],
    queryFn: () => fetchMovies('/movie/top_rated'),
  });

  const { data: upcomingMovies = [], isLoading: loadingUpcoming } = useQuery({
    queryKey: ['movies', 'upcoming'],
    queryFn: () => fetchMovies('/movie/upcoming'),
  });

  const { data: nowPlayingMovies = [], isLoading: loadingNowPlaying } = useQuery({
    queryKey: ['movies', 'now_playing'],
    queryFn: () => fetchMovies('/movie/now_playing'),
  });

  const isLoading = loadingTrending || loadingPopular || loadingTopRated || loadingUpcoming || loadingNowPlaying;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-2xl animate-pulse">Loading ReelFlix...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <Header />
      
      <main>
        <HeroSection movies={trendingMovies} />
        
        <div className="relative z-10 -mt-32">
          <MovieGrid title="Trending Now" movies={trendingMovies} />
          <MovieGrid title="Popular Movies" movies={popularMovies} />
          <MovieGrid title="Top Rated" movies={topRatedMovies} />
          <MovieGrid title="Now Playing" movies={nowPlayingMovies} />
          <MovieGrid title="Coming Soon" movies={upcomingMovies} />
          
          {/* Smart Recommendations */}
          <SmartRecommendations />
        </div>
        
        {/* Contact Section */}
        <ContactSection />
        
        <footer className="bg-gray-900 text-white py-12">
          <div className="container mx-auto px-4 text-center">
            <h3 className="text-2xl font-bold mb-4 text-red-500">ReelFlix</h3>
            <p className="text-gray-400">Your ultimate movie streaming destination</p>
            <div className="flex justify-center space-x-6 mt-6 text-sm text-gray-500">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Help Center</a>
              <a href="/feedback" className="hover:text-white transition-colors">Feedback</a>
            </div>
            <p className="text-gray-500 text-sm mt-4">© 2024 ReelFlix. All rights reserved.</p>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Index;
