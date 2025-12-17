import Discovery from "@/pages/Discovery";
import { HeaderLayout } from '@/components/layout/HeaderLayout';
import { useAuth } from "@/contexts/AuthContext";
import { useParams } from "react-router-dom";
import { useDiscoveryVenues } from "@/hooks/useDiscoveryVenues";
import { useDiscoveryPromoters } from "@/hooks/useDiscoveryPromoters";
import { useDiscoveryArtists } from "@/hooks/useDiscoveryArtists";
import { useState } from "react";
import { VenueSearchBar } from "@/components/ui/VenueSearchBar";
import { PromotorCard } from '@/components/promoter/PromotorCard';
import { ArtistCard } from '@/components/artists/ArtistCard';
import { ArtistSearch } from '@/components/artists/ArtistSearch';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import { useAuth } from '@/contexts/AuthContext';
// import { useParams } from 'react-router-dom';
// import { useDiscoveryManagers } from '@/hooks/useDiscoveryManagers';
// import { useState } from 'react';
// import { ManagerSearch } from '@/components/manager/ManagerSearch';

export default function ManagerDiscover() {
  const { user } = useAuth();
  const { id } = useParams();
  if (id && user && String(user.id) !== String(id)) {
    return <div className="flex items-center justify-center min-h-[60vh]"><p className="text-destructive text-lg font-semibold">Acceso denegado</p></div>;
  }

  // Selector de tipo de búsqueda: 'venues' o 'promoters'
  const [searchType, setSearchType] = useState<'venues' | 'promoters' | 'artists'>('venues');
  // ARTISTS
  const { artists, loading: loadingArtists, setFilters: setArtistFilters, filters: artistFilters } = useDiscoveryArtists();
  const verifiedArtists = artists.filter((a: any) => a.verified);
  const featuredArtists = artists.filter((a: any) => a.featured && !a.verified);
  const othersArtists = artists.filter((a: any) => !a.verified && !a.featured);
  const favoritesArtists = artists.filter((a: any) => a.favorite);
  const handleFavoriteArtist = (artistId: number, favorite: boolean) => {
    // Actualizar favoritos de artistas
  };
  const mapToArtistCard = (artist: any) => ({ ...artist });
  const handleArtistSearch = (filtersUpdate: any) => { setArtistFilters((prev: any) => ({ ...prev, ...filtersUpdate })); };

  // VENUES
  const { venues, loading, setFilters, filters } = useDiscoveryVenues();
  const [showFavorites, setShowFavorites] = useState(false);
  const verifiedVenues = venues.filter((v) => v.verified);
  const featuredVenues = venues.filter((v) => v.featured && !v.verified);
  const othersVenues = venues.filter((v) => !v.verified && !v.featured);
  const favoritesVenues = venues.filter((v) => v.favorite);
  const handleFavoriteVenue = (venueId: number, favorite: boolean) => {
    // Actualizar favoritos de venues
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

  // PROMOTERS
  const { promoters, loading: loadingPromoters, setFilters: setPromoterFilters, filters: promoterFilters } = useDiscoveryPromoters();
  const verifiedPromoters = promoters.filter((p: any) => p.verified);
  const featuredPromoters = promoters.filter((p: any) => p.featured && !p.verified);
  const othersPromoters = promoters.filter((p: any) => !p.verified && !p.featured);
  const favoritesPromoters = promoters.filter((p: any) => p.favorite);
  const handleFavoritePromoter = (promoterId: string, favorite: boolean) => {
    // Actualizar favoritos de promotores
  };
  const mapToPromoterCard = (promoter: any) => ({ ...promoter });
  const handlePromoterSearch = (filtersUpdate: any) => { setPromoterFilters((prev: any) => ({ ...prev, ...filtersUpdate })); };

  return (
    <HeaderLayout>
      <div className="mb-6">
        <Tabs value={searchType} onValueChange={(v) => setSearchType(v as 'venues' | 'promoters' | 'artists')}>
          <TabsList>
            <TabsTrigger value="venues">Locales</TabsTrigger>
            <TabsTrigger value="promoters">Promotores</TabsTrigger>
            <TabsTrigger value="artists">Artistas</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      {searchType === 'venues' && (
        <Discovery
          type="venues"
          loading={loading}
          verified={verifiedVenues}
          featured={featuredVenues}
          others={othersVenues}
          favorites={favoritesVenues}
          showFavorites={showFavorites}
          setShowFavorites={setShowFavorites}
          onFavoriteChange={handleFavoriteVenue}
          mapToCard={mapToVenueCard}
          onSearchBar={
            <VenueSearchBar
              onSearch={handleVenueSearch}
              initialCity={filters.city || ''}
              initialType={filters.type}
            />
          }
          totalCount={venues.length}
          sectionTitle="Encuentra escenario para tus artistas"
          cardType="venue"
        />
      )}
      {searchType === 'promoters' && (
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
          // Puedes agregar un PromoterSearchBar aquí si lo creas
          totalCount={promoters.length}
          sectionTitle="Encuentra promotores para tus artistas"
          cardType="promoter"
        />
      )}
      {searchType === 'artists' && (
        <Discovery
          type="artists"
          loading={loadingArtists}
          verified={verifiedArtists}
          featured={featuredArtists}
          others={othersArtists}
          favorites={favoritesArtists}
          showFavorites={showFavorites}
          setShowFavorites={setShowFavorites}
          onFavoriteChange={handleFavoriteArtist}
          mapToCard={mapToArtistCard}
          onSearchBar={
            <ArtistSearch filters={artistFilters} onFiltersChange={handleArtistSearch} />
          }
          totalCount={artists.length}
          sectionTitle="Descubre artistas para tu roster"
          cardType="artist"
        />
      )}
    </HeaderLayout>
  );
}