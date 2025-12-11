import { Link } from 'react-router-dom';
import { useCallback, useMemo, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RequestCard } from '@/components/booking/RequestCard';
import { useUpdateRequestStatus, useArtistRequests, useConfirmedRequests } from '@/lib/requests';
import { useAuth } from '@/contexts/AuthContext';
import { API_BASE_URL } from '@/config';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { io, Socket } from 'socket.io-client';
import {
  Calendar,
  MessageSquare,
  DollarSign,
  TrendingUp,
  ArrowRight,
  User,
  Music,
} from 'lucide-react';
import { format, isThisYear, isFuture, parseISO, isThisMonth } from 'date-fns';
import { es } from 'date-fns/locale';

export default function ArtistHome() {
  const { user: artist, token } = useAuth();
  const { data: requests = [], isLoading } = useArtistRequests();
  const { data: confirmedRequests = [] } = useConfirmedRequests(artist?.id ? Number(artist.id) : undefined);

  const updateStatusMutation = useUpdateRequestStatus();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const pendingRequests = useMemo(() => requests.filter(r => r.status === 'Pending'), [requests]);

  // Shows totales: all confirmed requests regardless of year
  const showsThisYear = useMemo(() => {
    console.log('📊 Total shows (all time):', confirmedRequests.length);
    return confirmedRequests.length;
  }, [confirmedRequests]);

  // Próximas fechas: next 3 dates from today onwards
  const upcomingDates = useMemo(() => {
    const now = new Date();
    return confirmedRequests
      .filter(req => {
        const eventDate = typeof req.eventDate === 'string' ? parseISO(req.eventDate) : new Date(req.eventDate);
        return isFuture(eventDate) || eventDate.toDateString() === now.toDateString();
      })
      .sort((a, b) => {
        const dateA = typeof a.eventDate === 'string' ? parseISO(a.eventDate) : new Date(a.eventDate);
        const dateB = typeof b.eventDate === 'string' ? parseISO(b.eventDate) : new Date(b.eventDate);
        return dateA.getTime() - dateB.getTime();
      })
      .slice(0, 3);
  }, [confirmedRequests]);

  // Shows this month: confirmed requests for current month
  const showsThisMonth = useMemo(() => {
    return confirmedRequests.filter(req => {
      const eventDate = typeof req.eventDate === 'string' ? parseISO(req.eventDate) : new Date(req.eventDate);
      return isThisMonth(eventDate);
    }).length;
  }, [confirmedRequests]);

  const handleAccept = useCallback(async (id: string) => {
    try {
      await updateStatusMutation.mutateAsync({ id, status: 'Accepted' });
      // Invalidate confirmed requests to refresh upcoming dates
      if (artist?.id) {
        queryClient.invalidateQueries({ queryKey: ['confirmed-requests', Number(artist.id)] });
      }
    } catch (err) {
      // error already handled by mutation
    }
  }, [updateStatusMutation, queryClient, artist?.id]);

  const handleReject = useCallback(async (id: string) => {
    try {
      await updateStatusMutation.mutateAsync({ id, status: 'Rejected' });
    } catch (err) {
      // error already handled by mutation
    }
  }, [updateStatusMutation]);

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

    socket.on('request.created', (payload: any) => {
      toast({
        title: 'Nueva solicitud',
        description: `${payload.eventType} - ${payload.eventLocation}`,
      });
      queryClient.invalidateQueries({ queryKey: ['requests'] });
    });

    return () => {
      socket.disconnect();
    };
  }, [token, queryClient, toast]);

  const stats = [
    {
      label: 'Solicitudes pendientes',
      value: pendingRequests.length,
      icon: MessageSquare,
      color: 'text-role-artist',
      bgColor: 'bg-role-artist/10',
    },
    {
      label: 'Próximas actuaciones este mes',
      value: showsThisMonth,
      icon: Calendar,
      color: 'text-accent',
      bgColor: 'bg-accent/10',
    },
    {
      label: 'Caché base',
      value: `${((artist as any)?.basePrice ?? 0).toLocaleString('es-ES', { maximumFractionDigits: 0 })} €`,
      icon: DollarSign,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10',
    },
    {
      label: 'Shows confirmados (total)',
      value: showsThisYear,
      icon: Music,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
    },
    {
      label: 'Shows totales',
      value: showsThisYear,
      icon: TrendingUp,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
  ];

  if (!artist) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-screen">
          <p className="text-muted-foreground">No hay usuario autenticado</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold mb-2">
              ¡Hola, {artist.nickName || artist.name}!
            </h1>
            <p className="text-muted-foreground">
              Aquí está el resumen de tu actividad
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" asChild>
              <Link to="/artist/profile">
                <User className="w-4 h-4 mr-2" />
                Mi Perfil
              </Link>
            </Button>
            <Button variant="gradient" asChild>
              <Link to="/artist/calendar">
                <Calendar className="w-4 h-4 mr-2" />
                Calendario
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card key={stat.label} variant="gradient">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                  <div>
                    <p className={`text-2xl font-display font-bold ${stat.label === 'Solicitudes pendientes' && pendingRequests.length > 0 ? 'text-red-500' : ''}`}>
                      {stat.value}
                    </p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pending requests */}
          <Card variant="gradient">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-primary" />
                Solicitudes Pendientes
              </CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/artist/requests">
                  Ver todas
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {pendingRequests.length > 0 ? (
                pendingRequests.slice(0, 2).map((request) => (
                  <RequestCard
                    key={request.id}
                    request={request}
                    artist={artist ?? undefined}
                    isReceiver
                    onAccept={() => handleAccept(String(request.id))}
                    onReject={() => handleReject(String(request.id))}
                  />
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No tienes solicitudes pendientes</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Upcoming dates this month */}
          <Card variant="gradient">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-accent" />
                Próximas Actuaciones Este Mes
              </CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/artist/calendar">
                  Ver calendario
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {upcomingDates.length > 0 ? (
                <div className="space-y-3">
                  {upcomingDates
                    .filter(req => {
                      const eventDate = typeof req.eventDate === 'string' ? parseISO(req.eventDate) : new Date(req.eventDate);
                      return isThisMonth(eventDate);
                    })
                    .map((request) => (
                    <div
                      key={request.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-secondary/50"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Music className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{request.eventType}</p>
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(request.eventDate), "d 'de' MMMM", { locale: es })} - {request.eventLocation}
                          </p>
                        </div>
                      </div>
                      <Badge variant="success">Confirmado</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No tienes fechas próximas este mes</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
