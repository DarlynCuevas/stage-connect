import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { apiFetch } from '@/lib/api';


export interface DiscoveryVenue {
  id: number;
  name: string;
  city?: string;
  province?: string;
  capacity?: number;
  amenities?: string[];
  openingTime?: string;
  closingTime?: string;
  avatar?: string;
  bio?: string;
  featured?: boolean;
  verified?: boolean;
  favorite?: boolean;
  blockedDays?: string[];
}

export interface DiscoveryFilters {
  city: string;
  type: string;
  query?: string;
  date?: string; // Nueva propiedad para la fecha seleccionada
}

export function useDiscoveryVenues() {
  const [populares, setPopulares] = useState<DiscoveryVenue[]>([]);
  const [destacados, setDestacados] = useState<DiscoveryVenue[]>([]);
  const [recienLlegados, setRecienLlegados] = useState<DiscoveryVenue[]>([]);
  const [enCiudad, setEnCiudad] = useState<DiscoveryVenue[]>([]);
  const [resto, setResto] = useState<DiscoveryVenue[]>([]);
  const [pagination, setPagination] = useState<any>({ page: 1, pageSize: 20, total: 0, hasNextPage: false });
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<DiscoveryFilters>({ city: '', type: '', query: '', date: undefined });
  const { token } = useAuth();
  const venues = [...populares, ...destacados, ...enCiudad, ...resto];

  useEffect(() => {
    const fetchVenues = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (filters.city && filters.city !== 'all') params.append('city', filters.city);
        if (filters.query && filters.query.trim() !== '') params.append('query', filters.query.trim());
        if (filters.date) params.append('date', filters.date);
        const url = `/public/venues/discover${params.toString() ? '?' + params.toString() : ''}`;
        const response = await apiFetch(url, token ? { token } : undefined);
        setPopulares(response.populares || []);
        setDestacados(response.destacados || []);
        setRecienLlegados(response.recienLlegados || []);
        setEnCiudad(response.enCiudad || []);
        setResto(response.resto || []);
        setPagination(response.pagination || { page: 1, pageSize: 20, total: 0, hasNextPage: false });
      } catch (error) {
        setPopulares([]);
        setDestacados([]);
        setRecienLlegados([]);
        setEnCiudad([]);
        setResto([]);
        setPagination({ page: 1, pageSize: 20, total: 0, hasNextPage: false });
      } finally {
        setLoading(false);
      }
    };
    fetchVenues();
  }, [filters, token]);

  return { populares, destacados, recienLlegados, enCiudad, resto, pagination, venues, loading, setFilters, filters, setPopulares, setDestacados, setRecienLlegados, setEnCiudad, setResto };
}
