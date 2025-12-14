import { Link } from 'react-router-dom';
import { useCallback, useMemo, useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { HeaderLayout } from '@/components/layout/HeaderLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { RequestCard } from '@/components/booking/RequestCard';
import { useUpdateRequestStatus, useArtistRequests, useConfirmedRequests } from '@/lib/requests';
import { useReceivedManagerRequests, useUpdateManagerRequestStatus } from '@/lib/manager-requests';
import { useAuth } from '@/contexts/AuthContext';
import { API_BASE_URL } from '@/config';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { io, Socket } from 'socket.io-client';
import { apiFetch } from '@/lib/api';
import {
  Calendar,
  MessageSquare,
  DollarSign,
  TrendingUp,
  ArrowRight,
  User,
  Music,
  Check,
  X,
  Search,
  MapPin,
  Users,
  Filter,
  Star,
} from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { format, isThisYear, isFuture, parseISO, isThisMonth } from 'date-fns';
import { es } from 'date-fns/locale';
import { mockVenues } from '@/data/mockData';
import { VenueCard } from '@/components/venue/VenueCard';

export default function ArtistHome() {

  const { user: artist, token } = useAuth();
  const { data: requests = [], isLoading } = useArtistRequests();
  const { data: confirmedRequests = [] } = useConfirmedRequests(artist?.id ? Number(artist.id) : undefined);
  const { data: managerRequests = [] } = useReceivedManagerRequests();

  // Estado para rating y totalReviews reales
  const [realRating, setRealRating] = useState<number | null>(null);
  const [realTotalReviews, setRealTotalReviews] = useState<number | null>(null);

  useEffect(() => {
    if (!artist?.id) return;
    // Obtener número de reseñas
    apiFetch<{ totalReviews: number }>(`/reviews/artist/${artist.id}/count`).then(res => {
      setRealTotalReviews(res.totalReviews);
    });
    // Obtener rating medio
    apiFetch<{ averageRating: number }>(`/reviews/artist/${artist.id}/average`).then(res => {
      setRealRating(res.averageRating);
    });
  }, [artist?.id]);

  const updateStatusMutation = useUpdateRequestStatus();
  const updateManagerStatusMutation = useUpdateManagerRequestStatus();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const pendingRequests = useMemo(() => requests.filter(r => r.status === 'Pending'), [requests]);
  const pendingManagerRequests = useMemo(() => managerRequests.filter(r => r.status === 'Pending'), [managerRequests]);

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

  const handleAcceptManager = useCallback(async (requestId: number) => {
    try {
      await updateManagerStatusMutation.mutateAsync({ requestId, status: 'Accepted' });
    } catch (err) {
      // error already handled by mutation
    }
  }, [updateManagerStatusMutation]);

  const handleRejectManager = useCallback(async (requestId: number) => {
    try {
      await updateManagerStatusMutation.mutateAsync({ requestId, status: 'Rejected' });
    } catch (err) {
      // error already handled by mutation
    }
  }, [updateManagerStatusMutation]);

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
        duration: 4000,
      });
      queryClient.invalidateQueries({ queryKey: ['requests'] });
    });

    socket.on('managerRequest.created', (payload: any) => {
      toast({
        title: 'Nueva solicitud de manager',
        description: `${payload.sender?.name || 'Un manager'} quiere ser tu representante`,
        duration: 4000,
      });
      queryClient.invalidateQueries({ queryKey: ['managerRequests'] });
    });

    socket.on('managerRequest.statusUpdated', (payload: any) => {
      queryClient.invalidateQueries({ queryKey: ['managerRequests'] });
      queryClient.invalidateQueries({ queryKey: ['artist'] });
      queryClient.invalidateQueries({ queryKey: ['artists'] });
    });

    return () => {
      socket.disconnect();
    };
  }, [token, queryClient, toast]);




  // Calcular fechas cerradas por artista y por manager

  // Calcular ingresos totales del año

  // Ingresos estimados para este año (solo solicitudes aceptadas, suma offeredPrice)
  const estimatedIncomeThisYear = useMemo(() => {
    const now = new Date();
    return confirmedRequests
      .filter((req: any) => {
        const eventDate = typeof req.eventDate === 'string' ? parseISO(req.eventDate) : new Date(req.eventDate);
        return isThisYear(eventDate);
      })
      .reduce((sum: number, req: any) => sum + (Number(req.offeredPrice) || 0), 0);
  }, [confirmedRequests]);

  const closedByArtist = useMemo(() =>
    confirmedRequests.filter((req: any) => req.closed_by === 'artist').length
  , [confirmedRequests]);
  const closedByManager = useMemo(() =>
    confirmedRequests.filter((req: any) => req.closed_by === 'manager').length
  , [confirmedRequests]);

  // Sección económica
  const economicStats = [
    {
      label: 'Caché base',
      value: `${((artist as any)?.basePrice ?? 0).toLocaleString('es-ES', { maximumFractionDigits: 0 })} €`,
      icon: DollarSign,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10',
    },
    {
      label: 'Ingresos estimados (año)',
      value: `${estimatedIncomeThisYear.toLocaleString('es-ES', { maximumFractionDigits: 0 })} €`,
      icon: DollarSign,
      color: 'text-orange-500',
      bgColor: 'bg-orange-100',
    },
    {
      label: 'Ingresos reales (año)',
      value: "0",
      icon: DollarSign,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
    },
  ];

  // Sección de shows y fechas
  const showStats = [
    {
      label: 'Solicitudes pendientes',
      value: pendingRequests.length + pendingManagerRequests.length,
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
    {
      label: 'Fechas cerradas por artista',
      value: closedByArtist,
      icon: User,
      color: 'text-blue-500',
      bgColor: 'bg-blue-100',
    },
    {
      label: 'Fechas cerradas por manager',
      value: closedByManager,
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
  ];


      
    
  return (

      <HeaderLayout>
         <DashboardLayout noSidebar>
      <div>
        {/* Dashboard header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-display font-bold mb-2">Panel de Artista</h1>
              <p className="text-muted-foreground">Bienvenido, {artist.nickName || artist.name}</p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" asChild>
                  <Link to={artist ? `/artist/${artist.id}/discover` : '/login'}>
                    <User className="w-4 h-4 mr-2" />
                    Inicio
                  </Link>
                </Button>
                <Button variant="gradient" asChild>
                  <Link to={artist ? `/artist/calendar/${artist.id}` : '/artist/calendar'}>
                    <Calendar className="w-4 h-4 mr-2" />
                    Calendario
                  </Link>
                </Button>
              </div>
            </div>



            {/* Sección Económica - estilo elegante */}
            <div className="mb-10">
              <h2 className="text-2xl font-semibold mb-6 tracking-tight text-yellow-400 drop-shadow-sm">Resumen Económico</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
                {economicStats.map((stat) => (
                  <div
                    key={stat.label}
                    className="bg-gradient-to-br from-[#23272f] to-[#181a20] rounded-2xl shadow-lg p-7 flex items-center gap-5 border border-[#23272f]/60 hover:shadow-2xl transition-shadow duration-200 min-h-[120px]"
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-white/5`}>
                      <stat.icon className={`w-6 h-6 ${stat.color} opacity-80`} />
                    </div>
                    <div>
                      <p className="text-3xl font-light text-white mb-1">{stat.value}</p>
                      <p className="text-sm text-[#bfc9d4] tracking-wide font-medium">{stat.label}</p>
                    </div>
                  </div>
                ))}

                {/* Tarjeta destacada de valoración media */}
                <div className="bg-gradient-to-br from-[#23272f] to-[#181a20] rounded-2xl shadow-lg p-7 flex flex-col items-center justify-center border border-[#23272f]/60 hover:shadow-2xl transition-shadow duration-200 min-h-[120px]">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-3xl font-semibold text-yellow-400">{realRating !== null ? realRating.toFixed(1) : '—'}</span>
                    <Star className="w-7 h-7 text-yellow-400" fill="#facc15" />
                  </div>
                  <span className="text-xs text-[#bfc9d4] tracking-wide font-medium">{realTotalReviews !== null ? realTotalReviews : 0} reseñas</span>
                  <span className="text-sm text-[#bfc9d4] mt-1">Valoración media</span>
                </div>
              </div>
            </div>


            {/* Sección Shows y Fechas - estilo elegante */}
            <div className="mb-10">
              <h2 className="text-2xl font-semibold mb-6 tracking-tight text-blue-400 drop-shadow-sm">Resumen de Shows y Fechas</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
                {showStats.map((stat) => (
                  <div
                    key={stat.label}
                    className="bg-gradient-to-br from-[#23272f] to-[#181a20] rounded-2xl shadow-lg p-7 flex items-center gap-5 border border-[#23272f]/60 hover:shadow-2xl transition-shadow duration-200 min-h-[120px]"
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-white/5`}>
                      <stat.icon className={`w-6 h-6 ${stat.color} opacity-80`} />
                    </div>
                    <div>
                      <p className={`text-3xl font-light mb-1 ${stat.label === 'Solicitudes pendientes' && pendingRequests.length > 0 ? 'text-red-400' : 'text-white'}`}>{stat.value}</p>
                      <p className="text-sm text-[#bfc9d4] tracking-wide font-medium">{stat.label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Two-panel layout: pending requests and upcoming dates */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Pending requests */}
                <Card variant="gradient">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="w-5 h-5 text-primary" />
                      Solicitudes Pendientes
                    </CardTitle>
                    <Button variant="ghost" size="sm" asChild>
                      <Link to={artist ? `/artist/${artist.id}/discover` : '/login'}>
                        Ir a inicio
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </Link>
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {pendingRequests.length > 0 || pendingManagerRequests.length > 0 ? (
                      <>
                        {pendingManagerRequests.slice(0, 1).map((managerRequest) => (
                          <Card key={`manager-${managerRequest.id}`} variant="gradient" className="hover:shadow-md transition-all duration-300 border-l-4 border-l-blue-500">
                            <CardHeader className="pb-2 px-4 pt-4">
                              <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3 flex-1">
                                  <Avatar className="h-10 w-10">
                                    <AvatarImage src={managerRequest.sender?.avatar} />
                                    <AvatarFallback>{managerRequest.sender?.name?.[0]}</AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <CardTitle className="text-base font-semibold">{managerRequest.sender?.name}</CardTitle>
                                    <Badge variant="artist" className="mt-1">Solicitud de Manager</Badge>
                                  </div>
                                </div>
                              </div>
                            </CardHeader>
                            <CardContent className="px-4 pb-4">
                              {managerRequest.message && (
                                <p className="text-sm text-muted-foreground mb-4">{managerRequest.message}</p>
                              )}
                              <div className="flex gap-2">
                                <Button size="sm" variant="default" onClick={() => handleAcceptManager(managerRequest.id)} disabled={updateManagerStatusMutation.isPending} className="flex-1">
                                  <Check className="w-4 h-4 mr-1" />Aceptar
                                </Button>
                                <Button size="sm" variant="outline" onClick={() => handleRejectManager(managerRequest.id)} disabled={updateManagerStatusMutation.isPending} className="flex-1">
                                  <X className="w-4 h-4 mr-1" />Rechazar
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                        {pendingRequests.slice(0, 2).map((request) => (
                          <RequestCard
                            key={request.id}
                            request={request}
                            artist={artist ?? undefined}
                            isReceiver
                            onAccept={() => handleAccept(String(request.id))}
                            onReject={() => handleReject(String(request.id))}
                          />
                        ))}
                      </>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <MessageSquare className="w-10 h-10 mx-auto mb-3 opacity-50" />
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
                      <Link to={artist ? `/artist/calendar/${artist.id}` : '/artist/calendar'}>
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
                          <div key={request.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
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
                        <Calendar className="w-10 h-10 mx-auto mb-3 opacity-50" />
                        <p>No tienes fechas próximas este mes</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
            </div>
          </div>
          </DashboardLayout>
          </HeaderLayout>
  );
}