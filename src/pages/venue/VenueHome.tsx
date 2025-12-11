import { Link } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArtistCard } from '@/components/artists/ArtistCard';
import { RequestCard } from '@/components/booking/RequestCard';
import { useArtists } from '@/lib/users';
import { useSentRequests } from '@/lib/requests';
import {
  Search,
  MessageSquare,
  Heart,
  Calendar,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

export default function VenueHome() {
  const { data: featuredArtists = [], isLoading } = useArtists();
  const { data: sentRequests = [] } = useSentRequests();
  const topArtists = (featuredArtists || []).slice(0, 3);

  const stats = [
    {
      label: 'Solicitudes enviadas',
      value: sentRequests.length,
      icon: MessageSquare,
      color: 'text-role-venue',
      bgColor: 'bg-role-venue/10',
    },
    {
      label: 'Artistas favoritos',
      value: 5,
      icon: Heart,
      color: 'text-destructive',
      bgColor: 'bg-destructive/10',
    },
    {
      label: 'Eventos programados',
      value: 3,
      icon: Calendar,
      color: 'text-accent',
      bgColor: 'bg-accent/10',
    },
    {
      label: 'Contrataciones este mes',
      value: 2,
      icon: TrendingUp,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10',
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold mb-2">
              ¡Bienvenido, Club Nocturno!
            </h1>
            <p className="text-muted-foreground">
              Encuentra el artista perfecto para tu próximo evento
            </p>
          </div>
          <Button variant="hero" asChild size="lg">
            <Link to="/venue/search">
              <Search className="w-5 h-5 mr-2" />
              Buscar Artistas
            </Link>
          </Button>
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

        {/* Featured artists */}
        <Card variant="gradient">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Artistas Destacados
            </CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/venue/search">
                Ver todos
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {topArtists.map((artist) => (
                <ArtistCard key={artist.id} artist={artist} showPrice />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
