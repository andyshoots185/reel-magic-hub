
import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "../Auth/AuthProvider";
import { Button } from "../ui/button";

type Profile = {
  id: string;
  full_name: string;
  avatar_url?: string;
};

const ProfilesManager = () => {
  const { user } = useAuth();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, avatar_url")
        .eq("account_id", user.id);
      
      if (error) {
        console.error("Error fetching profiles:", error.message);
      } else {
        setProfiles(data || []);
      }
    };
    fetch();
  }, [user]);
  return (
    <section>
      <div className="text-lg font-bold text-white mb-2">Your Profiles</div>
      <div className="flex gap-4 items-center">
        {profiles.map((p) => (
          <div key={p.id} className="bg-gray-800 rounded-lg p-4 text-center">
            <img src={p.avatar_url || "/placeholder.svg"} alt={p.full_name} className="w-20 h-20 rounded-full mx-auto mb-2 object-cover" />
            <div className="text-white">{p.full_name}</div>
          </div>
        ))}
        <Button>Add Profile</Button>
      </div>
    </section>
  );
};

export default ProfilesManager;
