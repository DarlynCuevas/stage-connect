import { Link } from 'react-router-dom';
import { Artist } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { MapPin, Star, Music, CheckCircle, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ArtistCardProps {
  artist: Artist;
  showPrice?: boolean;
  onViewProfile?: () => void;
}

export function ArtistCard({ artist, showPrice = false, onViewProfile }: ArtistCardProps) {
  return (
    <Card 
      variant="gradient" 
      className="group overflow-hidden hover:shadow-glow hover:border-primary/30 transition-all duration-300"
    >
      <div className="relative h-32 overflow-hidden">
        {artist.banner ? (
          <img
            src={artist.banner}
            alt={artist.stageName}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
        
        {/* Avatar */}
        <Avatar className="absolute -bottom-6 left-4 h-16 w-16 border-4 border-card shadow-lg">
          <AvatarImage src={artist.avatar} alt={artist.stageName} />
          <AvatarFallback className="bg-primary text-primary-foreground text-lg">
            {artist.stageName.charAt(0)}
          </AvatarFallback>
        </Avatar>

        {/* Verified badge */}
        {artist.verified && (
          <div className="absolute top-3 right-3">
            <Badge variant="default" className="gap-1">
              <CheckCircle className="w-3 h-3" />
              Verificado
            </Badge>
          </div>
        )}
      </div>

      <CardContent className="pt-8 pb-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="font-display font-bold text-lg text-foreground group-hover:text-primary transition-colors">
              {artist.stageName}
            </h3>
            <p className="text-sm text-muted-foreground">{artist.name}</p>
          </div>
          <div className="flex items-center gap-1 text-accent">
            <Star className="w-4 h-4 fill-current" />
            <span className="text-sm font-medium">{artist.rating}</span>
          </div>
        </div>

        <div className="flex items-center gap-1 text-muted-foreground text-sm mb-3">
          <MapPin className="w-3.5 h-3.5" />
          <span>{artist.city}, {artist.country}</span>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {artist.genre.slice(0, 3).map((genre) => (
            <Badge key={genre} variant="secondary" className="text-xs">
              <Music className="w-3 h-3 mr-1" />
              {genre}
            </Badge>
          ))}
        </div>

        {showPrice && (
          <div className="flex items-center justify-between pt-3 border-t border-border">
            <div>
              <p className="text-xs text-muted-foreground">Desde</p>
              <p className="text-lg font-bold text-primary">
                €{artist.basePrice.toLocaleString()}
              </p>
            </div>
            <Button asChild size="sm" variant="gradient">
              <Link to={`/artist/${artist.id}`}>
                <Eye className="w-4 h-4 mr-1" />
                Ver perfil
              </Link>
            </Button>
          </div>
        )}

        {!showPrice && (
          <Button asChild className="w-full" variant="outline">
            <Link to={`/artist/${artist.id}`}>
              Ver perfil
            </Link>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
