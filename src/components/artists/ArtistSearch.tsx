import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Search, X, SlidersHorizontal } from 'lucide-react';
import { genres, countries, cities } from '@/data/mockData';
import { SearchFilters } from '@/types';
import { cn } from '@/lib/utils';

interface ArtistSearchProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
}

export function ArtistSearch({ filters, onFiltersChange }: ArtistSearchProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState([filters.priceMin || 0, filters.priceMax || 50000]);

  const handleQueryChange = (query: string) => {
    onFiltersChange({ ...filters, query });
  };

  const handleGenreToggle = (genre: string) => {
    const currentGenres = filters.genre || [];
    const newGenres = currentGenres.includes(genre)
      ? currentGenres.filter((g) => g !== genre)
      : [...currentGenres, genre];
    onFiltersChange({ ...filters, genre: newGenres });
  };

  const handleCountryChange = (country: string) => {
    onFiltersChange({ ...filters, country, city: undefined });
  };

  const handleCityChange = (city: string) => {
    onFiltersChange({ ...filters, city });
  };

  const handlePriceChange = (value: number[]) => {
    setPriceRange(value);
    onFiltersChange({ ...filters, priceMin: value[0], priceMax: value[1] });
  };

  const clearFilters = () => {
    onFiltersChange({});
    setPriceRange([0, 50000]);
  };

  const activeFiltersCount = [
    filters.query,
    filters.genre?.length,
    filters.country,
    filters.city,
    filters.priceMin || filters.priceMax,
  ].filter(Boolean).length;

  return (
    <div className="space-y-4">
      {/* Search bar */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Buscar artistas por nombre..."
            value={filters.query || ''}
            onChange={(e) => handleQueryChange(e.target.value)}
            className="pl-10 h-12"
          />
        </div>
        <Button
          variant={showFilters ? "default" : "outline"}
          size="lg"
          onClick={() => setShowFilters(!showFilters)}
          className="relative"
        >
          <SlidersHorizontal className="w-5 h-5 mr-2" />
          Filtros
          {activeFiltersCount > 0 && (
            <Badge variant="default" className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      </div>

      {/* Filters panel */}
      <div className={cn(
        "grid gap-6 overflow-hidden transition-all duration-300",
        showFilters ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
      )}>
        <div className="min-h-0">
          <div className="p-6 rounded-xl bg-card border border-border space-y-6">
            {/* Genres */}
            <div>
              <label className="text-sm font-medium text-foreground mb-3 block">
                Géneros musicales
              </label>
              <div className="flex flex-wrap gap-2">
                {genres.slice(0, 15).map((genre) => (
                  <Badge
                    key={genre}
                    variant={filters.genre?.includes(genre) ? "default" : "outline"}
                    className="cursor-pointer hover:bg-primary/80 transition-colors"
                    onClick={() => handleGenreToggle(genre)}
                  >
                    {genre}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  País
                </label>
                <Select
                  value={filters.country || ''}
                  onValueChange={handleCountryChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar país" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((country) => (
                      <SelectItem key={country} value={country}>
                        {country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Ciudad
                </label>
                <Select
                  value={filters.city || ''}
                  onValueChange={handleCityChange}
                  disabled={!filters.country}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar ciudad" />
                  </SelectTrigger>
                  <SelectContent>
                    {(filters.country && cities[filters.country] || []).map((city) => (
                      <SelectItem key={city} value={city}>
                        {city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Price range */}
            <div>
              <label className="text-sm font-medium text-foreground mb-4 block">
                Rango de precio (caché)
              </label>
              <div className="px-2">
                <Slider
                  value={priceRange}
                  onValueChange={handlePriceChange}
                  min={0}
                  max={50000}
                  step={500}
                  className="mb-2"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>€{priceRange[0].toLocaleString()}</span>
                  <span>€{priceRange[1].toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Clear filters */}
            {activeFiltersCount > 0 && (
              <Button variant="ghost" onClick={clearFilters} className="text-muted-foreground">
                <X className="w-4 h-4 mr-2" />
                Limpiar filtros
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
