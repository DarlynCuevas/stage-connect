import { useQuery } from '@tanstack/react-query';
import apiFetch from './api';
import { useAuth } from '@/contexts/AuthContext';
import { BlockedDay } from './blocked-days';

// API para días bloqueados de un venue
async function fetchVenueBlockedDaysApi(venueId: number) {
  try {
    return await apiFetch<BlockedDay[]>(`/blocked-days/venue/${venueId}`, {
      method: 'GET',
    });
  } catch (err: any) {
    if (err.status === 404) {
      console.info(`[VenueCalendar] No hay días bloqueados para el venue ${venueId}`);
      return [];
    }
    throw err;
  }
}

// Hook para obtener días bloqueados de un venue
export function useVenueBlockedDays(venueId: number | undefined) {
  return useQuery({
    queryKey: ['venue-blocked-days', venueId],
    queryFn: () => fetchVenueBlockedDaysApi(venueId!),
    enabled: !!venueId,
  });
}
