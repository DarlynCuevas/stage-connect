import { Artist, Manager, Venue, Promoter, CalendarDate, User } from '@/types';

export const mockUsers: User[] = [];

export const mockArtists: Artist[] = [];

export const mockManagers: Manager[] = [];

export const mockVenues: Venue[] = [
  {
    id: '1',
    userId: '10',
    name: 'Club Ibiza',
    type: 'club',
    capacity: 1200,
    city: 'Ibiza',
    country: 'España',
    avatar: '/placeholder.svg',
    featured: true, // destacado
    verified: true, // verificado
  },
  {
    id: '2',
    userId: '11',
    name: 'Sala Apolo',
    type: 'concert_hall',
    capacity: 900,
    city: 'Barcelona',
    country: 'España',
    avatar: '/placeholder.svg',
    featured: true, // destacado
    verified: true, // verificado
  },
  {
    id: '3',
    userId: '12',
    name: 'Bar Sol',
    type: 'bar',
    capacity: 300,
    city: 'Madrid',
    country: 'España',
    avatar: '/placeholder.svg',
    featured: true, // destacado
    verified: true, // verificado
  },
  {
    id: '4',
    userId: '13',
    name: 'Teatro Real',
    type: 'theater',
    capacity: 1800,
    city: 'Madrid',
    country: 'España',
    avatar: '/placeholder.svg',
    featured: true, // destacado
    verified: true, // verificado
  },
];

export const mockPromoters: Promoter[] = [];

export const mockCalendarDates: CalendarDate[] = [
  { date: '2025-01-15', available: true },
  { date: '2025-01-16', available: false, note: 'Festival Sónar' },
  { date: '2025-01-17', available: true },
  { date: '2025-01-18', available: true },
  { date: '2025-01-20', available: false, note: 'Club Pacha' },
  { date: '2025-01-25', available: true },
  { date: '2025-01-26', available: true },
];

export const genres = [
  'Techno', 'House', 'Progressive', 'Trance', 'EDM',
  'Pop', 'Rock', 'Indie', 'Alternative', 'R&B',
  'Hip-Hop', 'Rap', 'Trap', 'Reggaeton', 'Latin',
  'Jazz', 'Soul', 'Funk', 'Disco', 'Electrónica',
  'Folk', 'Country', 'Reggae', 'Metal', 'Punk',
];

export const countries = [
  'España', 'México', 'Argentina', 'Colombia', 'Chile',
  'Perú', 'Puerto Rico', 'Estados Unidos', 'Brasil', 'Portugal',
];

export const cities: Record<string, string[]> = {
  'España': ['Madrid', 'Barcelona', 'Valencia', 'Sevilla', 'Bilbao', 'Ibiza'],
  'México': ['Ciudad de México', 'Guadalajara', 'Monterrey', 'Cancún', 'Tijuana'],
  'Argentina': ['Buenos Aires', 'Córdoba', 'Rosario', 'Mendoza'],
  'Colombia': ['Bogotá', 'Medellín', 'Cali', 'Cartagena', 'Barranquilla'],
  'Chile': ['Santiago', 'Valparaíso', 'Viña del Mar'],
  'Puerto Rico': ['San Juan', 'Ponce', 'Mayagüez'],
};
