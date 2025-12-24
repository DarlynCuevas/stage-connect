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
import { ManagerCard } from '@/components/manager/ManagerCard';
import { ChevronDown, ChevronUp, Star, Users, MapPin, Trophy, BadgeCheck } from "lucide-react";
import { Sparkles } from "lucide-react";
import { artistFilterConfig, managerFilterConfig } from "@/data/filterConfigs";
import "./venueDiscoverScroll.css";
import { HorizontalScrollSection } from '@/components/ui/HorizontalScrollSection';

export default function VenueDiscover() {
  const { user } = useAuth();
  const { id } = useParams();
  if (id && user && String(user.id) !== String(id)) {
    return <div className="flex items-center justify-center min-h-[60vh]"><p className="text-destructive text-lg font-semibold">Acceso denegado</p></div>;
  }

  // Selector de tipo de búsqueda: 'artists' o 'managers'
  const [searchType, setSearchType] = useState<'artists' | 'managers'>('artists');
  const handleTabChange = (value: string) => {
    if (value === 'artists' || value === 'managers') setSearchType(value);
  };

  // ARTISTS
  const { populares, destacados, enCiudad, recienLlegados, masContratados, resto, pagination, loading, setFilters, filters, setPopulares, setDestacados, setEnCiudad, setResto, setRecienLlegados, setMasContratados } = useDiscoveryArtists();
  const [showFavorites, setShowFavorites] = useState(false);
  const [favorites, setFavorites] = useState<any[]>([]);
  const handleFavoriteArtist = async (artistId: number, favorite: boolean) => {
    if (!user) return;
    try {
      setPopulares((prev) => prev.map((artist) => (artist.id === artistId ? { ...artist, favorite } : artist)));
      setDestacados((prev) => prev.map((artist) => (artist.id === artistId ? { ...artist, favorite } : artist)));
      setResto((prev) => prev.map((artist) => (artist.id === artistId ? { ...artist, favorite } : artist)));
      setFavorites((prevFavs) => {
        if (favorite) {
          // Buscar el artista actualizado en los arrays actuales
          const allArtists = [...populares, ...destacados, ...resto];
          let artist = allArtists.find((a) => a.id === artistId);
          if (!artist) return prevFavs;
          artist = { ...artist, favorite: true };
          if (!prevFavs.some((a) => a.id === artistId)) {
            return [...prevFavs, artist];
          }
          return prevFavs.map((a) => a.id === artistId ? artist : a);
        } else {
          return prevFavs.filter((a) => a.id !== artistId);
        }
      });
    } catch (e) {
      // Manejo de error opcional
    }
  };
  // Asegura que el campo avatar esté correctamente mapeado
  const mapToArtistCard = (artist: any) => {
    let avatar = artist.avatar;
    if (!avatar && artist.user && artist.user.avatar) {
      avatar = artist.user.avatar;
    }
    return { ...artist, avatar, venueId: user?.id };
  };
    const handleArtistSearch = (filtersUpdate: any) => {
      setFilters((prev: any) => ({ ...prev, ...filtersUpdate }));
    };

    // MANAGERS
    const { populares: popularesManagers, destacados: destacadosManagers, verificados: verificadosManagers, resto: restoManagers, pagination: paginationManagers, loading: loadingManagers, setFilters: setManagerFilters, filters: managerFilters, setPopulares: setPopularesManagers, setDestacados: setDestacadosManagers, setVerificados: setVerificadosManagers, setResto: setRestoManagers } = useDiscoveryManagers();
    const [showFavoritesManagers, setShowFavoritesManagers] = useState(false);
    const [favoritesManagers, setFavoritesManagers] = useState<any[]>([]);
    const handleFavoriteManager = (managerId: string, favorite: boolean) => {
      if (!user) return;
      setPopularesManagers((prev) => prev.map((manager) => String(manager.id) === String(managerId) ? { ...manager, favorite } : manager));
      setDestacadosManagers((prev) => prev.map((manager) => String(manager.id) === String(managerId) ? { ...manager, favorite } : manager));
      setRestoManagers((prev) => prev.map((manager) => String(manager.id) === String(managerId) ? { ...manager, favorite } : manager));
      setFavoritesManagers((prevFavs) => {
        // Usar los arrays actualizados para reflejar el estado real
        let updatedManagers = prevFavs;
        if (favorite) {
          // Buscar el manager actualizado en los arrays actuales
          const allManagers = [...popularesManagers, ...destacadosManagers, ...restoManagers];
          let manager = allManagers.find((m) => String(m.id) === String(managerId));
          if (!manager) return prevFavs;
          manager = { ...manager, favorite: true };
          if (!prevFavs.some((m) => String(m.id) === String(managerId))) {
            updatedManagers = [...prevFavs, manager];
          } else {
            updatedManagers = prevFavs.map((m) => String(m.id) === String(managerId) ? manager : m);
          }
        } else {
          // Eliminar de favoritos visualmente
          updatedManagers = prevFavs.filter((m) => String(m.id) !== String(managerId));
        }
        return updatedManagers;
      });
    };
    const mapToManagerCard = (manager: any) => ({ ...manager });
    const handleManagerSearch = (filtersUpdate: any) => {
      setManagerFilters((prev: any) => ({ ...prev, ...filtersUpdate }));
    };

    return (
      <HeaderLayout>
        {/* Título y subtítulo principal */}
        <div className="mt-8 mb-4 text-center px-2">
          <h1 className="text-2xl sm:text-3xl font-display font-semibold mb-1 mx-auto max-w-xl">
            {searchType === 'artists' ? 'Encuentra artistas para tu evento' : 'Encuentra managers para tu evento'}
          </h1>
          <p className="text-muted-foreground mb-2">
            {searchType === 'artists'
              ? 'Descubre y contacta artistas disponibles'
              : 'Descubre y contacta managers disponibles'}
          </p>
        </div>
        <Tabs value={searchType} onValueChange={handleTabChange} className="mb-6">
          <TabsList>
            <TabsTrigger value="artists">Artistas</TabsTrigger>
            <TabsTrigger value="managers">Managers</TabsTrigger>
          </TabsList>
        </Tabs>
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
                  filterConfig={artistFilterConfig}
                  type ='artists'
                />
              }
              totalCount={pagination.total}
              sectionTitle="Encuentra artistas para tu evento"
              cardType="artist"
              pagination={pagination}
              onPageChange={(page) => setFilters((prev: any) => ({ ...prev, page }))}
              renderGrid={(children) => (
                <>
                  {destacados && destacados.length > 0 && (
                    <HorizontalScrollSection                              
                      title={<span className="text-lg font-semibold text-gray-800 dark:text-white">Artistas Destacados</span>}
                      items={destacados}
                      containerId="destacados-scroll"
                      onScrollRight={() => {
                        const el = document.getElementById('destacados-scroll');
                        if (el) {
                          console.log('Scrolling destacados-scroll');
                          el.scrollBy({ left: 220, behavior: 'smooth' });
                        } else {
                          console.error('Element with id destacados-scroll not found');
                        }
                      }}
                      onScrollLeft={() => {
                        const el = document.getElementById('destacados-scroll');
                        if (el) {
                          console.log('Scrolling destacados-scroll left');
                          el.scrollBy({ left: -220, behavior: 'smooth' });
                        } else {
                          console.error('Element with id destacados-scroll not found');
                        }
                      }}
                      renderItem={(artist) => <ArtistCard artist={mapToArtistCard(artist)} showPrice={true} />}
                    />
                  )}
                  {populares && populares.length > 0 && (
                    <HorizontalScrollSection
                      title={<span className="text-lg font-semibold text-gray-800 dark:text-white">Artistas Populares</span>}
                      items={populares.slice(0, 5)}
                      containerId="populares-scroll"
                      onScrollRight={() => {
                        const el = document.getElementById('populares-scroll');
                        if (el) {
                          console.log('Scrolling populares-scroll');
                          el.scrollBy({ left: 220, behavior: 'smooth' });
                        } else {
                          console.error('Element with id populares-scroll not found');
                        }
                      }}
                      onScrollLeft={() => {
                        const el = document.getElementById('populares-scroll');
                        if (el) {
                          console.log('Scrolling populares-scroll left');
                          el.scrollBy({ left: -220, behavior: 'smooth' });
                        } else {
                          console.error('Element with id populares-scroll not found');
                        }
                      }}
                      renderItem={(artist) => <ArtistCard artist={mapToArtistCard(artist)} showPrice={true} />}
                    />
                  )}
                  {enCiudad && enCiudad.length > 0 && (
                    <HorizontalScrollSection
                      title={<span className="text-lg font-semibold text-gray-800 dark:text-white">En tu ciudad</span>}
                      items={enCiudad.slice(0, 5)}
                      containerId="enCiudad-scroll"
                      onScrollRight={() => {
                        const el = document.getElementById('enCiudad-scroll');
                        if (el) {
                          console.log('Scrolling enCiudad-scroll');
                          el.scrollBy({ left: 220, behavior: 'smooth' });
                        } else {
                          console.error('Element with id enCiudad-scroll not found');
                        }
                      }}
                      onScrollLeft={() => {
                        const el = document.getElementById('enCiudad-scroll');
                        if (el) {
                          console.log('Scrolling enCiudad-scroll left');
                          el.scrollBy({ left: -220, behavior: 'smooth' });
                        } else {
                          console.error('Element with id enCiudad-scroll not found');
                        }
                      }}
                      renderItem={(artist) => <ArtistCard artist={mapToArtistCard(artist)} showPrice={true} />}
                    />
                  )}
                  {recienLlegados && recienLlegados.length > 0 && (
                    <HorizontalScrollSection
                      title={<span className="text-lg font-semibold text-gray-800 dark:text-white">Recién llegados</span>}
                      items={recienLlegados.slice(0, 5)}
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
                      renderItem={(artist) => <ArtistCard artist={mapToArtistCard(artist)} showPrice={true} />}
                    />
                  )}
                  {masContratados && masContratados.length > 0 && (
                    <HorizontalScrollSection
                      title={<span className="text-lg font-semibold text-gray-800 dark:text-white">Más contratados</span>}
                      items={masContratados.slice(0, 5)}
                      containerId="masContratados-scroll"
                      onScrollRight={() => {
                        const el = document.getElementById('masContratados-scroll');
                        if (el) {
                          el.scrollBy({ left: 220, behavior: 'smooth' });
                        }
                      }}
                      onScrollLeft={() => {
                        const el = document.getElementById('masContratados-scroll');
                        if (el) {
                          el.scrollBy({ left: -220, behavior: 'smooth' });
                        }
                      }}
                      renderItem={(artist) => <ArtistCard artist={mapToArtistCard(artist)} showPrice={true} />}
                    />
                  )}
                  {/* Sección de favoritos (mover debajo de populares) */}
                  <div className="mb-6 relative">
                    <button
                      className="flex items-center gap-2 text-lg font-semibold mb-2 focus:outline-none hover:underline"
                      onClick={() => setShowFavorites(!showFavorites)}
                    >
                      Favoritos
                    </button>
                    {showFavorites && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                        {favorites.length > 0 ? favorites.map((artist) => (
                          <ArtistCard
                            key={artist.id}
                            artist={mapToArtistCard(artist)}
                            showPrice={true}
                          />
                        )) : (
                          <div className="text-muted-foreground px-4 py-8 col-span-5">No tienes favoritos.</div>
                        )}
                      </div>
                    )}
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
              <ArtistSearch
                  filters={managerFilters}
                  onFiltersChange={handleManagerSearch}
                  filterConfig={managerFilterConfig}
                  type="managers"
              />
            }
            totalCount={paginationManagers.total}
            sectionTitle="Encuentra managers para tu evento"
            cardType="manager"
            pagination={paginationManagers}
            onPageChange={(page) => setManagerFilters((prev: any) => ({ ...prev, page }))}
            renderGrid={(children) => (
              <>
                {verificadosManagers && verificadosManagers.length > 0 && (
                  <HorizontalScrollSection
                    title={<span className="text-lg font-semibold text-gray-800 dark:text-white">Managers verificados</span>}
                    items={verificadosManagers.slice(0, 5)}
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
                    title={<span className="text-lg font-semibold text-gray-800 dark:text-white">Managers Destacados</span>}
                    items={destacadosManagers}
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
                    renderItem={(manager) => <ManagerCard manager={mapToManagerCard(manager)} />}
                  />
                )}
                {popularesManagers && popularesManagers.length > 0 && (
                  <HorizontalScrollSection
                    title={<span className="text-lg font-semibold text-gray-800 dark:text-white">Managers Populares</span>}
                    items={popularesManagers.slice(0, 5)}
                    containerId="populares-scroll"
                    onScrollRight={() => {
                      const el = document.getElementById('populares-scroll');
                      if (el) {
                        console.log('Scrolling populares-scroll');
                        el.scrollBy({ left: 220, behavior: 'smooth' });
                      } else {
                        console.error('Element with id populares-scroll not found');
                      }
                    }}
                    onScrollLeft={() => {
                      const el = document.getElementById('populares-scroll');
                      if (el) {
                        console.log('Scrolling populares-scroll left');
                        el.scrollBy({ left: -220, behavior: 'smooth' });
                      } else {
                        console.error('Element with id populares-scroll not found');
                      }
                    }}
                    renderItem={(artist) => <ArtistCard artist={mapToArtistCard(artist)} showPrice={true} />}
                  />
                )}
                {/* Sección de favoritos para managers */}
                <div className="mb-6 relative">
                  <button
                    className="flex items-center gap-2 text-lg font-semibold mb-2 focus:outline-none hover:underline"
                    onClick={() => setShowFavoritesManagers(!showFavoritesManagers)}
                  >
                    Favoritos
                  </button>
                  {showFavoritesManagers && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                      {favoritesManagers.length > 0 ? favoritesManagers.map((manager) => (
                        <ManagerCard
                          key={manager.id}
                          manager={mapToManagerCard(manager)}
                        />
                      )) : (
                        <div className="text-muted-foreground px-4 py-8 col-span-5">No tienes favoritos.</div>
                      )}
                    </div>
                  )}
                </div>
                {/* Renderizar el resto de managers */}
                {children}
              </>
            )}
          />
        )}
      </HeaderLayout>
    );
  }

