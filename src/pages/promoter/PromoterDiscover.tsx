import Discovery from "@/pages/Discovery";
import { HeaderLayout } from '@/components/layout/HeaderLayout';
import { useAuth } from "@/contexts/AuthContext";
import { useParams } from "react-router-dom";
import { useDiscoveryArtists } from "@/hooks/useDiscoveryArtists";
import { handleFavorite } from "@/lib/favorite";
import { useDiscoveryManagers } from "@/hooks/useDiscoveryManagers";
import { useState } from "react";
import { ArtistSearch } from "@/components/artists/ArtistSearch";
import { ManagerSearchBar } from "@/components/manager/ManagerSearchBar";
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function PromoterDiscover() {
  const { user } = useAuth();
  const { id } = useParams();
  if (id && user && String(user.id) !== String(id)) {
    return <div className="flex items-center justify-center min-h-[60vh]"><p className="text-destructive text-lg font-semibold">Acceso denegado</p></div>;
  }

  // Selector de tipo de búsqueda: 'artists' o 'managers'
  const [searchType, setSearchType] = useState<'artists' | 'managers'>('artists');

  // ARTISTS
  const { artists, setArtists, loading, setFilters, filters } = useDiscoveryArtists();
  const [showFavorites, setShowFavorites] = useState(false);
  const verifiedArtists = artists.filter((a) => a.verified);
  const featuredArtists = artists.filter((a) => a.featured && !a.verified);
  const othersArtists = artists.filter((a) => !a.verified && !a.featured);
  const favoritesArtists = artists.filter((a) => a.favorite);
  const handleFavoriteArtist = async (artistId: number, favorite: boolean) => {
    try {
      await handleFavorite({ targetId: artistId, favorite });
      setArtists((prevArtists: any[]) => prevArtists.map((artist) => artist.id === artistId ? { ...artist, favorite } : artist));
    } catch (e) {
      // Manejo de error opcional
    }
  };
  const mapToArtistCard = (artist: any) => ({ ...artist });
  const handleArtistSearch = (filtersUpdate: any) => {
    setFilters((prev: any) => ({ ...prev, ...filtersUpdate }));
  };

  // MANAGERS
  const { managers, setManagers, loading: loadingManagers, setFilters: setManagerFilters, filters: managerFilters } = useDiscoveryManagers();
  const [showFavoritesManagers, setShowFavoritesManagers] = useState(false);
  const verifiedManagers = managers.filter((m) => m.verified);
  const featuredManagers = managers.filter((m) => m.featured && !m.verified);
  const othersManagers = managers.filter((m) => !m.verified && !m.featured);
  const favoritesManagers = managers.filter((m) => m.favorite);
  const handleFavoriteManager = async (managerId: number, favorite: boolean) => {
    try {
      await handleFavorite({ targetId: managerId, favorite });
      setManagers((prevManagers: any[]) => prevManagers.map((manager) => manager.id === managerId ? { ...manager, favorite } : manager));
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
            <TabsTrigger value="artists">Salas</TabsTrigger>
            <TabsTrigger value="managers">Managers</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      {searchType === 'artists' ? (
        <Discovery
          type="artists"
          loading={loading}
          verified={verifiedArtists}
          featured={featuredArtists}
          others={othersArtists}
          favorites={favoritesArtists}
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
          totalCount={artists.length}
          sectionTitle="Encuentra artistas para tus eventos"
          cardType="artist"
        />
      ) : (
        <Discovery
          type="managers"
          loading={loadingManagers}
          verified={verifiedManagers}
          featured={featuredManagers}
          others={othersManagers}
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
          totalCount={managers.length}
          sectionTitle="Encuentra managers para tus eventos"
          cardType="manager"
        />
      )}
    </HeaderLayout>
  );
}
