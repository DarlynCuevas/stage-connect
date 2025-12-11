import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Search, X, SlidersHorizontal, MapPin, Music, DollarSign } from 'lucide-react';
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
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Buscar artistas por nombre..."
            value={filters.query || ''}
            onChange={(e) => handleQueryChange(e.target.value)}
            className="pl-12 h-13 text-base bg-card/50 border-border/50 focus:border-primary/50"
          />
        </div>
        <Button
          variant={showFilters ? "default" : "outline"}
          size="lg"
          onClick={() => setShowFilters(!showFilters)}
          className="relative h-13 px-5"
        >
          <SlidersHorizontal className="w-5 h-5 mr-2" />
          Filtros
          {activeFiltersCount > 0 && (
            <Badge 
              variant="default" 
              className="absolute -top-2 -right-2 h-5 min-w-5 p-0 flex items-center justify-center text-[10px] bg-primary text-primary-foreground"
            >
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
          <Card className="p-6 bg-card/50 border-border/50 backdrop-blur-sm space-y-6">
            {/* Genres */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-foreground mb-3">
                <Music className="w-4 h-4 text-primary" />
                Géneros musicales
              </label>
              <div className="flex flex-wrap gap-2">
                {genres.slice(0, 15).map((genre) => (
                  <Badge
                    key={genre}
                    variant={filters.genre?.includes(genre) ? "default" : "outline"}
                    className={cn(
                      "cursor-pointer transition-all duration-200",
                      filters.genre?.includes(genre) 
                        ? "bg-primary hover:bg-primary/90" 
                        : "hover:bg-primary/10 hover:border-primary/50"
                    )}
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
                <label className="flex items-center gap-2 text-sm font-semibold text-foreground mb-2">
                  <MapPin className="w-4 h-4 text-role-venue" />
                  País
                </label>
                <Select
                  value={filters.country || ''}
                  onValueChange={handleCountryChange}
                >
                  <SelectTrigger className="bg-secondary/30 border-border/50">
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
                <label className="flex items-center gap-2 text-sm font-semibold text-foreground mb-2">
                  <MapPin className="w-4 h-4 text-role-venue" />
                  Ciudad
                </label>
                <Select
                  value={filters.city || ''}
                  onValueChange={handleCityChange}
                  disabled={!filters.country}
                >
                  <SelectTrigger className="bg-secondary/30 border-border/50">
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
              <label className="flex items-center gap-2 text-sm font-semibold text-foreground mb-4">
                <DollarSign className="w-4 h-4 text-success" />
                Rango de precio (caché)
              </label>
              <div className="px-2">
                <Slider
                  value={priceRange}
                  onValueChange={handlePriceChange}
                  min={0}
                  max={50000}
                  step={500}
                  className="mb-3"
                />
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-foreground">€{priceRange[0].toLocaleString()}</span>
                  <span className="font-medium text-foreground">€{priceRange[1].toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Clear filters */}
            {activeFiltersCount > 0 && (
              <div className="pt-2 border-t border-border/30">
                <Button 
                  variant="ghost" 
                  onClick={clearFilters} 
                  className="text-muted-foreground hover:text-destructive"
                >
                  <X className="w-4 h-4 mr-2" />
                  Limpiar todos los filtros
                </Button>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
