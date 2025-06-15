
import React, { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "../Auth/AuthProvider";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

const AvatarBioEditor = () => {
  const { user } = useAuth();
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState("");

  const save = async () => {
    if (!user) return;
    await supabase.from("profiles").update({ bio, avatar_url: avatar }).eq("id", user.id);
  };

  return (
    <div className="space-y-2">
      <div className="font-bold text-white">Edit Bio & Avatar</div>
      <Input placeholder="Bio..." value={bio} onChange={e => setBio(e.target.value)} />
      <Input placeholder="Avatar URL..." value={avatar} onChange={e => setAvatar(e.target.value)} />
      <Button onClick={save}>Save</Button>
    </div>
  );
};
export default AvatarBioEditor;
