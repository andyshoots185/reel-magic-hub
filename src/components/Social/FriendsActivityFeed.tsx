
import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "../Auth/AuthProvider";
import MovieCard from "../MovieCard";

const FriendsActivityFeed = () => {
  const { user } = useAuth();
  const [activities, setActivities] = useState<any[]>([]);
  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      // This assumes you have a table user_friends, and activity stored in movie_reviews or similar.
      // We'll demo with recent reviews from friends.
      const { data, error } = await supabase
        .from("movie_reviews")
        .select(`
          id,
          rating,
          review,
          movie_id,
          profiles (
            full_name
          )
        `)
        .eq('user_id', user.id)
        .order("created_at", { ascending: false })
        .limit(10);
      
      if (error) {
        console.error("Error fetching activity feed:", error);
        setActivities([]);
        return;
      }

      if(data) {
        setActivities(
          data.map((act: any) => ({
            id: act.id,
            friend_full_name: act.profiles?.full_name || "You",
            activity_desc: `rated ${act.rating}★`,
            movie: { id: act.movie_id, ...act }
          }))
        );
      }
    };
    fetch();
  }, [user]);

  if (!user) return null;

  return (
    <section className="py-6">
      <div className="container mx-auto px-4">
        <h2 className="text-lg font-bold text-white mb-4">My Recent Activity</h2>
        {activities.length > 0 ? (
          <div className="flex flex-wrap gap-4">
            {activities.map(act => (
              <div key={act.id} className="w-44 text-center">
                <MovieCard movie={act.movie} />
                <div className="text-xs text-gray-400 mt-2 truncate">{act.friend_full_name} {act.activity_desc}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-gray-500">No recent activity found.</div>
        )}
      </div>
    </section>
  );
};

export default FriendsActivityFeed;
