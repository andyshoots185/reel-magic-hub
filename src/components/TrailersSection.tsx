
import { useState, useEffect } from 'react';
import { Play, Youtube } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

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

  useEffect(() => {
    const fetchTrailers = async () => {
      try {
        // Get popular movies first
        const moviesResponse = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}`);
        const moviesData = await moviesResponse.json();
        const movies = moviesData.results?.slice(0, 8) || [];

        // Fetch trailers for each movie
        const trailersPromises = movies.map(async (movie: any) => {
          try {
            const videosResponse = await fetch(`${BASE_URL}/movie/${movie.id}/videos?api_key=${API_KEY}`);
            const videosData = await videosResponse.json();
            const movieTrailers = videosData.results?.filter((video: any) => 
              video.type === 'Trailer' && video.site === 'YouTube'
            ) || [];

            return movieTrailers.map((trailer: any) => ({
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
        const flatTrailers = allTrailers.flat().slice(0, 6);
        setTrailers(flatTrailers);
      } catch (error) {
        console.error('Error fetching trailers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrailers();
  }, []);

  const openTrailer = (trailerKey: string) => {
    window.open(`https://www.youtube.com/watch?v=${trailerKey}`, '_blank');
  };

  if (loading) {
    return (
      <section className="bg-gray-900 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Latest Trailers</h2>
          <div className="flex justify-center">
            <div className="animate-pulse text-white">Loading trailers...</div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-gray-900 py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">Latest Trailers</h2>
          <p className="text-gray-400 text-lg">Watch the newest movie trailers</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trailers.map((trailer) => (
            <Card key={trailer.id} className="bg-gray-800 border-gray-700 overflow-hidden group hover:transform hover:scale-105 transition-all duration-300">
              <CardContent className="p-0">
                <div className="relative">
                  <img
                    src={`https://image.tmdb.org/t/p/w500${trailer.moviePoster}`}
                    alt={trailer.movieTitle}
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button
                      onClick={() => openTrailer(trailer.key)}
                      className="bg-red-600 hover:bg-red-700 text-white rounded-full w-16 h-16 flex items-center justify-center"
                    >
                      <Play size={24} />
                    </Button>
                  </div>
                  <div className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded text-xs flex items-center space-x-1">
                    <Youtube size={14} />
                    <span>Trailer</span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-white font-semibold text-lg mb-1 truncate">
                    {trailer.movieTitle}
                  </h3>
                  <p className="text-gray-400 text-sm truncate">
                    {trailer.name}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {trailers.length === 0 && !loading && (
          <div className="text-center text-gray-400">
            <p>No trailers available at the moment.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default TrailersSection;
