
import { useState, useEffect } from 'react';
import apiFetch from '../lib/api';
import { useAuth } from '@/contexts/AuthContext';

export interface DiscoveryManager {
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
export interface DiscoveryManagerFilters {
  city: string;
  country: string;
  query?: string;
  page?: number;
  pageSize?: number;
}

export function useDiscoveryManagers() {
  const [populares, setPopulares] = useState<DiscoveryManager[]>([]);
  const [destacados, setDestacados] = useState<DiscoveryManager[]>([]);
  const [resto, setResto] = useState<DiscoveryManager[]>([]);
  const [pagination, setPagination] = useState<any>({ page: 1, pageSize: 20, total: 0, hasNextPage: false });
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<DiscoveryManagerFilters>({ city: '', country: '', page: 1, pageSize: 20 });
  const { token } = useAuth();
  const managers = [...populares, ...destacados, ...resto];

  useEffect(() => {
    const fetchManagers = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (filters.city && filters.city !== 'all') params.append('city', filters.city);
        if (filters.query && filters.query.trim() !== '') params.append('query', filters.query.trim());
        if (filters.page) params.append('page', String(filters.page));
        if (filters.pageSize) params.append('pageSize', String(filters.pageSize));
        const url = `/public/managers${params.toString() ? '?' + params.toString() : ''}`;
        const response = await apiFetch(url, token ? { token } : undefined);
        setPopulares(response.populares || []);
        setDestacados(response.destacados || []);
        setResto(response.resto || []);
        setPagination(response.pagination || { page: 1, pageSize: 20, total: 0, hasNextPage: false });
      } catch (error) {
        setPopulares([]);
        setDestacados([]);
        setResto([]);
        setPagination({ page: 1, pageSize: 20, total: 0, hasNextPage: false });
      } finally {
        setLoading(false);
      }
    };
    fetchManagers();
  }, [filters, token]);

  return {
    populares,
    destacados,
    resto,
    pagination,
    managers,
    loading,
    setFilters,
    filters,
    setPopulares,
    setDestacados,
    setResto,
  };
}
