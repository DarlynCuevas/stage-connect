import { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/api';
import { Venue } from '@/types';

// Solo los campos seguros
const pickVenueFields = (venue: any): Venue => ({
  id: venue.id,
  userId: venue.userId,
  name: venue.name,
  type: venue.type,
  capacity: venue.capacity,
  city: venue.city,
  country: venue.country,
  avatar: venue.avatar,
  featured: venue.featured,
  verified: venue.verified,
});

export function useVenue(userId?: string, token?: string) {
  const [venue, setVenue] = useState<Venue | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;
    // 1. Buscar en localStorage
    let localVenue: Venue | null = null;
    try {
      const venueStr = localStorage.getItem('currentVenue');
      if (venueStr) {
        localVenue = pickVenueFields(JSON.parse(venueStr));
      }
    } catch {}
    if (localVenue && localVenue.userId === userId) {
      setVenue(localVenue);
      return;
    }
    // 2. Si no está, fetch al backend
    setLoading(true);
    apiFetch(`/users/me`, { token })
      .then((data) => {
        // venueProfile puede estar anidado en el usuario
        const venueProfile = data.venueProfile || data.venue_profile || null;
        if (venueProfile) {
          const safeVenue = pickVenueFields({ ...venueProfile, userId: data.user_id });
          setVenue(safeVenue);
          localStorage.setItem('currentVenue', JSON.stringify(safeVenue));
        } else {
          setVenue(null);
        }
      })
      .catch((err) => {
        setError(err?.message || 'Error al obtener venue');
      })
      .finally(() => setLoading(false));
  }, [userId, token]);

  return { venue, loading, error };
}
