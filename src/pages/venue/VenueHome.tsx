import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { mockArtists } from '@/data/mockData';
import { TopNavbar } from '@/components/layout/TopNavbar';
import { ArtistCard } from '@/components/artists/ArtistCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  MessageSquare,
  Heart,
  Calendar,
  TrendingUp,
  ArrowRight,
  Search,
} from 'lucide-react';

export default function VenueHome() {
  const featuredArtists = mockArtists.slice(0, 4);

  const stats = [
    {
      label: 'Solicitudes enviadas',
      value: 3,
      icon: MessageSquare,
      color: 'text-role-venue',
      bgColor: 'bg-role-venue/10',
    },
    {
      label: 'Artistas favoritos',
      value: 5,
      icon: Heart,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      label: 'Eventos programados',
      value: 2,
      icon: Calendar,
      color: 'text-accent',
      bgColor: 'bg-accent/10',
    },
    {
      label: 'Este mes',
      value: 2,
      icon: TrendingUp,
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <TopNavbar />
      
      <main className="container-tight py-6 md:py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-2">
            Encuentra tu artista ideal
          </h1>
          <p className="text-muted-foreground">
            Explora artistas y contrata talento para tus eventos
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

        {/* Search CTA */}
        <Card variant="outline" className="mb-8 bg-secondary/30">
          <CardContent className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="font-semibold text-foreground mb-1">¿Buscas un artista específico?</h3>
              <p className="text-sm text-muted-foreground">Usa nuestros filtros avanzados para encontrar exactamente lo que necesitas</p>
            </div>
            <Button asChild size="lg">
              <Link to="/venue/search">
                <Search className="w-4 h-4 mr-2" />
                Buscar Artistas
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Featured artists */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">Artistas destacados</h2>
            <Button variant="ghost" size="sm" asChild className="text-muted-foreground">
              <Link to="/venue/search">
                Ver todos
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {featuredArtists.map((artist) => (
              <ArtistCard key={artist.id} artist={artist} showPrice />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
