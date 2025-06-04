
import { Star } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface MovieRatingProps {
  movieId: number;
  movieTitle: string;
  currentRating?: number;
}

const MovieRating = ({ movieId, movieTitle, currentRating = 0 }: MovieRatingProps) => {
  const [rating, setRating] = useState(currentRating);
  const [hoverRating, setHoverRating] = useState(0);
  const { toast } = useToast();

  const handleRating = (newRating: number) => {
    setRating(newRating);
    
    // Save to localStorage
    const ratings = JSON.parse(localStorage.getItem('reelflix-ratings') || '{}');
    ratings[movieId] = newRating;
    localStorage.setItem('reelflix-ratings', JSON.stringify(ratings));
    
    toast({
      title: "Rating Saved!",
      description: `You rated ${movieTitle} ${newRating} star${newRating !== 1 ? 's' : ''}!`,
    });
  };

  return (
    <div className="flex items-center space-x-2">
      <span className="text-white text-sm font-medium">Rate this movie:</span>
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => handleRating(star)}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            className="transition-colors duration-200"
          >
            <Star
              size={20}
              className={`${
                star <= (hoverRating || rating)
                  ? 'text-yellow-400 fill-yellow-400'
                  : 'text-gray-500'
              } hover:text-yellow-300 cursor-pointer`}
            />
          </button>
        ))}
      </div>
      {rating > 0 && (
        <span className="text-yellow-400 text-sm">({rating}/5)</span>
      )}
    </div>
  );
};

export default MovieRating;
