import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiFetch from './api';
import { Artist } from '@/types';

export async function fetchArtistById(id: number | string) {
  const numericId = typeof id === 'string' ? parseInt(id, 10) : id;
  return apiFetch(`/public/users/${numericId}`);
}

export async function fetchArtists(filters?: {
  query?: string;
  genre?: string;
  country?: string;
  city?: string;
  priceMin?: number;
  priceMax?: number;
}) {
  const params = new URLSearchParams();
  params.set('role', 'Artista');
  if (filters) {
    if (filters.query) params.set('query', filters.query);
    if (filters.genre) params.set('genre', filters.genre);
    if (filters.country) params.set('country', filters.country);
    if (filters.city) params.set('city', filters.city);
    if (filters.priceMin !== undefined) params.set('priceMin', String(filters.priceMin));
    if (filters.priceMax !== undefined) params.set('priceMax', String(filters.priceMax));
  }
  return apiFetch(`/public/users?${params.toString()}`);
}

export async function updateProfile(profileData: any, token: string) {
  return apiFetch('/users/profile', {
    method: 'PATCH',
    body: profileData,
    token,
  });
}

export function useArtist(id?: number | string) {
  // Asegúrate de tipar el resultado de useQuery si es necesario (ej: useQuery<Artist>)
  return useQuery({
    queryKey: ['artist', id],
    queryFn: () => fetchArtistById(id as number | string),
    enabled: !!id,
  });
}

export function useArtists(filters?: { query?: string; genre?: string; country?: string; city?: string; priceMin?: number; priceMax?: number }) {
  return useQuery<Artist[]>({
    queryKey: ['artists', filters],
    queryFn: () => fetchArtists(filters),
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ profileData, token }: { profileData: any; token: string }) => 
      updateProfile(profileData, token),
    onSuccess: () => {
      // Invalidate queries to refetch updated data
      queryClient.invalidateQueries({ queryKey: ['artist'] });
      queryClient.invalidateQueries({ queryKey: ['artists'] });
    },
  });
}
