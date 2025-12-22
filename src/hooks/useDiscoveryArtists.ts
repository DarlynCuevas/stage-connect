import { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

export interface DiscoveryArtist {
  id: number;
  user_id?: number;
  name: string;
  city?: string;
  genre?: string;
  avatar?: string;
  bio?: string;
  featured?: boolean;
  verified?: boolean;
  favorite?: boolean;
  basePrice?: number;
  rating?: number;
  blockedDays?: string[];
  nickName?: string;
  reviewsCount?: number;
}


export interface DiscoveryArtistFilters {
  city: string;
  genre: string[];
  priceMin?: number;
  priceMax?: number;
  query?: string;
  page?: number;
  pageSize?: number;
  country?: string;
  date?: string;
}



export function useDiscoveryArtists() {
  const [populares, setPopulares] = useState<DiscoveryArtist[]>([]);
  const [destacados, setDestacados] = useState<DiscoveryArtist[]>([]);
  const [enCiudad, setEnCiudad] = useState<DiscoveryArtist[]>([]);
  const [resto, setResto] = useState<DiscoveryArtist[]>([]);
  const [pagination, setPagination] = useState<any>({ page: 1, pageSize: 20, total: 0, hasNextPage: false });
  const [loading, setLoading] = useState(true);
  const { user, token } = useAuth();
  // Si el usuario tiene ciudad, usarla como valor inicial
  const initialCity = user?.city || '';
  const [filters, setFilters] = useState<DiscoveryArtistFilters>({ city: initialCity, genre: [], page: 1, pageSize: 20 });
  const artists = [...populares, ...destacados, ...enCiudad, ...resto];

  useEffect(() => {
    const fetchArtists = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (filters.country && filters.country !== 'all') params.append('country', filters.country);
        if (filters.city !== 'all') params.append('city', filters.city);
        if (filters.genre && filters.genre.length > 0) {
          filters.genre.forEach((g) => params.append('genre', g));
        }
        if (filters.priceMin !== undefined) params.append('priceMin', String(filters.priceMin));
        if (filters.priceMax !== undefined) params.append('priceMax', String(filters.priceMax));
        if (filters.query && filters.query.trim() !== '') params.append('query', filters.query.trim());
        if (filters.date) params.append('date', filters.date);
        if (filters.page !== undefined) params.append('page', String(filters.page));
        if (filters.pageSize !== undefined) params.append('pageSize', String(filters.pageSize));
        const url = `/public/artists${params.toString() ? '?' + params.toString() : ''}`;
        const response = await apiFetch(url, token ? { token } : undefined);
        setPopulares(response.populares || []);
        setDestacados(response.destacados || []);
        setEnCiudad(response.enCiudad || []);
        setResto(response.resto || []);
        setPagination(response.pagination || { page: 1, pageSize: 20, total: 0, hasNextPage: false });
      } catch (error) {
        setPopulares([]);
        setDestacados([]);
        setEnCiudad([]);
        setResto([]);
        setPagination({ page: 1, pageSize: 20, total: 0, hasNextPage: false });
      } finally {
        setLoading(false);
      }
    };
    fetchArtists();
  }, [filters]);

  return { populares, destacados, enCiudad, resto, pagination, artists, loading, setFilters, filters, setPopulares, setDestacados, setEnCiudad, setResto };
}
