import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';

interface ArtistRatingResult {
  averageRating: number | null;
  totalReviews: number | null;
  loading: boolean;
  error: string | null;
}

export function useArtistRating(artistId?: number | string): ArtistRatingResult {
  const [averageRating, setAverageRating] = useState<number | null>(null);
  const [totalReviews, setTotalReviews] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!artistId) return;
    setLoading(true);
    setError(null);
    // Intenta obtener ambos datos en una sola llamada (recomendado para eficiencia)
    apiFetch<{ averageRating: number; totalReviews: number }>(`/reviews/artist/${artistId}/summary`)
      .then(res => {
        setAverageRating(res.averageRating);
        setTotalReviews(res.totalReviews);
        setLoading(false);
      })
      .catch(err => {
        // Si el endpoint no existe, fallback a dos llamadas
        Promise.all([
          apiFetch<{ averageRating: number }>(`/reviews/artist/${artistId}/average`).then(r => r.averageRating),
          apiFetch<{ totalReviews: number }>(`/reviews/artist/${artistId}/count`).then(r => r.totalReviews),
        ])
          .then(([avg, count]) => {
            setAverageRating(avg);
            setTotalReviews(count);
            setLoading(false);
          })
          .catch(e => {
            setError('No se pudo obtener la valoración');
            setLoading(false);
          });
      });
  }, [artistId]);

  return { averageRating, totalReviews, loading, error };
}
