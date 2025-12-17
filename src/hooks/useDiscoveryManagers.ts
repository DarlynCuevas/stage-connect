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
  query?: string;
}
export function useDiscoveryManagers() {
  const [managers, setManagers] = useState<DiscoveryManager[]>([]);
   const [loading, setLoading] = useState(true);
   // Por defecto, ciudad vacía (no 'all')
   const [filters, setFilters] = useState<DiscoveryManagerFilters>({ city: '' });
    const { token } = useAuth();
 
 
   useEffect(() => {
     const fetchArtists = async () => {
       setLoading(true);
       try {
         const params = new URLSearchParams();
         if (filters.city !== 'all') params.append('city', filters.city);
       
         if (filters.query && filters.query.trim() !== '') params.append('query', filters.query.trim());
         const url = `/public/managers${params.toString() ? '?' + params.toString() : ''}`;
         const response = await apiFetch(url, token ? { token } : undefined);
         setManagers(response);
       } catch (error) {
         setManagers([]);
       } finally {
         setLoading(false);
       }
     };
     fetchArtists();
   }, [filters]);
 
   return { managers, loading, setFilters, filters };
}
