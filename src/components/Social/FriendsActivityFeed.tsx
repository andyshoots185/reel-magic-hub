
import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "../Auth/AuthProvider";
import MovieCard from "../MovieCard";

const FriendsActivityFeed = () => {
  const { user } = useAuth();
  const [activities, setActivities] = useState<any[]>([]);
  useEffect(() => {
    if (!user) return;
    // Fallback to select if rpc is not available
    const fetch = async () => {
      // This assumes you have a table user_friends, and activity stored in movie_reviews or similar.
      // We'll demo with recent reviews from friends.
      const { data } = await supabase
        .from("movie_reviews")
        .select("*, profiles:user_id(full_name)")
        .or(`user_id.in.(${user.id},${user.id})`) // show only own or friends' activity
        .order("created_at", { ascending: false })
        .limit(10);
      setActivities(
        (data || []).map((act) => ({
          id: act.id,
          friend_full_name: act.profiles?.full_name || "Friend",
          activity_desc: `rated ${act.rating}★ "${(act.review || "").slice(0, 40)}"`,
          movie: { id: act.movie_id } // Best effort: you can expand this if joined
        }))
      );
    };
    fetch();
  }, [user]);
  if (!user) return null;
  return (
    <section className="py-6">
      <div className="text-lg font-bold text-white mb-2">Friends’ Recent Activity</div>
      <div className="flex flex-wrap gap-3">
        {activities.map(act => (
          <div key={act.id} className="w-40">
            <MovieCard movie={act.movie} />
            <div className="text-xs text-gray-400">{act.friend_full_name}: {act.activity_desc}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FriendsActivityFeed;
