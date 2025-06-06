
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { X, Maximize2, Volume2, VolumeX } from 'lucide-react';

interface YouTubePlayerProps {
  videoId: string;
  title: string;
  onClose: () => void;
}

const YouTubePlayer = ({ videoId, title, onClose }: YouTubePlayerProps) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <div className={`fixed inset-0 bg-black z-50 flex items-center justify-center ${isFullscreen ? 'p-0' : 'p-4'}`}>
      <div className={`relative ${isFullscreen ? 'w-full h-full' : 'w-full max-w-4xl h-full max-h-[80vh]'} bg-black rounded-lg overflow-hidden`}>
        {/* Controls */}
        <div className="absolute top-4 right-4 z-10 flex space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMute}
            className="bg-black/50 text-white hover:bg-black/70"
          >
            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleFullscreen}
            className="bg-black/50 text-white hover:bg-black/70"
          >
            <Maximize2 size={20} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="bg-black/50 text-white hover:bg-black/70"
          >
            <X size={20} />
          </Button>
        </div>

        {/* Title */}
        <div className="absolute top-4 left-4 z-10">
          <h3 className="text-white font-semibold text-lg bg-black/50 px-3 py-1 rounded">
            {title}
          </h3>
        </div>

        {/* YouTube iframe */}
        <iframe
          className="w-full h-full"
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=${isMuted ? 1 : 0}&controls=1&rel=0&modestbranding=1`}
          title={title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  );
};

export default YouTubePlayer;
