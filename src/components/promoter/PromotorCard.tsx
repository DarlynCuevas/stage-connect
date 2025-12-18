import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Star, CheckCircle2, Users, Heart } from 'lucide-react';
import { Promoter } from '@/types';

interface PromotorCardProps {
  promoter: Promoter;
  onViewProfile?: () => void;
  onFavoriteChange?: (promoterId: string, favorite: boolean) => void;
}


import { useAuth } from '@/contexts/AuthContext';
import { handleFavorite } from '@/lib/favorite';
import apiFetch from '@/lib/api';

export function PromotorCard({ promoter, onViewProfile, onFavoriteChange }: PromotorCardProps) {
  const location = [promoter.city, promoter.country].filter(Boolean).join(', ');
  const { user, token } = useAuth();

  let promoterProfileUrl = `/promoter/${promoter.id}/profile`;
  if (typeof window !== 'undefined') {
    const userStr = localStorage.getItem('currentUser');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        const role = String(user.role).toLowerCase();
        if (role.includes('manager')) {
          promoterProfileUrl = `/manager/${user.id}/promoter/${promoter.id}/profile`;
        } else if (role.includes('artist')) {
          promoterProfileUrl = `/artist/${user.id}/promoter/${promoter.id}/profile`;
        }
      } catch (e) {}
    }
  }

  // Estado visual depende de la prop promoter.favorite
  const isFavorite = !!promoter.favorite;

  return (
    <Link to={promoterProfileUrl} className="group">
      <Card className="overflow-hidden border-0 bg-transparent shadow-none transition-all duration-300">
        <div className="relative">
          <div className="aspect-[2/1] relative overflow-hidden rounded-xl">
            {/* Badge de verificado */}
            {promoter.verified && (
              <span className="absolute top-3 left-3 z-10">
                <CheckCircle2 className="h-5 w-5 text-green-500 drop-shadow" />
              </span>
            )}
            {promoter.avatar ? (
              <img
                src={promoter.avatar}
                alt={promoter.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Users className="h-12 w-12 text-primary/40" />
              </div>
            )}

            {/* Heart icon for favorites */}
            <button
              className={`absolute top-3 right-3 p-2 rounded-full bg-background/80 hover:bg-background transition-colors ${isFavorite ? 'text-red-500' : ''}`}
              onClick={async (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  const newFav = !isFavorite;
                  if (onFavoriteChange) onFavoriteChange(promoter.id, newFav);
                  try {
                    await handleFavorite({ targetId: promoter.id, favorite: newFav });
                  } catch (err) {
                    // Opcional: mostrar toast de error
                  }
                }}
              aria-label={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
            >
              <Heart className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-muted-foreground hover:text-red-500'}`} />
            </button>
          </div>
        </div>
        <CardContent className="px-0 py-2 space-y-2">
          <div className="space-y-1">
            <div className="flex items-start justify-between">
              <h3 className="font-semibold text-lg leading-tight group-hover:text-primary transition-colors">
                {promoter.name}
              </h3>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Star className="h-3 w-3 fill-current text-amber-400" />
                <span>{promoter.rating ?? 4.5}</span>
              </div>
            </div>
            {location && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-1 truncate">
                  <MapPin className="h-3 w-3" /> {location}
                </span>
              </div>
            )}
          </div>
          {promoter.company && (
            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
              {promoter.company}
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
