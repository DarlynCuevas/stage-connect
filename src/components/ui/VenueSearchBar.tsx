import { Plus } from 'lucide-react';
import CleaningServicesIcon from '@mui/icons-material/CleaningServices';
import { useState, useRef, useMemo } from 'react';
import { City } from 'country-state-city';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import BeachAccessIcon from '@mui/icons-material/BeachAccess';
import MuseumIcon from '@mui/icons-material/Museum';
import FortIcon from '@mui/icons-material/Fort';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import ChurchIcon from '@mui/icons-material/Church';
import WaterIcon from '@mui/icons-material/Water';
import SailingIcon from '@mui/icons-material/Sailing';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import LocalFloristIcon from '@mui/icons-material/LocalFlorist';
import NightlifeIcon from '@mui/icons-material/Nightlife';
import LocalBarIcon from '@mui/icons-material/LocalBar';
import PublicIcon from '@mui/icons-material/Public';
import LocalCafeIcon from '@mui/icons-material/LocalCafe';
import DirectionsBoatIcon from '@mui/icons-material/DirectionsBoat';
import ParkIcon from '@mui/icons-material/Park';
import HikingIcon from '@mui/icons-material/Hiking';
import LocalDiningIcon from '@mui/icons-material/LocalDining';

// Mapeo de ciudades principales a iconos representativos
const cityIconMap: Record<string, JSX.Element> = {
  'Madrid': <MuseumIcon fontSize="small" className="text-primary" />, // Museo del Prado
  'Barcelona': <BeachAccessIcon fontSize="small" className="text-blue-400" />, // playa
  'Valencia': <SailingIcon fontSize="small" className="text-blue-500" />, // puerto y costa
  'Sevilla': <MusicNoteIcon fontSize="small" className="text-pink-500" />, // flamenco
  'Bilbao': <MuseumIcon fontSize="small" className="text-amber-700" />, // Guggenheim
  'Granada': <FortIcon fontSize="small" className="text-amber-800" />, // Alhambra
  'Málaga': <WbSunnyIcon fontSize="small" className="text-yellow-500" />, // sol
  'Santiago de Compostela': <ChurchIcon fontSize="small" className="text-green-700" />, // catedral
  'Zaragoza': <WaterIcon fontSize="small" className="text-blue-300" />, // río Ebro
  'Toledo': <FortIcon fontSize="small" className="text-gray-700" />, // ciudad histórica
  'Alicante': <BeachAccessIcon fontSize="small" className="text-blue-400" />, // playa
  'Córdoba': <LocalFloristIcon fontSize="small" className="text-green-500" />, // patios
  'Valladolid': <ParkIcon fontSize="small" className="text-green-700" />, // parques
  'Vigo': <DirectionsBoatIcon fontSize="small" className="text-blue-400" />, // puerto
  'Gijón': <HikingIcon fontSize="small" className="text-green-800" />, // naturaleza
  'San Sebastián': <LocalDiningIcon fontSize="small" className="text-amber-600" />, // gastronomía
  'Pamplona': <NightlifeIcon fontSize="small" className="text-red-600" />, // San Fermín
  'Salamanca': <ChurchIcon fontSize="small" className="text-yellow-800" />, // universidad/catedral
  'Santander': <BeachAccessIcon fontSize="small" className="text-blue-300" />, // playa
  'Murcia': <LocalCafeIcon fontSize="small" className="text-green-600" />, // huerta
  'Las Palmas': <WbSunnyIcon fontSize="small" className="text-yellow-400" />, // clima
  'Palma': <SailingIcon fontSize="small" className="text-blue-400" />, // islas
  'A Coruña': <PublicIcon fontSize="small" className="text-blue-700" />, // Torre de Hércules
  'Badajoz': <FortIcon fontSize="small" className="text-gray-600" />, // fortaleza
  'Almería': <WbSunnyIcon fontSize="small" className="text-yellow-400" />, // desierto
  'León': <ChurchIcon fontSize="small" className="text-purple-700" />, // catedral
  'Cádiz': <DirectionsBoatIcon fontSize="small" className="text-blue-500" />, // puerto
  'Marbella': <BeachAccessIcon fontSize="small" className="text-yellow-400" />, // playa
  'Tarragona': <FortIcon fontSize="small" className="text-orange-700" />, // romano
  'Burgos': <ChurchIcon fontSize="small" className="text-gray-800" />, // catedral
  'Logroño': <LocalBarIcon fontSize="small" className="text-red-700" />, // vino
  'Ceuta': <PublicIcon fontSize="small" className="text-blue-700" />, // ciudad autónoma
  'Melilla': <PublicIcon fontSize="small" className="text-blue-700" />, // ciudad autónoma
};
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { format, isValid, parseISO, isBefore, startOfDay } from 'date-fns';
import { es } from 'date-fns/locale';

interface VenueSearchBarProps {
  onSearch: (filters: {
    city: string;
    dateRange: { from: string; to: string } | null;
    type: string;
  }) => void;
  initialCity?: string;
  initialDateRange?: { from: string; to: string } | null;
  initialType?: string;
  types?: string[];
}


export function VenueSearchBar({
  onSearch,
  initialCity = '',
  initialDateRange = null,
}: VenueSearchBarProps) {
  const [query, setQuery] = useState('');
  const [city, setCity] = useState(initialCity);
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const spainCities = useMemo(() => City.getCitiesOfCountry('ES').map(c => c.name), []);
  const [capacity, setCapacity] = useState('');
  const [showCapacityDropdown, setShowCapacityDropdown] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(initialDateRange?.from || null);
  const [calendarOpen, setCalendarOpen] = useState(false);

  const formatDate = (date: string | null) => {
    if (!date) return 'Introduce la fecha';
    return format(parseISO(date), 'd MMM yyyy', { locale: es });
  };

  const handleSearch = () => {
    onSearch({ city, dateRange: selectedDate ? { from: selectedDate, to: selectedDate } : null, type: capacity || '' });
  };

  const hasActiveFilters = city !== '' || capacity !== '' || selectedDate !== null;

  const handleClearFilters = () => {
    setQuery('');
    setCity('');
    setCapacity('');
    setSelectedDate(null);
    onSearch({ city: '', dateRange: null, type: '' });
  };

  return (
    <form
      className="w-full flex flex-col items-center my-2 gap-2 sm:gap-1"
      onSubmit={e => { e.preventDefault(); handleSearch(); }}
    >
      {/* Buscador principal con botón dentro del input */}
      <div className="relative w-full max-w-full sm:max-w-lg mb-2 px-2 sm:px-0 flex justify-center sticky top-0 left-0 right-0 w-full z-40 bg-background/95 backdrop-blur shadow-md sm:static sm:z-auto sm:bg-transparent sm:backdrop-blur-none sm:shadow-none">
        <div className="w-full">
          <div className="relative w-full">
            <Input
              placeholder="Empieza a buscar"
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="w-full h-14 sm:h-16 text-base sm:text-lg px-6 pr-24 py-3 rounded-[2.5rem] bg-white shadow-lg border border-border/10 focus:ring-2 focus:ring-primary/30 focus:outline-none font-medium text-black placeholder:text-black/60 transition-all"
              autoComplete="off"
              style={{ boxShadow: '0 2px 16px 0 rgba(0,0,0,0.07)' }}
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white border border-border/10 text-primary rounded-full px-4 py-2 font-semibold shadow hover:bg-primary/90 hover:text-white focus:bg-primary transition-all text-[15px] flex items-center justify-center h-11 sm:h-12"
              style={{ minWidth: 70, zIndex: 2 }}
            >
              Buscar
            </button>
          </div>
        </div>
      </div>
      {/* Filtros secundarios: ocultos en móvil, visibles en sm+ */}
      <div className="hidden sm:flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center justify-center gap-2 sm:gap-0 w-full max-w-full sm:max-w-xs bg-white/80 rounded-md shadow border border-border/20 px-2 sm:px-0.5 py-2 sm:py-0 transition-all text-[13px] sm:text-[12px] min-h-0">
        {/* Ciudad */}
        <div className="relative flex-1 min-w-0 flex items-center mb-2 sm:mb-0">
          <Input
            placeholder="Ciudad..."
            value={city === 'all' ? '' : city}
            onFocus={() => setShowCityDropdown(true)}
            onBlur={() => setTimeout(() => setShowCityDropdown(false), 120)}
            onChange={e => {
              setCity(e.target.value);
              setShowCityDropdown(true);
            }}
            className="w-full min-w-0 bg-transparent border-none focus:ring-0 focus:outline-none text-center text-[13px] sm:text-[11px] font-medium text-black placeholder:text-black/60 px-1 py-1 rounded-full"
            autoComplete="off"
          />
          <span className="mx-1 h-4 w-px bg-border/60 hidden sm:inline-block" />
          {showCityDropdown && (
            <div className="absolute left-0 right-0 top-12 z-30 bg-white rounded-2xl shadow-lg border border-border/20 max-h-64 overflow-y-auto text-left animate-fade-in">
              <ul>
                {spainCities.filter(c => c.toLowerCase().includes(city.toLowerCase())).slice(0, 10).map((c) => (
                  <li
                    key={c}
                    className="px-4 py-2 cursor-pointer hover:bg-primary/10 text-black text-[15px] flex items-center gap-2"
                    onMouseDown={() => {
                      setCity(c);
                      setShowCityDropdown(false);
                      setTimeout(() => {
                        const input = document.activeElement as HTMLInputElement;
                        if (input) input.blur();
                      }, 0);
                    }}
                  >
                    {cityIconMap[c] || <LocationCityIcon fontSize="small" className="text-primary" />} {c}
                  </li>
                ))}
                {spainCities.filter(c => c.toLowerCase().includes(city.toLowerCase())).length === 0 && (
                  <li className="px-4 py-2 text-muted-foreground text-[15px]">No hay resultados</li>
                )}
              </ul>
            </div>
          )}
        </div>
        {/* Fecha */}
        <div className="flex-1 min-w-0 flex items-center mb-2 sm:mb-0">
          <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
            <PopoverTrigger asChild>
              <button
                type="button"
                className="w-full bg-transparent border-none focus:ring-0 focus:outline-none text-center text-[13px] sm:text-[11px] font-medium text-black placeholder:text-black/60 px-1 py-1 rounded-full cursor-pointer"
                onClick={() => setCalendarOpen(true)}
              >
                <span className={selectedDate ? 'text-black' : 'text-black/60'}>
                  {formatDate(selectedDate)}
                </span>
              </button>
            </PopoverTrigger>
            <PopoverContent sideOffset={8} align="center" className="z-50 bg-white rounded-2xl shadow-lg p-2 border border-border/20">
              <div className="text-black">
                <Calendar
                  mode="single"
                  selected={selectedDate ? new Date(selectedDate) : undefined}
                  onSelect={date => {
                    if (date) {
                      const year = date.getFullYear();
                      const month = String(date.getMonth() + 1).padStart(2, '0');
                      const day = String(date.getDate()).padStart(2, '0');
                      setSelectedDate(`${year}-${month}-${day}`);
                      setCalendarOpen(false);
                    }
                  }}
                  numberOfMonths={1}
                  locale={es}
                  showOutsideDays
                  className="min-w-[220px] rounded-2xl text-black"
                  modifiers={{ today: [new Date()] }}
                  modifiersStyles={{ today: { border: '2px solid #2563eb', borderRadius: '50%' } }}
                  today={new Date()}
                  disabled={date => isBefore(date, startOfDay(new Date()))}
                />
              </div>
            </PopoverContent>
          </Popover>
          <span className="mx-1 h-4 w-px bg-border/60 hidden sm:inline-block" />
        </div>
        {/* Capacidad */}
        <div className="relative flex-1 min-w-0 flex items-center mb-2 sm:mb-0">
          <button
            type="button"
            className={`w-full min-w-0 bg-transparent border-none focus:ring-0 focus:outline-none text-center text-[13px] sm:text-[11px] font-medium px-1 py-1 rounded-full cursor-pointer border border-transparent hover:border-primary/30 transition ${capacity ? 'text-black' : 'text-black/60'}`}
            onClick={() => { setShowCapacityDropdown(true); setShowCityDropdown(false); }}
            onBlur={() => setTimeout(() => setShowCapacityDropdown(false), 120)}
          >
            {capacity ? `Capacidad ${capacity}` : 'Capacidad'}
          </button>
          {showCapacityDropdown && (
            <div className="absolute left-0 right-0 top-12 z-30 bg-white rounded-2xl shadow-lg border border-border/20 max-h-64 overflow-y-auto text-left animate-fade-in">
              <ul>
                {['100', '1000', '5000'].map((cap) => (
                  <li
                    key={cap}
                    className="px-4 py-2 cursor-pointer hover:bg-primary/10 text-black text-[15px] flex items-center gap-2"
                    onMouseDown={() => { setCapacity('+' + cap); setShowCapacityDropdown(false); }}
                  >
                    <Plus className="w-4 h-4 text-primary" />
                    {cap}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        {/* Limpiar filtros y buscar */}
        {hasActiveFilters && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="rounded-full p-2 text-primary hover:bg-primary/10 focus:bg-primary/10 transition-all"
            aria-label="Limpiar filtros"
            onClick={handleClearFilters}
          >
            <CleaningServicesIcon fontSize="small" className="w-5 h-5" />
          </Button>
        )}
        {/* Botón de buscar eliminado de aquí, ahora está dentro del input principal */}
      </div>
    </form>
  );
}

