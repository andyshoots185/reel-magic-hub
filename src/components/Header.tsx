
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Film } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-md border-b border-gray-800">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2 text-red-500 hover:text-red-400 transition-colors">
          <Film size={32} />
          <span className="text-2xl font-bold">ReelFlix</span>
        </Link>
        
        <nav className="hidden md:flex items-center space-x-8 text-white">
          <Link to="/" className="hover:text-red-400 transition-colors">Home</Link>
          <Link to="/movies" className="hover:text-red-400 transition-colors">Movies</Link>
          <Link to="/tv-shows" className="hover:text-red-400 transition-colors">TV Shows</Link>
          <span className="hover:text-red-400 transition-colors cursor-pointer">My List</span>
        </nav>

        <form onSubmit={handleSearch} className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <Input
              type="text"
              placeholder="Search movies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-red-500"
            />
          </div>
          <Button type="submit" variant="outline" size="icon" className="border-gray-600 text-white hover:bg-red-600 hover:border-red-600">
            <Search size={20} />
          </Button>
        </form>
      </div>
    </header>
  );
};

export default Header;
