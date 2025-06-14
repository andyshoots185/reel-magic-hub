
import { useState, useEffect } from 'react';
import { Play, Youtube } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import YouTubePlayer from './YouTubePlayer';

const API_KEY = '4e44d9029b1270a757cddc766a1bcb63';
const BASE_URL = 'https://api.themoviedb.org/3';

interface Trailer {
  id: string;
  key: string;
  name: string;
  type: string;
  movieTitle: string;
  moviePoster: string;
  movieId: number;
}

const TrailersSection = () => {
  const [trailers, setTrailers] = useState<Trailer[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTrailer, setSelectedTrailer] = useState<Trailer | null>(null);

  // Additional popular movie trailers to showcase
  const featuredTrailers = [
    {
      id: 'featured-1',
      key: 'TcMBFSGVi1c',
      name: 'Official Trailer',
      type: 'Trailer',
      movieTitle: 'Avatar: The Way of Water',
      moviePoster: '/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg',
      movieId: 76600
    },
    {
      id: 'featured-2',
      key: 'hA6hldpSTF8',
      name: 'Official Trailer',
      type: 'Trailer',
      movieTitle: 'Avengers: Endgame',
      moviePoster: '/or06FN3Dka5tukK1e9sl16pB3iy.jpg',
      movieId: 299534
    },
    {
      id: 'featured-3',
      key: 'vOUVVDWdXbo',
      name: 'Main Trailer',
      type: 'Trailer',
      movieTitle: 'The Batman',
      moviePoster: '/74xTEgt7R36Fpooo50r9T25onhq.jpg',
      movieId: 414906
    }
  ];

  useEffect(() => {
    const fetchTrailers = async () => {
      try {
        // Get popular movies first
        const moviesResponse = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}`);
        const moviesData = await moviesResponse.json();
        const movies = moviesData.results?.slice(0, 9) || [];

        // Fetch trailers for each movie
        const trailersPromises = movies.map(async (movie: any) => {
          try {
            const videosResponse = await fetch(`${BASE_URL}/movie/${movie.id}/videos?api_key=${API_KEY}`);
            const videosData = await videosResponse.json();
            const movieTrailers = videosData.results?.filter((video: any) => 
              video.type === 'Trailer' && video.site === 'YouTube'
            ) || [];

            return movieTrailers.slice(0, 1).map((trailer: any) => ({
              id: trailer.id,
              key: trailer.key,
              name: trailer.name,
              type: trailer.type,
              movieTitle: movie.title,
              moviePoster: movie.poster_path,
              movieId: movie.id
            }));
          } catch (error) {
            console.error(`Error fetching trailers for movie ${movie.id}:`, error);
            return [];
          }
        });

        const allTrailers = await Promise.all(trailersPromises);
        const flatTrailers = allTrailers.flat();
        
        // Combine with featured trailers and remove duplicates
        const combinedTrailers = [...featuredTrailers, ...flatTrailers]
          .filter((trailer, index, self) => 
            index === self.findIndex(t => t.key === trailer.key)
          )
          .slice(0, 12);
          
        setTrailers(combinedTrailers);
      } catch (error) {
        console.error('Error fetching trailers:', error);
        // Fallback to featured trailers only
        setTrailers(featuredTrailers);
      } finally {
        setLoading(false);
      }
    };

    fetchTrailers();
  }, []);

  const playTrailer = (trailer: Trailer) => {
    setSelectedTrailer(trailer);
  };

  const closePlayer = () => {
    setSelectedTrailer(null);
  };

  if (loading) {
    return (
      <section className="bg-gradient-to-b from-gray-900 to-black py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Latest Trailers</h2>
          <div className="flex justify-center">
            <div className="animate-pulse text-white">Loading amazing trailers...</div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-gradient-to-b from-gray-900 to-black py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Latest Movie Trailers
          </h2>
          <p className="text-gray-400 text-lg">Watch the newest movie trailers in stunning HD quality</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {trailers.map((trailer) => (
            <Card key={trailer.id} className="bg-gray-800/50 border-gray-700 overflow-hidden group hover:transform hover:scale-105 transition-all duration-300 backdrop-blur-sm">
              <CardContent className="p-0">
                <div className="relative">
                  <img
                    src={`https://image.tmdb.org/t/p/w500${trailer.moviePoster}`}
                    alt={trailer.movieTitle}
                    className="w-full h-64 object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Button
                        onClick={() => playTrailer(trailer)}
                        className="bg-red-600 hover:bg-red-700 text-white rounded-full w-16 h-16 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-200 shadow-lg"
                      >
                        <Play size={24} fill="white" />
                      </Button>
                    </div>
                  </div>
                  <div className="absolute top-2 right-2 bg-red-600 text-white px-3 py-1 rounded-full text-xs flex items-center space-x-1 shadow-lg">
                    <Youtube size={14} />
                    <span>4K Trailer</span>
                  </div>
                  <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs backdrop-blur-sm">
                    Ultra HD
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-white font-semibold text-lg mb-1 truncate">
                    {trailer.movieTitle}
                  </h3>
                  <p className="text-gray-400 text-sm truncate">
                    {trailer.name}
                  </p>
                  <div className="mt-3 flex justify-between items-center">
                    <span className="text-xs text-gray-500 bg-gray-800/50 px-2 py-1 rounded">Official Trailer</span>
                    <Button
                      onClick={() => playTrailer(trailer)}
                      size="sm"
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white text-xs px-4 py-2 transition-all duration-200"
                    >
                      Watch Now
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {trailers.length === 0 && !loading && (
          <div className="text-center text-gray-400">
            <p>No trailers available at the moment. Please check back later!</p>
          </div>
        )}
      </div>

      {/* YouTube Player Modal */}
      {selectedTrailer && (
        <YouTubePlayer
          videoId={selectedTrailer.key}
          title={`${selectedTrailer.movieTitle} - ${selectedTrailer.name}`}
          onClose={closePlayer}
        />
      )}
    </section>
  );
};

export default TrailersSection;
