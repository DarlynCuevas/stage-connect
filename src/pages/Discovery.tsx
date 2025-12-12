import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { HeaderLayout } from '@/components/layout/HeaderLayout';
import { apiFetch } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { VenueCard } from '@/components/venue/VenueCard';
import { Search, MapPin, Filter, X } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';


interface Venue {
  id: number;
  name: string;
  city?: string;
  province?: string;
  capacity?: number;
  amenities?: string[];
  openingTime?: string;
  closingTime?: string;
  avatar?: string;
  bio?: string;
  featured?: boolean;
  verified?: boolean;
  favorite?: boolean;
}


export default function Discovery() {
  const { user } = useAuth();
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [priceFilter, setPriceFilter] = useState<'all' | 'low' | 'mid' | 'high'>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'club' | 'concert' | 'rooftop' | 'bar' | 'festival' | 'theater' | 'private'>('all');
  const [cityFilter, setCityFilter] = useState<string>('all');
  const [showFiltersBar, setShowFiltersBar] = useState<boolean>(false);
  // Capacidad mínima y máxima
  const [capacityMin, setCapacityMin] = useState<number | null>(null);
  const [capacityMax, setCapacityMax] = useState<number | null>(null);

  // Filtros de destacados, verificados y favoritos
  const [showOnlyFeatured, setShowOnlyFeatured] = useState(false);
  const [showOnlyVerified, setShowOnlyVerified] = useState(false);
  const [showOnlyFavorite, setShowOnlyFavorite] = useState(false);
  // Memoized lists for featured and verified venues
  const featuredVenues = useMemo(() => venues.filter(v => v.featured), [venues]);
  const verifiedVenues = useMemo(() => venues.filter(v => v.verified), [venues]);


  useEffect(() => {
    const fetchVenues = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (searchTerm) params.append('query', searchTerm);
        if (cityFilter !== 'all') params.append('city', cityFilter);
        if (showOnlyFeatured) params.append('featured', 'true');
        if (showOnlyVerified) params.append('verified', 'true');
        if (typeFilter !== 'all') params.append('type', typeFilter);
        if (capacityMin !== null) params.append('capacityMin', String(capacityMin));
        if (capacityMax !== null) params.append('capacityMax', String(capacityMax));
        if (showOnlyFavorite) {
          params.append('favorite', 'true');
        }
        const url = `/public/venues${params.toString() ? '?' + params.toString() : ''}`;
        const response = await apiFetch(url);
        setVenues(response || []);
      } catch (error) {
        console.error('Error fetching venues:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchVenues();
  }, [searchTerm, cityFilter, showOnlyFeatured, showOnlyVerified, typeFilter, capacityMin, capacityMax, showOnlyFavorite]);


  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Descubriendo locales increíbles...</p>
        </div>
      </div>
    );
  }

  const activeList = venues;

  return (
    <HeaderLayout>
     <DashboardLayout noSidebar>
      {/* Hero + Search */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-display font-bold">
              Encuentra tu próximo escenario
            </h1>
            <p className="text-muted-foreground mt-1">
              Descubre locales y eventos donde mostrar tu talento
            </p>
          </div>
          <Badge variant="secondary" className="text-sm">
            {activeList.length} locales disponibles
          </Badge>
        </div>

        {/* Search Bar */}
        <Card className="border-2 border-primary/20 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nombre, ciudad..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="destructive" className="px-5" onClick={() => setShowFiltersBar(v => !v)}>
                <Filter className="h-4 w-4 mr-2" />
                Filtros
              </Button>
            </div>

            {showFiltersBar && (
              <div className="mt-4 p-3 rounded-xl border bg-secondary/30">
                <div className="flex items-center gap-3 flex-wrap">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="rounded-full">
                        <MapPin className="h-4 w-4 mr-2" />
                        {cityFilter === 'all' ? 'Todas' : cityFilter}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      {['all','Madrid','Barcelona','Valencia','Sevilla','Bilbao'].map(c => (
                        <DropdownMenuItem key={c} onClick={() => setCityFilter(c)}>
                          {c==='all' ? 'Todas' : c}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="rounded-full">
                        {typeFilter === 'all' ? 'Todos los tipos' : typeLabel(typeFilter)}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => setTypeFilter('all')}>Todos los tipos</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setTypeFilter('club')}>Discoteca</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setTypeFilter('concert')}>Sala de conciertos</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setTypeFilter('rooftop')}>Rooftop</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setTypeFilter('bar')}>Bar</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setTypeFilter('festival')}>Festival</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setTypeFilter('theater')}>Teatro</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setTypeFilter('private')}>Evento privado</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* Filtros de capacidad */}
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={0}
                      placeholder="Capacidad mín."
                      value={capacityMin ?? ''}
                      onChange={e => setCapacityMin(e.target.value ? parseInt(e.target.value) : null)}
                      className="w-28 rounded-full border px-3 py-1 text-sm bg-background text-foreground border-border focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <span className="text-muted-foreground">-</span>
                    <input
                      type="number"
                      min={0}
                      placeholder="Capacidad máx."
                      value={capacityMax ?? ''}
                      onChange={e => setCapacityMax(e.target.value ? parseInt(e.target.value) : null)}
                      className="w-28 rounded-full border px-3 py-1 text-sm bg-background text-foreground border-border focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  {/* Destacados, Verificados y Favoritos como botones */}
                  <Button
                    type="button"
                    variant="outline"
                    className={`rounded-full ${showOnlyFeatured ? 'bg-accent text-primary border-primary' : ''}`}
                    onClick={() => setShowOnlyFeatured(v => !v)}
                  >
                    Destacados
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className={`rounded-full ${showOnlyVerified ? 'bg-accent text-primary border-primary' : ''}`}
                    onClick={() => setShowOnlyVerified(v => !v)}
                  >
                    Verificados
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className={`rounded-full ${showOnlyFavorite ? 'bg-accent text-primary border-primary' : ''}`}
                    onClick={() => setShowOnlyFavorite(v => !v)}
                  >
                    Favoritos
                  </Button>

                  <button
                    type="button"
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:underline ml-auto"
                    onClick={() => { setCityFilter('all'); setTypeFilter('all'); setPriceFilter('all'); setShowOnlyFeatured(false); setShowOnlyVerified(false); }}
                  >
                    <X className="h-3 w-3" /> Limpiar filtros
                  </button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>



        {/* Locales destacados */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Locales destacados</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {featuredVenues.filter(v => (!showOnlyVerified || v.verified) && (!showOnlyFeatured || v.featured)).length === 0 && <p className="text-muted-foreground">No hay locales destacados.</p>}
            {featuredVenues
              .filter(v => (!showOnlyVerified || v.verified) && (!showOnlyFeatured || v.featured))
              .map(venue => (
                <VenueCard key={venue.id} venue={venue} />
              ))}
          </div>
        </div>

        {/* Locales verificados */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Locales verificados</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {verifiedVenues.filter(v => (!showOnlyFeatured || v.featured) && (!showOnlyVerified || v.verified)).length === 0 && <p className="text-muted-foreground">No hay locales verificados.</p>}
            {verifiedVenues
              .filter(v => (!showOnlyFeatured || v.featured) && (!showOnlyVerified || v.verified))
              .map(venue => (
                <VenueCard key={venue.id} venue={venue} />
              ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <p className="text-muted-foreground mb-4">{activeList.length} locales encontrados</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {activeList.map((venue) => (
            <VenueCard key={venue.id} venue={venue} onFavoriteChange={(venueId, favorite) => {
              setVenues((prev) => prev.map(v => v.id === venueId ? { ...v, favorite } : v));
            }} />
          ))}
        </div>
      </div>
      </DashboardLayout>
    </HeaderLayout>
  );
}

function typeLabel(t: 'all' | 'club' | 'concert' | 'rooftop' | 'bar' | 'festival' | 'theater' | 'private') {
  switch (t) {
    case 'club': return 'Discoteca';
    case 'concert': return 'Sala de conciertos';
    case 'rooftop': return 'Rooftop';
    case 'bar': return 'Bar';
    case 'festival': return 'Festival';
    case 'theater': return 'Teatro';
    case 'private': return 'Evento privado';
    default: return 'Todos los tipos';
  }
}