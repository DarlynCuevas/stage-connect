import { HeaderLayout } from '@/components/layout/HeaderLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArtistCard } from '@/components/artists/ArtistCard';
import { useArtists } from '@/lib/users';
import { useSentRequests } from '@/lib/requests';
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  Search,
  MessageSquare,
  Heart,
  Calendar,
  ArrowRight,
  TrendingUp,
  Star,
} from 'lucide-react';

import { useParams } from 'react-router-dom';
export default function VenueHome() {
  const { user } = useAuth();
  const { id } = useParams();
  if (id && user && String(user.id) !== String(id)) {
    return <div className="flex items-center justify-center min-h-[60vh]"><p className="text-destructive text-lg font-semibold">Acceso denegado</p></div>;
  }
  const { data: featuredArtists = [], isLoading } = useArtists();
  const { data: sentRequests = [] } = useSentRequests();
  // Simulación de datos adicionales
  const [receivedRequests, setReceivedRequests] = useState(); // solicitudes recibidas
  const [favoriteArtists, setFavoriteArtists] = useState(); // artistas favoritos
  const [scheduledEvents, setScheduledEvents] = useState(); // eventos programados
  const [hiresThisMonth, setHiresThisMonth] = useState(); // contrataciones este mes
  const [venueRating, setVenueRating] = useState(); // valoración
  const [estimatedIncome, setEstimatedIncome] = useState(); // ingresos estimados
  const [mostHiredArtist, setMostHiredArtist] = useState({ name: 'Artista Top', avatar: '', times: 0 });
  const [nextEvent, setNextEvent] = useState({ date: '', artist: 'Artista Invitado', hour: '' });

  // Asegurar que las propiedades existen y tienen valores por defecto
  // (esto previene errores si los datos reales llegan undefined)
  const safeMostHiredArtist = mostHiredArtist || { name: 'Artista Top', avatar: '', times: 0 };
  const safeNextEvent = nextEvent || { date: '', artist: '', hour: '' };
  const [notifications, setNotifications] = useState(2);
  const [avgAttendance, setAvgAttendance] = useState(80);

  // Menú personalizado para Local
  const localNav = [
     { to: `/venue/${id}/discover`, label: 'Inicio' },
    { to: `/venue/${id}/dashboard`, label: 'Panel de datos' },
    { to: `/venue/${id}/profile`, label: 'Mi perfil' },
    { to: `/venue/${id}/calendar`, label: 'Calendario' },
    { to: `/venue/${id}/requests`, label: 'Solicitudes' },
  ];

  const stats = [
    {
      label: 'Solicitudes recibidas',
      value: receivedRequests,
      icon: MessageSquare,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      label: 'Solicitudes enviadas',
      value: sentRequests.length,
      icon: ArrowRight,
      color: 'text-blue-500',
      bgColor: 'bg-blue-100',
    },
    {
      label: 'Artistas favoritos',
      value: favoriteArtists,
      icon: Heart,
      color: 'text-destructive',
      bgColor: 'bg-destructive/10',
    },
    {
      label: 'Eventos programados',
      value: scheduledEvents,
      icon: Calendar,
      color: 'text-accent',
      bgColor: 'bg-accent/10',
    },
    {
      label: 'Contrataciones este mes',
      value: hiresThisMonth,
      icon: TrendingUp,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10',
    },
    {
      label: 'Valoración',
      value: venueRating,
      icon: Star,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-100',
    },
    {
      label: 'Ingresos estimados',
      value: `$${estimatedIncome}`,
      icon: TrendingUp,
      color: 'text-green-500',
      bgColor: 'bg-green-100',
    },
    {
      label: 'Asistencia promedio',
      value: avgAttendance,
      icon: Calendar,
      color: 'text-indigo-500',
      bgColor: 'bg-indigo-100',
    },
  ];
  return (
    <HeaderLayout>
      <div className="space-y-10 max-w-5xl mx-auto w-full">
        {/* Welcome header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2 lg:gap-8 pb-2 border-b border-border/20">
          <div>
            <h1 className="text-4xl font-display font-semibold mb-1 tracking-tight text-gray-900 dark:text-white">
              Panel de Local
            </h1>
            <p className="text-muted-foreground text-base font-light">
              Bienvenido, {user?.name || 'Local'}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <Card key={stat.label} className="shadow-none border border-border/30 bg-background/80">
              <CardContent className="p-6 flex flex-col items-start gap-2">
                <div className="flex items-center gap-4 mb-2">
                  <div className={`w-12 h-12 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                    {stat.icon && <stat.icon className={`w-6 h-6 ${stat.color}`} />}
                  </div>
                  <div>
                    <p className="text-3xl font-display font-bold leading-tight">{stat.value}</p>
                    <p className="text-xs text-muted-foreground font-medium mt-1">{stat.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-2">
          {/* Artista más contratado */}
          <Card className="border border-border/30 bg-background/80">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">Artista más contratado</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center gap-4 pt-0">
              <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 text-xl font-bold">
                {/* Aquí podrías poner el avatar real */}
                <span>{safeMostHiredArtist.name ? safeMostHiredArtist.name[0] : '?'}</span>
              </div>
              <div>
                <p className="font-semibold text-base">{safeMostHiredArtist.name}</p>
                <p className="text-xs text-muted-foreground">{safeMostHiredArtist.times} contrataciones</p>
              </div>
            </CardContent>
          </Card>

          {/* Próximo evento */}
          <Card className="border border-border/30 bg-background/80">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">Próximo evento</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div>
                <p className="font-semibold text-base">{safeNextEvent.artist}</p>
                <p className="text-xs text-muted-foreground">{safeNextEvent.date} a las {safeNextEvent.hour}</p>
              </div>
            </CardContent>
          </Card>

          {/* Notificaciones */}
          <Card className="border border-border/30 bg-background/80">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">Notificaciones</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="font-semibold text-base">Tienes {notifications} notificaciones pendientes</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </HeaderLayout>
  );
}
