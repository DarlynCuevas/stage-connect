import { VenueSearchBar } from '@/components/ui/VenueSearchBar';
import { HeaderLayout } from '@/components/layout/HeaderLayout';
import { Badge } from '@/components/ui/badge';
import { VenueCard } from '@/components/venue/VenueCard';
import { useDiscoveryVenues } from '@/hooks/useDiscoveryVenues';
import { useDiscoveryArtists } from '@/hooks/useDiscoveryArtists';
import { ArtistCard } from '@/components/artists/ArtistCard';
import { ArtistSearch } from '@/components/artists/ArtistSearch';
import { apiFetch } from '@/lib/api';
import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Heart } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from '@/components/ui/carousel';

type DiscoveryProps = {
  type: 'artists' | 'venues';
};

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

export default function Discovery({ type }: DiscoveryProps) {
  if (type === 'artists') {
    // Mostrar artistas para venues
    const { artists, loading, setFilters, filters } = useDiscoveryArtists();
    // Adaptar los filtros para ArtistSearch (SearchFilters espera campos opcionales)
    const searchFilters = {
      ...filters,
      genre: filters.genre || [],
    };
    // Adaptar onFiltersChange para que acepte SearchFilters y lo convierta a DiscoveryArtistFilters
    const handleFiltersChange = (newFilters) => {
      setFilters({
        city: newFilters.city || 'all',
        genre: newFilters.genre || [],
        priceMin: newFilters.priceMin,
        priceMax: newFilters.priceMax,
      });
    };
    // Mapear DiscoveryArtist a ArtistCard (rellenar campos mínimos)
    const mapToArtistCard = (artist) => ({
      id: String(artist.id),
      userId: String(artist.id),
      name: artist.name,
      nickName: artist.name,
      avatar: artist.avatar || '',
      banner: '',
      bio: artist.bio || '',
      genre: artist.genre ? (Array.isArray(artist.genre) ? artist.genre : [artist.genre]) : [],
      country: '',
      city: artist.city || '',
      basePrice: artist.basePrice || 0,
      priceVariants: [],
      socialLinks: {},
      gallery: [],
      videos: [],
      managerId: '',
      rating: artist.rating || 0,
      totalShows: 0,
      verified: artist.verified || false,
      gender: '',
    });
    return (
      <div className="w-full max-w-[1800px] mx-auto px-4 py-6">
        <div className="flex flex-col items-center justify-center mb-4 text-center">
          <h1 className="text-3xl font-display font-bold mb-1">
            Encuentra artistas para tu evento
          </h1>
          <p className="text-muted-foreground mb-2">
            Descubre y contacta artistas disponibles
          </p>
        </div>
        <ArtistSearch filters={searchFilters} onFiltersChange={handleFiltersChange} />
        <div className="flex justify-center my-4">
          <Badge variant="secondary" className="text-sm">
            {artists.length} artistas disponibles
          </Badge>
        </div>
        {loading ? (
          <div className="min-h-[200px] flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground ml-4">
              Buscando artistas...
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {artists.map((artist) => (
              <ArtistCard key={artist.id} artist={mapToArtistCard(artist)} showPrice />
            ))}
          </div>
        )}
      </div>
    );
  }
  // ...lógica original para venues...
  const { venues, loading, setFilters, filters } = useDiscoveryVenues();
  const [showFavorites, setShowFavorites] = useState(false);
  const [venueList, setVenueList] = useState(venues);

  useEffect(() => {
    setVenueList(venues);
  }, [venues]);

  // Filtrar salas verificadas y destacadas, sin duplicados
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
    <div className="w-full max-w-[1800px] mx-auto px-4 py-6">
      <div className="flex flex-col items-center justify-center mb-4 text-center">
        <h1 className="text-3xl font-display font-bold mb-1">
          Encuentra tu próximo escenario
        </h1>
        <p className="text-muted-foreground mb-2">
          Descubre salas y eventos donde mostrar tu talento
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
          {venues.length} salas disponibles
        </Badge>
      </div>
      {loading ? (
        <div className="min-h-[200px] flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground ml-4">
            Descubriendo salas increíbles...
          </p>
        </div>
      ) : (
        <>
          <div className="w-full max-w-[1800px] mx-auto px-4 py-4">
            {/* Primera fila: salas verificadas */}
            {verified.length > 0 && (
              <div className="mb-6 relative">
                <h2 className="text-lg font-semibold text-muted-foreground mb-2">
                  Salas verificadas
                </h2>
                <div className="relative">
                  <Carousel>
                    <div className="flex flex-col">
                      <div className="flex justify-center items-center gap-1 mb-3">
                        <CarouselPrevious />
                        <CarouselNext />
                      </div>
                      <CarouselContent className="xl:!grid xl:!grid-cols-5 xl:!gap-6">
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
            )}
            {/* Segunda fila: salas destacadas */}
            {featured.length > 0 && (
              <div className="mb-6 relative">
                <h2 className="text-lg font-semibold text-muted-foreground mb-2">
                  Salas destacadas
                </h2>
                <div className="relative">
                  <Carousel>
                    <div className="flex flex-col">
                      <div className="flex justify-center items-center gap-1 mb-3">
                        <CarouselPrevious />
                        <CarouselNext />
                      </div>
                      <CarouselContent className="xl:!grid xl:!grid-cols-5 xl:!gap-6">
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
            {/* Tercera fila: otras salas */}
            {others.length > 0 && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-muted-foreground mb-2">
                  Salas
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
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
  );
}