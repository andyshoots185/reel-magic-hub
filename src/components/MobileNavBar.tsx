
import { Link, useLocation } from 'react-router-dom';
import { Film, Bookmark, MessageSquare, Home, User } from 'lucide-react';
import { useAuth } from '@/components/Auth/AuthProvider';

const MobileNavBar = () => {
  const location = useLocation();
  const { user } = useAuth();

  // Don't show navbar on guest pages
  if (!user || location.pathname === '/' || location.pathname === '/login' || location.pathname === '/register') {
    return null;
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-black border-t border-gray-800 flex justify-around items-center py-2 md:hidden">
      <Link to="/dashboard" className={`flex flex-col items-center text-xs ${location.pathname === '/dashboard' ? 'text-red-500' : 'text-white'}`}>
        <Home size={22} />
        Dashboard
      </Link>
      <Link to="/movies" className={`flex flex-col items-center text-xs ${location.pathname === '/movies' ? 'text-red-500' : 'text-white'}`}>
        <Film size={22} />
        Movies
      </Link>
      <Link to="/my-list" className={`flex flex-col items-center text-xs ${location.pathname === '/my-list' ? 'text-red-500' : 'text-white'}`}>
        <Bookmark size={22} />
        My List
      </Link>
      <Link to="/profile" className={`flex flex-col items-center text-xs ${location.pathname === '/profile' ? 'text-red-500' : 'text-white'}`}>
        <User size={22} />
        Profile
      </Link>
    </nav>
  );
};

export default MobileNavBar;
