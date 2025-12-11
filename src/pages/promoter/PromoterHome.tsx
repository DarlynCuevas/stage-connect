import { Link } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArtistCard } from '@/components/artists/ArtistCard';
import { mockArtists, mockBookingRequests, mockPromoters } from '@/data/mockData';
import {
  Search,
  MessageSquare,
  Calendar,
  TrendingUp,
  ArrowRight,
  Megaphone,
  Plus,
  Sparkles,
  Users,
} from 'lucide-react';

export default function PromoterHome() {
  const promoter = mockPromoters[0];
  const sentRequests = mockBookingRequests.slice(0, 2);
  const featuredArtists = mockArtists.slice(0, 3);

  const stats = [
    {
      label: 'Eventos organizados',
      value: promoter.eventsOrganized,
      icon: Calendar,
      color: 'text-role-promoter',
      bgColor: 'bg-role-promoter/10',
      borderColor: 'border-role-promoter/20',
    },
    {
      label: 'Solicitudes activas',
      value: sentRequests.length,
      icon: MessageSquare,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      borderColor: 'border-primary/20',
    },
    {
      label: 'Próximos eventos',
      value: 3,
      icon: Megaphone,
      color: 'text-accent',
      bgColor: 'bg-accent/10',
      borderColor: 'border-accent/20',
    },
    {
      label: 'Artistas contratados',
      value: 12,
      icon: Users,
      color: 'text-success',
      bgColor: 'bg-success/10',
      borderColor: 'border-success/20',
    },
  ];

  const upcomingEvents = [
    { id: 1, name: 'Festival de Primavera', date: '2025-03-20', artists: 5, status: 'planificando' },
    { id: 2, name: 'Noche Electrónica', date: '2025-02-14', artists: 2, status: 'confirmado' },
    { id: 3, name: 'Concierto Acústico', date: '2025-02-28', artists: 1, status: 'buscando' },
  ];

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'confirmado': return 'success';
      case 'planificando': return 'warning';
      default: return 'secondary';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome header with gradient background */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-role-promoter/10 via-card to-primary/5 border border-border/50 p-6 lg:p-8">
          <div className="absolute top-0 right-0 w-64 h-64 bg-role-promoter/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
          
          <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-2xl bg-gradient-to-br from-role-promoter to-role-promoter/70 flex items-center justify-center shadow-lg">
                  <Megaphone className="w-8 h-8 lg:w-10 lg:h-10 text-foreground" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-success rounded-full border-2 border-background flex items-center justify-center">
                  <Sparkles className="w-3 h-3 text-success-foreground" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-display font-bold mb-1">
                  Panel de Promotor
                </h1>
                <p className="text-muted-foreground">
                  Bienvenido, {promoter.name} • {promoter.company}
                </p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button variant="outline" asChild className="bg-background/50 backdrop-blur-sm">
                <Link to="/promoter/events">
                  <Calendar className="w-4 h-4 mr-2" />
                  Mis Eventos
                </Link>
              </Button>
              <Button variant="hero" asChild size="lg" className="shadow-lg shadow-primary/25">
                <Link to="/promoter/search">
                  <Search className="w-5 h-5 mr-2" />
                  Buscar Artistas
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <Card 
              key={stat.label} 
              className={`group relative overflow-hidden border-2 ${stat.borderColor} bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5`}
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Upcoming events */}
          <Card className="lg:col-span-1 border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="flex items-center gap-2.5 text-lg">
                <div className="w-8 h-8 rounded-lg bg-role-promoter/10 flex items-center justify-center">
                  <Megaphone className="w-4 h-4 text-role-promoter" />
                </div>
                Próximos Eventos
              </CardTitle>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                <Plus className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  className="group p-4 rounded-xl bg-secondary/20 border border-border/40 hover:border-role-promoter/30 hover:bg-secondary/40 transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold truncate pr-2">{event.name}</h4>
                    <Badge variant={getStatusVariant(event.status)} className="shrink-0 capitalize">
                      {event.status}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{event.date}</span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" />
                      {event.artists} artista{event.artists !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full mt-2 border-dashed">
                <Plus className="w-4 h-4 mr-2" />
                Crear Evento
              </Button>
            </CardContent>
          </Card>

          {/* Featured artists */}
          <Card className="lg:col-span-2 border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="flex items-center gap-2.5 text-lg">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-primary" />
                </div>
                Artistas Recomendados
              </CardTitle>
              <Button variant="ghost" size="sm" asChild className="text-muted-foreground hover:text-foreground">
                <Link to="/promoter/search">
                  Ver todos
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {featuredArtists.slice(0, 2).map((artist) => (
                  <ArtistCard key={artist.id} artist={artist} showPrice />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent requests */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="flex items-center gap-2.5 text-lg">
              <div className="w-8 h-8 rounded-lg bg-role-promoter/10 flex items-center justify-center">
                <MessageSquare className="w-4 h-4 text-role-promoter" />
              </div>
              Solicitudes Recientes
            </CardTitle>
            <Button variant="ghost" size="sm" asChild className="text-muted-foreground hover:text-foreground">
              <Link to="/promoter/requests">
                Ver todas
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {sentRequests.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {sentRequests.map((request) => {
                  const artist = mockArtists.find(a => a.id === request.artistId);
                  return (
                    <div
                      key={request.id}
                      className="group flex items-center justify-between p-4 rounded-xl bg-secondary/20 border border-border/40 hover:border-primary/30 hover:bg-secondary/40 transition-all duration-300"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={artist?.avatar}
                          alt={artist?.stageName}
                          className="w-12 h-12 rounded-xl object-cover border border-border/50 group-hover:border-primary/30 transition-colors"
                        />
                        <div>
                          <p className="font-semibold">{artist?.stageName}</p>
                          <p className="text-sm text-muted-foreground">
                            {request.eventType}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-primary text-lg">
                          €{request.offeredPrice.toLocaleString()}
                        </p>
                        <Badge
                          variant={
                            request.status === 'pending'
                              ? 'warning'
                              : request.status === 'negotiating'
                              ? 'artist'
                              : 'success'
                          }
                        >
                          {request.status === 'pending'
                            ? 'Pendiente'
                            : request.status === 'negotiating'
                            ? 'Negociando'
                            : 'Confirmado'}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-10 text-muted-foreground">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-muted/50 flex items-center justify-center">
                  <MessageSquare className="w-8 h-8 opacity-40" />
                </div>
                <p className="font-medium">No tienes solicitudes recientes</p>
                <p className="text-sm mt-1 opacity-70">Tus solicitudes aparecerán aquí</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
