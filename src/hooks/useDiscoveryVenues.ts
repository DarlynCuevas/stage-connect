import { useState, useEffect } from 'react';
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
}

export interface DiscoveryFilters {
  city: string;
  type: string;
  // dateRange?: { from: string; to: string };
}

export function useDiscoveryVenues() {
  const [venues, setVenues] = useState<DiscoveryVenue[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<DiscoveryFilters>({ city: 'all', type: 'all' });

  useEffect(() => {
    const fetchVenues = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (filters.city !== 'all') params.append('city', filters.city);
        if (filters.type !== 'all') params.append('type', filters.type);
        // if (filters.dateRange) { ... }
        const url = `/public/venues${params.toString() ? '?' + params.toString() : ''}`;
        const response = await apiFetch(url);
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
