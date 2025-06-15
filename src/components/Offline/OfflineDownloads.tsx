
import React, { useEffect, useState } from "react";
import { useAuth } from "../Auth/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "../ui/button";
const OfflineDownloads = () => {
  const { user } = useAuth();
  const [downloadList, setDownloadList] = useState<any[]>([]);
  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      const { data } = await supabase.from("download_queue").select("*").eq("user_id", user.id);
      setDownloadList(data || []);
    };
    fetch();
  }, [user]);
  return (
    <section>
      <div className="font-bold text-white mb-2">Offline Downloads</div>
      <div className="flex flex-wrap gap-3">
        {downloadList.map(dl => (
          <div key={dl.id} className="p-4 bg-gray-800 rounded">
            <div>Movie ID: {dl.movie_id}</div>
            <div>Status: {dl.status}</div>
            <Button className="mt-1">Open</Button>
          </div>
        ))}
      </div>
    </section>
  );
};
export default OfflineDownloads;
