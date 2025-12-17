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
  const [promoters, setPromoters] = useState<DiscoveryPromoter[]>([]);
   const [loading, setLoading] = useState(true);
   // Por defecto, ciudad vacía (no 'all')
   const [filters, setFilters] = useState<DiscoveryPromoterFilters>({ city: '' });
    const { token } = useAuth();
 
 
   useEffect(() => {
     const fetchPromoters = async () => {
       setLoading(true);
       try {
         const params = new URLSearchParams();
         if (filters.city !== 'all') params.append('city', filters.city);
       
         if (filters.query && filters.query.trim() !== '') params.append('query', filters.query.trim());
         const url = `/public/promoters${params.toString() ? '?' + params.toString() : ''}`;
         const response = await apiFetch(url, token ? { token } : undefined);
         setPromoters(response);
       } catch (error) {
         setPromoters([]);
       } finally {
         setLoading(false);
       }
     };
     fetchPromoters();
   }, [filters]);
 
   return { promoters, loading, setFilters, filters };
}

