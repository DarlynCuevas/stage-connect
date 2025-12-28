import apiFetch from '@/lib/api';
import { useEffect, useState } from 'react';

export function useIsFollowing(targetUserId: number | undefined, token: string | null, authUserId: number | undefined) {
  const [isFollowing, setIsFollowing] = useState(false);
  useEffect(() => {
    if (!targetUserId || !token || !authUserId) return;
    apiFetch(`/followers/followers-of/${targetUserId}`, { token })
      .then((followers) => {
        setIsFollowing(Array.isArray(followers) && followers.some(f => f.user_id === authUserId));
      })
      .catch(() => setIsFollowing(false));
  }, [targetUserId, token, authUserId]);
  return [isFollowing, setIsFollowing] as const;
}
