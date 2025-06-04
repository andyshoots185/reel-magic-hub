
import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Settings, Download, Maximize, SkipBack, SkipForward } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MovieStreamData } from '@/services/movieService';

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
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setShowControls(false), 3000);
    return () => clearTimeout(timer);
  }, [showControls]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value);
    if (videoRef.current) {
      videoRef.current.volume = value[0] / 100;
    }
  };

  const handleProgressChange = (value: number[]) => {
    setProgress(value);
    if (videoRef.current) {
      const duration = videoRef.current.duration || streamData.duration * 60;
      videoRef.current.currentTime = (value[0] / 100) * duration;
    }
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
    if (videoRef.current) {
      videoRef.current.currentTime += 10;
    }
  };

  const skipBackward = () => {
    if (videoRef.current) {
      videoRef.current.currentTime -= 10;
    }
  };

  const downloadMovie = () => {
    const selectedStream = streamData.streamingLinks.find(link => link.quality === selectedQuality);
    if (selectedStream) {
      // Simulate download
      console.log(`Downloading ${streamData.title} in ${selectedQuality} (${selectedStream.size})`);
      // In a real app, this would trigger the download
    }
  };

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 bg-black z-50 flex items-center justify-center"
      onMouseMove={() => setShowControls(true)}
    >
      <video
        ref={videoRef}
        className="w-full h-full object-contain"
        poster={`https://image.tmdb.org/t/p/original${streamData.id}`}
        onClick={togglePlay}
      >
        <source src={streamData.streamingLinks.find(link => link.quality === selectedQuality)?.url} type="video/mp4" />
        {streamData.subtitles.map((subtitle) => (
          <track
            key={subtitle.language}
            kind="subtitles"
            src={subtitle.url}
            srcLang={subtitle.language.toLowerCase()}
            label={subtitle.language}
          />
        ))}
      </video>

      {/* Player Controls */}
      <div className={`absolute inset-0 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
        {/* Top Bar */}
        <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/70 to-transparent p-4">
          <div className="flex items-center justify-between text-white">
            <div>
              <h1 className="text-xl font-bold">{streamData.title}</h1>
              <p className="text-sm opacity-80">Quality: {selectedQuality}</p>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={downloadMovie}
                className="text-white hover:bg-white/20"
              >
                <Download size={20} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-white hover:bg-white/20"
              >
                ✕
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
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-white/80">
                <span>{Math.floor(progress[0])}%</span>
                <span>{streamData.duration} min</span>
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
                    {streamData.streamingLinks.map((link) => (
                      <SelectItem key={link.quality} value={link.quality}>
                        {link.quality}
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
