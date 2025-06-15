
import { Link } from "react-router-dom";
import TrailersSection from "@/components/TrailersSection";
import { Button } from "@/components/ui/button";
// Removed GuestPublicDomainMovies import

const features = [
  "Browse & stream the latest movies and shows",
  "Curate your own personal watchlist",
  "Get smart recommendations tailored to your taste",
  "Continue watching across devices",
  "Join a welcoming movie lover community"
];

const GuestView = () => (
  <div className="min-h-screen bg-black flex flex-col">
    {/* Hero Section */}
    <section className="flex flex-col items-center justify-center py-16 px-4 bg-gradient-to-br from-purple-950 via-black to-blue-900 relative">
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-10 left-10 w-36 h-36 bg-purple-700/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-24 w-52 h-52 bg-blue-600/20 rounded-full blur-2xl animate-pulse" />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center max-w-2xl">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-blue-300 to-pink-400 mb-4 drop-shadow-lg">
          Unlock Unlimited Entertainment
        </h1>
        <p className="text-lg sm:text-xl text-gray-300 mb-6">
          Create your free account to stream top movies, build your list, get personal recommendations and join our fan community!
        </p>

        <ul className="mb-8 flex flex-col gap-2 items-center">
          {features.map((feature) => (
            <li
              key={feature}
              className="flex items-center gap-2 text-gray-400 text-base sm:text-lg"
            >
              <span className="inline-block w-2 h-2 rounded-full bg-gradient-to-br from-purple-400 to-blue-600" />
              {feature}
            </li>
          ))}
        </ul>

        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
          <Link to="/register" className="w-full sm:w-auto">
            <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-700 shadow-xl text-lg font-semibold">
              Create Free Account
            </Button>
          </Link>
          <Link to="/login" className="w-full sm:w-auto">
            <Button variant="outline" size="lg" className="w-full sm:w-auto border-purple-500 text-purple-200 hover:bg-purple-950/40 text-lg font-semibold">
              Sign In
            </Button>
          </Link>
        </div>
        <p className="text-xs text-gray-500 mt-6">No credit card required • Cancel anytime</p>
      </div>
    </section>
    {/* Removed GuestPublicDomainMovies section */}
    <section className="flex-1">
      <TrailersSection />
    </section>
  </div>
);

export default GuestView;

