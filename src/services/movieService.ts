
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

// Simulate real-time movie streaming data
export const getMovieStreamingData = async (movieId: number): Promise<MovieStreamData> => {
  // In a real app, this would fetch from your streaming service
  const streamingLinks: StreamingLink[] = [
    { quality: '4K', url: `https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8`, size: '8.5 GB' },
    { quality: '1080p', url: `https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8`, size: '4.2 GB' },
    { quality: '720p', url: `https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8`, size: '2.1 GB' },
    { quality: '480p', url: `https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8`, size: '1.2 GB' }
  ];

  const response = await fetch(`${BASE_URL}/movie/${movieId}?api_key=${API_KEY}`);
  const movie = await response.json();

  return {
    id: movieId,
    title: movie.title,
    streamingLinks,
    subtitles: [
      { language: 'English', url: '/subtitles/en.vtt' },
      { language: 'Spanish', url: '/subtitles/es.vtt' },
      { language: 'French', url: '/subtitles/fr.vtt' }
    ],
    duration: movie.runtime || 120,
    watchProgress: Math.floor(Math.random() * 100)
  };
};

export const getMovieTrailers = async (movieId: number) => {
  const response = await fetch(`${BASE_URL}/movie/${movieId}/videos?api_key=${API_KEY}`);
  const data = await response.json();
  return data.results?.filter((video: any) => video.type === 'Trailer') || [];
};
