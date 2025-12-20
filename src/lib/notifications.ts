import apiFetch from '@/lib/api';

export async function notifyAvailableDate(venueId: string, date: string, token?: string) {
  return apiFetch('/notifications/available-date', {
    method: 'POST',
    body: { venueId, date },
    token,
  });
}
