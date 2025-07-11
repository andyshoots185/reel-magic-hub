import { useState, useEffect } from 'react';
import { Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import MovieGrid from '@/components/MovieGrid';
import SmartRecommendations from '@/components/SmartRecommendations';
import ContactSection from '@/components/ContactSection';
import TrailersSection from '@/components/TrailersSection';
import ContinueWatching from '@/components/ContinueWatching/ContinueWatching';
import { useAuth } from '@/components/Auth/AuthProvider';
import GuestView from '@/components/GuestView';
import PersonalizedRecommendations from "@/components/Recommendations/PersonalizedRecommendations";
import FriendsActivityFeed from "@/components/Social/FriendsActivityFeed";

const API_KEY = '4e44d9029b1270a757cddc766a1bcb63';
const BASE_URL = 'https://api.themoviedb.org/3';

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  backdrop_path: string;
  overview: string;
  release_date: string;
  vote_average: number;
  genre_ids: number[];
}

const Index = () => {
  const { user } = useAuth();
  const [featuredMovies, setFeaturedMovies] = useState<Movie[]>([]);
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [topRatedMovies, setTopRatedMovies] = useState<Movie[]>([]);
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);

  useEffect(() => {
    if (!user) return; // Guests should not fetch or see extra movie data
    const fetchMovies = async () => {
      try {
        const [featuredRes, popularRes, topRatedRes, trendingRes] = await Promise.all([
          fetch(`${BASE_URL}/movie/now_playing?api_key=${API_KEY}`),
          fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}`),
          fetch(`${BASE_URL}/movie/top_rated?api_key=${API_KEY}`),
          fetch(`${BASE_URL}/trending/movie/week?api_key=${API_KEY}`)
        ]);
        const [featured, popular, topRated, trending] = await Promise.all([
          featuredRes.json(),
          popularRes.json(),
          topRatedRes.json(),
          trendingRes.json()
        ]);
        setFeaturedMovies(featured.results?.slice(0, 20) || []);
        setPopularMovies(popular.results?.slice(0, 20) || []);
        setTopRatedMovies(topRated.results?.slice(0, 20) || []);
        setTrendingMovies(trending.results?.slice(0, 20) || []);
      } catch (error) {
        console.error('Error fetching movies:', error);
      }
    };
    fetchMovies();
  }, [user]);

  if (!user) {
    // Only show TrailersSection to unauthenticated users
    return <GuestView />;
  }

  return (
    <div className="min-h-screen bg-black">
      <Header />
      <main>
        <HeroSection movies={featuredMovies} />
        <div className="py-8">
          <div className="container mx-auto space-y-12">
            {user && <ContinueWatching />}
            <MovieGrid title="Now Playing" movies={featuredMovies} />
            <MovieGrid title="Popular Movies" movies={popularMovies} />
            <MovieGrid title="Top Rated" movies={topRatedMovies} />
            <MovieGrid title="Trending This Week" movies={trendingMovies} />
            <PersonalizedRecommendations />
          </div>
        </div>
        <FriendsActivityFeed />
        <TrailersSection />
        <SmartRecommendations />
        <ContactSection />
      </main>
    </div>
  );
};

export default Index;
