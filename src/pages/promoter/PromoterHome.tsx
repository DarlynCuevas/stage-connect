import { Link } from 'react-router-dom';
import { TopNavbar } from '@/components/layout/TopNavbar';
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
  Plus,
  Users,
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
      value: 2,
      icon: MessageSquare,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      label: 'Próximos eventos',
      value: 3,
      icon: TrendingUp,
      color: 'text-accent',
      bgColor: 'bg-accent/10',
    },
    {
      label: 'Artistas contratados',
      value: 12,
      icon: Users,
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
  ];

  const upcomingEvents = [
    { id: 1, name: 'Festival de Primavera', date: '20 Mar 2025', artists: 5, status: 'planificando' },
    { id: 2, name: 'Noche Electrónica', date: '14 Feb 2025', artists: 2, status: 'confirmado' },
    { id: 3, name: 'Concierto Acústico', date: '28 Feb 2025', artists: 1, status: 'buscando' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <TopNavbar />
      
      <main className="container-tight py-6 md:py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-2">
            Panel de Promotor
          </h1>
          <p className="text-muted-foreground">
            Bienvenido, {promoter.name} · {promoter.company}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          {stats.map((stat) => (
            <Card key={stat.label} variant="outline" className="hover:shadow-sm transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg ${stat.bgColor} flex items-center justify-center shrink-0`}>
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Upcoming events */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">Próximos Eventos</h2>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="space-y-3">
              {upcomingEvents.map((event) => (
                <Card key={event.id} variant="outline" className="hover:shadow-sm transition-all">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-foreground truncate pr-2">{event.name}</h4>
                      <Badge 
                        variant={event.status === 'confirmado' ? 'success' : 'muted'}
                        className="shrink-0 capitalize"
                      >
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
                  </CardContent>
                </Card>
              ))}
              <Button variant="outline" className="w-full border-dashed">
                <Plus className="w-4 h-4 mr-2" />
                Crear Evento
              </Button>
            </div>
          </div>

          {/* Featured artists */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">Artistas Recomendados</h2>
              <Button variant="ghost" size="sm" asChild className="text-muted-foreground">
                <Link to="/promoter/search">
                  Ver todos
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {featuredArtists.map((artist) => (
                <ArtistCard key={artist.id} artist={artist} showPrice />
              ))}
            </div>
          </div>
        </div>

        {/* Search CTA */}
        <Card variant="outline" className="bg-secondary/30">
          <CardContent className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="font-semibold text-foreground mb-1">¿Buscas talento para tu evento?</h3>
              <p className="text-sm text-muted-foreground">Explora nuestra base de artistas con filtros avanzados</p>
            </div>
            <Button asChild size="lg">
              <Link to="/promoter/search">
                <Search className="w-4 h-4 mr-2" />
                Buscar Artistas
              </Link>
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
