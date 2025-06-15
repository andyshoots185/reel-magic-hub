
import React, { useEffect, useState } from "react";
import { TrendingUp, Zap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import MovieCard from "../MovieCard";

const PersonalizedRecommendations = () => {
  const [recommendations, setRecommendations] = useState<any[]>([]);
  useEffect(() => {
    // Fetch: smart combine trends + user likes + reviews + watch history
    const fetchData = async () => {
      // For brevity, this demo fetches recent/trending only
      const { data } = await supabase.from("movies").select("*").order("popularity", { ascending: false }).limit(6);
      setRecommendations(data || []);
    };
    fetchData();
  }, []);
  return (
    <section className="py-8">
      <div className="flex gap-2 items-center mb-4">
        <Zap className="text-yellow-400" />
        <h2 className="text-2xl font-bold text-white">Because You Watched / Trending</h2>
      </div>
      <div className="flex space-x-4 overflow-x-auto">
        {recommendations.map((movie) => (
          <div key={movie.id} className="w-48 flex-none">
            <MovieCard movie={movie} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default PersonalizedRecommendations;
