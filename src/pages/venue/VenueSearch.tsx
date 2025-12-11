import { useState, useMemo } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ArtistSearch } from '@/components/artists/ArtistSearch';
import { ArtistCard } from '@/components/artists/ArtistCard';
import { useArtists } from '@/lib/users';
import { SearchFilters } from '@/types';

export default function VenueSearch() {
  const [filters, setFilters] = useState<SearchFilters>({});

  const { data: artists = [] } = useArtists();

  const filteredArtists = useMemo(() => {
    return (artists || []).filter((artist: any) => {
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

        if (filters.priceMin && (artist.basePrice ?? 0) < filters.priceMin) {
        return false;
      }

      if (filters.priceMax && (artist.basePrice ?? 0) > filters.priceMax) {
        return false;
      }

      return true;
    });
  }, [filters]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-display font-bold mb-2">
            Buscar Artistas
          </h1>
          <p className="text-muted-foreground">
            Encuentra el talento perfecto para tu evento con nuestros filtros avanzados.
          </p>
        </div>

        <ArtistSearch filters={filters} onFiltersChange={setFilters} />

        <div className="flex items-center justify-between">
          <p className="text-muted-foreground">
            {filteredArtists.length} artista{filteredArtists.length !== 1 ? 's' : ''} encontrado{filteredArtists.length !== 1 ? 's' : ''}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArtists.map((artist) => (
            <ArtistCard key={artist.id} artist={artist} showPrice />
          ))}
        </div>

        {filteredArtists.length === 0 && (
          <div className="text-center py-16">
            <p className="text-lg text-muted-foreground">
              No se encontraron artistas con los filtros seleccionados.
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
