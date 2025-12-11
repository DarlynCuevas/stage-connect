import { Artist, Manager, Venue, Promoter, BookingRequest, CalendarDate, User } from '@/types';

export const mockUsers: User[] = [
  { id: 'u1', name: 'Darlyn Cuevas', email: 'carlos@example.com', role: 'artist', createdAt: new Date() },
  { id: 'u2', name: 'María López', email: 'maria@example.com', role: 'manager', createdAt: new Date() },
  { id: 'u3', name: 'Club Nocturno', email: 'club@example.com', role: 'venue', createdAt: new Date() },
  { id: 'u4', name: 'Pedro Eventos', email: 'pedro@example.com', role: 'promoter', createdAt: new Date() },
];

export const mockArtists: Artist[] = [
  {
    id: 'a1',
    userId: 'u1',
    name: 'Darlyn Cuevas',
    stageName: 'EL DIZZY',
    avatar: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400',
    banner: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1200',
    bio: 'Compositor, productor e intérprete con más de 10 años de experiencia en la escena musical internacional.',
    genre: ['Urbano'],
    country: 'España',
    city: 'Barcelona',
    basePrice: 2500,
    priceVariants: [
      { id: 'pv1', name: 'Set Corto (25min)', description: 'set de 25 minutos', price: 2500 },
      { id: 'pv2', name: 'Set Largo (45min)', description: 'set de 45 minutos', price: 4000 },
      { id: 'pv3', name: 'Festival', description: 'Actuación en festival con rider completo', price: 8000 },
    ],
    socialLinks: {
      instagram: 'darlyndcs',
      spotify: 'darlyndcs',
      youtube: 'darlyndcs',
    },
    gallery: [
      'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600',
      'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=600',
      'https://images.unsplash.com/photo-1571266028243-e4733b0f0bb0?w=600',
    ],
    videos: ['https://www.youtube.com/watch?v=example1'],
    managerId: 'm1',
    rating: 4.8,
    totalShows: 245,
    verified: true,
  },
  {
    id: 'a2',
    userId: 'u5',
    name: 'Ana Martínez',
    stageName: 'LUNA',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    banner: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200',
    bio: 'Cantante y compositora de música pop alternativo con influencias de R&B. Nominada a los Grammy Latinos.',
    genre: ['Pop', 'R&B', 'Alternative'],
    country: 'México',
    city: 'Ciudad de México',
    basePrice: 15000,
    priceVariants: [
      { id: 'pv4', name: 'Acústico', description: 'Show acústico íntimo', price: 8000 },
      { id: 'pv5', name: 'Show Completo', description: 'Show con banda completa', price: 15000 },
      { id: 'pv6', name: 'Festival Headliner', description: 'Headliner de festival', price: 50000 },
    ],
    socialLinks: {
      instagram: 'lunamusic',
      spotify: 'lunaartist',
      tiktok: 'lunamusic',
    },
    gallery: [
      'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=600',
      'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=600',
    ],
    videos: [],
    rating: 4.9,
    totalShows: 180,
    verified: true,
  },
  {
    id: 'a3',
    userId: 'u6',
    name: 'Miguel Fernández',
    stageName: 'THUNDER',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    banner: 'https://images.unsplash.com/photo-1501612780327-45045538702b?w=1200',
    bio: 'Guitarrista virtuoso y frontman de rock alternativo. Conocido por sus potentes shows en vivo.',
    genre: ['Rock', 'Alternative', 'Indie'],
    country: 'Argentina',
    city: 'Buenos Aires',
    basePrice: 5000,
    socialLinks: {
      instagram: 'thunderrock',
      youtube: 'thunderband',
    },
    gallery: [
      'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=600',
    ],
    videos: [],
    managerId: 'm1',
    rating: 4.7,
    totalShows: 320,
    verified: true,
  },
  {
    id: 'a4',
    userId: 'u7',
    name: 'Sofía Herrera',
    stageName: 'NEON',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
    bio: 'Productora y DJ de música electrónica experimental. Pionera del nuevo sonido latinoamericano.',
    genre: ['Electronic', 'Experimental', 'Ambient'],
    country: 'Colombia',
    city: 'Bogotá',
    basePrice: 3500,
    socialLinks: {
      instagram: 'neonmusic',
      spotify: 'neonartist',
    },
    gallery: [],
    videos: [],
    rating: 4.6,
    totalShows: 95,
    verified: false,
  },
  {
    id: 'a5',
    userId: 'u8',
    name: 'Diego Morales',
    stageName: 'VIBRA',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400',
    bio: 'Artista urbano con fusión de reggaeton, trap y sonidos latinos tradicionales.',
    genre: ['Reggaeton', 'Trap', 'Latin'],
    country: 'Puerto Rico',
    city: 'San Juan',
    basePrice: 12000,
    socialLinks: {
      instagram: 'vibramusic',
      tiktok: 'vibra',
    },
    gallery: [],
    videos: [],
    rating: 4.5,
    totalShows: 150,
    verified: true,
  },
];

export const mockManagers: Manager[] = [
  {
    id: 'm1',
    userId: 'u2',
    name: 'María López',
    company: 'Stellar Management',
    artists: ['a1', 'a3'],
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400',
  },
];

export const mockVenues: Venue[] = [
  {
    id: 'v1',
    userId: 'u3',
    name: 'Club Nocturno',
    type: 'club',
    capacity: 500,
    city: 'Barcelona',
    country: 'España',
    avatar: 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=400',
  },
];

export const mockPromoters: Promoter[] = [
  {
    id: 'p1',
    userId: 'u4',
    name: 'Pedro García',
    company: 'EventosPro',
    city: 'Madrid',
    country: 'España',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
    eventsOrganized: 45,
  },
];

export const mockCalendarDates: CalendarDate[] = [
  { date: '2025-01-15', available: true },
  { date: '2025-01-16', available: false, note: 'Festival Sónar' },
  { date: '2025-01-17', available: true },
  { date: '2025-01-18', available: true },
  { date: '2025-01-20', available: false, note: 'Club Pacha' },
  { date: '2025-01-25', available: true },
  { date: '2025-01-26', available: true },
];

export const mockBookingRequests: BookingRequest[] = [
  {
    id: 'br1',
    artistId: 'a1',
    requesterId: 'v1',
    requesterType: 'venue',
    status: 'pending',
    eventDate: '2025-02-14',
    eventLocation: 'Club Nocturno, Barcelona',
    eventType: 'Club Night',
    offeredPrice: 2800,
    message: 'Nos encantaría contar contigo para nuestra noche especial de San Valentín.',
    negotiations: [],
    createdAt: new Date('2025-01-05'),
    updatedAt: new Date('2025-01-05'),
  },
  {
    id: 'br2',
    artistId: 'a1',
    requesterId: 'p1',
    requesterType: 'promoter',
    status: 'negotiating',
    eventDate: '2025-03-20',
    eventLocation: 'Wizink Center, Madrid',
    eventType: 'Festival',
    offeredPrice: 6000,
    message: 'Queremos que seas parte del lineup de nuestro festival de primavera.',
    negotiations: [
      {
        id: 'n1',
        senderId: 'u1',
        senderRole: 'artist',
        message: 'Gracias por la propuesta. Mi caché para festivales es de 8000€. ¿Podemos negociar?',
        proposedPrice: 8000,
        createdAt: new Date('2025-01-06'),
      },
      {
        id: 'n2',
        senderId: 'u4',
        senderRole: 'promoter',
        message: 'Entendemos tu posición. Podemos ofrecerte 7000€ + gastos de viaje.',
        proposedPrice: 7000,
        createdAt: new Date('2025-01-07'),
      },
    ],
    createdAt: new Date('2025-01-04'),
    updatedAt: new Date('2025-01-07'),
  },
  {
    id: 'br3',
    artistId: 'a1',
    requesterId: 'v1',
    requesterType: 'venue',
    status: 'confirmed',
    eventDate: '2025-01-20',
    eventLocation: 'Club Nocturno, Barcelona',
    eventType: 'Club Night',
    offeredPrice: 2500,
    negotiations: [],
    createdAt: new Date('2024-12-15'),
    updatedAt: new Date('2024-12-20'),
  },
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
