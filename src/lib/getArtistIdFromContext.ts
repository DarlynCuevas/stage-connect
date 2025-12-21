/**
 * Obtiene el id del artista desde múltiples fuentes/contextos.
 * Prioridad: props explícitos > params > URL > objeto perfil > notificación > fallback.
 * Admite string o number, siempre retorna number o undefined.
 */
export function getArtistIdFromContext(options: {
  artistId?: string | number;
  params?: Record<string, any>;
  path?: string;
  profile?: { id?: string | number; user_id?: string | number };
  notification?: { artistId?: string | number; artist?: { id?: string | number } };
}): number | undefined {
  // 1. Prop explícito
  if (options.artistId !== undefined) {
    const id = typeof options.artistId === 'string' ? Number(options.artistId) : options.artistId;
    if (!isNaN(id as number)) return id as number;
  }
  // 2. Params
  if (options.params?.artistId !== undefined) {
    const id = typeof options.params.artistId === 'string' ? Number(options.params.artistId) : options.params.artistId;
    if (!isNaN(id as number)) return id as number;
  }
  // 3. URL
  if (options.path) {
    const match = options.path.match(/artist\/(\d+)/);
    if (match) {
      const id = Number(match[1]);
      if (!isNaN(id)) return id;
    }
  }
  // 4. Perfil
  if (options.profile) {
    const id = options.profile.id ?? options.profile.user_id;
    if (id !== undefined) {
      const numId = typeof id === 'string' ? Number(id) : id;
      if (!isNaN(numId as number)) return numId as number;
    }
  }
  // 5. Notificación
  if (options.notification) {
    const id = options.notification.artistId ?? options.notification.artist?.id;
    if (id !== undefined) {
      const numId = typeof id === 'string' ? Number(id) : id;
      if (!isNaN(numId as number)) return numId as number;
    }
  }
  // 6. Fallback
  return undefined;
}