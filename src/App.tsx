
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/components/Auth/AuthProvider";
import ProtectedRoute from "@/components/Auth/ProtectedRoute";
import PerformanceOptimizer from "@/components/PerformanceOptimizer";
import Index from "./pages/Index";
import Movies from "./pages/Movies";
import TVShows from "./pages/TVShows";
import MovieDetails from "./pages/MovieDetails";
import SearchResults from "./pages/SearchResults";
import NotFound from "./pages/NotFound";
import MyList from "./pages/MyList";
import Feedback from "./pages/Feedback";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import MobileNavBar from '@/components/MobileNavBar';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      retry: 2,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <PerformanceOptimizer />
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Index />} />
            
            {/* Protect all other routes with authentication */}
            <Route path="/movies" element={
              <ProtectedRoute>
                <Movies />
              </ProtectedRoute>
            } />
            <Route path="/tv-shows" element={
              <ProtectedRoute>
                <TVShows />
              </ProtectedRoute>
            } />
            <Route path="/movie/:id" element={
              <ProtectedRoute>
                <MovieDetails />
              </ProtectedRoute>
            } />
            <Route path="/search" element={
              <ProtectedRoute>
                <SearchResults />
              </ProtectedRoute>
            } />
            <Route path="/my-list" element={
              <ProtectedRoute>
                <MyList />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            <Route path="/feedback" element={
              <ProtectedRoute>
                <Feedback />
              </ProtectedRoute>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <MobileNavBar />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
