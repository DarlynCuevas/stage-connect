  // Obtener el id del artista desde user o params
import Discovery from "@/pages/Discovery";
import { useAuth } from '@/contexts/AuthContext';
import { HeaderLayout } from '@/components/layout/HeaderLayout';
import { useParams } from "react-router-dom";
import { useDiscoveryVenues } from '@/hooks/useDiscoveryVenues';
import { useState } from 'react';
import { VenueSearchBar } from '@/components/ui/VenueSearchBar';

export default function ArtistDiscover() {
  const { user } = useAuth();
  const { id } = useParams();
  if (id && user && String(user.id) !== String(id)) {
    return <div className="flex items-center justify-center min-h-[60vh]"><p className="text-destructive text-lg font-semibold">Acceso denegado</p></div>;
  }

  // Lógica de búsqueda de venues
  const { venues, loading, setFilters, filters } = useDiscoveryVenues();
  const [showFavorites, setShowFavorites] = useState(false);

  // Separar venues en verificados, destacados, otros y favoritos
  const verified = venues.filter((v) => v.verified);
  const featured = venues.filter((v) => v.featured && !v.verified);
  const others = venues.filter((v) => !v.verified && !v.featured);
  const favorites = venues.filter((v) => v.favorite);

  // Handler para favoritos (puedes expandir lógica si lo necesitas)
  const handleFavoriteChange = (venueId: number, favorite: boolean) => {
    // Aquí puedes actualizar el estado local o hacer una petición
  };

  // Mapear venue a VenueCard (puedes expandir si necesitas props extra)
    const mapToVenueCard = (venue: any) => ({ ...venue });

  // Handler para el search bar
  const handleVenueSearch = ({ query, city, dateRange, type }: any) => {
    setFilters({
      city: city || '',
      type: type || 'all',
      query: query || '',
      date: dateRange?.from || undefined,
    });
  };

  return (
    <HeaderLayout>
      <Discovery
        type="venues"
        loading={loading}
        verified={verified}
        featured={featured}
        others={others}
        favorites={favorites}
        showFavorites={showFavorites}
        setShowFavorites={setShowFavorites}
        onFavoriteChange={handleFavoriteChange}
        mapToCard={mapToVenueCard}
        onSearchBar={
          <VenueSearchBar
            onSearch={handleVenueSearch}
            initialCity={filters.city || ''}
            initialType={filters.type}
          />
        }
        totalCount={venues.length}
        sectionTitle="Encuentra tu próximo escenario"
        cardType="venue"
      />
    </HeaderLayout>
  );
}