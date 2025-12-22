import { useState, useEffect, useCallback } from 'react';
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
  const [recienLlegados, setRecienLlegados] = useState<DiscoveryArtist[]>([]);
  const [enCiudad, setEnCiudad] = useState<DiscoveryArtist[]>([]);
  const [masContratados, setMasContratados] = useState<DiscoveryArtist[]>([]);
  const [resto, setResto] = useState<DiscoveryArtist[]>([]);
  const [pagination, setPagination] = useState<any>({ page: 1, pageSize: 20, total: 0, hasNextPage: false });
  const [loading, setLoading] = useState(true);
  const { user, token } = useAuth();
  // Valor inicial sin ciudad para que la llamada inicial sea a /public/artists/discover
  const [filters, setFilters] = useState<DiscoveryArtistFilters>({ city: '', genre: [], page: 1, pageSize: 20 });
  const artists = [...populares, ...destacados, ...enCiudad, ...resto];


  useEffect(() => {
    // Si no hay filtros activos usar el nuevo endpoint
    const noFilters = !filters || (
      (!filters.city || filters.city === '' || filters.city === 'all') &&
      (!filters.genre || filters.genre.length === 0) &&
      !filters.priceMin &&
      !filters.priceMax &&
      !filters.query &&
      !filters.date
    );
    const fetchArtists = async () => {
      setLoading(true);
      try {
        let response;
        if (noFilters) {
          response = await apiFetch('/public/artists/discover', token ? { token } : undefined);
        } else {
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
          response = await apiFetch(url, token ? { token } : undefined);
        }
        setPopulares(response.populares || []);
        setDestacados(response.destacados || []);
        setRecienLlegados(response.recienLlegados || []);
        setEnCiudad(response.enCiudad || []);
        setMasContratados(response.masContratados || []);
        setResto(response.resto || []);
        setPagination(response.pagination || { page: 1, pageSize: 20, total: 0, hasNextPage: false });
      } catch (error) {
        setPopulares([]);
        setDestacados([]);
        setEnCiudad([]);
        setMasContratados([]);
        setResto([]);
        setPagination({ page: 1, pageSize: 20, total: 0, hasNextPage: false });
      } finally {
        setLoading(false);
      }
    };
    fetchArtists();
  }, [filters, token]);

  return { populares, destacados, recienLlegados, enCiudad, masContratados, resto, pagination, artists, loading, setFilters, filters, setPopulares, setDestacados, setRecienLlegados, setEnCiudad, setMasContratados, setResto };
}
