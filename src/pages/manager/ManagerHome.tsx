import { Link } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useArtists } from '@/lib/users';
import { useAuth } from '@/contexts/AuthContext';
import {
  Users,
  MessageSquare,
  Calendar,
  TrendingUp,
  ArrowRight,
  Music,
  Star,
  MapPin,
} from 'lucide-react';

export default function ManagerHome() {
  const { user } = useAuth();
  const { data: artists = [] } = useArtists();
  const manager = user;
  const managedArtists = (artists || []).filter((a: any) => {
    return a.managerId && String(a.managerId) === String(user?.id);
  });

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
      value: 0,
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
      label: 'Ingresos generados',
      value: '€45K',
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
              Panel de Manager
            </h1>
            <p className="text-muted-foreground">
              Bienvenido, {manager?.name || 'Manager'}{manager?.company ? ` • ${manager.company}` : ''}
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" asChild>
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

        {/* Managed artists */}
        <Card variant="gradient">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Music className="w-5 h-5 text-role-manager" />
              Artistas Gestionados
            </CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/manager/artists">
                Ver todos
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {managedArtists.map((artist) => {

                return (
                  <div
                    key={artist.id}
                    className="flex items-center gap-4 p-4 rounded-xl bg-secondary/30 border border-border/50 hover:border-primary/30 transition-all duration-300"
                  >
                    <Avatar className="h-16 w-16 border-2 border-border">
                      <AvatarImage src={artist.avatar} />
                      <AvatarFallback>{artist.stageName.charAt(0)}</AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-display font-bold truncate">{artist.stageName}</h3>
                        {artist.verified && (
                          <Badge variant="default" className="text-xs">Verificado</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {artist.city}
                        </span>
                        <span className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-accent" />
                          {artist.rating}
                        </span>
                      </div>
                      <p className="text-sm text-primary font-medium mt-1">
                        €{artist.basePrice.toLocaleString()} base
                      </p>
                    </div>

                    <div className="text-right">
                      <Button variant="outline" size="sm" asChild>
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
        <Card variant="gradient">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-primary" />
              Solicitudes Recientes
            </CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/manager/requests">
                Ver todas
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No hay solicitudes pendientes</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
