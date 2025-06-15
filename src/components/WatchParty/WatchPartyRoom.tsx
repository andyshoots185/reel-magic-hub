
import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/Auth/AuthProvider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface WatchPartyRoomProps {
  partyId: string;
}

interface Message {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
}

const WatchPartyRoom: React.FC<WatchPartyRoomProps> = ({ partyId }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    let ignore = false;

    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from("watch_party_messages")
        .select("*")
        .eq("party_id", partyId)
        .order("created_at", { ascending: true });
      if (!ignore && data) setMessages(data as Message[]);
    };

    fetchMessages();

    // realtime updates
    const channel = supabase.channel("watch-party-" + partyId).on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "watch_party_messages",
        filter: `party_id=eq.${partyId}`,
      },
      (payload) => {
        setMessages((prev) => [...prev, payload.new as Message]);
      }
    ).subscribe();

    return () => {
      ignore = true;
      supabase.removeChannel(channel);
    };
  }, [partyId]);

  const sendMessage = async () => {
    if (!input.trim() || !user) return;
    await supabase.from("watch_party_messages").insert({
      party_id: partyId,
      user_id: user.id,
      content: input,
    });
    setInput("");
  };

  return (
    <div className="bg-gray-800 rounded-xl shadow-xl p-4 w-full max-w-2xl mx-auto">
      <div className="mb-3 flex items-center gap-2">
        <Badge variant="secondary">Watch Party Room</Badge>
        <span className="text-xs text-gray-400">Invite others with code: <b>{partyId.slice(0, 6).toUpperCase()}</b></span>
      </div>
      <div className="h-64 overflow-y-auto bg-gray-900 p-3 rounded mb-3">
        {messages.map((msg) => (
          <div key={msg.id} className="mb-2 text-sm">
            <span className="font-bold text-white">{msg.user_id.slice(0, 6)}:</span>{" "}
            <span className="text-gray-200">{msg.content}</span>
            <span className="block text-xs text-gray-500">{new Date(msg.created_at).toLocaleTimeString()}</span>
          </div>
        ))}
      </div>
      <form
        className="flex gap-2"
        onSubmit={e => {
          e.preventDefault();
          sendMessage();
        }}
      >
        <input
          className="flex-1 rounded px-2 py-1 border border-gray-700 bg-gray-950 text-white"
          placeholder="Type your message"
          value={input}
          onChange={e => setInput(e.target.value)}
        />
        <Button type="submit" size="sm">Send</Button>
      </form>
    </div>
  );
};

export default WatchPartyRoom;
