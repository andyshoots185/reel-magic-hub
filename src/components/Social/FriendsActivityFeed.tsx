
import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "../Auth/AuthProvider";
import MovieCard from "../MovieCard";

const FriendsActivityFeed = () => {
  const { user } = useAuth();
  const [activities, setActivities] = useState<any[]>([]);
  useEffect(() => {
    if (!user) return;
    // last 10 things friends watched/rated
    const fetch = async () => {
      const { data } = await supabase.rpc("get_friends_recent_activity", { uid: user.id });
      setActivities(data || []);
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
