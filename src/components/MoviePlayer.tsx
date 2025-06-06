
import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Settings, Download, Maximize, SkipBack, SkipForward, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MovieStreamData, updateWatchProgress } from '@/services/movieService';

interface MoviePlayerProps {
  streamData: MovieStreamData;
  onClose: () => void;
}

const MoviePlayer = ({ streamData, onClose }: MoviePlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState([80]);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState([streamData.watchProgress || 0]);
  const [selectedQuality, setSelectedQuality] = useState('1080p');
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressUpdateTimer = useRef<NodeJS.Timeout>();

  // Sample YouTube video IDs for full movies (these would normally come from your backend)
  const getYouTubeVideoId = (movieId: string) => {
    // This is a mapping of movie IDs to YouTube video IDs
    // In a real app, this would come from your database
    const movieYouTubeMap: { [key: string]: string } = {
      '550': 'BdJKm16Co6M', // Fight Club
      '13': 'sY1S34973zA', // Forrest Gump
      '680': 'uYeXQqGY2as', // Pulp Fiction
      '155': 'sAOzrChqmd0', // The Dark Knight
      '497': 'QdBZY2fkU-0', // The Shawshank Redemption
      // Add more movie mappings as needed
    };
    
    return movieYouTubeMap[movieId] || 'dQw4w9WgXcQ'; // Default video if not found
  };

  const videoId = getYouTubeVideoId(streamData.id.toString());

  // Auto-hide controls
  useEffect(() => {
    const timer = setTimeout(() => setShowControls(false), 3000);
    return () => clearTimeout(timer);
  }, [showControls]);

  // Save progress periodically
  useEffect(() => {
    if (isPlaying) {
      progressUpdateTimer.current = setInterval(() => {
        updateWatchProgress(streamData.id, Math.floor(progress[0]));
      }, 10000); // Update every 10 seconds
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
  }, [isPlaying, progress, streamData.id]);

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

  const downloadMovie = () => {
    // For YouTube videos, we can't download directly, but we can open the video in a new tab
    window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank');
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

  // Quality options for YouTube
  const qualityOptions = ['720p', '1080p', '1440p', '2160p'];

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 bg-black z-50 flex items-center justify-center"
      onMouseMove={() => setShowControls(true)}
    >
      {/* YouTube Iframe */}
      <iframe
        className="w-full h-full"
        src={`https://www.youtube.com/embed/${videoId}?autoplay=${isPlaying ? 1 : 0}&mute=${isMuted ? 1 : 0}&controls=0&rel=0&modestbranding=1&iv_load_policy=3&cc_load_policy=0&fs=1&disablekb=1&start=${Math.floor((progress[0] / 100) * 3600)}`}
        title={streamData.title}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />

      {/* Player Controls */}
      <div className={`absolute inset-0 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
        {/* Top Bar */}
        <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/70 to-transparent p-4">
          <div className="flex items-center justify-between text-white">
            <div>
              <h1 className="text-xl font-bold">{streamData.title}</h1>
              <p className="text-sm opacity-80">Quality: {selectedQuality} • YouTube Player</p>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={downloadMovie}
                className="text-white hover:bg-white/20"
                title="Open on YouTube"
              >
                <Download size={20} />
              </Button>
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

        {/* Center Play Button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={togglePlay}
            className="w-20 h-20 rounded-full bg-black/50 text-white hover:bg-black/70 transition-all"
          >
            {isPlaying ? <Pause size={32} /> : <Play size={32} />}
          </Button>
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
                <span>{formatTime((progress[0] / 100) * 3600)}</span>
                <span>1:00:00</span>
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
