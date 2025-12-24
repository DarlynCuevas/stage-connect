import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Star, CheckCircle2, Users, Heart } from 'lucide-react';
import { Manager } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { handleFavorite } from '@/lib/favorite';

interface ManagerCardProps {
  manager: Manager;
  onViewProfile?: () => void;
  onFavoriteChange?: (managerId: string, favorite: boolean) => void;
}


export function ManagerCard({ manager, onViewProfile, onFavoriteChange }: ManagerCardProps) {
    const location = [manager.city, manager.country].filter(Boolean).join(', ');
    const { user, token } = useAuth();
  // No location in Manager type, but you can add if available
  // const location = [manager.city, manager.country].filter(Boolean).join(', ');
  // Detect if user is promoter for cross-route (optional, similar to PromotorCard)
  let promoterId = undefined;
  if (typeof window !== 'undefined') {
    const userStr = localStorage.getItem('currentUser');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user && String(user.role).toLowerCase().includes('promotor')) {
          promoterId = user.id;
        }
      } catch {}
        }
    }
    const isLocal = user && String(user.role).toLowerCase().includes('local');
    const isPromoter = user && String(user.role).toLowerCase().includes('promotor');
    const resolvedLocalId = isLocal ? user?.id : undefined;
    const resolvedPromoterId = isPromoter ? user?.id : undefined;


    // Si el usuario es artista, la ruta debe ser /artist/:artistId/manager/:managerId/profile
    const isArtist = user && String(user.role).toLowerCase().includes('artista');
    const resolvedArtistId = isArtist ? user?.id : undefined;
    let managerProfileUrl = `/manager/profile/${manager.id}`;
    if (isLocal && resolvedLocalId) {
      managerProfileUrl = `/venue/${resolvedLocalId}/manager/${manager.id}/profile`;
    } else if (isPromoter && resolvedPromoterId) {
      managerProfileUrl = `/promoter/${resolvedPromoterId}/manager/${manager.id}/profile`;
    } else if (isArtist && resolvedArtistId) {
      managerProfileUrl = `/artist/${resolvedArtistId}/manager/${manager.id}/profile`;
    }

    

  // Estado visual depende de la prop manager.favorite
  const isFavorite = !!manager.favorite;

  return (
    <Link to={managerProfileUrl} className="group">
      <Card className="overflow-hidden border-0 bg-transparent shadow-none transition-all duration-300">
        <div className="relative">
          <div className="aspect-[2/1] relative overflow-hidden rounded-xl">
            {/* Badge de verificado (si se añade en el futuro) */}
            {/* {manager.verified && (
              <span className="absolute top-3 left-3 z-10">
                <CheckCircle2 className="h-5 w-5 text-green-500 drop-shadow" />
              </span>
            )} */}
            {manager.avatar ? (
              <img
                src={manager.avatar}
                alt={manager.name}
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
                  if (onFavoriteChange) onFavoriteChange(manager.id, newFav);
                  try {
                    await handleFavorite({ targetId: Number(manager.id), favorite: newFav });
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
              <h3 className="font-semibold text-base text-gray-600 leading-tight">
                {manager.name}
              </h3>
              {/* No rating in Manager type, add if needed */}
              {/* <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Star className="h-3 w-3 fill-current text-amber-400" />
                <span>{manager.rating ?? 4.5}</span>
              </div> */}
            </div>
            {/* {location && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-1 truncate">
                  <MapPin className="h-3 w-3" /> {location}
                </span>
              </div>
            )} */}
          </div>
          {manager.company && (
            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
              {manager.company}
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
