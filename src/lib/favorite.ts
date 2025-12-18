// Servicio centralizado para marcar/desmarcar favoritos
// Puedes ampliar los parámetros según tus necesidades

export async function handleFavorite({ targetId, favorite }: { targetId: number, favorite: boolean }) {
  const endpoint = `http://localhost:4000/api/users/favorites/${targetId}`;
  const method = favorite ? 'POST' : 'DELETE';
  const token = localStorage.getItem('book_token');
  const response = await fetch(endpoint, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    credentials: 'include',
  });
  if (!response.ok) {
    throw new Error('Error actualizando favorito');
  }
  return response.json ? response.json() : undefined;
}
