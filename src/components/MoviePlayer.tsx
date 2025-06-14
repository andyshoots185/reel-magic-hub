
import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Settings, Download, Maximize, SkipBack, SkipForward, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getMovieStreamingData, updateWatchProgress, MovieStreamData } from '@/services/movieService';
import { useQuery } from '@tanstack/react-query';

interface MoviePlayerProps {
  movieId: number;
  title: string;
  onClose: () => void;
}

const MoviePlayer = ({ movieId, title, onClose }: MoviePlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState([80]);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState([0]);
  const [selectedQuality, setSelectedQuality] = useState('1080p');
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressUpdateTimer = useRef<NodeJS.Timeout>();

  const { data: streamData } = useQuery({
    queryKey: ['movieStream', movieId],
    queryFn: () => getMovieStreamingData(movieId),
  });

  // Auto-hide controls
  useEffect(() => {
    const timer = setTimeout(() => setShowControls(false), 3000);
    return () => clearTimeout(timer);
  }, [showControls]);

  // Save progress periodically
  useEffect(() => {
    if (isPlaying && streamData) {
      progressUpdateTimer.current = setInterval(() => {
        updateWatchProgress(movieId, Math.floor(progress[0]));
      }, 10000);
    } else {
      if (progressUpdateTimer.current) {
        clearInterval(progressUpdateTimer.current);
      }
    }

    return () => {
      if (progressUpdateTimer.current) {
        clearInterval(progressUpdateTimer.current);
      }
    };
  }, [isPlaying, progress, movieId, streamData]);

  // Set initial progress from stream data
  useEffect(() => {
    if (streamData?.watchProgress) {
      setProgress([streamData.watchProgress]);
    }
  }, [streamData]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value);
  };

  const handleProgressChange = (value: number[]) => {
    setProgress(value);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const skipForward = () => {
    const newProgress = Math.min(progress[0] + 1, 100);
    setProgress([newProgress]);
  };

  const skipBackward = () => {
    const newProgress = Math.max(progress[0] - 1, 0);
    setProgress([newProgress]);
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const qualityOptions = ['720p', '1080p', '1440p', '4K'];

  if (!streamData) {
    return (
      <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 bg-black z-50 flex items-center justify-center"
      onMouseMove={() => setShowControls(true)}
    >
      {/* Movie Poster/Placeholder */}
      <div className="w-full h-full relative flex items-center justify-center">
        <img
          src={`https://image.tmdb.org/t/p/original${streamData.posterPath || streamData.backdropPath}`}
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <div className="text-center text-white">
            <h2 className="text-4xl font-bold mb-4">{title}</h2>
            <p className="text-xl mb-8">Premium streaming experience</p>
            <Button
              onClick={togglePlay}
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 text-lg"
            >
              {isPlaying ? <Pause className="mr-2" /> : <Play className="mr-2" />}
              {isPlaying ? 'Pause' : 'Play Movie'}
            </Button>
          </div>
        </div>
      </div>

      {/* Player Controls */}
      <div className={`absolute inset-0 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
        {/* Top Bar */}
        <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/70 to-transparent p-4">
          <div className="flex items-center justify-between text-white">
            <div>
              <h1 className="text-xl font-bold">{title}</h1>
              <p className="text-sm opacity-80">Quality: {selectedQuality} • Premium Player</p>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-white hover:bg-white/20"
              >
                <X size={20} />
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Controls */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <div className="space-y-4">
            {/* Progress Bar */}
            <div className="space-y-2">
              <Slider
                value={progress}
                onValueChange={handleProgressChange}
                max={100}
                step={0.1}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-white/80">
                <span>{formatTime((progress[0] / 100) * (streamData.duration * 60))}</span>
                <span>{formatTime(streamData.duration * 60)}</span>
              </div>
            </div>

            {/* Control Buttons */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={skipBackward}
                  className="text-white hover:bg-white/20"
                >
                  <SkipBack size={20} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={togglePlay}
                  className="text-white hover:bg-white/20"
                >
                  {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={skipForward}
                  className="text-white hover:bg-white/20"
                >
                  <SkipForward size={20} />
                </Button>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleMute}
                    className="text-white hover:bg-white/20"
                  >
                    {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                  </Button>
                  <Slider
                    value={volume}
                    onValueChange={handleVolumeChange}
                    max={100}
                    step={1}
                    className="w-20"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <Select value={selectedQuality} onValueChange={setSelectedQuality}>
                  <SelectTrigger className="w-24 bg-transparent border-white/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {qualityOptions.map((quality) => (
                      <SelectItem key={quality} value={quality}>
                        {quality}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleFullscreen}
                  className="text-white hover:bg-white/20"
                >
                  <Maximize size={20} />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoviePlayer;
