
import React, { useEffect, useState } from "react";
import { useAuth } from "@/components/Auth/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MovieReviewProps {
  movieId: number;
}

const MovieReview = ({ movieId }: MovieReviewProps) => {
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [all, setAll] = useState<any[]>([]);

  useEffect(() => {
    // Fetch user's review
    const fetch = async () => {
      if (!user) return;
      const { data } = await supabase
        .from("movie_reviews")
        .select("*")
        .eq("movie_id", movieId)
        .eq("user_id", user.id)
        .maybeSingle();
      if (data) {
        setRating(data.rating || 0);
        setReview(data.review || "");
      }
    };
    fetch();

    // Fetch all reviews for display
    const fetchAll = async () => {
      const { data } = await supabase
        .from("movie_reviews")
        .select("*, profiles: user_id (full_name)")
        .eq("movie_id", movieId)
        .order("created_at", { ascending: false });
      setAll(data || []);
    };
    fetchAll();
  }, [movieId, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !rating) return;
    // Upsert review
    await supabase.from("movie_reviews").upsert({
      movie_id: movieId,
      user_id: user.id,
      rating,
      review,
    });
  };

  return (
    <div className="bg-gray-900 rounded-xl p-4 mt-6">
      <form onSubmit={handleSubmit} className="mb-4 space-y-2">
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setRating(n)}
              className={n <= rating ? "text-yellow-400" : "text-gray-600"}
            >
              <Star size={20} fill={n <= rating ? "#fde047" : "none"} />
            </button>
          ))}
          <span className="text-xs text-gray-400 ml-2">{rating ? `${rating} stars` : ""}</span>
        </div>
        <textarea
          className="w-full bg-gray-800 border-gray-700 rounded p-2 text-white"
          placeholder="Write a short review (optional)"
          value={review}
          onChange={e => setReview(e.target.value)}
        />
        <Button type="submit" className="bg-yellow-500 text-black hover:bg-yellow-600">
          Save Rating
        </Button>
      </form>
      <div>
        <h4 className="font-bold text-white mb-2">All Reviews:</h4>
        {all.map(r => (
          <div key={r.id} className="mb-2 text-sm bg-gray-800 rounded p-2">
            <span className="font-semibold text-yellow-400">{r.rating}★</span>{" "}
            <span className="text-white">{r.review}</span>
            <span className="block text-gray-400 text-xs">{r.profiles?.full_name || "User"} · {new Date(r.created_at).toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
export default MovieReview;
