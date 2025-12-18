import { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

export interface DiscoveryArtist {
  id: number;
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
}


export interface DiscoveryArtistFilters {
  city: string;
  genre: string[];
  priceMin?: number;
  priceMax?: number;
  query?: string;
}



export function useDiscoveryArtists() {
  const [artists, setArtists] = useState<DiscoveryArtist[]>([]);
  const [loading, setLoading] = useState(true);
  // Por defecto, ciudad vacía (no 'all')
  const [filters, setFilters] = useState<DiscoveryArtistFilters>({ city: '', genre: [] });
   const { token } = useAuth();


  useEffect(() => {
    const fetchArtists = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (filters.city !== 'all') params.append('city', filters.city);
        if (filters.genre && filters.genre.length > 0) {
          filters.genre.forEach((g) => params.append('genre', g));
        }
        if (filters.priceMin !== undefined) params.append('priceMin', String(filters.priceMin));
        if (filters.priceMax !== undefined) params.append('priceMax', String(filters.priceMax));
        if (filters.query && filters.query.trim() !== '') params.append('query', filters.query.trim());
        const url = `/public/artists${params.toString() ? '?' + params.toString() : ''}`;
        const response = await apiFetch(url, token ? { token } : undefined);
        setArtists(response);
      } catch (error) {
        setArtists([]);
      } finally {
        setLoading(false);
      }
    };
    fetchArtists();
  }, [filters]);

  return { artists, setArtists, loading, setFilters, filters };
}
