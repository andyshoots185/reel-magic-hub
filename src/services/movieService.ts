
const API_KEY = '4e44d9029b1270a757cddc766a1bcb63';
const BASE_URL = 'https://api.themoviedb.org/3';

export interface StreamingLink {
  quality: string;
  url: string;
  size: string;
}

export interface MovieStreamData {
  id: number;
  title: string;
  streamingLinks: StreamingLink[];
  subtitles: Array<{ language: string; url: string }>;
  duration: number;
  watchProgress?: number;
}

// Demo streaming data for different movies
const getDemoStreamingData = (movieId: number, title: string): MovieStreamData => {
  return {
    id: movieId,
    title,
    streamingLinks: [
      {
        quality: '4K',
        url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        size: '2.1 GB'
      },
      {
        quality: '1080p',
        url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
        size: '1.2 GB'
      },
      {
        quality: '720p',
        url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        size: '800 MB'
      },
      {
        quality: '480p',
        url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
        size: '400 MB'
      }
    ],
    subtitles: [
      { language: 'English', url: 'https://example.com/subtitles/en.vtt' },
      { language: 'Spanish', url: 'https://example.com/subtitles/es.vtt' },
      { language: 'French', url: 'https://example.com/subtitles/fr.vtt' }
    ],
    duration: 120,
    watchProgress: Math.floor(Math.random() * 80) // Random progress for demo
  };
};

export const getMovieStreamingData = async (movieId: number): Promise<MovieStreamData> => {
  try {
    // Fetch movie details from TMDB to get the title
    const response = await fetch(`${BASE_URL}/movie/${movieId}?api_key=${API_KEY}`);
    const movie = await response.json();
    
    // Return demo streaming data with actual movie title
    return getDemoStreamingData(movieId, movie.title || 'Demo Movie');
  } catch (error) {
    console.error('Error fetching movie details:', error);
    return getDemoStreamingData(movieId, 'Demo Movie');
  }
};

export const updateWatchProgress = async (movieId: number, progressSeconds: number, completed: boolean = false) => {
  // Demo implementation - just log the progress
  console.log(`Updating watch progress for movie ${movieId}:`, {
    progressSeconds,
    completed,
    timestamp: new Date().toISOString()
  });
  
  // In a real implementation, this would save to a database
  localStorage.setItem(`watch_progress_${movieId}`, JSON.stringify({
    progressSeconds,
    completed,
    timestamp: Date.now()
  }));
};

export const getMovieTrailers = async (movieId: number) => {
  const response = await fetch(`${BASE_URL}/movie/${movieId}/videos?api_key=${API_KEY}`);
  const data = await response.json();
  return data.results?.filter((video: any) => video.type === 'Trailer') || [];
};
