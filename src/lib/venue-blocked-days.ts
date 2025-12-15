import { useQuery } from '@tanstack/react-query';
import apiFetch from './api';
import { useAuth } from '@/contexts/AuthContext';
import { BlockedDay } from './blocked-days';

// API para días bloqueados de un venue
async function fetchVenueBlockedDaysApi(venueId: number) {
  return apiFetch<BlockedDay[]>(`/blocked-days/venue/${venueId}`, {
    method: 'GET',
  });
}

// Hook para obtener días bloqueados de un venue
export function useVenueBlockedDays(venueId: number | undefined) {
  return useQuery({
    queryKey: ['venue-blocked-days', venueId],
    queryFn: () => fetchVenueBlockedDaysApi(venueId!),
    enabled: !!venueId,
  });
}
