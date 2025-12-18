// Obtener el id del artista desde user o params
import Discovery from "@/pages/Discovery";
import { useAuth } from '@/contexts/AuthContext';
import { HeaderLayout } from '@/components/layout/HeaderLayout';
import { useParams } from "react-router-dom";
import { useDiscoveryVenues } from '@/hooks/useDiscoveryVenues';
import { useDiscoveryManagers } from '@/hooks/useDiscoveryManagers';
import { useState } from 'react';
import { VenueSearchBar } from '@/components/ui/VenueSearchBar';
import { ManagerCard } from '@/components/manager/ManagerCard';
import { ManagerSearchBar } from '@/components/manager/ManagerSearchBar';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useDiscoveryPromoters } from '@/hooks/useDiscoveryPromoters';
import { PromotorCard } from '@/components/promoter/PromotorCard';

export default function ArtistDiscover() {
  const { user } = useAuth();
  const { id } = useParams();
  if (id && user && String(user.id) !== String(id)) {
    return <div className="flex items-center justify-center min-h-[60vh]"><p className="text-destructive text-lg font-semibold">Acceso denegado</p></div>;
  }

  // Tabs: 'venues' o 'managers'
  const [searchType, setSearchType] = useState<'venues' | 'managers' | 'promoters'>('venues');

  // VENUES
  const { venues, setVenues, loading, setFilters, filters } = useDiscoveryVenues();
  const [showFavorites, setShowFavorites] = useState(false);
  const verified = venues.filter((v) => v.verified);
  const featured = venues.filter((v) => v.featured && !v.verified);
  const others = venues.filter((v) => !v.verified && !v.featured);
  const favorites = venues.filter((v) => v.favorite);
  const handleFavoriteVenue = (venueId: number, favorite: boolean) => {
    setVenues((prevVenues: any[]) =>
      prevVenues.map((venue) =>
        venue.id === venueId ? { ...venue, favorite } : venue
      )
    );
  };

 

  const handleFavoritePromoter = (promoterId: number, favorite: boolean) => {
    setPromoters && setPromoters((prevPromoters: any[]) => {
      // If removing from favorites, filter out from favorites and update global
      if (!favorite) {
        return prevPromoters.map((promoter) =>
          promoter.id === promoterId ? { ...promoter, favorite: false } : promoter
        );
      }
      // If adding to favorites, just update the favorite flag
      return prevPromoters.map((promoter) =>
        promoter.id === promoterId ? { ...promoter, favorite: true } : promoter
      );
    });
  };
  const mapToVenueCard = (venue: any) => ({ ...venue });
  const handleVenueSearch = ({ query, city, dateRange, type }: any) => {
    setFilters({
      city: city || '',
      type: type || 'all',
      query: query || '',
      date: dateRange?.from || undefined,
    });
  };

  // MANAGERS
  const { managers, setManagers, loading: loadingManagers, setFilters: setManagerFilters, filters: managerFilters } = useDiscoveryManagers();
  const verifiedManagers = managers.filter((m: any) => m.verified);
  const featuredManagers = managers.filter((m: any) => m.featured && !m.verified);
  const othersManagers = managers.filter((m: any) => !m.verified && !m.featured);
  const favoritesManagers = managers.filter((m: any) => m.favorite);
   const handleFavoriteManager = (managerId: number, favorite: boolean) => {
    setManagers && setManagers((prevManagers: any[]) =>
      prevManagers.map((manager) =>
        manager.id === managerId ? { ...manager, favorite } : manager
      )
    );
  };

  //PROMOTERS(solo exploración)
  const { promoters, setPromoters, loading: loadingPromoters, setFilters: setPromoterFilters, filters: promoterFilters } = useDiscoveryPromoters();
  const verifiedPromoters = promoters.filter((p: any) => p.verified);
  const featuredPromoters = promoters.filter((p: any) => p.featured && !p.verified);
  const othersPromoters = promoters.filter((p: any) => !p.verified && !p.featured);
  const favoritesPromoters = promoters.filter((p: any) => p.favorite);
  const mapToPromoterCard = (promoter: any) => ({ ...promoter });
  const handlePromoterSearch = (filtersUpdate: any) => { setPromoterFilters((prev: any) => ({ ...prev, ...filtersUpdate })); };
  const mapToManagerCard = (manager: any) => ({ ...manager });
  const handleManagerSearch = (filtersUpdate: any) => { setManagerFilters((prev: any) => ({ ...prev, ...filtersUpdate })); };

  return (
    <HeaderLayout>
      <div className="mb-6">
        <Tabs value={searchType} onValueChange={(v) => setSearchType(v as 'venues' | 'managers' | 'promoters')}>
          <TabsList>
            <TabsTrigger value="venues">Locales</TabsTrigger>
            <TabsTrigger value="managers">Managers</TabsTrigger>
            <TabsTrigger value="promoters">Promotores</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      {searchType === 'promoters' && (
        <>
          <div className="mb-4 p-4 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 rounded">
            <strong>Nota:</strong> Los promotores organizan eventos y seleccionan a los artistas que desean contratar. Mantén tu perfil actualizado y profesional para aumentar tus oportunidades de ser descubierto.
          </div>
          <Discovery
            type="promoters"
            loading={loadingPromoters}
            verified={verifiedPromoters}
            featured={featuredPromoters}
            others={othersPromoters}
            favorites={favoritesPromoters}
            showFavorites={showFavorites}
            setShowFavorites={setShowFavorites}
            onFavoriteChange={handleFavoritePromoter}
            mapToCard={mapToPromoterCard}
            // Puedes agregar un PromoterSearchBar aquí si lo deseas
            totalCount={promoters.length}
            sectionTitle="Explora promotores de eventos"
            cardType="promoter"
          />
        </>
      )}
      {searchType === 'venues' && (
        <Discovery
          type="venues"
          loading={loading}
          verified={verified}
          featured={featured}
          others={others}
          favorites={favorites}
          showFavorites={showFavorites}
          setShowFavorites={setShowFavorites}
          mapToCard={mapToVenueCard}
          onFavoriteChange={handleFavoriteVenue}
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
      )}
      {searchType === 'managers' && (
        <Discovery
          type="managers"
          loading={loadingManagers}
          verified={verifiedManagers}
          featured={featuredManagers}
          others={othersManagers}
          favorites={favoritesManagers}
          showFavorites={showFavorites}
          setShowFavorites={setShowFavorites}
          onFavoriteChange={handleFavoriteManager}
          mapToCard={mapToManagerCard}
          onSearchBar={
            <ManagerSearchBar onSearch={handleManagerSearch} />
          }
          totalCount={managers.length}
          sectionTitle="Descubre managers para tu carrera"
          cardType="manager"
        />
      )}
    </HeaderLayout>
  );
}