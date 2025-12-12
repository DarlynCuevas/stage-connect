import { useState, useMemo } from 'react';
import { mockVenues, venueTypes, cities } from '@/data/mockData';
import { VenueCard } from '@/components/venues/VenueCard';
import { TopNavbar } from '@/components/layout/TopNavbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, SlidersHorizontal, X, MapPin } from 'lucide-react';

export default function ArtistHome() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  // All Spanish cities flattened
  const allCities = cities['España'] || [];

  // Filter venues
  const filteredVenues = useMemo(() => {
    return mockVenues.filter((venue) => {
      const matchesSearch = 
        searchQuery === '' ||
        venue.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        venue.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        venue.description?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCity = selectedCity === 'all' || venue.city === selectedCity;
      const matchesType = selectedType === 'all' || venue.type === selectedType;

      return matchesSearch && matchesCity && matchesType;
    });
  }, [searchQuery, selectedCity, selectedType]);

  const activeFiltersCount = [selectedCity !== 'all', selectedType !== 'all'].filter(Boolean).length;

  const clearFilters = () => {
    setSelectedCity('all');
    setSelectedType('all');
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-background">
      <TopNavbar showSearch={false} />
      
      <main className="container-tight py-6 md:py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-2">
            Encuentra tu próximo escenario
          </h1>
          <p className="text-muted-foreground">
            Descubre locales y eventos donde mostrar tu talento
          </p>
        </div>

        {/* Search and filters */}
        <div className="mb-8 space-y-4">
          {/* Search bar */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Buscar por nombre, ciudad..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 rounded-xl border-border bg-background text-base"
              />
            </div>
            <Button
              variant={showFilters ? "default" : "outline"}
              size="lg"
              onClick={() => setShowFilters(!showFilters)}
              className="h-12 px-4 rounded-xl shrink-0"
            >
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              Filtros
              {activeFiltersCount > 0 && (
                <span className="ml-2 w-5 h-5 rounded-full bg-primary-foreground text-primary text-xs flex items-center justify-center font-semibold">
                  {activeFiltersCount}
                </span>
              )}
            </Button>
          </div>

          {/* Filter panel */}
          {showFilters && (
            <div className="p-4 rounded-xl border border-border bg-card animate-fade-in">
              <div className="flex flex-wrap gap-3">
                <Select value={selectedCity} onValueChange={setSelectedCity}>
                  <SelectTrigger className="w-[180px] h-10 rounded-lg">
                    <MapPin className="w-4 h-4 mr-2 text-muted-foreground" />
                    <SelectValue placeholder="Ciudad" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border-border">
                    <SelectItem value="all">Todas las ciudades</SelectItem>
                    {allCities.map((city) => (
                      <SelectItem key={city} value={city}>{city}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="w-[180px] h-10 rounded-lg">
                    <SelectValue placeholder="Tipo de local" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border-border">
                    <SelectItem value="all">Todos los tipos</SelectItem>
                    {venueTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {activeFiltersCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="h-10 text-muted-foreground hover:text-foreground"
                  >
                    <X className="w-4 h-4 mr-1" />
                    Limpiar filtros
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Results count */}
        <div className="mb-4">
          <p className="text-sm text-muted-foreground">
            {filteredVenues.length} {filteredVenues.length === 1 ? 'local encontrado' : 'locales encontrados'}
          </p>
        </div>

        {/* Venues grid */}
        {filteredVenues.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredVenues.map((venue, index) => (
              <VenueCard 
                key={venue.id} 
                venue={venue}
                style={{ animationDelay: `${index * 50}ms` }}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-secondary flex items-center justify-center">
              <Search className="w-7 h-7 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-foreground mb-1">No se encontraron locales</h3>
            <p className="text-muted-foreground text-sm">
              Intenta con otros filtros o términos de búsqueda
            </p>
            <Button
              variant="outline"
              onClick={clearFilters}
              className="mt-4"
            >
              Limpiar filtros
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
