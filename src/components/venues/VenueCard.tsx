import { Link } from 'react-router-dom';
import { Venue } from '@/types';
import { Star, MapPin, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VenueCardProps extends React.HTMLAttributes<HTMLAnchorElement> {
  venue: Venue;
}

const typeLabels: Record<string, string> = {
  club: 'Discoteca',
  bar: 'Bar',
  concert_hall: 'Sala de conciertos',
  festival: 'Festival',
  rooftop: 'Rooftop',
  theater: 'Teatro',
  private: 'Privado',
  other: 'Otro',
};

export function VenueCard({ venue, className, ...props }: VenueCardProps) {
  return (
    <Link
      to={`/venue/${venue.id}`}
      className={cn(
        "group block animate-fade-in",
        className
      )}
      {...props}
    >
      {/* Image container */}
      <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-3">
        <img
          src={venue.avatar}
          alt={venue.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Subtle overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Price badge */}
        {venue.priceRange && (
          <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-background/90 backdrop-blur-sm text-xs font-medium">
            {venue.priceRange === 'low' && '€'}
            {venue.priceRange === 'medium' && '€€'}
            {venue.priceRange === 'high' && '€€€'}
            {venue.priceRange === 'premium' && '€€€€'}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="space-y-1">
        {/* Header row */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
            {venue.name}
          </h3>
          {venue.rating && (
            <div className="flex items-center gap-1 shrink-0">
              <Star className="w-3.5 h-3.5 fill-foreground text-foreground" />
              <span className="text-sm font-medium">{venue.rating}</span>
            </div>
          )}
        </div>

        {/* Type and location */}
        <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
          <span>{typeLabels[venue.type] || venue.type}</span>
          <span>·</span>
          <MapPin className="w-3 h-3" />
          <span>{venue.city}</span>
        </div>

        {/* Description */}
        {venue.description && (
          <p className="text-muted-foreground text-sm line-clamp-2 leading-snug">
            {venue.description}
          </p>
        )}

        {/* Capacity */}
        <div className="flex items-center gap-1.5 text-muted-foreground text-sm pt-0.5">
          <Users className="w-3.5 h-3.5" />
          <span>Aforo: {venue.capacity.toLocaleString()}</span>
          {venue.reviewCount && (
            <>
              <span>·</span>
              <span>{venue.reviewCount} reseñas</span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}
