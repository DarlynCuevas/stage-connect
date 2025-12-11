import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
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
import ArtistPublicProfile from "./pages/public/ArtistPublicProfile";

// Artist pages
import ArtistHome from "./pages/artist/ArtistHome";
import ArtistProfile from "./pages/artist/ArtistProfile";
import ArtistCalendar from "./pages/artist/ArtistCalendar";
import ArtistRequests from "./pages/artist/ArtistRequests";
import ArtistManagerRequests from "./pages/artist/ArtistManagerRequests";

// Manager pages
import ManagerHome from "./pages/manager/ManagerHome";
import ManagerRequests from "./pages/manager/ManagerRequests";
import ManagerArtists from "./pages/manager/ManagerArtists";

// Venue pages
import VenueHome from "./pages/venue/VenueHome";
import VenueSearch from "./pages/venue/VenueSearch";

// Promoter pages
import PromoterHome from "./pages/promoter/PromoterHome";

// Common pages
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

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
        });
        invalidateManagerRelations();
      } catch (err: any) {
        toast({
          title: 'Error',
          description: err?.message || 'No se pudo actualizar la solicitud',
          variant: 'destructive',
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
      });
      invalidateBookings();
    });

    socket.on('request.updated', (payload: any) => {
      toast({
        title: 'Solicitud actualizada',
        description: `Estado: ${payload?.status || 'Actualizada'}`,
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
      });
      invalidateManagerRelations();
    });

    socket.on('manager-request.updated', (payload: any) => {
      toast({
        title: 'Solicitud actualizada',
        description: `Estado: ${payload?.status || 'Actualizada'}`,
      });
      invalidateManagerRelations();
    });

    socket.on('manager-relation.removed', () => {
      toast({
        title: 'Relación finalizada',
        description: 'Se ha eliminado la relación manager-artista.',
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
        <Route path="/artist/manager-requests" element={<ArtistManagerRequests />} />
      <Route path="/artist/settings" element={<Settings />} />

      {/* Manager routes */}
      <Route path="/manager" element={<ManagerHome />} />
      <Route path="/manager/artists" element={<ManagerArtists />} />
      <Route path="/manager/requests" element={<ManagerRequests />} />
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
            <RealtimeToasts />
            <AppRoutes />
          </ErrorBoundary>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
