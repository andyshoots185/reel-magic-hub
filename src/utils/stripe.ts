
import { supabase } from "@/integrations/supabase/client";

/**
 * Start a Stripe Checkout session for a subscription plan
 */
export async function startStripeSubscription(): Promise<{ url?: string, error?: string }> {
  const { data, error } = await supabase.functions.invoke("create-checkout", {
    body: {},
  });
  if (error) {
    return { error: error.message };
  }
  return data || {};
}

/**
 * Start a one-off payment for unlocking a movie (returns Stripe Checkout session url)
 */
export async function startOneTimePayment(movieId: number, amountCents: number): Promise<{ url?: string, error?: string }> {
  const { data, error } = await supabase.functions.invoke("create-payment", {
    body: { movie_id: movieId, amount: amountCents },
  });
  if (error) {
    return { error: error.message };
  }
  return data || {};
}
