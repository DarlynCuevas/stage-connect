
import { Link } from 'react-router-dom';
import { Artist } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { MapPin, Users, Star, Heart, Music, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';


interface ArtistCardProps {
  artist: Artist;
  showPrice?: boolean;
  onViewProfile?: () => void;
  venueId?: string;
}

export function ArtistCard({ artist, showPrice = false, venueId }: ArtistCardProps) {
  const [isFavorite, setIsFavorite] = useState(false); // Puedes conectar lógica real si tienes favoritos
  const location = [artist.city, artist.country].filter(Boolean).join(', ');
  const genres = artist.genre || [];

  // Si venueId está presente, usar la ruta pública de visitante
  const profileLink = venueId
    ? `/venue/${venueId}/artist/${artist.id}/profile`
    : `/artist/${artist.id}/profile`;

  return (
    <Link to={profileLink} className="group">
      <Card className="overflow-hidden border-0 bg-transparent shadow-none transition-all duration-300">
        <div className="relative">
          {/* Banner principal */}
          <div className="aspect-[2/1] relative overflow-hidden rounded-xl">
            {/* Badge de verificado arriba a la izquierda */}
            {artist.verified && (
              <span className="absolute top-3 left-3 z-10">
                <CheckCircle2 className="h-5 w-5 text-green-500 drop-shadow" />
              </span>
            )}
            {artist.gallery && artist.gallery.length > 0 ? (
              <img
                src={artist.gallery[0]}
                alt={artist.nickName || artist.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : artist.banner ? (
              <img
                src={artist.banner}
                alt={artist.nickName || artist.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Music className="h-12 w-12 text-primary/40" />
              </div>
            )}
            {/* Botón de favorito (simulado) */}
            <button
              className={`absolute top-3 right-3 p-2 rounded-full bg-background/80 hover:bg-background transition-colors ${isFavorite ? 'text-red-500' : ''}`}
              onClick={e => { e.preventDefault(); setIsFavorite(v => !v); }}
              aria-label={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
            >
              <Heart className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-muted-foreground hover:text-red-500'}`} />
            </button>
            {/* Badge de precio desde o género */}
            {showPrice && (
              <Badge variant="secondary" className="absolute bottom-3 left-3 bg-background/90 text-xs">
                €{artist.basePrice?.toLocaleString() || '0'}
              </Badge>
            )}
            {!showPrice && genres.length > 0 && (
              <Badge variant="secondary" className="absolute bottom-3 left-3 bg-background/90 text-xs">
                <Music className="h-3 w-3 mr-1" />
                {genres[0]}
              </Badge>
            )}
          </div>
        </div>
        <CardContent className="px-0 py-2 space-y-2">
          {/* Nombre + calificación */}
          <div className="space-y-1">
            <div className="flex items-start justify-between">
              <h3 className="font-semibold text-lg leading-tight group-hover:text-primary transition-colors">
                {artist.nickName || artist.name}
              </h3>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Star className="h-3 w-3 fill-current text-amber-400" />
                <span>{artist.rating ?? 4.5}</span>
              </div>
            </div>
            {/* Género + Ciudad en la misma línea */}
            {(genres.length > 0 || location) && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                {genres.length > 0 && <span className="truncate">{genres[0]}</span>}
                {location && (
                  <span className="flex items-center gap-1 truncate">
                    • <MapPin className="h-3 w-3" /> {location}
                  </span>
                )}
              </div>
            )}
          </div>
          {/* Descripción corta (2 líneas con puntos suspensivos) */}
          {artist.bio && (
            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
              {artist.bio}
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
