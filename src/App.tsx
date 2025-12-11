import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import ErrorBoundary from '@/components/ErrorBoundary';

// Public pages
import Landing from "./pages/Landing";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ArtistPublicProfile from "./pages/public/ArtistPublicProfile";

// Artist pages
import ArtistHome from "./pages/artist/ArtistHome";
import ArtistProfile from "./pages/artist/ArtistProfile";
import ArtistCalendar from "./pages/artist/ArtistCalendar";
import ArtistRequests from "./pages/artist/ArtistRequests";

// Manager pages
import ManagerHome from "./pages/manager/ManagerHome";

// Venue pages
import VenueHome from "./pages/venue/VenueHome";
import VenueSearch from "./pages/venue/VenueSearch";

// Promoter pages
import PromoterHome from "./pages/promoter/PromoterHome";

// Common pages
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function RoleBasedRedirect() {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Landing />;
  }

  switch (user?.role) {
    case 'Artista':
      return <Navigate to="/artist" replace />;
    case 'Manager':
      return <Navigate to="/manager" replace />;
    case 'Local':
      return <Navigate to="/venue" replace />;
    case 'Promotor':
      return <Navigate to="/promoter" replace />;
    default:
      return <Landing />;
  }
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<RoleBasedRedirect />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/artist/:id" element={<ArtistPublicProfile />} />

      {/* Artist routes */}
      <Route path="/artist" element={<ArtistHome />} />
      <Route path="/artist/profile" element={<ArtistProfile />} />
      <Route path="/artist/calendar" element={<ArtistCalendar />} />
      <Route path="/artist/requests" element={<ArtistRequests />} />
      <Route path="/artist/settings" element={<Settings />} />

      {/* Manager routes */}
      <Route path="/manager" element={<ManagerHome />} />
      <Route path="/manager/artists" element={<ManagerHome />} />
      <Route path="/manager/requests" element={<ManagerHome />} />
      <Route path="/manager/settings" element={<Settings />} />

      {/* Venue routes */}
      <Route path="/venue" element={<VenueHome />} />
      <Route path="/venue/search" element={<VenueSearch />} />
      <Route path="/venue/requests" element={<VenueHome />} />
      <Route path="/venue/favorites" element={<VenueHome />} />
      <Route path="/venue/settings" element={<Settings />} />

      {/* Promoter routes */}
      <Route path="/promoter" element={<PromoterHome />} />
      <Route path="/promoter/search" element={<VenueSearch />} />
      <Route path="/promoter/events" element={<PromoterHome />} />
      <Route path="/promoter/requests" element={<PromoterHome />} />
      <Route path="/promoter/settings" element={<Settings />} />

      {/* Catch all */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ErrorBoundary>
            <AppRoutes />
          </ErrorBoundary>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
