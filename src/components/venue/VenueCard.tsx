import { Link, useParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  Users, 
  Star, 
  Heart,
  Wifi,
  Car,
  Music,
  Shield,
  Volume2,
  CheckCircle2
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import apiFetch from '@/lib/api';
import { handleFavorite } from '@/lib/favorite';

interface VenueCardProps {
  venue: {
    id: number;
    name: string;
    city?: string;
    province?: string;
    capacity?: number;
    amenities?: string[];
    openingTime?: string;
    closingTime?: string;
    avatar?: string;
    gallery?: string[];
    bio?: string;
    reviewsCount?: number;
    rating?: number;
    favorite?: boolean;
    verified?: boolean;
  };
  onFavoriteChange?: (user_id: number, favorite: boolean) => void;
}

const getAmenityIcon = (amenity: string) => {
  const lower = amenity.toLowerCase();
  if (lower.includes('wifi') || lower.includes('internet')) return <Wifi className="h-3 w-3" />;
  if (lower.includes('parking') || lower.includes('aparcamiento')) return <Car className="h-3 w-3" />;
  if (lower.includes('sonido') || lower.includes('audio')) return <Volume2 className="h-3 w-3" />;
  if (lower.includes('música') || lower.includes('music')) return <Music className="h-3 w-3" />;
  return <Shield className="h-3 w-3" />;
};


export function VenueCard({ venue, onFavoriteChange }: VenueCardProps) {
  
  const { user, token } = useAuth();
  const params = useParams();
  // El estado visual depende siempre de la prop venue.favorite
  const isFavorite = !!venue.favorite;
  // Log para ver el estado de favorite recibido
  const location = [venue.city, venue.province].filter(Boolean).join(', ');
  const displayAmenities = venue.amenities?.slice(0, 3) || [];
  const cap = venue.capacity || 0;
  const reviewsDisplay = (venue.reviewsCount !== undefined)
    ? venue.reviewsCount
    : (cap > 0 ? Math.max(50, Math.round(cap / 6)) : (venue.id % 300) + 50);
  // Infer simple venue type from bio keywords (approximation)
  const bio = (venue.bio || '').toLowerCase();
  const venueType = bio.includes('discoteca') || bio.includes('club')
    ? 'Discoteca'
    : bio.includes('sala') || bio.includes('concierto')
    ? 'Sala de conciertos'
    : bio.includes('rooftop') || bio.includes('terraza')
    ? 'Rooftop'
    : '';

  // Si el usuario es artista o manager, usar su propio id para la ruta cruzada
  const isArtist = user && String(user.role).toLowerCase().includes('art');
  const isManager = user && String(user.role).toLowerCase().includes('manager');
  const resolvedArtistId = isArtist ? user?.id : undefined;
  const resolvedManagerId = isManager ? user?.id : undefined;
  
  
  // Usar userId si existe, si no id
  const venueId = (venue as any).userId || venue.id;
  let venueProfileUrl = `/venue/profile/${venueId}`;
  if (isArtist && resolvedArtistId) {
    venueProfileUrl = `/artist/${resolvedArtistId}/venue/${venueId}/profile`;
  } else if (isManager && resolvedManagerId) {
    venueProfileUrl = `/manager/${resolvedManagerId}/venue/${venueId}/profile`;
  }

  return (
    <Link to={venueProfileUrl} className="group">
      <Card className="overflow-hidden border-0 bg-transparent shadow-none transition-all duration-300">
        <div className="relative">
          {/* Image placeholder or avatar */}
          <div className="aspect-[2/1] relative overflow-hidden rounded-xl">
            {/* Icono de verificado arriba a la izquierda */}
            {venue.verified && (
              <span className="absolute top-3 left-3 z-10">
                <CheckCircle2 className="h-5 w-5 text-green-500 drop-shadow" />
              </span>
            )}

            {venue.gallery?.[0] ? (
              <img 
                src={venue.gallery[0]} 
                alt={venue.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : venue.avatar ? (
              <img 
                src={venue.avatar} 
                alt={venue.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Music className="h-12 w-12 text-primary/40" />
              </div>
            )}

            {/* Heart icon for favorites */}
            <button 
              className={`absolute top-3 right-3 p-2 rounded-full bg-background/80 hover:bg-background transition-colors ${isFavorite ? 'text-red-500' : ''}`}
              onClick={async (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  const newFav = !isFavorite;
                  if (onFavoriteChange) onFavoriteChange(venue.id, newFav);
                  try {
                    await handleFavorite({ targetId: venue.id, favorite: newFav });
                  } catch (err) {
                    console.error('[VenueCard] Error actualizando favorito', err);
                  }
                }}
              aria-label={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
            >
              <Heart className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-muted-foreground hover:text-red-500'}`} />
            </button>

            {/* Capacity badge */}
            {venue.capacity && (
              <Badge 
                variant="secondary" 
                className="absolute bottom-3 left-3 bg-background/90 text-xs"
              >
                <Users className="h-3 w-3 mr-1" />
                {venue.capacity}
              </Badge>
            )}
          </div>
        </div>

        <CardContent className="px-0 py-2 space-y-2">
          {/* Nombre + calificación */}
          <div className="space-y-1">
            <div className="flex items-start justify-between">
              <h3 className="font-semibold text-lg leading-tight group-hover:text-primary transition-colors">
                {venue.name}
              </h3>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Star className="h-3 w-3 fill-current text-amber-400" />
                <span>{venue.rating ?? 4.5}</span>
              </div>
            </div>
            {/* Tipo + Ciudad en la misma línea */}
            {(venueType || location) && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                {venueType && <span className="truncate">{venueType}</span>}
                {location && (
                  <span className="flex items-center gap-1 truncate">
                    • <MapPin className="h-3 w-3" /> {location}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Ocultamos amenities en esta vista */}

          {/* Horario oculto en esta vista */}

          {/* Descripción eliminada por requerimiento */}

          {/* Aforo y reseñas en la misma línea */}
          {(cap > 0 || reviewsDisplay) && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              {cap > 0 && (
                <span className="flex items-center gap-1"><Users className="h-3 w-3" /> Aforo: {cap}</span>
              )}
              {reviewsDisplay ? (
                <span>{cap > 0 ? '· ' : ''}{reviewsDisplay} reseñas</span>
              ) : null}
            </div>
          )}

        </CardContent>
      </Card>
    </Link>
  );
}