
import { Button } from "@/components/ui/button";
import { Play, Film, Star, Users } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import ContactSection from "@/components/ContactSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center bg-gradient-to-r from-red-900/20 to-black">
        <div className="absolute inset-0 bg-black/50 z-10"></div>
        <div className="relative z-20 text-center max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-red-500 to-white bg-clip-text text-transparent">
            Welcome to ReelFlix
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-300">
            Stream unlimited movies and TV shows in stunning quality
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white px-8 py-3">
                <Play className="mr-2 h-5 w-5" />
                Start Watching
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-black px-8 py-3">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">Why Choose ReelFlix?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <Film className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold mb-4">Vast Library</h3>
              <p className="text-gray-400">Access thousands of movies and TV shows from around the world</p>
            </div>
            <div className="text-center p-6">
              <Star className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold mb-4">HD Quality</h3>
              <p className="text-gray-400">Enjoy crystal clear streaming in HD and 4K resolution</p>
            </div>
            <div className="text-center p-6">
              <Users className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold mb-4">Multiple Devices</h3>
              <p className="text-gray-400">Watch on your TV, laptop, tablet, or smartphone</p>
            </div>
          </div>
        </div>
      </section>

      <ContactSection />
    </div>
  );
};

export default Index;
