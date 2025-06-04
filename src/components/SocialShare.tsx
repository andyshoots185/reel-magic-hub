
import { Share2, Facebook, Twitter, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

interface SocialShareProps {
  movieTitle: string;
  movieId: number;
}

const SocialShare = ({ movieTitle, movieId }: SocialShareProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const shareUrl = `${window.location.origin}/movie/${movieId}`;
  const shareText = `Check out ${movieTitle} on ReelFlix!`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    toast({
      title: "Link Copied!",
      description: "Movie link has been copied to your clipboard.",
    });
    setIsOpen(false);
  };

  const shareOnFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
    setIsOpen(false);
  };

  const shareOnTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white"
      >
        <Share2 size={16} />
      </Button>
      
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 bg-gray-900 rounded-lg shadow-lg border border-gray-700 p-4 z-50 min-w-48">
          <div className="space-y-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={copyToClipboard}
              className="w-full justify-start text-white hover:bg-gray-800"
            >
              <Copy size={16} className="mr-2" />
              Copy Link
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={shareOnFacebook}
              className="w-full justify-start text-blue-500 hover:bg-gray-800"
            >
              <Facebook size={16} className="mr-2" />
              Facebook
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={shareOnTwitter}
              className="w-full justify-start text-blue-400 hover:bg-gray-800"
            >
              <Twitter size={16} className="mr-2" />
              Twitter
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SocialShare;
