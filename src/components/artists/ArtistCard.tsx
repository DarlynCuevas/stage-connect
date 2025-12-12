import { Link } from 'react-router-dom';
import { Artist } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Star, MapPin, CheckCircle } from 'lucide-react';

interface ArtistCardProps {
  artist: Artist;
  showPrice?: boolean;
}

export function ArtistCard({ artist, showPrice = false }: ArtistCardProps) {
  return (
    <Link
      to={`/artist/${artist.id}`}
      className="group block animate-fade-in"
    >
      {/* Image container */}
      <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-3">
        <img
          src={artist.banner || artist.avatar}
          alt={artist.stageName}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Verified badge */}
        {artist.verified && (
          <div className="absolute top-3 left-3 px-2 py-1 rounded-lg bg-background/90 backdrop-blur-sm text-xs font-medium flex items-center gap-1">
            <CheckCircle className="w-3 h-3 text-success" />
            Verificado
          </div>
        )}

        {/* Avatar overlay */}
        <div className="absolute bottom-3 left-3">
          <img
            src={artist.avatar}
            alt={artist.stageName}
            className="w-10 h-10 rounded-full border-2 border-background object-cover"
          />
        </div>
      </div>

      {/* Content */}
      <div className="space-y-1">
        {/* Header row */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
            {artist.stageName}
          </h3>
          <div className="flex items-center gap-1 shrink-0">
            <Star className="w-3.5 h-3.5 fill-foreground text-foreground" />
            <span className="text-sm font-medium">{artist.rating}</span>
          </div>
        </div>

        {/* Genre and location */}
        <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
          <span>{artist.genre[0]}</span>
          <span>·</span>
          <MapPin className="w-3 h-3" />
          <span>{artist.city}</span>
        </div>

        {/* Price */}
        {showPrice && (
          <p className="text-sm pt-0.5">
            <span className="font-semibold text-foreground">€{artist.basePrice.toLocaleString()}</span>
            <span className="text-muted-foreground"> / actuación</span>
          </p>
        )}
      </div>
    </Link>
  );
}
