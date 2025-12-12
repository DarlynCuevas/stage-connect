import { VenueSearchBar } from '@/components/ui/VenueSearchBar';
import { HeaderLayout } from '@/components/layout/HeaderLayout';
import { Badge } from '@/components/ui/badge';
import { VenueCard } from '@/components/venue/VenueCard';
import { useDiscoveryVenues } from '@/hooks/useDiscoveryVenues';
import { apiFetch } from '@/lib/api';
import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Heart } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from '@/components/ui/carousel';

// Ejemplo: actualizar un local a verificado o destacado
async function updateVenueField(
  venueId: string,
  data: { verified?: boolean; featured?: boolean },
  token?: string
) {
  return apiFetch(`/venues/${venueId}`, {
    method: 'PATCH',
    body: data,
    token,
  });
}
// Uso:
// await updateVenueField('1', { verified: true }, token);
// await updateVenueField('2', { featured: true }, token);

export default function Discovery() {
  const { venues, loading, setFilters, filters } = useDiscoveryVenues();
  const [showFavorites, setShowFavorites] = useState(false);
  const [venueList, setVenueList] = useState(venues);

  useEffect(() => {
    setVenueList(venues);
  }, [venues]);

  // Filtrar locales verificados y destacados, sin duplicados
  const verified = venueList.filter((v) => v.verified);
  const featured = venueList.filter((v) => v.featured && !v.verified);
  const others = venueList.filter((v) => !v.verified && !v.featured);
  const favorites = venueList.filter((v) => v.favorite);

  const handleFavoriteChange = (venueId: number, favorite: boolean) => {
    setVenueList((prev) =>
      prev.map((v) =>
        v.id === venueId ? { ...v, favorite } : v
      )
    );
  };

  return (
    <HeaderLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col items-center justify-center mb-4 text-center">
          <h1 className="text-3xl font-display font-bold mb-1">
            Encuentra tu próximo escenario
          </h1>
          <p className="text-muted-foreground mb-2">
            Descubre locales y eventos donde mostrar tu talento
          </p>
        </div>
        <VenueSearchBar
          onSearch={({ city, dateRange, type }) => {
            setFilters({
              city: city || 'all',
              type: type || 'all',
              // dateRange
            });
          }}
          initialCity={filters.city !== 'all' ? filters.city : ''}
          initialType={filters.type}
        />
        <div className="flex justify-center my-4">
          <Badge variant="secondary" className="text-sm">
            {venues.length} locales disponibles
          </Badge>
        </div>
        {loading ? (
          <div className="min-h-[200px] flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground ml-4">
              Descubriendo locales increíbles...
            </p>
          </div>
        ) : (
          <>
            <div className="container mx-auto px-4 py-4">
              {/* Primera fila: locales verificados */}
               <div className="mb-6 relative">
                 <h2 className="text-lg font-semibold text-muted-foreground mb-2">
                   Locales verificados
                 </h2>
                 <div className="relative">
                   <Carousel>
                     <div className="flex flex-col">
                       <div className="flex justify-center items-center gap-1 mb-3">
                         <CarouselPrevious />
                         <CarouselNext />
                       </div>
                       <CarouselContent>
                         {verified.map((venue) => (
                           <CarouselItem key={venue.id} className="basis-72 max-w-xs">
                             <VenueCard venue={venue} onFavoriteChange={handleFavoriteChange} />
                           </CarouselItem>
                         ))}
                       </CarouselContent>
                     </div>
                   </Carousel>
                 </div>
               </div>
              {/* Segunda fila: locales destacados */}
               <div className="mb-6 relative">
                 <h2 className="text-lg font-semibold text-muted-foreground mb-2">
                   Locales destacados
                 </h2>
                 <div className="relative">
                   <Carousel>
                     <div className="flex flex-col">
                       <div className="flex justify-center items-center gap-1 mb-3">
                         <CarouselPrevious />
                         <CarouselNext />
                       </div>
                       <CarouselContent>
                         {featured.map((venue) => (
                           <CarouselItem key={venue.id} className="basis-72 max-w-xs">
                             <VenueCard venue={venue} onFavoriteChange={handleFavoriteChange} />
                           </CarouselItem>
                         ))}
                       </CarouselContent>
                     </div>
                   </Carousel>
                 </div>
               </div>
              {/* Sección colapsable de favoritos */}
               {favorites.length > 0 && (
                 <div className="mb-6 relative">
                   <button
                     className="flex items-center gap-2 text-lg font-semibold text-red-500 mb-2 focus:outline-none hover:underline"
                     onClick={() => setShowFavorites((v) => !v)}
                   >
                     <Heart className="h-5 w-5" /> Favoritos
                     {showFavorites ? (
                       <ChevronUp className="h-4 w-4" />
                     ) : (
                       <ChevronDown className="h-4 w-4" />
                     )}
                   </button>
                   {showFavorites && (
                     <Carousel>
                       <div className="flex flex-col">
                         <div className="flex justify-center items-center gap-1 mb-3">
                           <CarouselPrevious />
                           <CarouselNext />
                         </div>
                         <CarouselContent>
                           {favorites.map((venue) => (
                             <CarouselItem key={venue.id} className="basis-72 max-w-xs">
                               <VenueCard venue={venue} onFavoriteChange={handleFavoriteChange} />
                             </CarouselItem>
                           ))}
                         </CarouselContent>
                       </div>
                     </Carousel>
                   )}
                 </div>
               )}
              {/* Tercera fila: otros locales */}
              {others.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-muted-foreground mb-2">
                    Otros locales
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {others.map((venue) => (
                      <VenueCard key={venue.id} venue={venue} onFavoriteChange={handleFavoriteChange} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </HeaderLayout>
  );
}