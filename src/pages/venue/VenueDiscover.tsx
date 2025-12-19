import Discovery from "@/pages/Discovery";
import { useAuth } from '@/contexts/AuthContext';
import { HeaderLayout } from '@/components/layout/HeaderLayout';
import { useParams } from 'react-router-dom';
import { useDiscoveryArtists } from '@/hooks/useDiscoveryArtists';
import { useDiscoveryManagers } from '@/hooks/useDiscoveryManagers';
import { useState } from 'react';
import { handleFavorite } from '@/lib/favorite';
import { ArtistSearch } from '@/components/artists/ArtistSearch';
import { ManagerSearchBar } from '@/components/manager/ManagerSearchBar';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArtistCard } from '@/components/artists/ArtistCard';
import { ChevronDown, ChevronUp } from "lucide-react";

export default function VenueDiscover() {
  const { user } = useAuth();
  const { id } = useParams();
  if (id && user && String(user.id) !== String(id)) {
    return <div className="flex items-center justify-center min-h-[60vh]"><p className="text-destructive text-lg font-semibold">Acceso denegado</p></div>;
  }

  // Selector de tipo de búsqueda: 'artists' o 'managers'
  const [searchType, setSearchType] = useState<'artists' | 'managers'>('artists');

  // ARTISTS
  const { populares, destacados, resto, pagination, loading, setFilters, filters, setPopulares, setDestacados, setResto } = useDiscoveryArtists();
  const [showFavorites, setShowFavorites] = useState(false);
  const [favorites, setFavorites] = useState<any[]>([]);
  const handleFavoriteArtist = async (artistId: number, favorite: boolean) => {
    if (!user) return;
    try {
      // Buscar y actualizar en el array correspondiente
      setPopulares((prev) => prev.map((artist) => (artist.id === artistId ? { ...artist, favorite } : artist)));
      setDestacados((prev) => prev.map((artist) => (artist.id === artistId ? { ...artist, favorite } : artist)));
      setResto((prev) => prev.map((artist) => (artist.id === artistId ? { ...artist, favorite } : artist)));
      // Actualizar favoritos
      setFavorites((prevFavs) => {
        const allArtists = [...populares, ...destacados, ...resto];
        const artist = allArtists.find((a) => a.id === artistId);
        if (!artist) return prevFavs;
        if (favorite) {
          // Agregar si no está
          if (!prevFavs.some((a) => a.id === artistId)) {
            return [...prevFavs, { ...artist, favorite: true }];
          }
          // Si ya está, actualizar el estado
          return prevFavs.map((a) => a.id === artistId ? { ...a, favorite: true } : a);
        } else {
          // Quitar si se desmarca
          return prevFavs.filter((a) => a.id !== artistId);
        }
      });
      await handleFavorite({ userId: user.id, targetId: artistId, favorite });
    } catch (e) {
      // Manejo de error opcional
    }
  };
  const mapToArtistCard = (artist: any) => ({ ...artist, venueId: user?.id });
  const handleArtistSearch = (filtersUpdate: any) => {
    setFilters((prev: any) => ({ ...prev, ...filtersUpdate }));
  };

  // MANAGERS
  const { populares: popularesManagers, destacados: destacadosManagers, resto: restoManagers, pagination: paginationManagers, loading: loadingManagers, setFilters: setManagerFilters, filters: managerFilters, setPopulares: setPopularesManagers, setDestacados: setDestacadosManagers, setResto: setRestoManagers } = useDiscoveryManagers();
  const [showFavoritesManagers, setShowFavoritesManagers] = useState(false);
  const [favoritesManagers, setFavoritesManagers] = useState<any[]>([]);
  const handleFavoriteManager = async (managerId: number, favorite: boolean) => {
    if (!user) return;
    try {
      setPopularesManagers((prev) => prev.map((manager) => manager.id === managerId ? { ...manager, favorite } : manager));
      setDestacadosManagers((prev) => prev.map((manager) => manager.id === managerId ? { ...manager, favorite } : manager));
      setRestoManagers((prev) => prev.map((manager) => manager.id === managerId ? { ...manager, favorite } : manager));
      // Actualizar favoritos
      setFavoritesManagers((prevFavs) => {
        const allManagers = [...popularesManagers, ...destacadosManagers, ...restoManagers];
        const manager = allManagers.find((m) => m.id === managerId);
        if (!manager) return prevFavs;
        if (favorite) {
          if (!prevFavs.some((m) => m.id === managerId)) {
            return [...prevFavs, { ...manager, favorite: true }];
          }
          return prevFavs.map((m) => m.id === managerId ? { ...m, favorite: true } : m);
        } else {
          return prevFavs.filter((m) => m.id !== managerId);
        }
      });
      await handleFavorite({ userId: user.id, targetId: managerId, favorite });
    } catch (e) {
      // Manejo de error opcional
    }
  };
  const mapToManagerCard = (manager: any) => ({ ...manager });
  const handleManagerSearch = (filtersUpdate: any) => {
    setManagerFilters((prev: any) => ({ ...prev, ...filtersUpdate }));
  };

  return (
    <HeaderLayout>
      <div className="mb-6">
        <Tabs value={searchType} onValueChange={(v) => setSearchType(v as 'artists' | 'managers')}>
          <TabsList>
            <TabsTrigger value="artists">Artistas</TabsTrigger>
            <TabsTrigger value="managers">Managers</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      {searchType === 'artists' ? (
        <>
          <Discovery
            type="artists"
            loading={loading}
            verified={[]}
            featured={destacados}
            others={resto}
            favorites={favorites}
            showFavorites={showFavorites}
            setShowFavorites={setShowFavorites}
            onFavoriteChange={handleFavoriteArtist}
            mapToCard={mapToArtistCard}
            onSearchBar={
              <ArtistSearch
                filters={filters}
                onFiltersChange={handleArtistSearch}
              />
            }
            totalCount={pagination.total}
            sectionTitle="Encuentra artistas para tu evento"
            cardType="artist"
            pagination={pagination}
            onPageChange={(page) => setFilters((prev: any) => ({ ...prev, page }))}
            // Renderizado personalizado de la grilla de artistas
            renderGrid={(children) => (
              <>
                <div className="rounded-xl border text-card-foreground transition-all duration-300 bg-transparent shadow-lg mb-6 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      {/* Icono de corona premium */}
                      <span className="text-yellow-500 text-2xl">👑</span>
                      <span className="font-bold text-lg gradient-text">Artistas Destacados</span>
                    </div>
                    <a href="#" className="flex items-center gap-1 text-sm text-yellow-700 hover:underline">
                      Ver todos <span className="text-lg">→</span>
                    </a>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                    {destacados.slice(0, 5).map((artist) => (
                      <div className="min-w-0 w-full relative" key={artist.id}>
                        <ArtistCard
                          artist={mapToArtistCard(artist)}
                          showPrice={true}
                          onFavoriteChange={handleFavoriteArtist}
                          className="!p-1 !text-xs !h-40 !min-h-0 !max-w-[140px] border-yellow-300 hover:border-yellow-500"
                        />
                      </div>
                    ))}
                  </div>
                </div>
                {/* Sección de favoritos (mover debajo de populares) */}
                {/* ...existing code for destacados... */}
                {/* ...existing code for populares... */}
                <div className="mb-6 relative">
                  <button
                    className="flex items-center gap-2 text-lg font-semibold text-red-500 mb-2 focus:outline-none hover:underline"
                    onClick={() => setShowFavorites(!showFavorites)}
                  >
                    <span className="text-red-400 text-xl">❤️</span> Favoritos
                    {showFavorites ? (
                      <ChevronUp className="h-4 w-4 text-red-400" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-red-400" />
                    )}
                  </button>
                  {showFavorites && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                      {favorites.length > 0 ? favorites.map((artist) => (
                        <ArtistCard
                          key={artist.id}
                          artist={mapToArtistCard(artist)}
                          showPrice={true}
                          onFavoriteChange={handleFavoriteArtist}
                          className="!p-1 !text-xs !h-40 !min-h-0 !max-w-[140px] border-red-300 hover:border-red-500"
                        />
                      )) : (
                        <div className="text-muted-foreground px-4 py-8 col-span-5">No tienes favoritos.</div>
                      )}
                    </div>
                  )}
                </div>
                {/* Card visual para los primeros 5 artistas populares */}
                <div className="rounded-xl border text-card-foreground transition-all duration-300 bg-transparent shadow-lg mb-6 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      {/* Icono de estrella popular */}
                      <span className="text-amber-400 text-2xl">⭐</span>
                      <span className="font-bold text-lg">Artistas Populares</span>
                    </div>
                    <a href="#" className="flex items-center gap-1 text-sm text-amber-700 hover:underline">
                      Ver todos <span className="text-lg">→</span>
                    </a>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                    {populares.slice(0, 5).map((artist) => (
                      <div className="min-w-0 w-full relative" key={artist.id}>
                        <ArtistCard
                          artist={mapToArtistCard(artist)}
                          showPrice={true}
                          onFavoriteChange={handleFavoriteArtist}
                          className="!p-1 !text-xs !h-40 !min-h-0 !max-w-[140px] border-amber-300 hover:border-amber-500"
                        />
                      </div>
                    ))}
                  </div>
                </div>
                {/* Renderizar el resto de artistas */}
                {children}
              </>
            )}
          />
        </>
      ) : (
        <Discovery
          type="managers"
          loading={loadingManagers}
          verified={popularesManagers}
          featured={destacadosManagers}
          others={restoManagers}
          favorites={favoritesManagers}
          showFavorites={showFavoritesManagers}
          setShowFavorites={setShowFavoritesManagers}
          onFavoriteChange={handleFavoriteManager}
          mapToCard={mapToManagerCard}
          onSearchBar={
            <ManagerSearchBar
              onSearch={handleManagerSearch}
            />
          }
          totalCount={paginationManagers.total}
          sectionTitle="Encuentra managers para tu evento"
          cardType="manager"
          pagination={paginationManagers}
          onPageChange={(page) => setManagerFilters((prev: any) => ({ ...prev, page }))}
        />
      )}
    </HeaderLayout>
  );
}
