import InviteFriend from './pages/artist/InviteFriend';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {  HashRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import ErrorBoundary from '@/components/ErrorBoundary';
import { useEffect } from "react";
import { io, Socket } from "socket.io-client";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { API_BASE_URL } from "@/config";
import apiFetch from "@/lib/api";
import { Button } from "@/components/ui/button";
import Messages from "./pages/Messages";

import { useDynamicPrimaryColor } from "@/hooks/useDynamicPrimaryColor";

// Public pages
import Landing from "./pages/Landing";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// Artist pages
import ArtistHome from "./pages/artist/ArtistHome";
import ArtistProfile from "./pages/artist/ArtistProfile";
import ProtectedArtistDiscover from "./pages/artist/ProtectedArtistDiscover";
import ArtistCalendar from "./pages/artist/ArtistCalendar";
import ArtistRequests from "./pages/artist/ArtistRequests";

// Manager pages
import ManagerHome from "./pages/manager/ManagerHome";
import ManagerDiscover from "./pages/manager/ManagerDiscover";
import ManagerRequests from "./pages/manager/ManagerRequests";
import ManagerArtists from "./pages/manager/ManagerArtists";
import ManagerProfile from "./pages/manager/ManagerProfile";


// Venue pages
import VenueDashboard from "./pages/venue/VenueDashboard";
import VenueRequests from "./pages/venue/VenueRequests";
import VenueProfile from "./pages/venue/VenueProfile";
import VenueCalendar from "./pages/venue/VenueCalendar";

// Promoter pages
import PromoterHome from "./pages/promoter/PromoterHome";
import PromoterDiscover from "./pages/promoter/PromoterDiscover";
import PromoterRequests from "./pages/promoter/PromoterRequests";
import PromoterProfile from "./pages/promoter/PromoterProfile";

// Common pages
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import VenueDiscover from './pages/venue/VenueDiscover';
import DiscoveryCategory from './pages/DiscoveryCategory';

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

    // NUEVO: invalidar interesados para venues
    const invalidateInterested = () => {
      if (user?.role === 'Local' && user?.id) {
        queryClient.invalidateQueries({ queryKey: ['interested', Number(user.id)] });
      }
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

    // NUEVO: escuchar evento de interesado creado
    socket.on('interested.created', (payload: any) => {
      if (user?.role === 'Local' && user?.id && payload?.venueId === user.id) {
        toast({
          title: 'Nuevo interesado',
          description: `Un artista o manager ha mostrado interés en tu oportunidad.`,
          duration: 4000,
        });
        invalidateInterested();
      }
    });

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

       // Notificación: artista interesado en la propuesta del local
      socket.on('notification.artist-interested', (payload: any) => {
        if (user?.role === 'Local' && user?.id) {
          toast({
            title: 'Nuevo interés recibido',
            description: payload?.message || 'Un artista está interesado en tu propuesta.',
            duration: 5000,
          });
          invalidateInterested();
        }
      });

    // Notificación global de oportunidad de actuación
    socket.on('notification.available-date', (payload: any) => {
      const { venueName, venueCity, date, price } = payload;
      const fecha = date ? new Date(date).toLocaleDateString('es-ES') : '';
      // Determinar rol para la notificación (artista o manager)
      const role = user?.role === 'Manager' ? 'manager' : 'artista';
      // Usar función genérica para mostrar la notificación personalizada
      import('@/hooks/showOpportunityNotification.tsx').then(({ showOpportunityNotification }) => {
        showOpportunityNotification({
          venueName: venueName || 'desconocido',
          venueCity: venueCity || '',
          date: fecha,
          role,
          price: typeof price === 'number' ? price : undefined,
          onDetails: () => {
            // Redirigir a la página de detalles del local
            if (user?.role === 'Manager') {
              navigate(`/manager/${user.id}/discover`);
            } else {
              navigate(`/artist/${user.id}/discover`);
            }
          },
          onInterest: () => {},
          venueId: payload.venueId || payload.venue_id || undefined,
          artistId: user?.role === 'Artista' ? Number(user.id) : undefined,
          managerId: user?.role === 'Manager' ? Number(user.id) : undefined,
        });
      });
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
      return <Navigate to={`/manager/${user.id}/discover`} replace />;
    case 'Local':
      return <Navigate to={`/venue/${user.id}/discover`} replace />;
    case 'Promotor':
      return <Navigate to={`/promoter/${user.id}/discover`} replace />;
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

      {/* Artist routes */}
      <Route path="/artist/:id/discover" element={<ProtectedArtistDiscover />} />
      <Route path="/artist/:id/dashboard" element={<ArtistHome />} />
      <Route path="/artist/:id/profile" element={<ArtistProfile />} />
      <Route path="/artist/:id/calendar" element={<ArtistCalendar />} />
      <Route path="/artist/:id/requests" element={<ArtistRequests />} />
      <Route path="/artist/:id/settings" element={<Settings />} />
      <Route path="/artist/:id/invite" element={<InviteFriend />} />
      <Route path="/artist/:id/pages" element={<Messages />} />
      {/* Ruta pública: venue o promotor pueden ver perfil de artista */}
      <Route path="/venue/:venueId/artist/:id/profile" element={<ArtistProfile />} />
      <Route path="/promoter/:promoterId/artist/:id/profile" element={<ArtistProfile />} />
      <Route path="/manager/:managerId/artist/:id/profile" element={<ArtistProfile />} />

      {/* Venue routes */}
      <Route path="/venue/:id/discover" element={<VenueDiscover />} />
      <Route path="/venue/:id/profile" element={<VenueProfile />} />
      <Route path="/venue/:id/calendar" element={<VenueCalendar />} />
      <Route path="/venue/:id/requests" element={<VenueRequests />} />
      <Route path="/venue/:id/dashboard" element={<VenueDashboard />} />
      <Route path="/venue/:id/settings" element={<Settings />} />
      <Route path="/venue/:id/pages" element={<Messages />} />
      {/* Ruta pública: artista o manager pueden ver perfil de venue */}
      <Route path="/artist/:id/venue/:venueId/profile" element={<VenueProfile />} />
      <Route path="/manager/:id/venue/:venueId/profile" element={<VenueProfile />} />


      {/* Manager routes */}
      <Route path="/manager/:id/discover" element={<ManagerDiscover />} />
      <Route path="/manager/:id/dashboard" element={<ManagerHome />} />
      <Route path="/manager/:id/profile" element={<ManagerProfile />} />
      <Route path="/manager/:id/artists" element={<ManagerArtists />} />
      <Route path="/manager/:id/requests" element={<ManagerRequests />} />
      <Route path="/manager/:id/settings" element={<Settings />} />
      <Route path="/manager/:id/pages" element={<Messages />} />
      {/* Ruta pública: promotor, locales o artista pueden ver perfil de manager */}
      <Route path="/promoter/:id/manager/:managerId/profile" element={<ManagerProfile />} />
      <Route path="/artist/:artistId/manager/:id/profile" element={<ManagerProfile />} />
      <Route path="/venue/:venueId/manager/:id/profile" element={<ManagerProfile />} />

    
      {/* Promoter routes */}
      <Route path="/promoter/:id/discover" element={<PromoterDiscover />} />
      <Route path="/promoter/:id/profile" element={<PromoterProfile />} />
      <Route path="/promoter/:id/dashboard" element={<PromoterHome />} />
      <Route path="/promoter/:id/requests" element={<PromoterRequests />} />
      <Route path="/promoter/:id/settings" element={<Settings />} />
      <Route path="/promoter/:id/pages" element={<Messages />} />
      {/* Ruta pública: manager o artista pueden ver perfil de promoter */}
      <Route path="/manager/:managerId/promoter/:promoterId/profile" element={<PromoterProfile />} />
      <Route path="/artist/:artistId/promoter/:id/profile" element={<PromoterProfile />} />

      {/* Catch all */}
      <Route path="*" element={<NotFound />} />
      <Route path=":role/discover/:category" element={<DiscoveryCategory />} />
    </Routes>
  );
}





function DynamicThemeProvider() {
  useDynamicPrimaryColor();
  return null;
}

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <DynamicThemeProvider />
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
};

export default App;
