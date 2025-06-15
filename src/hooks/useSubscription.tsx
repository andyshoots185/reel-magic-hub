
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

// Subscription Tier type
export type SubscriptionTier = "Basic" | "Premium" | "Family" | null;

export interface SubscriptionState {
  subscribed: boolean;
  subscription_tier: SubscriptionTier;
  subscription_end: string | null;
  loading: boolean;
  refresh: () => Promise<void>;
}

export function useSubscription(): SubscriptionState {
  const [subscribed, setSubscribed] = useState(false);
  const [tier, setTier] = useState<SubscriptionTier>(null);
  const [end, setEnd] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStatus = async () => {
    setLoading(true);
    const { data, error } = await supabase.functions.invoke("check-subscription");
    if (data) {
      setSubscribed(!!data.subscribed);
      setTier((data.subscription_tier ?? null) as SubscriptionTier);
      setEnd(data.subscription_end ?? null);
    }
    setLoading(false);
  };
  useEffect(() => {
    fetchStatus();
  }, []);
  return {
    subscribed,
    subscription_tier: tier,
    subscription_end: end,
    loading,
    refresh: fetchStatus,
  };
}
