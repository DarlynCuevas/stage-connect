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
import { useContext } from 'react';
import { useVenue } from '@/hooks/useVenue';
import { AuthContext } from '@/contexts/AuthContext';
import { notifyAvailableDate } from '@/lib/notifications';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { CalendarComponent } from '../calendar/CalendarComponent';
import './no-spinner.css';

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
  const [offeredPrice, setOfferedPrice] = useState<string>('');
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

  // Mover hooks y lógica de venue aquí
  const auth = useContext(AuthContext);
  const user = auth?.user;
  const token = auth?.token;
  // Ya no necesitamos venue para el botón premium
  const isFeatured = user?.role === 'Local' && user?.featured;

  const venueId = user?.id; // Si necesitas el id del local para notificar
  const goldButtonClass =
    'relative bg-gradient-to-br from-yellow-300 via-yellow-500 to-yellow-700 border-2 border-yellow-400 shadow-gold text-yellow-950 font-semibold hover:from-yellow-400 hover:to-yellow-800 active:scale-[0.98]';
  const handleNotifyWithPrice = async (date: Date, price: string) => {
    if (isFeatured && date && user && price && Number(price) > 0) {
      try {
        await notifyAvailableDate(venueId, date.toISOString().slice(0, 10), token || undefined, Number(price));
        toast({
          title: 'Notificación enviada',
          description: `Notificación enviada a artistas y managers para el día ${date.toLocaleDateString()}\nOferta: ${Number(price).toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}`,
          duration: 4000,
        });
        setShowDate(false);
        setOfferedPrice('');
      } catch (err: any) {
        toast({
          title: 'Error al notificar',
          description: err?.message || 'Error desconocido',
          variant: 'destructive',
          duration: 4000,
        });
      }
    }
  };

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
                <div className="flex flex-row gap-8 p-4 rounded-2xl bg-white dark:bg-zinc-900 shadow-lg border border-zinc-200 dark:border-zinc-800 items-start w-fit">
                  <div className="min-w-[320px]">
                    <CalendarComponent
                      dates={[]}
                      selectedDate={selectedDate}
                      onSelect={date => setSelectedDate(date)}
                    />
                  </div>
                  <div className="flex flex-col gap-4 min-w-[260px] items-end justify-start w-full">
                    <Button
                      variant="default"
                      size="sm"
                      disabled={!selectedDate}
                      className="w-full mt-2 mb-1 rounded-lg font-medium text-base transition-all"
                      onClick={() => {
                        if (selectedDate) {
                          onFiltersChange({ ...filters, date: selectedDate.toISOString().slice(0, 10) });
                          setShowDate(false);
                        }
                      }}
                    >
                      <span className="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="text-primary"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10m-7 4h4" /></svg>
                        Buscar artistas disponibles
                      </span>
                    </Button>
                    <span className="text-xs text-muted-foreground mb-2">Filtra la lista y muestra solo artistas que tienen libre el día seleccionado.</span>
                    <div className="w-full border-t border-zinc-100 dark:border-zinc-800 my-2" />
                    <div className="flex flex-col gap-2 w-full items-end justify-end">
                      {isFeatured ? (
                        <>
                          <div className="relative w-full flex items-center">
                            <input
                              type="number"
                              min={0}
                              placeholder="Precio ofrecido"
                              className="no-spinner border-0 border-b-2 border-zinc-200 dark:border-zinc-700 focus:border-primary focus:ring-0 bg-transparent pr-8 py-2 mb-1 text-base text-center w-full transition-all outline-none"
                              value={offeredPrice}
                              onChange={e => {
                                const value = e.target.value;
                                // Permite solo números y vacío
                                if (/^\d*$/.test(value)) {
                                  setOfferedPrice(value);
                                }
                              }}
                              style={{ MozAppearance: 'textfield', appearance: 'textfield' }}
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none">€</span>
                          </div>
                          <Button
                            variant="default"
                            size="sm"
                            className="w-full rounded-lg font-medium text-base mt-1"
                            disabled={!selectedDate || !offeredPrice || Number(offeredPrice) <= 0}
                            onClick={async () => {
                              if (selectedDate && offeredPrice && Number(offeredPrice) > 0) {
                                await handleNotifyWithPrice(selectedDate, offeredPrice);
                              }
                            }}
                          >
                            <span className="flex items-center gap-2">
                              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="text-primary"><path strokeLinecap="round" strokeLinejoin="round" d="M17 11V7a5 5 0 10-10 0v4M5 11h14a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2z" /></svg>
                              Notificar a artistas
                            </span>
                          </Button>
                          <span className="text-xs text-muted-foreground mt-1 block">Envía una notificación a todos los artistas y managers informando que tienes disponible este día y el caché ofertado.</span>
                        </>
                      ) : (
                        <>
                          <button
                            type="button"
                            disabled={!isFeatured || !selectedDate}
                            className={
                              'px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-200 ' +
                              goldButtonClass +
                              (!isFeatured ? ' opacity-70 cursor-not-allowed' : '')
                            }
                            title="Solo para cuentas destacadas"
                          >
                            <span className="flex items-center gap-2">
                              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="text-yellow-900"><path strokeLinecap="round" strokeLinejoin="round" d="M17 11V7a5 5 0 10-10 0v4M5 11h14a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2z" /></svg>
                              Notificar a artistas
                              <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 text-yellow-950 border border-yellow-300 shadow-gold">Premium</span>
                            </span>
                            <span className="absolute inset-0 rounded-lg pointer-events-none animate-gold-shine" />
                          </button>
                          <span className="text-xs text-yellow-900 flex items-center gap-1 mt-1">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="inline align-middle text-yellow-900"><path strokeLinecap="round" strokeLinejoin="round" d="M17 11V7a5 5 0 10-10 0v4M5 11h14a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2z" /></svg>
                            Solo para cuentas destacadas
                          </span>
                        </>
                      )}
                    </div>
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

            {/* Clear filters: siempre visible y alineado a la derecha */}
            <div className="flex w-full justify-end">
              <Button variant="ghost" onClick={clearFilters} className="text-muted-foreground">
                <X className="w-4 h-4 mr-2" />
                Limpiar filtros
              </Button>
            </div>
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
