
import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/Auth/AuthProvider";
import { Button } from "@/components/ui/button";

interface MovieCommentsProps {
  movieId: number;
}

const MovieComments = ({ movieId }: MovieCommentsProps) => {
  const { user } = useAuth();
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("movie_comments")
        .select("*, profiles:user_id(full_name)")
        .eq("movie_id", movieId)
        .order("created_at", { ascending: false });
      setComments(data || []);
    };
    fetch();

    // Listen for realtime inserts
    const channel = supabase.channel("movie-comments-" + movieId)
      .on("postgres_changes", {
        event: "INSERT",
        schema: "public",
        table: "movie_comments",
        filter: `movie_id=eq.${movieId}`,
      }, payload => {
        setComments(prev => [payload.new, ...prev]);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [movieId]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newComment.trim()) return;
    await supabase.from("movie_comments").insert({
      movie_id: movieId,
      user_id: user.id,
      content: newComment,
    });
    setNewComment("");
  };

  return (
    <div className="bg-gray-900 rounded-xl p-4 mt-6">
      <form onSubmit={handleAdd} className="mb-3 flex gap-2">
        <input
          className="flex-1 bg-gray-800 text-white rounded px-2"
          value={newComment}
          placeholder="Comment on this movie"
          onChange={e => setNewComment(e.target.value)}
        />
        <Button size="sm" type="submit" disabled={!user}>Add</Button>
      </form>
      <div>
        {comments.map(c => (
          <div key={c.id} className="mb-2 text-sm border-b border-gray-700 pb-2">
            <span className="font-semibold text-white">{c.profiles?.full_name || "User"}:</span>{" "}
            <span className="text-gray-200">{c.content}</span>
            <span className="text-xs text-gray-500 block">{new Date(c.created_at).toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
export default MovieComments;
