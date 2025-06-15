
import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import MovieCard from "../MovieCard";
import { Button } from "../ui/button";
import { useAuth } from "../Auth/AuthProvider";

const WatchlistManager = () => {
  const { user } = useAuth();
  const [watchlist, setWatchlist] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      const { data } = await supabase.from("user_watchlists").select(`
        *,
        movie:movie_id(*)
      `).eq("user_id", user.id);
      setWatchlist((data || []).map(x => x.movie));
    };
    fetch();
  }, [user]);

  return (
    <section>
      <div className="text-lg font-bold text-white mb-2">Your Watchlist</div>
      <div className="flex gap-3">
        {watchlist.map((movie) => (
          <div key={movie.id} className="w-40">
            <MovieCard movie={movie} />
          </div>
        ))}
      </div>
      <Button className="mt-2">Share Your Watchlist</Button>
    </section>
  );
};

export default WatchlistManager;
