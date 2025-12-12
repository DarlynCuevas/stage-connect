import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { apiFetch } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { VenueCard } from '@/components/venue/VenueCard';
import { Search, MapPin, Filter, X } from 'lucide-react';

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

  useEffect(() => {
    fetchVenues();
  }, []);

  const fetchVenues = async () => {
    try {
      setLoading(true);
      const response = await apiFetch('/public/venues');
      const allVenues = response || [];
      setVenues(allVenues);
    } catch (error) {
      console.error('Error fetching venues:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredVenues = venues
    .filter(venue => 
      venue.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      venue.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      venue.province?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(venue => {
      if (cityFilter !== 'all') {
        const vcity = (venue.city || '').toLowerCase();
        if (!vcity.includes(cityFilter.toLowerCase())) return false;
      }
      const type = (venue.bio || '').toLowerCase();
      if (typeFilter === 'club') return type.includes('discoteca') || type.includes('club');
      if (typeFilter === 'concert') return type.includes('concierto') || type.includes('sala');
      if (typeFilter === 'rooftop') return type.includes('rooftop') || type.includes('terraza');
      if (typeFilter === 'bar') return type.includes('bar') || type.includes('pub');
      if (typeFilter === 'festival') return type.includes('festival');
      if (typeFilter === 'theater') return type.includes('teatro') || type.includes('theater');
      if (typeFilter === 'private') return type.includes('privado') || type.includes('evento privado');
      return true;
    })
    .filter(venue => {
      const cap = venue.capacity || 0;
      if (priceFilter === 'low') return cap < 500;
      if (priceFilter === 'mid') return cap >= 500 && cap < 1200;
      if (priceFilter === 'high') return cap >= 1200;
      return true;
    });

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

  const activeList = searchTerm || cityFilter !== 'all' || typeFilter !== 'all' || priceFilter !== 'all' ? filteredVenues : venues;

  return (
    <div className="min-h-screen bg-background">
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

                    <button
                      className="flex items-center gap-2 text-sm text-muted-foreground hover:underline ml-auto"
                      onClick={() => { setCityFilter('all'); setTypeFilter('all'); setPriceFilter('all'); }}
                    >
                      <X className="h-3 w-3" /> Limpiar filtros
                    </button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <p className="text-muted-foreground mb-4">{activeList.length} locales encontrados</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {activeList.map((venue) => (
            <VenueCard key={venue.id} venue={venue} />
          ))}
        </div>
      </div>
    </div>
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