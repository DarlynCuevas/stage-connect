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
import { ChevronDown, ChevronUp, Star, Users, MapPin, Trophy } from "lucide-react";
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
    const { populares: popularesManagers, destacados: destacadosManagers, resto: restoManagers, pagination: paginationManagers, loading: loadingManagers, setFilters: setManagerFilters, filters: managerFilters, setPopulares: setPopularesManagers, setDestacados: setDestacadosManagers, setResto: setRestoManagers } = useDiscoveryManagers();
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
        <div className="mt-8 mb-4 text-center">
          <h1 className="text-3xl font-display font-bold mb-1">
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
                  {/* Reemplazo de la sección de "Artistas Destacados" con el componente genérico */}
                  <HorizontalScrollSection                              
                    title={<span className="flex items-center gap-2"><Star className="text-yellow-400 w-5 h-5" />Artistas Destacados</span>}
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
                  {/* Reemplazo de la sección de "Artistas Populares" con el componente genérico */}
                  <HorizontalScrollSection
                    title={<span className="flex items-center gap-2"><Users className="text-blue-500 w-5 h-5" />Artistas Populares</span>}
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

                  {/* Sección En tu ciudad */}
                  <HorizontalScrollSection
                    title={<span className="flex items-center gap-2"><MapPin className="text-green-500 w-5 h-5" />En tu ciudad</span>}
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
                   {/* Sección Recién llegados */}
                  <HorizontalScrollSection
                    title={<span className="flex items-center gap-2"><Sparkles className="text-purple-500 w-5 h-5" />Recién llegados</span>}
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
                   {/* Sección mas contratados */}
                  <HorizontalScrollSection
                    title={<span className="flex items-center gap-2"><Trophy  className="text-purple-500 w-5 h-5" />Mas contratados</span>}
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

                  {/* Sección de favoritos (mover debajo de populares) */}
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
                {/* Card visual para los primeros 5 managers destacados */}
                <div className="rounded-xl border text-card-foreground transition-all duration-300 bg-transparent shadow-lg mb-6 p-6">
                  <div className="flex items-center justify-between mb-4">
                    {/* Icono de tendencia original y título juntos */}
                    <div className="flex items-center gap-2">
                      <span className="text-orange-500 text-xl">↗</span>
                      <span className="font-bold text-lg gradient-text">Managers Destacados</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                    {destacadosManagers.slice(0, 5).map((manager) => (
                      <div className="min-w-0 w-full relative" key={manager.id}>
                        <ManagerCard
                          manager={mapToManagerCard(manager)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
                {/* Card visual para los primeros 5 managers populares */}
                <div className="rounded-xl border text-card-foreground transition-all duration-300 bg-transparent shadow-lg mb-6 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      {/* Icono de estrella popular */}
                      <span className="text-amber-400 text-2xl">⭐</span>
                      <span className="font-bold text-lg">Managers Populares</span>
                    </div>
                    <a href="#" className="flex items-center gap-1 text-sm text-amber-700 hover:underline">
                      Ver todos <span className="text-lg">→</span>
                    </a>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                    {popularesManagers.slice(0, 5).map((manager) => (
                      <div className="min-w-0 w-full relative" key={manager.id}>
                        <ManagerCard
                          manager={mapToManagerCard(manager)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
                {/* Sección de favoritos para managers */}
                <div className="mb-6 relative">
                  <button
                    className="flex items-center gap-2 text-lg font-semibold text-red-500 mb-2 focus:outline-none hover:underline"
                    onClick={() => setShowFavoritesManagers(!showFavoritesManagers)}
                  >
                    <span className="text-red-400 text-xl">❤️</span> Favoritos
                    {showFavoritesManagers ? (
                      <ChevronUp className="h-4 w-4 text-red-400" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-red-400" />
                    )}
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

