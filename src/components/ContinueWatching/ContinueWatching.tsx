
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/Auth/AuthProvider';
import { Clock, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ContinueWatching = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: continueWatching = [], isLoading } = useQuery({
    queryKey: ['continue-watching', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('watch_history')
        .select(`
          *,
          movies:movie_id (
            id,
            title,
            poster_path,
            backdrop_path
          )
        `)
        .eq('user_id', user.id)
        .eq('completed', false)
        .gt('progress_seconds', 0)
        .order('last_watched_at', { ascending: false })
        .limit(6);

      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });

  if (!user || isLoading || continueWatching.length === 0) {
    return null;
  }

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const getProgressPercentage = (progress: number, duration: number) => {
    if (!duration) return 0;
    return Math.min((progress / duration) * 100, 100);
  };

  return (
    <div className="mb-12">
      <div className="flex items-center mb-6">
        <Clock className="mr-3 text-red-400" size={24} />
        <h2 className="text-2xl font-bold text-white">Continue Watching</h2>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {continueWatching.map((item: any) => {
          const movie = item.movies;
          const progressPercentage = getProgressPercentage(
            item.progress_seconds, 
            item.duration_seconds
          );
          
          return (
            <Card 
              key={item.id} 
              className="bg-gray-900 border-gray-800 overflow-hidden hover:scale-105 transition-transform cursor-pointer group"
              onClick={() => navigate(`/movie/${movie.id}`)}
            >
              <div className="relative">
                <img
                  src={movie.poster_path ? `https://image.tmdb.org/t/p/w300${movie.poster_path}` : '/placeholder.svg'}
                  alt={movie.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center">
                  <Play className="text-white opacity-0 group-hover:opacity-100 transition-opacity" size={32} />
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-2">
                  <Progress 
                    value={progressPercentage} 
                    className="h-1 bg-gray-600"
                  />
                </div>
              </div>
              <CardContent className="p-3">
                <h3 className="text-white font-medium text-sm line-clamp-2 mb-1">
                  {movie.title}
                </h3>
                <p className="text-gray-400 text-xs">
                  {formatDuration(item.progress_seconds)} watched
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default ContinueWatching;
