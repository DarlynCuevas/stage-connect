import { Link } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArtistCard } from '@/components/artists/ArtistCard';
import { RequestCard } from '@/components/booking/RequestCard';
import { mockArtists, mockBookingRequests } from '@/data/mockData';
import {
  Search,
  MessageSquare,
  Heart,
  Calendar,
  ArrowRight,
  TrendingUp,
  MapPin,
  Sparkles,
} from 'lucide-react';

export default function VenueHome() {
  const sentRequests = mockBookingRequests.slice(0, 2);
  const featuredArtists = mockArtists.slice(0, 3);

  const stats = [
    {
      label: 'Solicitudes enviadas',
      value: sentRequests.length,
      icon: MessageSquare,
      color: 'text-role-venue',
      bgColor: 'bg-role-venue/10',
      borderColor: 'border-role-venue/20',
    },
    {
      label: 'Artistas favoritos',
      value: 5,
      icon: Heart,
      color: 'text-destructive',
      bgColor: 'bg-destructive/10',
      borderColor: 'border-destructive/20',
    },
    {
      label: 'Eventos programados',
      value: 3,
      icon: Calendar,
      color: 'text-accent',
      bgColor: 'bg-accent/10',
      borderColor: 'border-accent/20',
    },
    {
      label: 'Contrataciones este mes',
      value: 2,
      icon: TrendingUp,
      color: 'text-success',
      bgColor: 'bg-success/10',
      borderColor: 'border-success/20',
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome header with gradient background */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-role-venue/10 via-card to-primary/5 border border-border/50 p-6 lg:p-8">
          <div className="absolute top-0 right-0 w-64 h-64 bg-role-venue/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
          
          <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-2xl bg-gradient-to-br from-role-venue to-role-venue/70 flex items-center justify-center shadow-lg">
                  <MapPin className="w-8 h-8 lg:w-10 lg:h-10 text-foreground" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-success rounded-full border-2 border-background flex items-center justify-center">
                  <Sparkles className="w-3 h-3 text-success-foreground" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-display font-bold mb-1">
                  ¡Bienvenido, Club Nocturno!
                </h1>
                <p className="text-muted-foreground">
                  Encuentra el artista perfecto para tu próximo evento
                </p>
              </div>
            </div>
            
            <Button variant="hero" asChild size="lg" className="shadow-lg shadow-primary/25">
              <Link to="/venue/search">
                <Search className="w-5 h-5 mr-2" />
                Buscar Artistas
              </Link>
            </Button>
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

        {/* Featured artists */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="flex items-center gap-2.5 text-lg">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-primary" />
              </div>
              Artistas Destacados
            </CardTitle>
            <Button variant="ghost" size="sm" asChild className="text-muted-foreground hover:text-foreground">
              <Link to="/venue/search">
                Ver todos
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {featuredArtists.map((artist) => (
                <ArtistCard key={artist.id} artist={artist} showPrice />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent requests */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="flex items-center gap-2.5 text-lg">
              <div className="w-8 h-8 rounded-lg bg-role-venue/10 flex items-center justify-center">
                <MessageSquare className="w-4 h-4 text-role-venue" />
              </div>
              Mis Solicitudes Recientes
            </CardTitle>
            <Button variant="ghost" size="sm" asChild className="text-muted-foreground hover:text-foreground">
              <Link to="/venue/requests">
                Ver todas
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {sentRequests.map((request) => {
                const artist = mockArtists.find(a => a.id === request.artistId);
                return (
                  <RequestCard
                    key={request.id}
                    request={request}
                    artist={artist}
                  />
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
