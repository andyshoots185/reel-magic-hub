import { supabase } from '@/integrations/supabase/client';

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

// Get movie streaming data from Supabase
export const getMovieStreamingData = async (movieId: number): Promise<MovieStreamData> => {
  try {
    // First, check if we have this movie in our database
    const { data: movieContent, error: movieError } = await supabase
      .from('movie_content')
      .select('*')
      .eq('tmdb_id', movieId)
      .single();

    if (movieError && movieError.code !== 'PGRST116') {
      throw movieError;
    }

    // If movie doesn't exist in our database, fetch from TMDB and create placeholder
    if (!movieContent) {
      const response = await fetch(`${BASE_URL}/movie/${movieId}?api_key=${API_KEY}`);
      const tmdbMovie = await response.json();

      // Create movie content entry
      const { data: newMovieContent, error: insertError } = await supabase
        .from('movie_content')
        .insert({
          tmdb_id: movieId,
          title: tmdbMovie.title || 'Unknown Title',
          duration: tmdbMovie.runtime || 120,
          poster_url: tmdbMovie.poster_path ? `https://image.tmdb.org/t/p/w500${tmdbMovie.poster_path}` : null,
          backdrop_url: tmdbMovie.backdrop_path ? `https://image.tmdb.org/t/p/original${tmdbMovie.backdrop_path}` : null,
          status: 'pending'
        })
        .select()
        .single();

      if (insertError) {
        throw insertError;
      }

      return {
        id: movieId,
        title: tmdbMovie.title || 'Unknown Title',
        streamingLinks: [],
        subtitles: [],
        duration: tmdbMovie.runtime || 120,
        watchProgress: 0
      };
    }

    // Get streaming links for this movie
    const { data: streams, error: streamsError } = await supabase
      .from('movie_streams')
      .select('*')
      .eq('movie_content_id', movieContent.id)
      .order('quality', { ascending: false });

    if (streamsError) {
      throw streamsError;
    }

    // Get subtitles for this movie
    const { data: subtitles, error: subtitlesError } = await supabase
      .from('movie_subtitles')
      .select('*')
      .eq('movie_content_id', movieContent.id);

    if (subtitlesError) {
      throw subtitlesError;
    }

    // Get user's watch progress (if authenticated)
    let watchProgress = 0;
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      const { data: progressData } = await supabase
        .from('watch_progress')
        .select('progress_seconds')
        .eq('user_id', user.id)
        .eq('movie_content_id', movieContent.id)
        .single();

      if (progressData) {
        // Convert seconds to percentage
        const totalSeconds = (movieContent.duration || 120) * 60;
        watchProgress = Math.round((progressData.progress_seconds / totalSeconds) * 100);
      }
    }

    // Format streaming links
    const streamingLinks: StreamingLink[] = streams.map(stream => ({
      quality: stream.quality,
      url: stream.video_url,
      size: stream.file_size ? formatFileSize(stream.file_size) : 'Unknown'
    }));

    // Format subtitles
    const formattedSubtitles = subtitles.map(subtitle => ({
      language: subtitle.language,
      url: subtitle.subtitle_url
    }));

    return {
      id: movieId,
      title: movieContent.title,
      streamingLinks,
      subtitles: formattedSubtitles,
      duration: movieContent.duration || 120,
      watchProgress
    };

  } catch (error) {
    console.error('Error fetching movie streaming data:', error);
    
    // Fallback: fetch basic info from TMDB
    const response = await fetch(`${BASE_URL}/movie/${movieId}?api_key=${API_KEY}`);
    const movie = await response.json();

    return {
      id: movieId,
      title: movie.title || 'Demo Movie',
      streamingLinks: [],
      subtitles: [],
      duration: movie.runtime || 120,
      watchProgress: 0
    };
  }
};

// Helper function to format file sizes
const formatFileSize = (bytes: number): string => {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes === 0) return '0 Byte';
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)).toString());
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
};

// Update watch progress
export const updateWatchProgress = async (movieId: number, progressSeconds: number, completed: boolean = false) => {
  try {
    // Get the movie content ID
    const { data: movieContent, error: movieError } = await supabase
      .from('movie_content')
      .select('id')
      .eq('tmdb_id', movieId)
      .single();

    if (movieError || !movieContent) {
      console.error('Movie not found in database:', movieError);
      return;
    }

    // Update progress using the database function
    const { error } = await supabase.rpc('update_watch_progress', {
      p_movie_content_id: movieContent.id,
      p_progress_seconds: progressSeconds,
      p_completed: completed
    });

    if (error) {
      console.error('Error updating watch progress:', error);
    }
  } catch (error) {
    console.error('Error updating watch progress:', error);
  }
};

// Get movie trailers (unchanged from TMDB)
export const getMovieTrailers = async (movieId: number) => {
  const response = await fetch(`${BASE_URL}/movie/${movieId}/videos?api_key=${API_KEY}`);
  const data = await response.json();
  return data.results?.filter((video: any) => video.type === 'Trailer') || [];
};

// Admin function to upload movie content (you would call this to populate your database)
export const uploadMovieContent = async (
  tmdbId: number,
  videoFile: File,
  quality: string = '1080p'
) => {
  try {
    // First ensure the movie exists in movie_content table
    let { data: movieContent, error: fetchError } = await supabase
      .from('movie_content')
      .select('*')
      .eq('tmdb_id', tmdbId)
      .single();

    if (fetchError && fetchError.code === 'PGRST116') {
      // Movie doesn't exist, fetch from TMDB and create it
      const response = await fetch(`${BASE_URL}/movie/${tmdbId}?api_key=${API_KEY}`);
      const tmdbMovie = await response.json();

      const { data: newMovie, error: insertError } = await supabase
        .from('movie_content')
        .insert({
          tmdb_id: tmdbId,
          title: tmdbMovie.title,
          duration: tmdbMovie.runtime,
          poster_url: tmdbMovie.poster_path ? `https://image.tmdb.org/t/p/w500${tmdbMovie.poster_path}` : null,
          backdrop_url: tmdbMovie.backdrop_path ? `https://image.tmdb.org/t/p/original${tmdbMovie.backdrop_path}` : null,
          status: 'processing'
        })
        .select()
        .single();

      if (insertError) throw insertError;
      movieContent = newMovie;
    }

    // Upload video file to Supabase Storage
    const fileName = `${tmdbId}_${quality}_${Date.now()}.mp4`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('movies')
      .upload(fileName, videoFile);

    if (uploadError) throw uploadError;

    // Get public URL for the uploaded video
    const { data: urlData } = supabase.storage
      .from('movies')
      .getPublicUrl(fileName);

    // Create stream entry
    const { error: streamError } = await supabase
      .from('movie_streams')
      .insert({
        movie_content_id: movieContent.id,
        quality,
        video_url: urlData.publicUrl,
        file_size: videoFile.size
      });

    if (streamError) throw streamError;

    // Update movie status to ready
    await supabase
      .from('movie_content')
      .update({ 
        status: 'ready',
        video_url: urlData.publicUrl,
        file_size: videoFile.size
      })
      .eq('id', movieContent.id);

    return { success: true, url: urlData.publicUrl };
  } catch (error) {
    console.error('Error uploading movie content:', error);
    return { success: false, error };
  }
};
