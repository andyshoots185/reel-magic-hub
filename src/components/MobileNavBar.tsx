import { Link, useLocation } from 'react-router-dom';
import { Film, Bookmark, MessageSquare, Home } from 'lucide-react';

const MobileNavBar = () => {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-black border-t border-gray-800 flex justify-around items-center py-2 md:hidden">
      <Link to="/" className={`flex flex-col items-center text-xs ${location.pathname === '/' ? 'text-red-500' : 'text-white'}`}>
        <Home size={22} />
        Home
      </Link>
      <Link to="/movies" className={`flex flex-col items-center text-xs ${location.pathname === '/movies' ? 'text-red-500' : 'text-white'}`}>
        <Film size={22} />
        Movies
      </Link>
      <Link to="/my-list" className={`flex flex-col items-center text-xs ${location.pathname === '/my-list' ? 'text-red-500' : 'text-white'}`}>
        <Bookmark size={22} />
        My List
      </Link>
      <Link to="/feedback" className={`flex flex-col items-center text-xs ${location.pathname === '/feedback' ? 'text-red-500' : 'text-white'}`}>
        <MessageSquare size={22} />
        Feedback
      </Link>
    </nav>
  );
};

export default MobileNavBar;