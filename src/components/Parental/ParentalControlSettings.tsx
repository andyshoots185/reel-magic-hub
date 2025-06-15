
import React, { useState } from "react";
import { useAuth } from "../Auth/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "../ui/button";
const ParentalControlSettings = () => {
  const { user } = useAuth();
  const [ageLimit, setAgeLimit] = useState(13);

  const save = async () => {
    if (!user) return;
    await supabase.from("user_preferences").update({ parental_controls: { age_limit: ageLimit } }).eq("user_id", user.id);
  };

  return (
    <section>
      <div className="font-bold text-white mb-2">Parental Controls</div>
      <label className="text-white">Maximum Allowed Age Rating:</label>
      <input className="ml-2" type="number" min={0} max={21} value={ageLimit} onChange={e => setAgeLimit(Number(e.target.value))} />
      <Button className="ml-3" onClick={save}>Save</Button>
    </section>
  );
};
export default ParentalControlSettings;
