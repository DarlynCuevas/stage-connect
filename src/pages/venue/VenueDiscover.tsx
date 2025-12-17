
import Discovery from "@/pages/Discovery";
import { useAuth } from '@/contexts/AuthContext';
import { HeaderLayout } from '@/components/layout/HeaderLayout';
import { useParams } from 'react-router-dom';
import { useDiscoveryArtists } from '@/hooks/useDiscoveryArtists';
import { useState } from 'react';
import { ArtistSearch } from '@/components/artists/ArtistSearch';

export default function VenueDiscover() {
  const { user } = useAuth();
  const { id } = useParams();
  if (id && user && String(user.id) !== String(id)) {
    return <div className="flex items-center justify-center min-h-[60vh]"><p className="text-destructive text-lg font-semibold">Acceso denegado</p></div>;
  }
  // Lógica de búsqueda de artistas
  const { artists, loading, setFilters, filters } = useDiscoveryArtists();
  const [showFavorites, setShowFavorites] = useState(false);

  // Filtro por nickName si hay búsqueda
  const searchQuery = (filters.query || '').toLowerCase();
  const filteredArtists = searchQuery
    ? artists.filter((a) =>
        (a.nickName || a.name || '').toLowerCase().includes(searchQuery)
      )
    : artists;

  // Separar artistas en verificados, destacados, otros y favoritos
  const verified = filteredArtists.filter((a) => a.verified);
  const featured = filteredArtists.filter((a) => a.featured && !a.verified);
  const others = filteredArtists.filter((a) => !a.verified && !a.featured);
  const favorites = filteredArtists.filter((a) => a.favorite);

  // Handler para favoritos (puedes expandir lógica si lo necesitas)
  const handleFavoriteChange = (artistId: number, favorite: boolean) => {
    // Aquí puedes actualizar el estado local o hacer una petición
  };

  // Mapear artista a ArtistCard (puedes expandir si necesitas props extra)
  const mapToArtistCard = (artist: any) => ({ ...artist, venueId: user?.id });

  // Handler para el search bar
  const handleArtistSearch = (filtersUpdate: any) => {
    setFilters((prev) => ({ ...prev, ...filtersUpdate }));
  };

  return (
    <HeaderLayout>
      <Discovery
        type="artists"
        loading={loading}
        verified={verified}
        featured={featured}
        others={others}
        favorites={favorites}
        showFavorites={showFavorites}
        setShowFavorites={setShowFavorites}
        onFavoriteChange={handleFavoriteChange}
        mapToCard={mapToArtistCard}
        onSearchBar={
          <ArtistSearch
            filters={filters}
            onFiltersChange={handleArtistSearch}
          />
        }
        totalCount={artists.length}
        sectionTitle="Encuentra artistas para tu evento"
        cardType="artist"
      />
    </HeaderLayout>
  );
}
