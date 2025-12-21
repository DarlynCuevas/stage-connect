import apiFetch from './api';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';

export interface Interested {
  id: number;
  venue: any;
  manager: any | null;
  artist: any;
  date: string;
  price: number | null;
  status: 'pending' | 'accepted' | 'rejected' | 'withdrawn';
  createdAt: string;
  artistId: number;
}

export async function createInterested(
  venueId: number,
  artistIds: number[],
  date: string,
  price?: number,
  managerId?: number
) {
  return apiFetch<Interested[]>('/interested', {
    method: 'POST',
    body: { venueId, artistIds, date, price, managerId },
  });
}

export async function getInterestedByVenue(venueId: number, token?: string | null) {
  return apiFetch<Interested[]>(`/interested/venue/${venueId}`, { token });
}

export async function updateInterestedStatus(id: number, status: Interested['status']) {
  return apiFetch(`/interested/${id}`, {
    method: 'PATCH',
    body: { status },
  });
}

export async function deleteInterested(id: number) {
  return apiFetch(`/interested/${id}`, {
    method: 'DELETE' });
}

export function useInterestedByArtist(artistId?: number) {
  const { token } = useAuth();
  return useQuery({
    queryKey: ['interested-artist', artistId],
    queryFn: () => artistId ? apiFetch<Interested[]>(`/interested/artist/${artistId}`, { token }) : [],
    enabled: !!artistId,
  });
}
