import InviteFriend from './pages/artist/InviteFriend';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, HashRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import ErrorBoundary from '@/components/ErrorBoundary';
import { useEffect } from "react";
import { io, Socket } from "socket.io-client";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { API_BASE_URL } from "@/config";
import apiFetch from "@/lib/api";
import { Button } from "@/components/ui/button";

// Public pages
import Landing from "./pages/Landing";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// Artist pages
import ArtistHome from "./pages/artist/ArtistHome";
import ArtistDiscover from "./pages/artist/ArtistDiscover";
import ArtistProfile from "./pages/artist/ArtistProfile";
import ProtectedArtistDiscover from "./pages/artist/ProtectedArtistDiscover";
import ArtistCalendar from "./pages/artist/ArtistCalendar";
import ArtistRequests from "./pages/artist/ArtistRequests";
import ArtistManagerRequests from "./pages/artist/ArtistManagerRequests";

// Manager pages
import ManagerHome from "./pages/manager/ManagerHome";
import ManagerDiscover from "./pages/manager/ManagerDiscover";
import ManagerRequests from "./pages/manager/ManagerRequests";
import ManagerArtists from "./pages/manager/ManagerArtists";
import ManagerProfile from "./pages/manager/ManagerProfile";


// Venue pages
import VenueHome from "./pages/venue/VenueHome";
import Discovery from "./pages/Discovery";
import VenueRequests from "./pages/venue/VenueRequests";
import VenueProfile from "./pages/venue/VenueProfile";

// Promoter pages
import PromoterHome from "./pages/promoter/PromoterHome";
import PromoterRequests from "./pages/promoter/PromoterRequests";
import PromoterProfile from "./pages/promoter/PromoterProfile";

// Common pages
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import VenueDiscover from './pages/venue/VenueDiscover';

const queryClient = new QueryClient();

function RealtimeToasts() {
  const { token, user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) return;

    const socket: Socket = io(API_BASE_URL.replace('/api', ''), {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 500,
      reconnectionAttempts: 10,
      auth: { token },
      extraHeaders: { Authorization: `Bearer ${token}` },
    });

    const invalidateBookings = () => {
      queryClient.invalidateQueries({ queryKey: ['requests'] });
      queryClient.invalidateQueries({ queryKey: ['managerRequests'] });
      if (user?.id) {
        queryClient.invalidateQueries({ queryKey: ['confirmed-requests', Number(user.id)] });
      }
      queryClient.invalidateQueries({ queryKey: ['managerStats'] });
    };

    const invalidateManagerRelations = () => {
      queryClient.invalidateQueries({ queryKey: ['managerRequests'] });
      queryClient.invalidateQueries({ queryKey: ['managerRequests', 'received'] });
      queryClient.invalidateQueries({ queryKey: ['managerRequests', 'sent'] });
      queryClient.invalidateQueries({ queryKey: ['managerStats'] });
      queryClient.invalidateQueries({ queryKey: ['artists'] });
      queryClient.invalidateQueries({ queryKey: ['artist'] });
    };

    const updateManagerRequestStatus = async (requestId: number, status: 'Accepted' | 'Rejected') => {
      try {
        await apiFetch(`/manager-requests/${requestId}/status`, {
          method: 'PATCH',
          body: { status },
          token: token as string,
        });
        toast({
          title: 'Solicitud actualizada',
          description: `Estado: ${status}`,
          duration: 4000,
        });
        invalidateManagerRelations();
      } catch (err: any) {
        toast({
          title: 'Error',
          description: err?.message || 'No se pudo actualizar la solicitud',
          variant: 'destructive',
          duration: 4000,
        });
      }
    };

    socket.on('request.created', (payload: any) => {
      toast({
        title: 'Nueva solicitud de contratación',
        description: (
          <div className="space-y-2">
            <div className="font-semibold">{`${payload?.eventType || 'Evento'} - ${payload?.eventLocation || ''}`.trim()}</div>
            {payload?.managerId && user?.role === 'Manager' && (
              <Button size="sm" variant="outline" onClick={() => navigate('/manager/requests')}>Ver en solicitudes</Button>
            )}
          </div>
        ),
        duration: 4000,
      });
      invalidateBookings();
    });

    socket.on('request.updated', (payload: any) => {
      toast({
        title: 'Solicitud actualizada',
        description: `Estado: ${payload?.status || 'Actualizada'}`,
        duration: 4000,
      });
      invalidateBookings();
    });

    socket.on('manager-request.created', (payload: any) => {
      const isReceiver = user?.id && Number(user.id) === Number(payload?.receiverId);

      const t = toast({
        title: 'Nueva solicitud manager-artista',
        description: (
          <div className="space-y-2">
            <div>
              <div className="font-semibold">De: {payload?.senderName || 'Usuario'}</div>
              <div className="text-muted-foreground text-xs">Rol: {payload?.senderRole || 'N/A'}</div>
            </div>
            <div className="flex gap-2">
              {isReceiver && (
                <>
                  <Button size="sm" variant="default" onClick={() => updateManagerRequestStatus(payload.id, 'Accepted')}>
                    Aceptar
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => updateManagerRequestStatus(payload.id, 'Rejected')}>
                    Rechazar
                  </Button>
                </>
              )}
              <Button size="sm" variant="ghost" onClick={() => t.dismiss?.()}>
                Ver después
              </Button>
            </div>
          </div>
        ),
        duration: 4000,
      });
      invalidateManagerRelations();
    });

    socket.on('manager-request.updated', (payload: any) => {
      toast({
        title: 'Solicitud actualizada',
        description: `Estado: ${payload?.status || 'Actualizada'}`,
        duration: 4000,
      });
      invalidateManagerRelations();
    });

    socket.on('manager-relation.removed', () => {
      toast({
        title: 'Relación finalizada',
        description: 'Se ha eliminado la relación manager-artista.',
        duration: 4000,
      });
      invalidateManagerRelations();
    });

    return () => {
      socket.disconnect();
    };
  }, [token, user?.id, queryClient, toast]);

  return null;
}

function RoleBasedRedirect() {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Landing />;
  }

  switch (user?.role) {
    case 'Artista':
      return <Navigate to={`/artist/${user.id}/discover`} replace />;
    case 'Manager':
      return <Navigate to="/manager" replace />;
    case 'Local':
      return <Navigate to={`/venue/${user.id}/discover`} replace />;
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
      {/* <Route path="/artist/:id" element={<ArtistPublicProfile />} /> */}
      {/* <Route path="/manager/:id" element={<ManagerPublicProfile />} /> */}
      {/* <Route path="/promoter/:id" element={<PromoterPublicProfile />} /> */}
      {/* <Route path="/venue/:id" element={<VenuePublicProfile />} /> */}

      {/* Artist routes */}
      <Route path="/artist/:id/discover" element={<ProtectedArtistDiscover />} />
      <Route path="/artist/dashboard" element={<ArtistHome />} />
      <Route path="/artist/profile/:id" element={<ArtistProfile />} />
      <Route path="/artist/calendar/:id" element={<ArtistCalendar />} />
      <Route path="/artist/requests" element={<ArtistRequests />} />
      <Route path="/artist/manager-requests" element={<ArtistManagerRequests />} />
      <Route path="/artist/settings" element={<Settings />} />
      <Route path="/artist/invite" element={<InviteFriend />} />

        {/* Venue routes */}
      <Route path="/venue/:id/discover" element={<VenueDiscover />} />
      <Route path="/venue/profile/:id" element={<VenueProfile />} />
      <Route path="/venue/search" element={<Discovery type="artists" />} />
      <Route path="/venue/requests" element={<VenueRequests />} />
      <Route path="/venue/dashboard/" element={<VenueHome />} />
      <Route path="/venue/settings" element={<Settings />} />


      {/* Manager routes */}
      <Route path="/manager" element={<ManagerDiscover />} />
      <Route path="/manager/dashboard" element={<ManagerHome />} />
      <Route path="/manager/profile/:id" element={<ManagerProfile />} />
      <Route path="/manager/artists" element={<ManagerArtists />} />
      <Route path="/manager/requests" element={<ManagerRequests />} />
      <Route path="/manager/settings" element={<Settings />} />

    
      {/* Promoter routes */}
      <Route path="/promoter" element={<PromoterHome />} />
      <Route path="/promoter/profile/:id" element={<PromoterProfile />} />
      <Route path="/promoter/search" element={<Discovery type="artists" />} />
      <Route path="/promoter/events" element={<PromoterHome />} />
      <Route path="/promoter/requests" element={<PromoterRequests />} />
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
        <HashRouter>
          <ErrorBoundary>
            <RealtimeToasts />
            <AppRoutes />
          </ErrorBoundary>
        </HashRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
