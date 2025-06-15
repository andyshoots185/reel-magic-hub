
import React, { useEffect, useState } from "react";
import { useAuth } from "@/components/Auth/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

interface UserType {
  id: string;
  full_name: string;
  avatar_url?: string;
}

const FriendsManager = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<UserType[]>([]);
  const [friends, setFriends] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch other users for search
    const fetchUsers = async () => {
      if (!user) return;
      const { data } = await supabase
        .from("profiles")
        .select("id, full_name, avatar_url")
        .neq("id", user.id)
        .ilike("full_name", `%${search}%`);
      setUsers(data || []);
    };
    fetchUsers();
  }, [search, user]);

  useEffect(() => {
    // Fetch my friends and requests
    const fetch = async () => {
      if (!user) return;
      const { data } = await supabase
        .from("user_friends")
        .select("*")
        .or(`user_id.eq.${user.id},friend_id.eq.${user.id}`);
      setFriends((data || []).filter((f: any) => f.status === "accepted"));
      setRequests((data || []).filter((f: any) => f.status === "pending" && f.friend_id === user.id));
    };
    fetch();
  }, [user]);

  const sendRequest = async (friendId: string) => {
    if (!user) return;
    setLoading(true);
    await supabase.from("user_friends").insert({
      user_id: user.id,
      friend_id: friendId,
      status: "pending",
    });
    setLoading(false);
  };

  const acceptRequest = async (reqId: string) => {
    await supabase.from("user_friends").update({ status: "accepted" }).eq("id", reqId);
  };

  return (
    <div className="bg-gray-900 rounded-xl p-4 mt-6 max-w-lg mx-auto">
      <div className="mb-2 font-bold text-white">Find People</div>
      <input
        className="w-full p-2 text-white bg-gray-800 rounded mb-3"
        placeholder="Search by name"
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
      <div className="mb-5">
        {users.map(u => (
          <div key={u.id} className="flex items-center gap-2 mb-2">
            <span className="text-white">{u.full_name}</span>
            <Button size="sm" onClick={() => sendRequest(u.id)} disabled={loading}>
              Add Friend
            </Button>
          </div>
        ))}
      </div>
      <div className="mb-4">
        <div className="text-white mb-2">Friend Requests</div>
        {requests.map(r => (
          <div key={r.id} className="flex items-center gap-2 mb-1">
            <span className="text-white">{r.user_id.slice(0, 6)}</span>
            <Button size="sm" onClick={() => acceptRequest(r.id)}>Accept</Button>
          </div>
        ))}
      </div>
      <div>
        <div className="text-white mb-2">Your Friends</div>
        {friends.map(f => (
          <div key={f.id} className="flex items-center gap-2 mb-1">
            <span className="text-green-400">{f.user_id === user?.id ? f.friend_id.slice(0,6) : f.user_id.slice(0,6)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
export default FriendsManager;
