import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Star, CheckCircle2, Users } from 'lucide-react';
import { Promoter } from '@/types';

interface PromotorCardProps {
  promoter: Promoter;
  onViewProfile?: () => void;
  onFavoriteChange?: (promoterId: string, favorite: boolean) => void;
}

export function PromotorCard({ promoter, onViewProfile, onFavoriteChange }: PromotorCardProps) {
    console.log('[PromotorCard][RENDER]', promoter?.id, promoter?.name);
  const location = [promoter.city, promoter.country].filter(Boolean).join(', ');
  // Puedes agregar lógica de favoritos si es necesario
  // Detectar si el usuario es manager para ruta cruzada
  let promoterProfileUrl = `/promoter/${promoter.id}/profile`;
  if (typeof window !== 'undefined') {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        const role = String(user.role).toLowerCase();
        // DEPURADOR ACTIVO
        debugger;
        console.log('[PromotorCard][DEBUG] ROL DETECTADO:', role, 'ID:', user.id, 'Promoter:', promoter.id, promoter.name);
        if (role === 'manager') {
          promoterProfileUrl = `/manager/${user.id}/promoter/${promoter.id}/profile`;
        }
      } catch (e) {
        console.log('[PromotorCard][DEBUG] Error parseando user:', e);
      }
    } else {
      console.log('[PromotorCard][DEBUG] No hay user en localStorage');
    }
  }
  console.log('[PromotorCard][DEBUG] URL generada:', promoterProfileUrl, 'Promoter:', promoter.id, promoter.name);

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
