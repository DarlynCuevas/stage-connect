import { useState, useMemo } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ArtistSearch } from '@/components/artists/ArtistSearch';
import { ArtistCard } from '@/components/artists/ArtistCard';
import { mockArtists } from '@/data/mockData';
import { SearchFilters } from '@/types';
import { Users, SearchX } from 'lucide-react';

export default function VenueSearch() {
  const [filters, setFilters] = useState<SearchFilters>({});

  const filteredArtists = useMemo(() => {
    return mockArtists.filter((artist) => {
      if (filters.query) {
        const query = filters.query.toLowerCase();
        if (
          !artist.name.toLowerCase().includes(query) &&
          !artist.stageName.toLowerCase().includes(query)
        ) {
          return false;
        }
      }

      if (filters.genre && filters.genre.length > 0) {
        if (!filters.genre.some((g) => artist.genre.includes(g))) {
          return false;
        }
      }

      if (filters.country && artist.country !== filters.country) {
        return false;
      }

      if (filters.city && artist.city !== filters.city) {
        return false;
      }

      if (filters.priceMin && artist.basePrice < filters.priceMin) {
        return false;
      }

      if (filters.priceMax && artist.basePrice > filters.priceMax) {
        return false;
      }

      return true;
    });
  }, [filters]);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-role-venue/10 via-card to-primary/5 border border-border/50 p-6 lg:p-8">
          <div className="absolute top-0 right-0 w-64 h-64 bg-role-venue/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          
          <div className="relative">
            <h1 className="text-2xl lg:text-3xl font-display font-bold mb-2">
              Buscar Artistas
            </h1>
            <p className="text-muted-foreground max-w-xl">
              Encuentra el talento perfecto para tu evento con nuestros filtros avanzados.
            </p>
          </div>
        </div>

        {/* Search component */}
        <ArtistSearch filters={filters} onFiltersChange={setFilters} />

        {/* Results count */}
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Users className="w-4 h-4" />
            <span>
              <span className="font-semibold text-foreground">{filteredArtists.length}</span>
              {' '}artista{filteredArtists.length !== 1 ? 's' : ''} encontrado{filteredArtists.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {/* Results grid */}
        {filteredArtists.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArtists.map((artist, index) => (
              <div 
                key={artist.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <ArtistCard artist={artist} showPrice />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-muted/50 flex items-center justify-center">
              <SearchX className="w-10 h-10 text-muted-foreground/50" />
            </div>
            <h3 className="text-xl font-display font-semibold mb-2">No se encontraron artistas</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Intenta ajustar los filtros de búsqueda para encontrar más resultados.
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
