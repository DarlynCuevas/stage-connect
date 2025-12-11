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
  Sparkles,
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function ArtistHome() {
  const artist = mockArtists[0];
  const pendingRequests = mockBookingRequests.filter(r => r.status === 'pending');
  const upcomingDates = mockCalendarDates.filter(d => !d.available && d.note);

  const stats = [
    {
      label: 'Solicitudes pendientes',
      value: pendingRequests.length,
      icon: MessageSquare,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      borderColor: 'border-primary/20',
    },
    {
      label: 'Próximas actuaciones',
      value: upcomingDates.length,
      icon: Calendar,
      color: 'text-accent',
      bgColor: 'bg-accent/10',
      borderColor: 'border-accent/20',
    },
    {
      label: 'Caché base',
      value: `€${artist.basePrice.toLocaleString()}`,
      icon: DollarSign,
      color: 'text-success',
      bgColor: 'bg-success/10',
      borderColor: 'border-success/20',
    },
    {
      label: 'Shows totales',
      value: artist.totalShows,
      icon: TrendingUp,
      color: 'text-role-manager',
      bgColor: 'bg-role-manager/10',
      borderColor: 'border-role-manager/20',
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome header with gradient background */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-card to-accent/5 border border-border/50 p-6 lg:p-8">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
          
          <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <img 
                  src={artist.avatar} 
                  alt={artist.stageName}
                  className="w-16 h-16 lg:w-20 lg:h-20 rounded-2xl object-cover border-2 border-primary/30 shadow-lg"
                />
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-success rounded-full border-2 border-background flex items-center justify-center">
                  <Sparkles className="w-3 h-3 text-success-foreground" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-display font-bold mb-1">
                  ¡Hola, {artist.stageName}!
                </h1>
                <p className="text-muted-foreground">
                  Aquí está el resumen de tu actividad
                </p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button variant="outline" asChild className="bg-background/50 backdrop-blur-sm">
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
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <Card 
              key={stat.label} 
              className={`group relative overflow-hidden border-2 ${stat.borderColor} bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`absolute inset-0 ${stat.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
              <CardContent className="relative p-4 lg:p-5">
                <div className="flex items-start gap-3">
                  <div className={`w-11 h-11 rounded-xl ${stat.bgColor} flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110`}>
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-2xl lg:text-3xl font-display font-bold tracking-tight">{stat.value}</p>
                    <p className="text-xs lg:text-sm text-muted-foreground truncate">{stat.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pending requests */}
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="flex items-center gap-2.5 text-lg">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <MessageSquare className="w-4 h-4 text-primary" />
                </div>
                Solicitudes Pendientes
              </CardTitle>
              <Button variant="ghost" size="sm" asChild className="text-muted-foreground hover:text-foreground">
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
                <div className="text-center py-10 text-muted-foreground">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-muted/50 flex items-center justify-center">
                    <MessageSquare className="w-8 h-8 opacity-40" />
                  </div>
                  <p className="font-medium">No tienes solicitudes pendientes</p>
                  <p className="text-sm mt-1 opacity-70">Las nuevas solicitudes aparecerán aquí</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Upcoming dates */}
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="flex items-center gap-2.5 text-lg">
                <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-accent" />
                </div>
                Próximas Fechas
              </CardTitle>
              <Button variant="ghost" size="sm" asChild className="text-muted-foreground hover:text-foreground">
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
                      className="group flex items-center justify-between p-4 rounded-xl bg-secondary/30 border border-border/30 hover:border-primary/30 hover:bg-secondary/50 transition-all duration-300"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                          <Music className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold">{date.note}</p>
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(date.date), "EEEE, d 'de' MMMM", { locale: es })}
                          </p>
                        </div>
                      </div>
                      <Badge variant="success" className="shrink-0">Confirmado</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 text-muted-foreground">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-muted/50 flex items-center justify-center">
                    <Calendar className="w-8 h-8 opacity-40" />
                  </div>
                  <p className="font-medium">No tienes fechas próximas</p>
                  <p className="text-sm mt-1 opacity-70">Tus próximos eventos aparecerán aquí</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
