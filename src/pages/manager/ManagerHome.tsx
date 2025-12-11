import { Link } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
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
  Music,
  Star,
  MapPin,
  Sparkles,
  Briefcase,
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
      borderColor: 'border-role-manager/20',
    },
    {
      label: 'Solicitudes pendientes',
      value: pendingRequests.length,
      icon: MessageSquare,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      borderColor: 'border-primary/20',
    },
    {
      label: 'Eventos este mes',
      value: 4,
      icon: Calendar,
      color: 'text-accent',
      bgColor: 'bg-accent/10',
      borderColor: 'border-accent/20',
    },
    {
      label: 'Ingresos generados',
      value: '€45K',
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
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-role-manager/10 via-card to-primary/5 border border-border/50 p-6 lg:p-8">
          <div className="absolute top-0 right-0 w-64 h-64 bg-role-manager/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
          
          <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-2xl bg-gradient-to-br from-role-manager to-role-manager/70 flex items-center justify-center shadow-lg">
                  <Briefcase className="w-8 h-8 lg:w-10 lg:h-10 text-foreground" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-success rounded-full border-2 border-background flex items-center justify-center">
                  <Sparkles className="w-3 h-3 text-success-foreground" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-display font-bold mb-1">
                  Panel de Manager
                </h1>
                <p className="text-muted-foreground">
                  Bienvenido, {manager.name} • {manager.company}
                </p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button variant="outline" asChild className="bg-background/50 backdrop-blur-sm">
                <Link to="/manager/requests">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Solicitudes
                </Link>
              </Button>
              <Button variant="gradient" asChild>
                <Link to="/manager/artists">
                  <Users className="w-4 h-4 mr-2" />
                  Mis Artistas
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

        {/* Managed artists */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="flex items-center gap-2.5 text-lg">
              <div className="w-8 h-8 rounded-lg bg-role-manager/10 flex items-center justify-center">
                <Music className="w-4 h-4 text-role-manager" />
              </div>
              Artistas Gestionados
            </CardTitle>
            <Button variant="ghost" size="sm" asChild className="text-muted-foreground hover:text-foreground">
              <Link to="/manager/artists">
                Ver todos
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {managedArtists.map((artist) => {
                const artistRequests = allRequests.filter(r => r.artistId === artist.id);
                const pendingCount = artistRequests.filter(r => r.status === 'pending').length;

                return (
                  <div
                    key={artist.id}
                    className="group flex items-center gap-4 p-4 rounded-xl bg-secondary/20 border border-border/40 hover:border-role-manager/30 hover:bg-secondary/40 transition-all duration-300"
                  >
                    <Avatar className="h-14 w-14 lg:h-16 lg:w-16 border-2 border-border/50 group-hover:border-role-manager/30 transition-colors">
                      <AvatarImage src={artist.avatar} />
                      <AvatarFallback className="bg-muted text-lg font-semibold">{artist.stageName.charAt(0)}</AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <h3 className="font-display font-bold truncate">{artist.stageName}</h3>
                        {artist.verified && (
                          <Badge variant="default" className="text-[10px] px-1.5 py-0">Verificado</Badge>
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
                      <p className="text-sm text-primary font-semibold mt-1.5">
                        €{artist.basePrice.toLocaleString()} base
                      </p>
                    </div>

                    <div className="text-right shrink-0 flex flex-col items-end gap-2">
                      {pendingCount > 0 && (
                        <Badge variant="warning">
                          {pendingCount} pendiente{pendingCount !== 1 ? 's' : ''}
                        </Badge>
                      )}
                      <Button variant="outline" size="sm" asChild className="group-hover:border-role-manager/30 group-hover:text-role-manager transition-colors">
                        <Link to={`/manager/artists/${artist.id}`}>
                          Gestionar
                        </Link>
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Recent requests */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="flex items-center gap-2.5 text-lg">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <MessageSquare className="w-4 h-4 text-primary" />
              </div>
              Solicitudes Recientes
            </CardTitle>
            <Button variant="ghost" size="sm" asChild className="text-muted-foreground hover:text-foreground">
              <Link to="/manager/requests">
                Ver todas
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {pendingRequests.length > 0 ? (
              <div className="space-y-3">
                {pendingRequests.slice(0, 3).map((request) => {
                  const artist = managedArtists.find(a => a.id === request.artistId);
                  return (
                    <div
                      key={request.id}
                      className="group flex items-center justify-between p-4 rounded-xl bg-secondary/20 border border-border/40 hover:border-primary/30 hover:bg-secondary/40 transition-all duration-300"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="h-11 w-11 border border-border/50">
                          <AvatarImage src={artist?.avatar} />
                          <AvatarFallback className="bg-muted">{artist?.stageName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold">{artist?.stageName}</p>
                          <p className="text-sm text-muted-foreground">
                            {request.eventType} • {request.eventLocation}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-primary text-lg">
                          €{request.offeredPrice.toLocaleString()}
                        </p>
                        <Badge variant="warning">Pendiente</Badge>
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
                <p className="font-medium">No hay solicitudes pendientes</p>
                <p className="text-sm mt-1 opacity-70">Las nuevas solicitudes aparecerán aquí</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
