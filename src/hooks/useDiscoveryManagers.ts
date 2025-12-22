
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
  const [verificados, setVerificados] = useState<DiscoveryManager[]>([]);
  const [resto, setResto] = useState<DiscoveryManager[]>([]);
  const [pagination, setPagination] = useState<any>({ page: 1, pageSize: 20, total: 0, hasNextPage: false });
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<DiscoveryManagerFilters>({ city: '', country: '', page: 1, pageSize: 20 });
  const { token } = useAuth();
  const managers = [...populares, ...destacados, ...verificados, ...resto];

  useEffect(() => {
    const noFilters = !filters || (
      (!filters.city || filters.city === '' || filters.city === 'all') &&
      (!filters.country || filters.country === '' || filters.country === 'all') &&
      !filters.query
    );
    const fetchManagers = async () => {
      setLoading(true);
      try {
        let response;
        if (noFilters) {
          response = await apiFetch('/public/managers/discover', token ? { token } : undefined);
        } else {
          const params = new URLSearchParams();
          if (filters.city && filters.city !== 'all') params.append('city', filters.city);
          if (filters.query && filters.query.trim() !== '') params.append('query', filters.query.trim());
          if (filters.page) params.append('page', String(filters.page));
          if (filters.pageSize) params.append('pageSize', String(filters.pageSize));
          const url = `/public/managers${params.toString() ? '?' + params.toString() : ''}`;
          response = await apiFetch(url, token ? { token } : undefined);
        }
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
    fetchManagers();
  }, [filters, token]);

  return {
    populares,
    destacados,
    verificados,
    resto,
    pagination,
    managers,
    loading,
    setFilters,
    filters,
    setPopulares,
    setDestacados,
    setVerificados,
    setResto,
  };
}
