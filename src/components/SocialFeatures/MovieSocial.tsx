
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/Auth/AuthProvider';
import { useToast } from '@/hooks/use-toast';
import { Heart, MessageCircle, Share2, Download, Star } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface MovieSocialProps {
  movieId: number;
}

const MovieSocial: React.FC<MovieSocialProps> = ({ movieId }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newComment, setNewComment] = useState('');
  const [shareEmail, setShareEmail] = useState('');
  const [shareMessage, setShareMessage] = useState('');
  const [showShareForm, setShowShareForm] = useState(false);

  // Fetch user's like status
  const { data: userLike } = useQuery({
    queryKey: ['movie-like', movieId, user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data } = await supabase
        .from('movie_likes')
        .select('*')
        .eq('user_id', user.id)
        .eq('movie_id', movieId)
        .single();
      return data;
    },
    enabled: !!user,
  });

  // Fetch movie comments
  const { data: comments = [] } = useQuery({
    queryKey: ['movie-comments', movieId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('movie_comments')
        .select(`
          *,
          profiles:user_id (
            full_name,
            avatar_url
          )
        `)
        .eq('movie_id', movieId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });

  // Fetch like count
  const { data: likeCount = 0 } = useQuery({
    queryKey: ['movie-like-count', movieId],
    queryFn: async () => {
      const { count } = await supabase
        .from('movie_likes')
        .select('*', { count: 'exact' })
        .eq('movie_id', movieId)
        .eq('is_liked', true);
      return count || 0;
    },
  });

  // Toggle like mutation
  const toggleLikeMutation = useMutation({
    mutationFn: async (isLiked: boolean) => {
      if (!user) throw new Error('Must be logged in');
      
      const { error } = await supabase
        .from('movie_likes')
        .upsert({
          user_id: user.id,
          movie_id: movieId,
          is_liked: isLiked,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['movie-like', movieId] });
      queryClient.invalidateQueries({ queryKey: ['movie-like-count', movieId] });
    },
  });

  // Add comment mutation
  const addCommentMutation = useMutation({
    mutationFn: async (content: string) => {
      if (!user) throw new Error('Must be logged in');
      
      const { error } = await supabase
        .from('movie_comments')
        .insert({
          user_id: user.id,
          movie_id: movieId,
          content,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['movie-comments', movieId] });
      setNewComment('');
      toast({
        title: 'Success',
        description: 'Comment added successfully!',
      });
    },
  });

  // Share movie mutation
  const shareMovieMutation = useMutation({
    mutationFn: async ({ email, message }: { email: string; message: string }) => {
      if (!user) throw new Error('Must be logged in');
      
      const { error } = await supabase
        .from('movie_shares')
        .insert({
          user_id: user.id,
          movie_id: movieId,
          shared_with_email: email,
          share_message: message,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      setShareEmail('');
      setShareMessage('');
      setShowShareForm(false);
      toast({
        title: 'Success',
        description: 'Movie shared successfully!',
      });
    },
  });

  const handleLike = () => {
    if (!user) {
      toast({
        title: 'Login Required',
        description: 'Please log in to like movies',
        variant: 'destructive',
      });
      return;
    }
    toggleLikeMutation.mutate(!userLike?.is_liked);
  };

  const handleComment = () => {
    if (!user) {
      toast({
        title: 'Login Required',
        description: 'Please log in to comment',
        variant: 'destructive',
      });
      return;
    }
    if (newComment.trim()) {
      addCommentMutation.mutate(newComment.trim());
    }
  };

  const handleShare = () => {
    if (!user) {
      toast({
        title: 'Login Required',
        description: 'Please log in to share movies',
        variant: 'destructive',
      });
      return;
    }
    if (shareEmail && shareMessage.trim()) {
      shareMovieMutation.mutate({ email: shareEmail, message: shareMessage.trim() });
    }
  };

  return (
    <div className="space-y-6">
      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4">
        <Button
          variant={userLike?.is_liked ? "default" : "outline"}
          onClick={handleLike}
          className={`flex items-center gap-2 ${
            userLike?.is_liked ? 'bg-red-600 hover:bg-red-700' : ''
          }`}
        >
          <Heart className={userLike?.is_liked ? 'fill-current' : ''} size={16} />
          Like ({likeCount})
        </Button>

        <Button
          variant="outline"
          onClick={() => setShowShareForm(!showShareForm)}
          className="flex items-center gap-2"
        >
          <Share2 size={16} />
          Share
        </Button>

        <Button
          variant="outline"
          className="flex items-center gap-2"
        >
          <Download size={16} />
          Download
        </Button>
      </div>

      {/* Share Form */}
      {showShareForm && (
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <h3 className="text-white font-semibold">Share this movie</h3>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Friend's email"
              value={shareEmail}
              onChange={(e) => setShareEmail(e.target.value)}
              className="bg-gray-800 border-gray-700 text-white"
            />
            <Textarea
              placeholder="Add a message..."
              value={shareMessage}
              onChange={(e) => setShareMessage(e.target.value)}
              className="bg-gray-800 border-gray-700 text-white"
            />
            <div className="flex gap-2">
              <Button
                onClick={handleShare}
                disabled={!shareEmail || !shareMessage.trim() || shareMovieMutation.isPending}
                className="bg-red-600 hover:bg-red-700"
              >
                {shareMovieMutation.isPending ? 'Sharing...' : 'Share'}
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowShareForm(false)}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Comments Section */}
      <div>
        <h3 className="text-xl font-bold text-white mb-4 flex items-center">
          <MessageCircle className="mr-2" size={20} />
          Comments ({comments.length})
        </h3>

        {/* Add Comment */}
        {user && (
          <div className="mb-6 space-y-3">
            <Textarea
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="bg-gray-800 border-gray-700 text-white"
            />
            <Button
              onClick={handleComment}
              disabled={!newComment.trim() || addCommentMutation.isPending}
              className="bg-red-600 hover:bg-red-700"
            >
              {addCommentMutation.isPending ? 'Adding...' : 'Add Comment'}
            </Button>
          </div>
        )}

        {/* Comments List */}
        <div className="space-y-4">
          {comments.map((comment: any) => (
            <Card key={comment.id} className="bg-gray-800 border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">
                      {comment.profiles?.full_name?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-white font-medium">
                        {comment.profiles?.full_name || 'User'}
                      </span>
                      <span className="text-gray-400 text-sm">
                        {new Date(comment.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-300">{comment.content}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {comments.length === 0 && (
          <p className="text-gray-400 text-center py-8">
            No comments yet. Be the first to share your thoughts!
          </p>
        )}
      </div>
    </div>
  );
};

export default MovieSocial;
