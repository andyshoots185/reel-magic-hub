
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/Auth/AuthProvider';

export const useWatchHistory = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const updateWatchProgress = useMutation({
    mutationFn: async ({ 
      movieId, 
      progressSeconds, 
      durationSeconds, 
      completed = false 
    }: {
      movieId: number;
      progressSeconds: number;
      durationSeconds?: number;
      completed?: boolean;
    }) => {
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('watch_history')
        .upsert({
          user_id: user.id,
          movie_id: movieId,
          progress_seconds: progressSeconds,
          duration_seconds: durationSeconds,
          completed,
          last_watched_at: new Date().toISOString(),
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['continue-watching'] });
      queryClient.invalidateQueries({ queryKey: ['watch-history'] });
    },
  });

  const addToWatchlist = useMutation({
    mutationFn: async (movieId: number) => {
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('user_watchlists')
        .upsert({
          user_id: user.id,
          movie_id: movieId,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['watchlist'] });
    },
  });

  const removeFromWatchlist = useMutation({
    mutationFn: async (movieId: number) => {
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('user_watchlists')
        .delete()
        .eq('user_id', user.id)
        .eq('movie_id', movieId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['watchlist'] });
    },
  });

  return {
    updateWatchProgress,
    addToWatchlist,
    removeFromWatchlist,
  };
};
