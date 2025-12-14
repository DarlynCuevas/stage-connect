import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Star } from 'lucide-react';
import { apiFetch } from '@/lib/api';

interface ReviewFormProps {
  targetId: number;
  token?: string | null;
  type?: 'artist' | 'venue' | 'manager' | 'promoter';
  onSuccess?: () => void;
}

export function ReviewForm({ targetId, token, type = 'artist', onSuccess }: ReviewFormProps) {
  const { user: authUser } = useAuth();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      // Obtener reviewerId del token o contexto de auth si es necesario
      // Aquí asumimos que el backend identifica al usuario por el token, pero si no, debes pasar reviewerId
      await apiFetch(`/reviews`, {
        method: 'POST',
        token,
        body: {
          rating,
          comment,
          artistId: type === 'artist' ? targetId : undefined,
          reviewerId: authUser?.id ? Number(authUser.id) : undefined,
          // Puedes agregar otros tipos (venueId, etc.) según el tipo
        },
      });
      setSuccess(true);
      setRating(0);
      setComment('');
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err?.message || 'Error al enviar la reseña');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return <div className="text-green-600 font-medium mb-6">¡Gracias por tu reseña!</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="mb-8 p-4 bg-[#20232a] rounded-xl shadow space-y-3">
      <div className="flex items-center gap-2 mb-2">
        <span className="font-medium">Tu valoración:</span>
        {Array.from({ length: 5 }).map((_, i) => (
          <button
            type="button"
            key={i}
            onClick={() => setRating(i + 1)}
            className="focus:outline-none"
          >
            <Star className={`w-6 h-6 ${i < rating ? 'text-yellow-400' : 'text-gray-400'}`} fill={i < rating ? '#facc15' : 'none'} />
          </button>
        ))}
      </div>
      <Textarea
        value={comment}
        onChange={e => setComment(e.target.value)}
        placeholder="Escribe tu reseña..."
        minLength={5}
        maxLength={500}
        required
        className="w-full"
      />
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <Button type="submit" disabled={loading || rating === 0 || comment.length < 5}>
        {loading ? 'Enviando...' : 'Enviar reseña'}
      </Button>
    </form>
  );
}
