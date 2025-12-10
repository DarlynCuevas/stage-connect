import { Link } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RequestCard } from '@/components/booking/RequestCard';
import { mockBookingRequests, mockArtists, mockCalendarDates } from '@/data/mockData';
import {
  Calendar,
  MessageSquare,
  DollarSign,
  TrendingUp,
  ArrowRight,
  User,
  Music,
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function ArtistHome() {
  const artist = mockArtists[0]; // Current logged in artist
  const pendingRequests = mockBookingRequests.filter(r => r.status === 'pending');
  const upcomingDates = mockCalendarDates.filter(d => !d.available && d.note);

  const stats = [
    {
      label: 'Solicitudes pendientes',
      value: pendingRequests.length,
      icon: MessageSquare,
      color: 'text-role-artist',
      bgColor: 'bg-role-artist/10',
    },
    {
      label: 'Próximas actuaciones',
      value: upcomingDates.length,
      icon: Calendar,
      color: 'text-accent',
      bgColor: 'bg-accent/10',
    },
    {
      label: 'Caché base',
      value: `€${artist.basePrice.toLocaleString()}`,
      icon: DollarSign,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10',
    },
    {
      label: 'Shows totales',
      value: artist.totalShows,
      icon: TrendingUp,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold mb-2">
              ¡Hola, {artist.stageName}!
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
                    <p className="text-2xl font-display font-bold">{stat.value}</p>
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
                    artist={artist}
                    isReceiver
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

          {/* Upcoming dates */}
          <Card variant="gradient">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-accent" />
                Próximas Fechas
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
                  {upcomingDates.map((date, index) => (
                    <div
                      key={date.date}
                      className="flex items-center justify-between p-3 rounded-lg bg-secondary/50"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Music className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{date.note}</p>
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(date.date), "d 'de' MMMM", { locale: es })}
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
                  <p>No tienes fechas próximas</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
