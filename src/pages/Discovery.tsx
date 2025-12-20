import { Badge } from '@/components/ui/badge';
import { VenueCard } from '@/components/venue/VenueCard';
import { ArtistCard } from '@/components/artists/ArtistCard';
import { ManagerCard } from '@/components/manager/ManagerCard';
import { PromotorCard } from '@/components/promoter/PromotorCard';
import { ChevronDown, ChevronUp, Heart } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from '@/components/ui/carousel';
import { useAuth } from '@/contexts/AuthContext';

type DiscoveryProps = {
  type: 'artists' | 'venues' | 'managers' | 'promoters';
  loading: boolean;
  verified: any[];
  featured: any[];
  others: any[];
  favorites: any[];
  showFavorites: boolean;
  setShowFavorites: (show: boolean) => void;
  onFavoriteChange: (...args: any[]) => void;
  mapToCard: (item: any) => any;
  onSearchBar?: React.ReactNode;
  totalCount: number;
  sectionTitle: string;
  cardType: 'artist' | 'venue' | 'manager' | 'promoter';
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
    hasNextPage: boolean;
  };
  onPageChange?: (page: number) => void;
  renderGrid?: (children: React.ReactNode) => React.ReactNode;
};


export default function Discovery({
  loading,
  verified,
  featured,
  others,
  favorites,
  showFavorites,
  setShowFavorites,
  onFavoriteChange,
  mapToCard,
  onSearchBar,
  totalCount,
  sectionTitle,
  cardType,
  pagination,
  onPageChange,
  renderGrid
}: DiscoveryProps) {
  const { user } = useAuth();
  const artistId = user && user.role && String(user.role).toLowerCase().includes('art') ? user.id : undefined;
  const venueId = user && user.role && String(user.role).toLowerCase().includes('venue') ? user.id : undefined;
  return (
    <div className="w-full max-w-[1800px] mx-auto px-4 py-6">
      {onSearchBar}
      <div className="flex justify-center my-4">
        <Badge variant="secondary" className="text-sm">
          {totalCount} {cardType === 'artist' ? 'artistas' : cardType === 'manager' ? 'managers' : 'salas'} disponibles
        </Badge>
      </div>
      {loading ? (
        <div className="min-h-[200px] flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground ml-4">
            {cardType === 'artist' ? 'Buscando artistas...' : 'Descubriendo salas increíbles...'}
          </p>
        </div>
      ) : (
        <>
      
          {/* Renderizado personalizado de la grilla si existe renderGrid */}
          {renderGrid ? (
            renderGrid(
              <>
                {/* Otros */}
                {others.length > 0 && (
                  <div className="mb-6">
                    <h2 className="text-lg font-semibold text-muted-foreground mb-2">
                      {cardType === 'artist' ? 'Artistas' : 'Managers'}
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                      {others.map((item) => (
                        cardType === 'artist' ? (
                          <ArtistCard key={item.id} artist={mapToCard(item)} showPrice onFavoriteChange={onFavoriteChange} venueId={venueId} />
                        ) : cardType === 'manager' ? (
                          <ManagerCard key={item.id} manager={mapToCard(item)} onFavoriteChange={onFavoriteChange} />
                        ) : cardType === 'promoter' ? (
                          <PromotorCard key={item.id} promoter={mapToCard(item)} onFavoriteChange={onFavoriteChange} />
                        ) : (
                          <VenueCard key={item.id} venue={mapToCard(item)} onFavoriteChange={onFavoriteChange} />
                        )
                      ))}
                    </div>
                    {/* Paginación */}
                    {pagination && (
                      <div className="flex justify-center items-center gap-4 mt-6">
                        <button
                          className="px-4 py-2 rounded bg-muted text-muted-foreground disabled:opacity-50"
                          disabled={pagination.page === 1}
                          onClick={() => onPageChange && onPageChange(pagination.page - 1)}
                        >
                          Anterior
                        </button>
                        <span>Página {pagination.page} de {Math.ceil(pagination.total / pagination.pageSize)}</span>
                        <button
                          className="px-4 py-2 rounded bg-muted text-muted-foreground disabled:opacity-50"
                          disabled={!pagination.hasNextPage}
                          onClick={() => onPageChange && onPageChange(pagination.page + 1)}
                        >
                          Siguiente
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </>
            )
          ) : (
            <>
              {/* Favoritos */}
              <div className="mb-6 relative">
                <button
                  className="flex items-center gap-2 text-lg font-semibold text-red-500 mb-2 focus:outline-none hover:underline"
                  onClick={() => setShowFavorites(!showFavorites)}
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
                        {favorites.length > 0 ? favorites.map((item) => (
                          <CarouselItem key={item.id} className="basis-72 max-w-xs">
                            {cardType === 'artist' ? (
                              <ArtistCard artist={mapToCard(item)} showPrice onFavoriteChange={onFavoriteChange} venueId={venueId} />
                            ) : cardType === 'manager' ? (
                              <ManagerCard manager={mapToCard(item)} onFavoriteChange={onFavoriteChange} />
                            ) : cardType === 'promoter' ? (
                              <PromotorCard promoter={mapToCard(item)} onFavoriteChange={onFavoriteChange} />
                            ) : (
                              <VenueCard venue={mapToCard(item)} onFavoriteChange={onFavoriteChange} />
                            )}
                          </CarouselItem>
                        )) : (
                          <div className="text-muted-foreground px-4 py-8">No tienes favoritos.</div>
                        )}
                      </CarouselContent>
                    </div>
                  </Carousel>
                )}
              </div>
              {/* Otros */}
              {others.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-muted-foreground mb-2">
                    {cardType === 'artist' ? 'Artistas' : 'Salas'}
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {others.map((item) => (
                      cardType === 'artist' ? (
                        <ArtistCard key={item.id} artist={mapToCard(item)} showPrice onFavoriteChange={onFavoriteChange} venueId={venueId} />
                      ) : cardType === 'manager' ? (
                        <ManagerCard key={item.id} manager={mapToCard(item)} onFavoriteChange={onFavoriteChange} />
                      ) : cardType === 'promoter' ? (
                        <PromotorCard key={item.id} promoter={mapToCard(item)} onFavoriteChange={onFavoriteChange} />
                      ) : (
                        <VenueCard key={item.id} venue={mapToCard(item)} onFavoriteChange={onFavoriteChange} />
                      )
                    ))}
                  </div>
                  {/* Paginación */}
                  {pagination && (
                    <div className="flex justify-center items-center gap-4 mt-6">
                      <button
                        className="px-4 py-2 rounded bg-muted text-muted-foreground disabled:opacity-50"
                        disabled={pagination.page === 1}
                        onClick={() => onPageChange && onPageChange(pagination.page - 1)}
                      >
                        Anterior
                      </button>
                      <span>Página {pagination.page} de {Math.ceil(pagination.total / pagination.pageSize)}</span>
                      <button
                        className="px-4 py-2 rounded bg-muted text-muted-foreground disabled:opacity-50"
                        disabled={!pagination.hasNextPage}
                        onClick={() => onPageChange && onPageChange(pagination.page + 1)}
                      >
                        Siguiente
                      </button>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}