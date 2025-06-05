
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

export const getMovieStreamingData = async (movieId: number): Promise<MovieStreamData> => {
  try {
    // Fetch movie details from TMDB to get the title and runtime
    const response = await fetch(`${BASE_URL}/movie/${movieId}?api_key=${API_KEY}`);
    const movie = await response.json();
    
    // Note: In a real streaming service, you would have actual video files
    // For now, we return empty streaming links since demo videos were removed
    return {
      id: movieId,
      title: movie.title || 'Movie Title',
      streamingLinks: [], // No demo videos - would be populated with real content
      subtitles: [],
      duration: movie.runtime || 120,
      watchProgress: 0
    };
  } catch (error) {
    console.error('Error fetching movie details:', error);
    return {
      id: movieId,
      title: 'Movie Title',
      streamingLinks: [],
      subtitles: [],
      duration: 120,
      watchProgress: 0
    };
  }
};

export const updateWatchProgress = async (movieId: number, progressSeconds: number, completed: boolean = false) => {
  // Log the progress update
  console.log(`Updating watch progress for movie ${movieId}:`, {
    progressSeconds,
    completed,
    timestamp: new Date().toISOString()
  });
  
  // Save to localStorage for demo purposes
  localStorage.setItem(`watch_progress_${movieId}`, JSON.stringify({
    progressSeconds,
    completed,
    timestamp: Date.now()
  }));
};

export const getMovieTrailers = async (movieId: number) => {
  try {
    const response = await fetch(`${BASE_URL}/movie/${movieId}/videos?api_key=${API_KEY}`);
    const data = await response.json();
    return data.results?.filter((video: any) => video.type === 'Trailer') || [];
  } catch (error) {
    console.error('Error fetching movie trailers:', error);
    return [];
  }
};
