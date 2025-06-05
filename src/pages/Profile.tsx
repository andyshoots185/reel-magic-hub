
import React from 'react';
import Header from '@/components/Header';
import UserProfile from '@/components/Profile/UserProfile';

const Profile = () => {
  return (
    <div className="min-h-screen bg-black">
      <Header />
      <UserProfile />
    </div>
  );
};

export default Profile;
