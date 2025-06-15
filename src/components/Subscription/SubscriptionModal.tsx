
import { useState } from "react";
import { useSubscription } from "@/hooks/useSubscription";
import { startStripeSubscription } from "@/utils/stripe";
import { Button } from "@/components/ui/button";
import { Loader2, BadgeCheck, CreditCard } from "lucide-react";

export default function SubscriptionModal() {
  const { subscribed, subscription_tier, loading, refresh } = useSubscription();
  const [pending, setPending] = useState(false);

  const handleUpgrade = async () => {
    setPending(true);
    const { url, error } = await startStripeSubscription();
    setPending(false);
    if (url) {
      window.open(url, '_blank');
    } else {
      alert("Error creating subscription: " + (error ?? "Unknown"));
    }
  };

  let description = subscribed
    ? `You have an active ${subscription_tier} subscription.`
    : "Upgrade now to unlock HD streaming, ad-free experience, and offline viewing!";

  return (
    <div className="bg-gray-900 rounded-lg p-6 max-w-md mx-auto text-white shadow-2xl">
      <div className="flex items-center gap-3 mb-3">
        {subscribed ? (
          <BadgeCheck className="text-green-400" />
        ) : (
          <CreditCard className="text-yellow-300" />
        )}
        <h2 className="text-2xl font-bold">
          {subscribed ? "Premium Features Unlocked" : "Upgrade to Premium"}
        </h2>
      </div>
      <p className="mb-4">{description}</p>
      <ul className="mb-6 pl-6 list-disc text-gray-300 space-y-2 text-sm">
        <li>HD & 4K streaming</li>
        <li>Zero ads</li>
        <li>Watch offline</li>
        <li>Early access to new releases</li>
      </ul>
      {!subscribed && (
        <Button
          onClick={handleUpgrade}
          disabled={loading || pending}
          className="w-full bg-gradient-to-r from-purple-700 via-pink-600 to-blue-600 text-lg font-semibold"
        >
          {pending ? <Loader2 className="inline animate-spin mr-2" /> : null}
          Upgrade with Stripe
        </Button>
      )}
      {subscribed && (
        <div className="flex flex-row items-center justify-between text-green-300 mt-3">
          Premium active
          <Button size="sm" variant="outline" onClick={refresh}>
            Refresh Status
          </Button>
        </div>
      )}
      {loading && (
        <div className="mt-3 flex items-center gap-2 text-gray-400 text-sm">
          <Loader2 className="animate-spin" /> Checking status...
        </div>
      )}
    </div>
  );
}
