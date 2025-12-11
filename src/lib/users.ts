import { useQuery } from '@tanstack/react-query';
import apiFetch from './api';

export async function fetchArtistById(id: number | string) {
  const numericId = typeof id === 'string' ? parseInt(id, 10) : id;
  return apiFetch(`/public/users/${numericId}`);
}

export async function fetchArtists() {
  return apiFetch(`/public/users?role=Artist`);
}

export function useArtist(id?: number | string) {
  return useQuery(['artist', id], () => fetchArtistById(id as number | string), {
    enabled: !!id,
  });
}

export function useArtists() {
  return useQuery(['artists'], fetchArtists);
}
