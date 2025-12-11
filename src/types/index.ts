export type UserRole = 'Artista' | 'Manager' | 'Local' | 'Promotor';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  createdAt: Date;
  nickName?: string;
  bio?: string;
  genre?: string[];
  country?: string;
  city?: string;
  basePrice?: number;
  banner?: string;
  rating?: number;
  totalShows?: number;
  verified?: boolean;
  gender?: string;
  managerId?: string | number;
  socialLinks?: SocialLinks;
  gallery?: string[];
  priceVariants?: PriceVariant[];
}

export interface Artist {
  id: string;
  userId: string;
  name: string;
  nickName: string;
  avatar: string;
  banner?: string;
  bio: string;
  genre: string[];
  country: string;
  city: string;
  basePrice: number;
  priceVariants?: PriceVariant[];
  socialLinks: SocialLinks;
  gallery: string[];
  videos: string[];
  managerId?: string | number;
  rating: number;
  totalShows: number;
  verified: boolean;
  gender?: string;
}

export interface PriceVariant {
  id: string;
  name: string;
  description: string;
  price: number;
}

export interface SocialLinks {
  instagram?: string;
  spotify?: string;
  youtube?: string;
  tiktok?: string;
  website?: string;
}

export interface Manager {
  id: string;
  userId: string;
  name: string;
  company?: string;
  artists: string[]; // Artist IDs
  avatar: string;
}

export interface Venue {
  id: string;
  userId: string;
  name: string;
  type: 'club' | 'bar' | 'festival' | 'concert_hall' | 'private' | 'other';
  capacity: number;
  city: string;
  country: string;
  avatar: string;
}

export interface Promoter {
  id: string;
  userId: string;
  name: string;
  company?: string;
  city: string;
  country: string;
  avatar: string;
  eventsOrganized: number;
}

export interface CalendarDate {
  date: string; // ISO date string
  available: boolean;
  eventId?: string;
  note?: string;
  confirmed?: boolean; // true cuando es una reserva aceptada
  blocked?: boolean; // true cuando el artista bloquea el día
}

export interface BookingRequest {
  id: number | string;
  artist?: User;
  requester?: User;
  status: 'Pending' | 'Accepted' | 'Rejected';
  eventDate: string;
  eventLocation: string;
  eventType: string;
  offeredPrice: number;
  message?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Negotiation {
  id: string;
  senderId: string;
  senderRole: UserRole;
  message: string;
  proposedPrice?: number;
  createdAt: Date;
}

export interface SearchFilters {
  query?: string;
  genre?: string[];
  country?: string;
  city?: string;
  priceMin?: number;
  priceMax?: number;
  managerId?: string;
  availability?: string;
}
