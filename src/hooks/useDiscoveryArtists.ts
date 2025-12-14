import { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/api';

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
}

export interface DiscoveryArtistFilters {
  city: string;
  genre: string[];
  priceMin?: number;
  priceMax?: number;
}

export function useDiscoveryArtists() {
  const [artists, setArtists] = useState<DiscoveryArtist[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<DiscoveryArtistFilters>({ city: 'all', genre: [] });

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
        const url = `/public/users?role=Artista${params.toString() ? '&' + params.toString() : ''}`;
        const response = await apiFetch(url);
        setArtists(response);
      } catch (error) {
        setArtists([]);
      } finally {
        setLoading(false);
      }
    };
    fetchArtists();
  }, [filters]);

  return { artists, loading, setFilters, filters };
}
