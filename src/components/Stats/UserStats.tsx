
import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "../Auth/AuthProvider";
const UserStats = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  useEffect(() => {
    if (!user) return;
    // Placeholder for demo: fetch some viewing stats
    const fetch = async () => {
      setStats({
        minutesWatched: 1234,
        genres: ["Drama", "Comedy"],
        streakDays: 5
      });
    };
    fetch();
  }, [user]);
  if (!user) return null;
  return (
    <section>
      <div className="font-bold text-white mb-2">Your Stats</div>
      {stats && (
        <div className="text-white">
          <div>Total Minutes Watched: {stats.minutesWatched}</div>
          <div>Genres Explored: {stats.genres.join(", ")}</div>
          <div>Binge Streak: {stats.streakDays} days</div>
        </div>
      )}
    </section>
  );
};
export default UserStats;
