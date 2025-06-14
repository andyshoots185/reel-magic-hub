
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
  posterPath?: string;
  backdropPath?: string;
}

export interface Movie {
  id: number;
  title: string;
  poster_path: string;
  backdrop_path: string;
  overview: string;
  release_date: string;
  vote_average: number;
  genre_ids: number[];
}

export const getMovieStreamingData = async (movieId: number): Promise<MovieStreamData> => {
  try {
    const response = await fetch(`${BASE_URL}/movie/${movieId}?api_key=${API_KEY}`);
    const movie = await response.json();
    
    return {
      id: movieId,
      title: movie.title || 'Movie Title',
      streamingLinks: [],
      subtitles: [],
      duration: movie.runtime || 120,
      watchProgress: 0,
      posterPath: movie.poster_path,
      backdropPath: movie.backdrop_path
    };
  } catch (error) {
    console.error('Error fetching movie details:', error);
    return {
      id: movieId,
      title: 'Movie Title',
      streamingLinks: [],
      subtitles: [],
      duration: 120,
      watchProgress: 0,
      posterPath: null,
      backdropPath: null
    };
  }
};

export const getMovieDetails = async (movieId: number): Promise<Movie> => {
  try {
    const response = await fetch(`${BASE_URL}/movie/${movieId}?api_key=${API_KEY}`);
    const movie = await response.json();
    return movie;
  } catch (error) {
    console.error('Error fetching movie details:', error);
    throw error;
  }
};

export const getPopularMovies = async (): Promise<Movie[]> => {
  try {
    const response = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}`);
    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error('Error fetching popular movies:', error);
    return [];
  }
};

export const getTrendingMovies = async (): Promise<Movie[]> => {
  try {
    const response = await fetch(`${BASE_URL}/trending/movie/week?api_key=${API_KEY}`);
    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error('Error fetching trending movies:', error);
    return [];
  }
};

export const updateWatchProgress = async (movieId: number, progressSeconds: number, completed: boolean = false) => {
  console.log(`Updating watch progress for movie ${movieId}:`, {
    progressSeconds,
    completed,
    timestamp: new Date().toISOString()
  });
  
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
