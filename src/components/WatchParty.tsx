
import { Users, Share, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

interface WatchPartyProps {
  movieTitle: string;
  movieId: number;
}

const WatchParty = ({ movieTitle, movieId }: WatchPartyProps) => {
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();

  const createWatchParty = () => {
    setIsCreating(true);
    
    // Simulate creating a watch party
    setTimeout(() => {
      const partyCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      
      toast({
        title: "Watch Party Created!",
        description: `Party Code: ${partyCode}. Share this code with friends to watch together!`,
      });
      
      setIsCreating(false);
    }, 2000);
  };

  return (
    <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-lg p-6 border border-purple-500/30">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="bg-purple-600 p-2 rounded-full">
            <Users className="text-white" size={20} />
          </div>
          <div>
            <h3 className="text-white font-semibold">Watch Party</h3>
            <p className="text-purple-300 text-sm">Watch together with friends</p>
          </div>
        </div>
        <Badge className="bg-purple-600 text-white">
          <Clock size={12} className="mr-1" />
          LIVE
        </Badge>
      </div>
      
      <p className="text-gray-300 text-sm mb-4">
        Create a synchronized viewing experience and chat with friends while watching {movieTitle}!
      </p>
      
      <div className="flex space-x-3">
        <Button
          onClick={createWatchParty}
          disabled={isCreating}
          className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
        >
          {isCreating ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Creating...</span>
            </div>
          ) : (
            <>
              <Users size={16} className="mr-2" />
              Create Party
            </>
          )}
        </Button>
        <Button
          variant="outline"
          className="border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white"
        >
          <Share size={16} />
        </Button>
      </div>
    </div>
  );
};

export default WatchParty;
