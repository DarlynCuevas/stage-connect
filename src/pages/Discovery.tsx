import { VenueSearchBar } from '@/components/ui/VenueSearchBar';
import { Badge } from '@/components/ui/badge';
import { VenueCard } from '@/components/venue/VenueCard';
import { useDiscoveryArtists } from '@/hooks/useDiscoveryArtists';
import { apiFetch } from '@/lib/api';
import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Heart } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from '@/components/ui/carousel';

// Ejemplo: actualizar una sala a verificada o destacada
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
  const { artists, loading, setFilters, filters } = useDiscoveryArtists();
  const [showFavorites, setShowFavorites] = useState(false);
  const [artistList, setArtistList] = useState(artists);

  useEffect(() => {
    setArtistList(artists);
  }, [artists]);

  // Filtrar artistas destacados, verificados, etc.
  const verified = artistList.filter((a) => a.verified);
  const featured = artistList.filter((a) => a.featured && !a.verified);
  const others = artistList.filter((a) => !a.verified && !a.featured);
  const favorites = artistList.filter((a) => a.favorite);

  const handleFavoriteChange = (artistId: number, favorite: boolean) => {
    setArtistList((prev) =>
      prev.map((a) =>
        a.id === artistId ? { ...a, favorite } : a
      )
    );
  };

  return (
    <div className="w-full max-w-[1800px] mx-auto px-4 py-6">
      <div className="flex flex-col items-center justify-center mb-4 text-center">
        <h1 className="text-3xl font-display font-bold mb-1">
          Encuentra artistas para tu local
        </h1>
        <p className="text-muted-foreground mb-2">
          Descubre y contacta artistas para tus eventos
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
          {artists.length} artistas disponibles
        </Badge>
      </div>
      {loading ? (
        <div className="min-h-[200px] flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground ml-4">
            Descubriendo artistas increíbles...
          </p>
        </div>
      ) : (
        <>
          <div className="w-full max-w-[1800px] mx-auto px-4 py-4">
            {/* Primera fila: artistas verificadas */}
            {verified.length > 0 && (
              <div className="mb-6 relative">
                <h2 className="text-lg font-semibold text-muted-foreground mb-2">
                  Artistas verificadas
                </h2>
                <div className="relative">
                  <Carousel>
                    <div className="flex flex-col">
                      <div className="flex justify-center items-center gap-1 mb-3">
                        <CarouselPrevious />
                        <CarouselNext />
                      </div>
                      <CarouselContent className="xl:!grid xl:!grid-cols-5 xl:!gap-6">
                        {verified.map((artist) => (
                          <CarouselItem key={artist.id} className="basis-72 max-w-xs">
                            <VenueCard venue={artist} onFavoriteChange={handleFavoriteChange} />
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                    </div>
                  </Carousel>
                </div>
              </div>
            )}
            {/* Segunda fila: artistas destacados */}
            {featured.length > 0 && (
              <div className="mb-6 relative">
                <h2 className="text-lg font-semibold text-muted-foreground mb-2">
                  Artistas destacados
                </h2>
                <div className="relative">
                  <Carousel>
                    <div className="flex flex-col">
                      <div className="flex justify-center items-center gap-1 mb-3">
                        <CarouselPrevious />
                        <CarouselNext />
                      </div>
                      <CarouselContent className="xl:!grid xl:!grid-cols-5 xl:!gap-6">
                        {featured.map((artist) => (
                          <CarouselItem key={artist.id} className="basis-72 max-w-xs">
                            <VenueCard venue={artist} onFavoriteChange={handleFavoriteChange} />
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                    </div>
                  </Carousel>
                </div>
              </div>
            )}
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
                       <CarouselContent className="xl:!grid xl:!grid-cols-5 xl:!gap-6">
                         {favorites.map((artist) => (
                           <CarouselItem key={artist.id} className="basis-72 max-w-xs">
                             <VenueCard venue={artist} onFavoriteChange={handleFavoriteChange} />
                           </CarouselItem>
                         ))}
                       </CarouselContent>
                     </div>
                   </Carousel>
                 )}
               </div>
             )}
            {/* Tercera fila: otros artistas */}
            {others.length > 0 && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-muted-foreground mb-2">
                  Otros artistas
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                  {others.map((artist) => (
                    <VenueCard key={artist.id} venue={artist} onFavoriteChange={handleFavoriteChange} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}