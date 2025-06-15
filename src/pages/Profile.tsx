
import React from "react";
import UserProfile from "@/components/Profile/UserProfile";
import ProfilesManager from "@/components/Profile/ProfilesManager";
import AvatarBioEditor from "@/components/Profile/AvatarBioEditor";
import WatchlistManager from "@/components/Watchlists/WatchlistManager";
import UserStats from "@/components/Stats/UserStats";
import Achievements from "@/components/Stats/Achievements";
import FriendsManager from "@/components/Social/FriendsManager";
import FriendsActivityFeed from "@/components/Social/FriendsActivityFeed";

const Profile = () => {
  return (
    <div className="min-h-screen bg-black pt-24">
      <div className="container mx-auto px-2 space-y-8">
        <UserProfile />
        <ProfilesManager />
        <AvatarBioEditor />
        <WatchlistManager />
        <UserStats />
        <Achievements />
        <FriendsManager />
        <FriendsActivityFeed />
      </div>
    </div>
  );
};

export default Profile;
