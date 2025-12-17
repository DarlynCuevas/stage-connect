import { Link } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArtistCard } from '@/components/artists/ArtistCard';
import { useArtists } from '@/lib/users';
import { useSentRequests } from '@/lib/requests';
import { useAuth } from '@/contexts/AuthContext';
import {
  Search,
  MessageSquare,
  Calendar,
  TrendingUp,
  ArrowRight,
  Megaphone,
} from 'lucide-react';
import { HeaderLayout } from '@/components/layout/HeaderLayout';

export default function PromoterHome() {
  const { user } = useAuth();
  const { data: featuredArtists = [] } = useArtists();
  const { data: sentRequests = [] } = useSentRequests();
  const promoter = user ?? { name: 'Promotor', company: '' };

  const stats = [
    {
      label: 'Solicitudes activas',
      value: sentRequests.length,
      icon: MessageSquare,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      label: 'Próximos eventos',
      value: 0,
      icon: Megaphone,
      color: 'text-accent',
      bgColor: 'bg-accent/10',
    },
    {
      label: 'Eventos organizados',
      value: 0,
      icon: Calendar,
      color: 'text-role-promoter',
      bgColor: 'bg-role-promoter/10',
    },
    {
      label: 'Artistas contratados',
      value: 0,
      icon: TrendingUp,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10',
    },
  ];

  return (
    <HeaderLayout>
      <div className="space-y-8">
        {/* Welcome header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold mb-2">
              Panel de Promotor
            </h1>
            <p className="text-muted-foreground">
              Bienvenido, {promoter.name}
            </p>
          </div>
          <Button variant="hero" asChild size="lg">
            <Link to="/promoter/search">
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

        <div className="grid grid-cols-1 gap-6">
          {/* Featured artists */}
          <Card variant="gradient">
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {(featuredArtists || []).slice(0, 3).map((artist: any) => (
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
    </HeaderLayout>
  );
}
