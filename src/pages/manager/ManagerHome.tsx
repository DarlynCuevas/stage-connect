import { Link } from 'react-router-dom';
import { TopNavbar } from '@/components/layout/TopNavbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { mockArtists, mockManagers, mockBookingRequests } from '@/data/mockData';
import {
  Users,
  MessageSquare,
  Calendar,
  TrendingUp,
  ArrowRight,
  Star,
  MapPin,
} from 'lucide-react';

export default function ManagerHome() {
  const manager = mockManagers[0];
  const managedArtists = mockArtists.filter(a => manager.artists.includes(a.id));
  const allRequests = mockBookingRequests.filter(r =>
    managedArtists.some(a => a.id === r.artistId)
  );
  const pendingRequests = allRequests.filter(r => r.status === 'pending');

  const stats = [
    {
      label: 'Artistas gestionados',
      value: managedArtists.length,
      icon: Users,
      color: 'text-role-manager',
      bgColor: 'bg-role-manager/10',
    },
    {
      label: 'Solicitudes pendientes',
      value: pendingRequests.length,
      icon: MessageSquare,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      label: 'Eventos este mes',
      value: 4,
      icon: Calendar,
      color: 'text-accent',
      bgColor: 'bg-accent/10',
    },
    {
      label: 'Ingresos',
      value: '€45K',
      icon: TrendingUp,
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <TopNavbar showSearch={false} />
      
      <main className="container-tight py-6 md:py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-2">
            Panel de Manager
          </h1>
          <p className="text-muted-foreground">
            Bienvenido, {manager.name} · {manager.company}
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

        {/* Managed artists */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">Mis Artistas</h2>
            <Button variant="ghost" size="sm" asChild className="text-muted-foreground">
              <Link to="/manager/artists">
                Ver todos
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {managedArtists.map((artist) => {
              const artistRequests = allRequests.filter(r => r.artistId === artist.id);
              const pendingCount = artistRequests.filter(r => r.status === 'pending').length;

              return (
                <Card key={artist.id} variant="outline" className="hover:shadow-sm transition-all">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-14 w-14 border border-border">
                        <AvatarImage src={artist.avatar} />
                        <AvatarFallback className="bg-secondary">{artist.stageName.charAt(0)}</AvatarFallback>
                      </Avatar>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-foreground truncate">{artist.stageName}</h3>
                          {artist.verified && (
                            <Badge variant="secondary" className="text-[10px] px-1.5">Verificado</Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5" />
                            {artist.city}
                          </span>
                          <span className="flex items-center gap-1">
                            <Star className="w-3.5 h-3.5 text-accent" />
                            {artist.rating}
                          </span>
                        </div>
                        <p className="text-sm text-primary font-medium mt-1">
                          €{artist.basePrice.toLocaleString()} base
                        </p>
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        {pendingCount > 0 && (
                          <Badge variant="muted">
                            {pendingCount} pendiente{pendingCount !== 1 ? 's' : ''}
                          </Badge>
                        )}
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/manager/artists/${artist.id}`}>
                            Gestionar
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Recent requests */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">Solicitudes Recientes</h2>
            <Button variant="ghost" size="sm" asChild className="text-muted-foreground">
              <Link to="/manager/requests">
                Ver todas
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
          </div>
          {pendingRequests.length > 0 ? (
            <div className="space-y-3">
              {pendingRequests.slice(0, 3).map((request) => {
                const artist = managedArtists.find(a => a.id === request.artistId);
                return (
                  <Card key={request.id} variant="outline" className="hover:shadow-sm transition-all">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10 border border-border">
                            <AvatarImage src={artist?.avatar} />
                            <AvatarFallback className="bg-secondary">{artist?.stageName.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-foreground">{artist?.stageName}</p>
                            <p className="text-sm text-muted-foreground">
                              {request.eventType} · {request.eventLocation}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-primary">
                            €{request.offeredPrice.toLocaleString()}
                          </p>
                          <Badge variant="muted">Pendiente</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card variant="outline">
              <CardContent className="p-8 text-center text-muted-foreground">
                <MessageSquare className="w-10 h-10 mx-auto mb-3 opacity-40" />
                <p className="font-medium">No hay solicitudes pendientes</p>
                <p className="text-sm">Las nuevas solicitudes aparecerán aquí</p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
