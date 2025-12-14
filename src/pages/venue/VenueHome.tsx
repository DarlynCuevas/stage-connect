import { Link } from 'react-router-dom';
import { HeaderLayout } from '@/components/layout/HeaderLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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

export default function VenueHome() {
  const { user } = useAuth();
  const { data: featuredArtists = [], isLoading } = useArtists();
  const { data: sentRequests = [] } = useSentRequests();
  // Simulación de datos adicionales
  const [receivedRequests, setReceivedRequests] = useState(3); // solicitudes recibidas
  const [favoriteArtists, setFavoriteArtists] = useState(2); // artistas favoritos
  const [scheduledEvents, setScheduledEvents] = useState(1); // eventos programados
  const [hiresThisMonth, setHiresThisMonth] = useState(1); // contrataciones este mes
  const [venueRating, setVenueRating] = useState(4.7); // valoración
  const [estimatedIncome, setEstimatedIncome] = useState(1200); // ingresos estimados
  const [mostHiredArtist, setMostHiredArtist] = useState({ name: 'Artista Top', avatar: '', times: 5 });
  const [nextEvent, setNextEvent] = useState({ date: '2025-12-20', artist: 'Artista Invitado', hour: '21:00' });

  // Asegurar que las propiedades existen y tienen valores por defecto
  // (esto previene errores si los datos reales llegan undefined)
  const safeMostHiredArtist = mostHiredArtist || { name: 'Artista Top', avatar: '', times: 0 };
  const safeNextEvent = nextEvent || { date: '', artist: '', hour: '' };
  const [notifications, setNotifications] = useState(2);
  const [avgAttendance, setAvgAttendance] = useState(80);

  // Menú personalizado para Local
  const localNav = [
    { to: user ? `/venue/${user.id}/discover` : '/login', label: 'Inicio' },
    { to: '/venue/dashboard', label: 'Panel de datos' },
    { to: user ? `/venue/profile/${user.id}` : '/login', label: 'Mi perfil' },
    { to: user ? `/venue/calendar/${user.id}` : '/venue/calendar', label: 'Calendario' },
    { to: '/venue/requests', label: 'Solicitudes' },
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
    <HeaderLayout profileTabs={localNav}>
      <div className="space-y-8">
        {/* Welcome header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold mb-2">
              Panel de Local
            </h1>
            <p className="text-muted-foreground">
              Bienvenido, {user?.name || 'Local'}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card key={stat.label} variant="gradient">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                    {stat.icon && <stat.icon className={`w-5 h-5 ${stat.color}`} />}
                  </div>
                  <div>
                    <p className="text-2xl font-display font-bold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Artista más contratado */}
        <Card>
          <CardHeader>
            <CardTitle>Artista más contratado</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                {/* Aquí podrías poner el avatar real */}
                <span className="text-lg font-bold">{safeMostHiredArtist.name ? safeMostHiredArtist.name[0] : '?'}</span>
              </div>
              <div>
                <p className="font-semibold">{safeMostHiredArtist.name}</p>
                <p className="text-xs text-muted-foreground">{safeMostHiredArtist.times} contrataciones</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Próximo evento */}
        <Card>
          <CardHeader>
            <CardTitle>Próximo evento</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <p className="font-semibold">{safeNextEvent.artist}</p>
              <p className="text-xs text-muted-foreground">{safeNextEvent.date} a las {safeNextEvent.hour}</p>
            </div>
          </CardContent>
        </Card>

        {/* Notificaciones */}
        <Card>
          <CardHeader>
            <CardTitle>Notificaciones</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-semibold">Tienes {notifications} notificaciones pendientes</p>
          </CardContent>
        </Card>

      </div>
    </HeaderLayout>
  );
}
