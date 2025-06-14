
import React from 'react';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import MovieGrid from '@/components/MovieGrid';
import ContinueWatching from '@/components/ContinueWatching/ContinueWatching';
import SmartRecommendations from '@/components/SmartRecommendations';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { Crown } from 'lucide-react';

const Dashboard = () => {
  const { isSubscribed, subscriptionTier, subscriptionEnd } = useSubscription();

  return (
    <div className="min-h-screen bg-black">
      <Header />
      
      {/* Subscription Status */}
      {isSubscribed && (
        <div className="bg-gradient-to-r from-yellow-600 to-yellow-500 py-2">
          <div className="container mx-auto px-4 flex items-center justify-center">
            <Crown className="w-5 h-5 mr-2 text-white" />
            <span className="text-white font-medium">
              Premium {subscriptionTier} subscription active
              {subscriptionEnd && ` until ${new Date(subscriptionEnd).toLocaleDateString()}`}
            </span>
          </div>
        </div>
      )}

      <HeroSection />
      <ContinueWatching />
      <SmartRecommendations />
      
      <section className="py-12">
        <div className="container mx-auto px-4">
          <MovieGrid title="Popular Movies" category="popular" />
          <MovieGrid title="Trending This Week" category="trending" />
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
