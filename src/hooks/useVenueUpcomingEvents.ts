import { useEffect, useState } from 'react';
import { API_BASE_URL } from '@/config';

export function useVenueUpcomingEvents(venueId: number) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!venueId) return;
    setLoading(true);
    fetch(`${API_BASE_URL}/venue-dashboard/${venueId}/upcoming-events`)
      .then((res) => {
        if (!res.ok) throw new Error('Error al obtener próximos eventos');
        return res.json();
      })
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [venueId]);

  return { data, loading, error };
}
