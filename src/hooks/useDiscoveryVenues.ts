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
  const [venues, setVenues] = useState<DiscoveryVenue[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<DiscoveryFilters>({ city: 'all', type: 'all', query: '', date: undefined });
  const { token } = useAuth();

  useEffect(() => {
    const fetchVenues = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (filters.city && filters.city !== 'all') params.append('city', filters.city);
        if (filters.type && filters.type !== 'all') params.append('type', filters.type);
        if (filters.query && filters.query.trim() !== '') params.append('query', filters.query.trim());
        if (filters.date) params.append('date', filters.date);
        const url = `/users/venues-search${params.toString() ? '?' + params.toString() : ''}`;
        const response = await apiFetch(url, token ? { token } : undefined);
        setVenues(response || []);
      } catch (error) {
        setVenues([]);
      } finally {
        setLoading(false);
      }
    };
    fetchVenues();
  }, [filters]);

  return { venues, loading, filters, setFilters };
}
