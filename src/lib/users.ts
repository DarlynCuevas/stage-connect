import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiFetch from './api';
import { Artist } from '@/types';

import { useAuth } from '@/contexts/AuthContext';

export function useManagedArtists() {
  const { token } = useAuth();
  return useQuery({
    queryKey: ['managed-artists'],
    queryFn: () => apiFetch('/users/managed-artists', { token }),
    enabled: !!token,
  });
}

export async function fetchArtistById(id: number | string) {
  const numericId = typeof id === 'string' ? parseInt(id, 10) : id;
  return apiFetch(`/public/users/${numericId}`);
}

export async function fetchUserById(id: number | string, token?: string) {
  const numericId = typeof id === 'string' ? parseInt(id, 10) : id;
  return apiFetch(`/public/users/${numericId}`, {
    method: 'GET',
    token: token || undefined,
  });
}

export async function fetchArtists(filters?: {
  query?: string;
  genre?: string[];
  country?: string;
  city?: string;
  priceMin?: number;
  priceMax?: number;
}) {
  const params = new URLSearchParams();
  params.set('role', 'Artista');
  if (filters) {
    if (filters.query) params.set('query', filters.query);
    if (filters.genre && filters.genre.length > 0) {
      filters.genre.forEach(g => params.append('genre', g));
    }
    if (filters.country) params.set('country', filters.country);
    if (filters.city) params.set('city', filters.city);
    // Only send price filters if they differ from defaults (0, 50000)
    if (filters.priceMin !== undefined && filters.priceMin > 0) {
      params.set('priceMin', String(filters.priceMin));
    }
    if (filters.priceMax !== undefined && filters.priceMax < 50000) {
      params.set('priceMax', String(filters.priceMax));
    }
  }
  // Esperamos que el backend devuelva blockedDays en cada artista
  return apiFetch(`/public/users?${params.toString()}`);
}

export async function updateProfile(profileData: any, token: string) {
  return apiFetch('/users/me', {
    method: 'PATCH',
    body: profileData,
    token,
  });
}

export async function deleteUser(userId: number, token: string) {
  return apiFetch(`/users/${userId}`, {
    method: 'DELETE',
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

export function useUser(id?: number | string, token?: string) {
  return useQuery({
    queryKey: ['user', id],
    queryFn: () => fetchUserById(id as number | string, token),
    enabled: !!id,
  });
}

export function useArtists(filters?: { query?: string; genre?: string[]; country?: string; city?: string; priceMin?: number; priceMax?: number }) {
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
