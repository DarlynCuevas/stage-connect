import { useEffect, useState } from 'react';
import { Promoter } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import apiFetch from '@/lib/api';

export interface DiscoveryPromoter {
  id: number;
  name: string;
  city?: string;
  avatar?: string;
  bio?: string;
  featured?: boolean;
  verified?: boolean;
  favorite?: boolean;
  rating?: number;
}
export interface DiscoveryPromoterFilters {
  city: string;
  query?: string;
}
export function useDiscoveryPromoters() {
  const [populares, setPopulares] = useState<DiscoveryPromoter[]>([]);
  const [destacados, setDestacados] = useState<DiscoveryPromoter[]>([]);
  const [verificados, setVerificados] = useState<DiscoveryPromoter[]>([]);
  const [resto, setResto] = useState<DiscoveryPromoter[]>([]);
  const [pagination, setPagination] = useState<any>({ page: 1, pageSize: 20, total: 0, hasNextPage: false });
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<DiscoveryPromoterFilters>({ city: '' });
  const { token } = useAuth();
  const promoters = [...populares, ...destacados, ...verificados, ...resto];

  useEffect(() => {
    const fetchPromoters = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (filters.city && filters.city !== 'all') params.append('city', filters.city);
        if (filters.query && filters.query.trim() !== '') params.append('query', filters.query.trim());
        const url = `/public/promoters/discover${params.toString() ? '?' + params.toString() : ''}`;
        const response = await apiFetch(url, token ? { token } : undefined);
        setPopulares(response.populares || []);
        setDestacados(response.destacados || []);
        setVerificados(response.verificados || []);
        setResto(response.resto || []);
        setPagination(response.pagination || { page: 1, pageSize: 20, total: 0, hasNextPage: false });
      } catch (error) {
        setPopulares([]);
        setDestacados([]);
        setVerificados([]);
        setResto([]);
        setPagination({ page: 1, pageSize: 20, total: 0, hasNextPage: false });
      } finally {
        setLoading(false);
      }
    };
    fetchPromoters();
  }, [filters, token]);

  return { populares, destacados, verificados, resto, pagination, promoters, loading, setFilters, filters, setPopulares, setDestacados, setVerificados, setResto };
}

