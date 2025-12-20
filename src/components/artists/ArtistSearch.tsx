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
import { PriceRangeSlider } from '@/components/ui/PriceRangeSlider';
import { Search, X, SlidersHorizontal, ChevronUp, ChevronDown } from 'lucide-react';
import { genres, countries, cities } from '@/data/mockData';
import { SearchFilters } from '@/types';
import { cn } from '@/lib/utils';
import { CalendarComponent } from '../calendar/CalendarComponent';

interface ArtistSearchProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
}

export function ArtistSearch({ filters, onFiltersChange }: ArtistSearchProps) {
    const [showGenre, setShowGenre] = useState(false);
    const [showLocation, setShowLocation] = useState(false);
    const [showPrice, setShowPrice] = useState(false);
    const [showDate, setShowDate] = useState(false);
    const [selectedDate, setSelectedDate] = useState(filters.date ? new Date(filters.date) : undefined);
  const [showFilters, setShowFilters] = useState(false);
    // Cierra todos los desplegables al abrir el panel de filtros
    const handleOpenFilters = () => {
      setShowFilters((prev) => {
        if (!prev) {
          setShowGenre(false);
          setShowLocation(false);
          setShowPrice(false);
        }
        return !prev;
      });
    };
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
    // Reset city when country changes
    onFiltersChange({ ...filters, country, city: undefined });
  };

  const handleCityChange = (city: string) => {
    onFiltersChange({ ...filters, city });
  };

  const handlePriceChange = (value: number[]) => {
    // Ensure priceMin is not greater than priceMax
    const [min, max] = value;
    const validMin = Math.min(min, max);
    const validMax = Math.max(min, max);
    setPriceRange([validMin, validMax]);
    onFiltersChange({ ...filters, priceMin: validMin, priceMax: validMax });
  };

  const clearFilters = () => {
    onFiltersChange({
      query: '',
      genre: [],
      country: '',
      city: '',
      priceMin: 0,
      priceMax: 50000,
      date: undefined,
    });
    setPriceRange([0, 50000]);
    setSelectedDate(undefined);
  };

  const activeFiltersCount = [
    filters.query ? 1 : 0,
    filters.genre?.length ?? 0,
    filters.country ? 1 : 0,
    filters.city ? 1 : 0,
    (filters.priceMin && filters.priceMin > 0) || (filters.priceMax && filters.priceMax < 50000) ? 1 : 0,
    filters.date ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

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
          onClick={handleOpenFilters}
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
              <button
                type="button"
                className="flex items-center gap-2 text-sm font-medium text-foreground mb-3 focus:outline-none"
                onClick={() => setShowGenre((v) => !v)}
              >
                Géneros musicales
                {showGenre ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {showGenre && (
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
              )}
            </div>

            {/* Location */}
            <div>
              <button
                type="button"
                className="flex items-center gap-2 text-sm font-medium text-foreground mb-3 focus:outline-none"
                onClick={() => setShowLocation((v) => !v)}
              >
                Ubicación
                {showLocation ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {showLocation && (
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
              )}
            </div>

            {/* Price range */}
                        {/* Date filter */}
                        <div>
                          <button
                            type="button"
                            className="flex items-center gap-2 text-sm font-medium text-foreground mb-3 focus:outline-none"
                            onClick={() => setShowDate((v) => !v)}
                          >
                            Fecha
                            {showDate ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            {selectedDate && (
                              <span className="ml-2 text-xs text-muted-foreground">{selectedDate.toLocaleDateString()}</span>
                            )}
                          </button>
                          {showDate && (
                            <div className="flex flex-row gap-6 p-2 rounded-xl bg-muted/10 border border-border items-start">
                              <div className="w-full max-w-xs">
                                <CalendarComponent
                                  dates={[]}
                                  selectedDate={selectedDate}
                                  onSelect={date => setSelectedDate(date)}
                                />
                              </div>
                              <div className="flex flex-col gap-3 min-w-[220px]">
                                <Button
                                  variant="default"
                                  size="sm"
                                  disabled={!selectedDate}
                                  onClick={() => {
                                    if (selectedDate) {
                                      onFiltersChange({ ...filters, date: selectedDate.toISOString().slice(0, 10) });
                                      setShowDate(false);
                                    }
                                  }}
                                >
                                  Buscar artistas disponibles para este día
                                </Button>
                                <span className="text-xs text-muted-foreground mb-2">Filtra la lista y muestra solo artistas que tienen libre el día seleccionado.</span>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  disabled={!selectedDate}
                                  onClick={() => {
                                    // Aquí iría la lógica para notificar a artistas (puedes conectar con backend)
                                    alert('Se notificará a los artistas que el local está disponible el ' + selectedDate?.toLocaleDateString());
                                    setShowDate(false);
                                  }}
                                >
                                  Notificar a artistas que este día está disponible
                                </Button>
                                <span className="text-xs text-muted-foreground">Envía una notificación a los artistas para que puedan sugerirse si están interesados en la fecha seleccionada.</span>
                              </div>
                            </div>
                          )}
                        </div>
            <div>
              <button
                type="button"
                className="flex items-center gap-2 text-sm font-medium text-foreground mb-3 focus:outline-none"
                onClick={() => setShowPrice((v) => !v)}
              >
                Rango de precio
                {showPrice ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {showPrice && (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col items-start">
                      <span className="text-xs text-muted-foreground mb-1">Mín</span>
                      <Input
                        type="number"
                        min={0}
                        max={priceRange[1]}
                        value={priceRange[0]}
                        onChange={e => {
                          const val = Math.max(0, Math.min(Number(e.target.value), priceRange[1]));
                          handlePriceChange([val, priceRange[1]]);
                        }}
                        className="w-24 no-spinner"
                      />
                    </div>
                    <PriceRangeSlider
                      value={priceRange as [number, number]}
                      onChange={(vals) => handlePriceChange(vals)}
                      min={0}
                      max={50000}
                      className="flex-1 mx-2"
                    />
                    <div className="flex flex-col items-start">
                      <span className="text-xs text-muted-foreground mb-1">Máx</span>
                      <Input
                        type="number"
                        min={priceRange[0]}
                        max={50000}
                        value={priceRange[1]}
                        onChange={e => {
                          const val = Math.min(50000, Math.max(Number(e.target.value), priceRange[0]));
                          handlePriceChange([priceRange[0], val]);
                        }}
                        className="w-24 no-spinner"
                      />
                    </div>
                  </div>
                </div>
              )}
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
    <style>{`
      /* Oculta las flechitas de los inputs type number */
      .no-spinner::-webkit-outer-spin-button,
      .no-spinner::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }
      .no-spinner[type=number] {
        -moz-appearance: textfield;
      }
    `}</style>
  </div>
  );
}
