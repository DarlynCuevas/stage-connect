import { Link } from 'react-router-dom';
import { Artist } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { MapPin, Star, Music, CheckCircle, Eye } from 'lucide-react';

interface ArtistCardProps {
  artist: Artist;
  showPrice?: boolean;
  onViewProfile?: () => void;
}

export function ArtistCard({ artist, showPrice = false }: ArtistCardProps) {
  return (
    <Card 
      variant="gradient" 
      className="group overflow-hidden hover:shadow-lg hover-lift transition-all duration-300"
    >
      <div className="relative h-28 overflow-hidden">
        {artist.banner ? (
          <img
            src={artist.banner}
            alt={artist.stageName}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/10" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/60 to-transparent" />
        
        <Avatar className="absolute -bottom-5 left-4 h-14 w-14 border-[3px] border-card shadow-lg">
          <AvatarImage src={artist.avatar} alt={artist.stageName} />
          <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
            {artist.stageName.charAt(0)}
          </AvatarFallback>
        </Avatar>

        {artist.verified && (
          <Badge variant="default" className="absolute top-2.5 right-2.5 gap-1 text-2xs px-2 py-0.5">
            <CheckCircle className="w-3 h-3" />
            Verificado
          </Badge>
        )}
      </div>

      <CardContent className="pt-7 pb-4 px-4">
        <div className="flex items-start justify-between mb-1.5">
          <div className="min-w-0 flex-1">
            <h3 className="font-display font-semibold text-base text-foreground group-hover:text-primary transition-colors truncate">
              {artist.stageName}
            </h3>
            <p className="text-xs text-muted-foreground truncate">{artist.name}</p>
          </div>
          <div className="flex items-center gap-1 text-accent shrink-0 ml-2">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span className="text-xs font-medium">{artist.rating}</span>
          </div>
        </div>

        <div className="flex items-center gap-1 text-muted-foreground text-xs mb-3">
          <MapPin className="w-3 h-3 shrink-0" />
          <span className="truncate">{artist.city}, {artist.country}</span>
        </div>

        <div className="flex flex-wrap gap-1 mb-3">
          {artist.genre.slice(0, 2).map((genre) => (
            <Badge key={genre} variant="secondary" className="text-2xs px-2 py-0.5">
              <Music className="w-2.5 h-2.5 mr-1" />
              {genre}
            </Badge>
          ))}
          {artist.genre.length > 2 && (
            <Badge variant="secondary" className="text-2xs px-2 py-0.5">
              +{artist.genre.length - 2}
            </Badge>
          )}
        </div>

        {showPrice ? (
          <div className="flex items-center justify-between pt-3 border-t border-border/50">
            <div>
              <p className="text-2xs text-muted-foreground">Desde</p>
              <p className="text-base font-bold text-primary">
                €{artist.basePrice.toLocaleString()}
              </p>
            </div>
            <Button asChild size="sm" variant="gradient" className="h-8">
              <Link to={`/artist/${artist.id}`}>
                <Eye className="w-3.5 h-3.5 mr-1" />
                Ver perfil
              </Link>
            </Button>
          </div>
        ) : (
          <Button asChild className="w-full h-9" variant="outline" size="sm">
            <Link to={`/artist/${artist.id}`}>Ver perfil</Link>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
