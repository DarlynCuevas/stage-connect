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
}

export interface DiscoveryArtistFilters {
  city: string;
  genre: string;
}

export function useDiscoveryArtists() {
  const [artists, setArtists] = useState<DiscoveryArtist[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<DiscoveryArtistFilters>({ city: 'all', genre: 'all' });

  useEffect(() => {
    const fetchArtists = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (filters.city !== 'all') params.append('city', filters.city);
        if (filters.genre !== 'all') params.append('genre', filters.genre);
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
