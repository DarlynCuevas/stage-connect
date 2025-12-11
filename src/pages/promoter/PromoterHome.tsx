import { Link } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArtistCard } from '@/components/artists/ArtistCard';
import { mockArtists, mockPromoters } from '@/data/mockData';
import {
  Search,
  MessageSquare,
  Calendar,
  TrendingUp,
  ArrowRight,
  Megaphone,
  Plus,
} from 'lucide-react';

export default function PromoterHome() {
  const promoter = mockPromoters[0];
  const featuredArtists = mockArtists.slice(0, 3);

  const stats = [
    {
      label: 'Eventos organizados',
      value: promoter.eventsOrganized,
      icon: Calendar,
      color: 'text-role-promoter',
      bgColor: 'bg-role-promoter/10',
    },
    {
      label: 'Solicitudes activas',
      value: 0,
      icon: MessageSquare,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      label: 'Próximos eventos',
      value: 3,
      icon: Megaphone,
      color: 'text-accent',
      bgColor: 'bg-accent/10',
    },
    {
      label: 'Artistas contratados',
      value: 12,
      icon: TrendingUp,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10',
    },
  ];

  const upcomingEvents = [
    { id: 1, name: 'Festival de Primavera', date: '2025-03-20', artists: 5, status: 'planificando' },
    { id: 2, name: 'Noche Electrónica', date: '2025-02-14', artists: 2, status: 'confirmado' },
    { id: 3, name: 'Concierto Acústico', date: '2025-02-28', artists: 1, status: 'buscando' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold mb-2">
              Panel de Promotor
            </h1>
            <p className="text-muted-foreground">
              Bienvenido, {promoter.name} • {promoter.company}
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" asChild>
              <Link to="/promoter/events">
                <Calendar className="w-4 h-4 mr-2" />
                Mis Eventos
              </Link>
            </Button>
            <Button variant="hero" asChild size="lg">
              <Link to="/promoter/search">
                <Search className="w-5 h-5 mr-2" />
                Buscar Artistas
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Upcoming events */}
          <Card variant="gradient" className="lg:col-span-1">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-role-promoter" />
                Próximos Eventos
              </CardTitle>
              <Button variant="ghost" size="icon">
                <Plus className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  className="p-3 rounded-lg bg-secondary/30 border border-border/50"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{event.name}</h4>
                    <Badge
                      variant={
                        event.status === 'confirmado'
                          ? 'success'
                          : event.status === 'planificando'
                          ? 'warning'
                          : 'secondary'
                      }
                    >
                      {event.status}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{event.date}</span>
                    <span>{event.artists} artista{event.artists !== 1 ? 's' : ''}</span>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Crear Evento
              </Button>
            </CardContent>
          </Card>

          {/* Featured artists */}
          <Card variant="gradient" className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Artistas Recomendados
              </CardTitle>
              <Button variant="ghost" size="sm" asChild>
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
        <Card variant="gradient">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-role-promoter" />
              Solicitudes Recientes
            </CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/promoter/requests">
                Ver todas
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No tienes solicitudes recientes</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
