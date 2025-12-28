// Obtener el id del artista desde user o params
import Discovery from "@/pages/Discovery";
import { useAuth } from '@/contexts/AuthContext';
import { HeaderLayout } from '@/components/layout/HeaderLayout';
import { useParams } from "react-router-dom";
import { useDiscoveryVenues } from '@/hooks/useDiscoveryVenues';
import { useDiscoveryManagers } from '@/hooks/useDiscoveryManagers';
import { useState } from 'react';
import { handleFavorite } from '@/lib/favorite';
import { ArtistSearch } from '@/components/artists/ArtistSearch';
import { ManagerCard } from '@/components/manager/ManagerCard';
import { ManagerSearchBar } from '@/components/manager/ManagerSearchBar';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useDiscoveryPromoters } from '@/hooks/useDiscoveryPromoters';
import { PromotorCard } from '@/components/promoter/PromotorCard';
import { HorizontalScrollSection } from "@/components/ui/HorizontalScrollSection";
import { VenueCard } from "@/components/venue/VenueCard";
import { Star } from "lucide-react";

export default function ArtistDiscover() {
  const { user } = useAuth();
  const { id } = useParams();
  if (id && user && String(user.id) !== String(id)) {
    return <div className="flex items-center justify-center min-h-[60vh]"><p className="text-destructive text-lg font-semibold">Acceso denegado</p></div>;
  }

  // Tabs: 'venues' o 'managers'
  const [searchType, setSearchType] = useState<'venues' | 'managers' | 'promoters'>('venues');

  // VENUES
  const {
    populares,
    destacados,
    recienLlegados,
    enCiudad,
    resto,
    pagination,
    loading,
    setFilters,
    filters,
    setPopulares,
    setDestacados,
    setRecienLlegados,
    setEnCiudad,
    setResto
  } = useDiscoveryVenues();
  const [showFavorites, setShowFavorites] = useState(false);
  const favorites = [...populares, ...destacados, ...enCiudad, ...resto].filter((v) => v.favorite);
  const handleFavoriteVenue = async (venueId: number, favorite: boolean) => {
    if (!user) return;
    try {
      await handleFavorite({ targetId: venueId, favorite });
      setResto && setResto((prevVenues: any[]) =>
        prevVenues.map((venue) =>
          venue.id === venueId ? { ...venue, favorite } : venue
        )
      );
    } catch (e) {
      // Manejo de error opcional
    }
  };



  const handleFavoritePromoter = async (promoterId: number, favorite: boolean) => {
    if (!user) return;
    try {
      await handleFavorite({ targetId: promoterId, favorite });
      setRestoPromoters && setRestoPromoters((prevPromoters: any[]) =>
        prevPromoters.map((promoter) =>
          promoter.id === promoterId ? { ...promoter, favorite } : promoter
        )
      );
    } catch (e) {
      // Manejo de error opcional
    }
  };
  const mapToVenueCard = (venue: any) => ({
    ...venue,
    id: venue.id ?? venue.user_id,
  });
  const handleVenueSearch = ({ query, city, dateRange, type }: any) => {
    setFilters({
      city: city || '',
      type: type || 'all',
      query: query || '',
      date: dateRange?.from || undefined,
    });
  };

  // MANAGERS
  const {
    populares: popularesManagers,
    destacados: destacadosManagers,
    verificados: verificadosManagers,
    resto: restoManagers,
    pagination: paginationManagers,
    loading: loadingManagers,
    setFilters: setManagerFilters,
    filters: managerFilters,
    setPopulares: setPopularesManagers,
    setDestacados: setDestacadosManagers,
    setVerificados: setVerificadosManagers,
    setResto: setRestoManagers
  } = useDiscoveryManagers();
  const favoritesManagers = [...popularesManagers, ...destacadosManagers, ...verificadosManagers, ...restoManagers].filter((m) => m.favorite);
  if (!user) return;
  const handleFavoriteManager = async (managerId: number, favorite: boolean) => {
    if (!user) return;
    try {
      await handleFavorite({ targetId: managerId, favorite });
    } catch (e) {
      // Manejo de error opcional
    }
  };

  //PROMOTERS(solo exploración)
  const {
    populares: popularesPromoters,
    destacados: destacadosPromoters,
    verificados: verificadosPromoters,
    resto: restoPromoters,
    pagination: paginationPromoters,
    loading: loadingPromoters,
    setFilters: setPromoterFilters,
    filters: promoterFilters,
    setPopulares: setPopularesPromoters,
    setDestacados: setDestacadosPromoters,
    setVerificados: setVerificadosPromoters,
    setResto: setRestoPromoters
  } = useDiscoveryPromoters();
  const favoritesPromoters = [...popularesPromoters, ...destacadosPromoters, ...verificadosPromoters, ...restoPromoters].filter((p) => p.favorite);
  const mapToPromoterCard = (promoter: any) => ({ ...promoter });
  const handlePromoterSearch = (filtersUpdate: any) => { setPromoterFilters((prev: any) => ({ ...prev, ...filtersUpdate })); };
  const mapToManagerCard = (manager: any) => ({ ...manager });
  const handleManagerSearch = (filtersUpdate: any) => { setManagerFilters((prev: any) => ({ ...prev, ...filtersUpdate })); };
  const titles = {
    venues: {
      title: 'Encuentra tu próximo escenario',
      subtitle: 'Descubre y contacta artistas disponibles',
    },
    managers: {
      title: 'Encuentra managers para tu evento',
      subtitle: 'Descubre y contacta managers disponibles',
    },
    promoters: {
      title: 'Encuentra promotores para tu evento',
      subtitle: 'Descubre y contacta promotores disponibles',
    },
  };
  return (

    <HeaderLayout>
      {/* Título y subtítulo principal */}
      <div className="mt-8 mb-4 text-center px-2">
        <h1 className="text-2xl sm:text-3xl font-display font-semibold mb-1 mx-auto max-w-xl">
          {titles[searchType].title}
        </h1>
        <p className="text-muted-foreground mb-2">
          {titles[searchType].subtitle}
        </p>
      </div>

        <Tabs value={searchType} onValueChange={(v) => setSearchType(v as 'venues' | 'managers' | 'promoters')}>
          <TabsList>
            <TabsTrigger value="venues">Salas</TabsTrigger>
            <TabsTrigger value="managers">Managers</TabsTrigger>
            <TabsTrigger value="promoters">Promotores</TabsTrigger>
          </TabsList>
        </Tabs>
      
      {searchType === 'promoters' && (
        <>
          <div className="mb-4 p-4 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 rounded">
            <strong>Nota:</strong> Los promotores organizan eventos y seleccionan a los artistas que desean contratar. Mantén tu perfil actualizado y profesional para aumentar tus oportunidades de ser descubierto.
          </div>
          <Discovery
            type="promoters"
            loading={loadingPromoters}
            verified={verificadosPromoters}
            featured={destacadosPromoters}
            others={restoPromoters}
            favorites={favoritesPromoters}
            showFavorites={showFavorites}
            setShowFavorites={setShowFavorites}
            onFavoriteChange={handleFavoritePromoter}
            onSearchBar={
              <ArtistSearch
                filters={promoterFilters}
                onFiltersChange={handlePromoterSearch}
                filterConfig={[]}
                type="promoters"
              />
            }
            mapToCard={mapToPromoterCard}
            totalCount={paginationPromoters.total}
            sectionTitle="Explora promotores de eventos"
            cardType="promoter"
            pagination={paginationPromoters}
            onPageChange={(page) => setPromoterFilters((prev: any) => ({ ...prev, page }))}
            renderGrid={(children) => (
              <>
                {verificadosPromoters && verificadosPromoters.length > 0 && (
                  <HorizontalScrollSection
                    title={<span className="text-lg font-semibold text-black dark:text-white">Promotores verificados</span>}
                    items={verificadosPromoters}
                    containerId="verificadosPromoters-scroll"
                    onScrollRight={() => {
                      const el = document.getElementById('verificadosPromoters-scroll');
                      if (el) {
                        el.scrollBy({ left: 220, behavior: 'smooth' });
                      }
                    }}
                    onScrollLeft={() => {
                      const el = document.getElementById('verificadosPromoters-scroll');
                      if (el) {
                        el.scrollBy({ left: -220, behavior: 'smooth' });
                      }
                    }}
                    renderItem={(promoter) => <PromotorCard promoter={mapToPromoterCard(promoter)} />}
                  />
                )}
                {destacadosPromoters && destacadosPromoters.length > 0 && (
                  <HorizontalScrollSection
                    title={<span className="text-lg font-semibold text-black dark:text-white">Promotores Destacados</span>}
                    items={destacadosPromoters}
                    containerId="destacadosPromoters-scroll"
                    onScrollRight={() => {
                      const el = document.getElementById('destacadosPromoters-scroll');
                      if (el) {
                        el.scrollBy({ left: 220, behavior: 'smooth' });
                      }
                    }}
                    onScrollLeft={() => {
                      const el = document.getElementById('destacadosPromoters-scroll');
                      if (el) {
                        el.scrollBy({ left: -220, behavior: 'smooth' });
                      }
                    }}
                    renderItem={(promoter) => <PromotorCard promoter={mapToPromoterCard(promoter)} />}
                  />
                )}
                {popularesPromoters && popularesPromoters.length > 0 && (
                  <HorizontalScrollSection
                    title={<span className="text-lg font-semibold text-black dark:text-white">Promotores Populares</span>}
                    items={popularesPromoters}
                    containerId="popularesPromoters-scroll"
                    onScrollRight={() => {
                      const el = document.getElementById('popularesPromoters-scroll');
                      if (el) {
                        el.scrollBy({ left: 220, behavior: 'smooth' });
                      }
                    }}
                    onScrollLeft={() => {
                      const el = document.getElementById('popularesPromoters-scroll');
                      if (el) {
                        el.scrollBy({ left: -220, behavior: 'smooth' });
                      }
                    }}
                    renderItem={(promoter) => <PromotorCard promoter={mapToPromoterCard(promoter)} />}
                  />
                )}
                {children}
              </>
            )}
          />
        </>
      )}
      {searchType === 'venues' && (
        <>
          <Discovery
            type="venues"
            loading={loading}
            verified={[]}
            featured={destacados}
            others={resto}
            favorites={favorites}
            showFavorites={showFavorites}
            setShowFavorites={setShowFavorites}
            mapToCard={mapToVenueCard}
            onFavoriteChange={handleFavoriteVenue}
            onSearchBar={
              <ArtistSearch
                filters={filters}
                onFiltersChange={handleVenueSearch}
                filterConfig={[]}
                type="venues"
              />
            }
            totalCount={pagination.total}
            sectionTitle="Encuentra tu próximo escenario"
            cardType="venue"
            pagination={pagination}
            onPageChange={(page) => setFilters((prev: any) => ({ ...prev, page }))}
            renderGrid={(children) => (
              <>
                {/* Mostrar solo resto si hay filtros activos */}
                {(filters.city || filters.type !== 'all' || filters.query || filters.date) ? (
                  <div className="mb-6">
                    <h2 className="text-lg font-semibold text-muted-foreground mb-2">Resultados</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                      {resto.map((venue) => (
                        <VenueCard key={venue.id} venue={mapToVenueCard(venue)} />
                      ))}
                    </div>
                  </div>
                ) : (
                  <>
                    {destacados && destacados.length > 0 && (
                      <HorizontalScrollSection
                        title={<span className="text-lg font-semibold text-black">Salas Destacadas</span>}
                        items={destacados}
                        containerId="destacados-scroll"
                        onScrollRight={() => {
                          const el = document.getElementById('destacados-scroll');
                          if (el) {
                            el.scrollBy({ left: 220, behavior: 'smooth' });
                          }
                        }}
                        onScrollLeft={() => {
                          const el = document.getElementById('destacados-scroll');
                          if (el) {
                            el.scrollBy({ left: -220, behavior: 'smooth' });
                          }
                        }}
                        renderItem={(venue) => <VenueCard venue={mapToVenueCard(venue)} />}
                      />
                    )}
                    {populares && populares.length > 0 && (
                      <HorizontalScrollSection
                        title={<span className="text-lg font-semibold text-black dark:text-white">Salas Populares</span>}
                        items={populares}
                        containerId="populares-scroll"
                        onScrollRight={() => {
                          const el = document.getElementById('populares-scroll');
                          if (el) {
                            el.scrollBy({ left: 220, behavior: 'smooth' });
                          }
                        }}
                        onScrollLeft={() => {
                          const el = document.getElementById('populares-scroll');
                          if (el) {
                            el.scrollBy({ left: -220, behavior: 'smooth' });
                          }
                        }}
                        renderItem={(venue) => <VenueCard venue={mapToVenueCard(venue)} />}
                      />
                    )}
                    {enCiudad && enCiudad.length > 0 && (
                      <HorizontalScrollSection
                        title={<span className="text-lg font-semibold text-black dark:text-white">En tu ciudad</span>}
                        items={enCiudad}
                        containerId="enCiudad-scroll"
                        onScrollRight={() => {
                          const el = document.getElementById('enCiudad-scroll');
                          if (el) {
                            el.scrollBy({ left: 220, behavior: 'smooth' });
                          }
                        }}
                        onScrollLeft={() => {
                          const el = document.getElementById('enCiudad-scroll');
                          if (el) {
                            el.scrollBy({ left: -220, behavior: 'smooth' });
                          }
                        }}
                        renderItem={(venue) => <VenueCard venue={mapToVenueCard(venue)} />}
                      />
                    )}
                    {recienLlegados && recienLlegados.length > 0 && (
                      <HorizontalScrollSection
                        title={<span className="text-lg font-semibold text-black dark:text-white">Recién llegados</span>}
                        items={recienLlegados}
                        containerId="recienLlegados-scroll"
                        onScrollRight={() => {
                          const el = document.getElementById('recienLlegados-scroll');
                          if (el) {
                            el.scrollBy({ left: 220, behavior: 'smooth' });
                          }
                        }}
                        onScrollLeft={() => {
                          const el = document.getElementById('recienLlegados-scroll');
                          if (el) {
                            el.scrollBy({ left: -220, behavior: 'smooth' });
                          }
                        }}
                        renderItem={(venue) => <VenueCard venue={mapToVenueCard(venue)} />}
                      />
                    )}
                    {children}
                  </>
                )}
              </>
            )}
          />
        </>
      )}
      {searchType === 'managers' && (
        <Discovery
          type="managers"
          loading={loadingManagers}
          verified={verificadosManagers}
          featured={destacadosManagers}
          others={restoManagers}
          favorites={favoritesManagers}
          showFavorites={showFavorites}
          setShowFavorites={setShowFavorites}
          onFavoriteChange={handleFavoriteManager}
          mapToCard={mapToManagerCard}
          onSearchBar={
            <ArtistSearch
              filters={managerFilters}
              onFiltersChange={handleManagerSearch}
              filterConfig={[]}
              type="managers"
            />
          }
          totalCount={paginationManagers.total}
          sectionTitle="Descubre managers para tu carrera"
          cardType="manager"
          pagination={paginationManagers}
          onPageChange={(page) => setManagerFilters((prev: any) => ({ ...prev, page }))}
          renderGrid={(children) => (
            <>
              {verificadosManagers && verificadosManagers.length > 0 && (
                <HorizontalScrollSection
                  title={<span className="text-lg font-semibold text-black dark:text-white">Managers verificados</span>}
                  items={verificadosManagers}
                  containerId="verificadosManagers-scroll"
                  onScrollRight={() => {
                    const el = document.getElementById('verificadosManagers-scroll');
                    if (el) {
                      el.scrollBy({ left: 220, behavior: 'smooth' });
                    }
                  }}
                  onScrollLeft={() => {
                    const el = document.getElementById('verificadosManagers-scroll');
                    if (el) {
                      el.scrollBy({ left: -220, behavior: 'smooth' });
                    }
                  }}
                  renderItem={(manager) => <ManagerCard manager={mapToManagerCard(manager)} />}
                />
              )}
              {destacadosManagers && destacadosManagers.length > 0 && (
                <HorizontalScrollSection
                  title={<span className="text-lg font-semibold text-black dark:text-white">Managers Destacados</span>}
                  items={destacadosManagers}
                  containerId="destacadosManagers-scroll"
                  onScrollRight={() => {
                    const el = document.getElementById('destacadosManagers-scroll');
                    if (el) {
                      el.scrollBy({ left: 220, behavior: 'smooth' });
                    }
                  }}
                  onScrollLeft={() => {
                    const el = document.getElementById('destacadosManagers-scroll');
                    if (el) {
                      el.scrollBy({ left: -220, behavior: 'smooth' });
                    }
                  }}
                  renderItem={(manager) => <ManagerCard manager={mapToManagerCard(manager)} />}
                />
              )}
              {popularesManagers && popularesManagers.length > 0 && (
                <HorizontalScrollSection
                  title={<span className="text-lg font-semibold text-black dark:text-white">Managers Populares</span>}
                  items={popularesManagers}
                  containerId="popularesManagers-scroll"
                  onScrollRight={() => {
                    const el = document.getElementById('popularesManagers-scroll');
                    if (el) {
                      el.scrollBy({ left: 220, behavior: 'smooth' });
                    }
                  }}
                  onScrollLeft={() => {
                    const el = document.getElementById('popularesManagers-scroll');
                    if (el) {
                      el.scrollBy({ left: -220, behavior: 'smooth' });
                    }
                  }}
                  renderItem={(manager) => <ManagerCard manager={mapToManagerCard(manager)} />}
                />
              )}
              {children}
            </>
          )}
        />
      )}
    </HeaderLayout>
  );
}