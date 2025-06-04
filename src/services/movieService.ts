
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

// Working demo videos for testing
const DEMO_VIDEOS = [
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4'
];

// Simulate real-time movie streaming data with working video URLs
export const getMovieStreamingData = async (movieId: number): Promise<MovieStreamData> => {
  // Get a random working demo video
  const randomVideo = DEMO_VIDEOS[Math.floor(Math.random() * DEMO_VIDEOS.length)];
  
  const streamingLinks: StreamingLink[] = [
    { quality: '4K', url: randomVideo, size: '8.5 GB' },
    { quality: '1080p', url: randomVideo, size: '4.2 GB' },
    { quality: '720p', url: randomVideo, size: '2.1 GB' },
    { quality: '480p', url: randomVideo, size: '1.2 GB' }
  ];

  const response = await fetch(`${BASE_URL}/movie/${movieId}?api_key=${API_KEY}`);
  const movie = await response.json();

  return {
    id: movieId,
    title: movie.title || 'Demo Movie',
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
