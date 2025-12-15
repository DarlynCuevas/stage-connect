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
    onSearch({ query, city, dateRange: selectedDate ? { from: selectedDate, to: selectedDate } : null, type: capacity || '' });
  };

  const hasActiveFilters = city !== '' || capacity !== '' || selectedDate !== null;

  const handleClearFilters = () => {
    setQuery('');
    setCity('');
    setCapacity('');
    setSelectedDate(null);
    onSearch({ query: '', city: '', dateRange: null, type: '' });
  };

  return (
    <form className="w-full flex flex-col items-center my-6 gap-2" onSubmit={e => { e.preventDefault(); handleSearch(); }}>
      {/* Buscador principal */}
      <Input
        placeholder="Buscar por nombre, ciudad o local..."
        value={query}
        onChange={e => setQuery(e.target.value)}
        className="w-full max-w-xl h-14 text-lg px-6 py-3 rounded-full shadow border border-border/20 bg-white/95 focus:ring-2 focus:ring-primary/30 focus:outline-none font-medium text-black placeholder:text-black/60 mb-1"
        autoComplete="off"
      />
      {/* Filtros secundarios */}
      <div className="flex flex-row flex-wrap items-center justify-center gap-2 w-full max-w-xl bg-white/80 rounded-2xl shadow border border-border/20 px-2 py-2 transition-all">
        {/* Ciudad */}
        <div className="relative flex-1 min-w-[120px]">
          <Input
            placeholder="Ciudad..."
            value={city === 'all' ? '' : city}
            onFocus={() => setShowCityDropdown(true)}
            onBlur={() => setTimeout(() => setShowCityDropdown(false), 120)}
            onChange={e => {
              setCity(e.target.value);
              setShowCityDropdown(true);
            }}
            className="w-full min-w-0 bg-transparent border-none focus:ring-0 focus:outline-none text-center text-[15px] font-medium text-black placeholder:text-black/60 px-2 py-1 rounded-full"
            autoComplete="off"
          />
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
        <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
          <PopoverTrigger asChild>
            <button
              type="button"
              className="flex-1 min-w-[120px] bg-transparent border-none focus:ring-0 focus:outline-none text-center text-[15px] font-medium text-black placeholder:text-black/60 px-2 py-1 rounded-full cursor-pointer"
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
        {/* Capacidad */}
        <div className="relative flex-1 min-w-[120px]">
          <button
            type="button"
            className={`w-full min-w-0 bg-transparent border-none focus:ring-0 focus:outline-none text-center text-[15px] font-medium px-2 py-1 rounded-full cursor-pointer border border-transparent hover:border-primary/30 transition ${capacity ? 'text-black' : 'text-black/60'}`}
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
        <Button
          variant="soft"
          size="sm"
          className="rounded-full px-4 py-2 font-semibold shadow-none bg-primary/90 hover:bg-primary focus:bg-primary text-primary-foreground transition-all text-[15px] flex items-center justify-center"
          type="submit"
        >
          Buscar
        </Button>
      </div>
    </form>
  );
}

