
import { useQuery } from '@tanstack/react-query';
import Header from '@/components/Header';
import MovieGrid from '@/components/MovieGrid';

const API_KEY = '4e44d9029b1270a757cddc766a1bcb63';
const BASE_URL = 'https://api.themoviedb.org/3';

const fetchTVShows = async (endpoint: string) => {
  const response = await fetch(`${BASE_URL}${endpoint}?api_key=${API_KEY}`);
  if (!response.ok) {
    throw new Error('Failed to fetch TV shows');
  }
  const data = await response.json();
  return data.results;
};

const fetchTVShowsByGenre = async (genreId: number) => {
  const response = await fetch(`${BASE_URL}/discover/tv?api_key=${API_KEY}&with_genres=${genreId}&sort_by=popularity.desc`);
  if (!response.ok) {
    throw new Error('Failed to fetch TV shows by genre');
  }
  const data = await response.json();
  return data.results;
};

// Mock Ugandan shows data (since TMDB might not have extensive Ugandan content)
const ugandanShows = [
  {
    id: 100001,
    title: "Deception",
    poster_path: "/placeholder.svg",
    overview: "A thrilling Ugandan drama series exploring betrayal and family secrets in modern Kampala.",
    release_date: "2025-01-15",
    vote_average: 8.2
  },
  {
    id: 100002,
    title: "Kampala Nights",
    poster_path: "/placeholder.svg",
    overview: "Follow the lives of young professionals navigating love, career, and friendship in Uganda's capital.",
    release_date: "2024-11-20",
    vote_average: 7.8
  },
  {
    id: 100003,
    title: "The Pearl Chronicles",
    poster_path: "/placeholder.svg",
    overview: "A historical drama showcasing Uganda's rich cultural heritage and the journey to independence.",
    release_date: "2024-12-05",
    vote_average: 8.5
  },
  {
    id: 100004,
    title: "Busega Stories",
    poster_path: "/placeholder.svg",
    overview: "Comedy-drama series set in Busega, following the humorous daily lives of local residents.",
    release_date: "2025-02-01",
    vote_average: 7.9
  },
  {
    id: 100005,
    title: "Muyenga Heights",
    poster_path: "/placeholder.svg",
    overview: "Upscale drama about wealthy families in Kampala's elite neighborhoods and their dark secrets.",
    release_date: "2024-10-12",
    vote_average: 8.1
  },
  {
    id: 100006,
    title: "The Fisherman's Tale",
    poster_path: "/placeholder.svg",
    overview: "Environmental drama highlighting the challenges faced by Lake Victoria fishing communities.",
    release_date: "2024-09-18",
    vote_average: 8.3
  }
];

const urbanShows = [
  {
    id: 200001,
    title: "City Pulse",
    poster_path: "/placeholder.svg",
    overview: "Urban drama following young entrepreneurs in Africa's fastest-growing cities.",
    release_date: "2024-12-10",
    vote_average: 8.0
  },
  {
    id: 200002,
    title: "Street Chronicles",
    poster_path: "/placeholder.svg",
    overview: "Gritty series exploring street culture, hip-hop, and urban survival in modern Africa.",
    release_date: "2024-11-25",
    vote_average: 7.7
  },
  {
    id: 200003,
    title: "Metro Life",
    poster_path: "/placeholder.svg",
    overview: "Comedy-drama about millennials navigating relationships and careers in the big city.",
    release_date: "2025-01-08",
    vote_average: 7.5
  },
  {
    id: 200004,
    title: "Urban Kings",
    poster_path: "/placeholder.svg",
    overview: "Crime drama series about power struggles in the underground world of urban communities.",
    release_date: "2024-10-30",
    vote_average: 8.2
  },
  {
    id: 200005,
    title: "The Block",
    poster_path: "/placeholder.svg",
    overview: "Coming-of-age series set in urban housing projects, focusing on community and resilience.",
    release_date: "2024-12-15",
    vote_average: 7.9
  }
];

const TVShows = () => {
  const { data: popularTVShows = [], isLoading: loadingPopular } = useQuery({
    queryKey: ['tv', 'popular'],
    queryFn: () => fetchTVShows('/tv/popular'),
  });

  const { data: topRatedTVShows = [], isLoading: loadingTopRated } = useQuery({
    queryKey: ['tv', 'top_rated'],
    queryFn: () => fetchTVShows('/tv/top_rated'),
  });

  const { data: dramaTVShows = [], isLoading: loadingDrama } = useQuery({
    queryKey: ['tv', 'drama'],
    queryFn: () => fetchTVShowsByGenre(18), // Drama genre ID
  });

  const { data: comedyTVShows = [], isLoading: loadingComedy } = useQuery({
    queryKey: ['tv', 'comedy'],
    queryFn: () => fetchTVShowsByGenre(35), // Comedy genre ID
  });

  const { data: actionTVShows = [], isLoading: loadingAction } = useQuery({
    queryKey: ['tv', 'action'],
    queryFn: () => fetchTVShowsByGenre(10759), // Action & Adventure genre ID
  });

  const { data: sciFiTVShows = [], isLoading: loadingSciFi } = useQuery({
    queryKey: ['tv', 'sci-fi'],
    queryFn: () => fetchTVShowsByGenre(10765), // Sci-Fi & Fantasy genre ID
  });

  const { data: crimeTVShows = [], isLoading: loadingCrime } = useQuery({
    queryKey: ['tv', 'crime'],
    queryFn: () => fetchTVShowsByGenre(80), // Crime genre ID
  });

  const { data: documentaryTVShows = [], isLoading: loadingDocumentary } = useQuery({
    queryKey: ['tv', 'documentary'],
    queryFn: () => fetchTVShowsByGenre(99), // Documentary genre ID
  });

  const isLoading = loadingPopular || loadingTopRated || loadingDrama || loadingComedy || 
                   loadingAction || loadingSciFi || loadingCrime || loadingDocumentary;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-2xl animate-pulse">Loading TV Shows...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-12 text-center">
            TV Shows Collection
          </h1>
          
          {/* Ugandan Shows Section */}
          <MovieGrid title="🇺🇬 Trending Ugandan Shows 2025" movies={ugandanShows} />
          
          {/* Urban Shows Section */}
          <MovieGrid title="🏙️ Urban Shows" movies={urbanShows} />
          
          {/* International Shows */}
          <MovieGrid title="🔥 Popular TV Shows" movies={popularTVShows} />
          <MovieGrid title="⭐ Top Rated" movies={topRatedTVShows} />
          <MovieGrid title="🎭 Drama Series" movies={dramaTVShows} />
          <MovieGrid title="😂 Comedy Series" movies={comedyTVShows} />
          <MovieGrid title="🎬 Action & Adventure" movies={actionTVShows} />
          <MovieGrid title="🚀 Sci-Fi & Fantasy" movies={sciFiTVShows} />
          <MovieGrid title="🔍 Crime & Mystery" movies={crimeTVShows} />
          <MovieGrid title="📚 Documentary Series" movies={documentaryTVShows} />
        </div>
      </main>
    </div>
  );
};

export default TVShows;
