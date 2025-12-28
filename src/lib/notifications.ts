import apiFetch from '@/lib/api';

export async function notifyAvailableDate({ venueId, filters, token, price }: { venueId: string, filters: any, token?: string, price?: number }) {
  return apiFetch('/notifications/available-date', {
    method: 'POST',
    body: { venueId, filters, price },
    token,
  });
}
