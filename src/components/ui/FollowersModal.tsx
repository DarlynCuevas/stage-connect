import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import apiFetch from '@/lib/api';
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from '@/components/ui/dialog';

export interface Follower {
  id: number;
  name: string;
  avatar?: string;
  isFollowing?: boolean;
}

interface FollowersModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  followers: Follower[];
  trigger: React.ReactNode;
}




export const FollowersModal = (props: FollowersModalProps) => {
  const { open, setOpen, followers, trigger } = props;
  const { user: authUser, token } = useAuth();
  const [followingIds, setFollowingIds] = React.useState<number[]>([]);

  React.useEffect(() => {
    if (open && token && authUser?.id) {
      apiFetch(`/followers/following-of/${authUser.id}`, { token })
        .then((data) => setFollowingIds(Array.isArray(data) ? data.map((u: any) => u.user_id) : []))
        .catch(() => setFollowingIds([]));
    }
  }, [open, token, authUser]);

  const handleFollow = async (id: number) => {
    if (!token) return;
    await apiFetch(`/followers/${id}`, { method: 'POST', token });
    setFollowingIds((prev) => [...prev, id]);
  };
  const handleUnfollow = async (id: number) => {
    if (!token) return;
    await apiFetch(`/followers/${id}`, { method: 'DELETE', token });
    setFollowingIds((prev) => prev.filter((uid) => uid !== id));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogTitle asChild>
          <h2 className="text-lg font-bold mb-2">Seguidores</h2>
        </DialogTitle>
        <ul>
          {followers.length === 0 ? (
            <li className="text-muted-foreground py-2">Aún no tienes seguidores.</li>
          ) : (
            followers.map(f => {
              const isFollowing = followingIds.includes(f.id);
              return (
                <li key={f.id} className="py-1 border-b last:border-b-0 flex items-center gap-2">
                  {f.avatar && (
                    <img src={f.avatar} alt={f.name} className="w-7 h-7 rounded-full object-cover border" />
                  )}
                  <span>{f.name}</span>
                  {authUser && Number(authUser.id) !== f.id && (
                    <button
                      className={`ml-auto px-3 py-1 text-xs rounded-full font-semibold border transition min-w-[80px] ${isFollowing ? 'bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300' : 'bg-primary text-white border-primary hover:bg-primary/80'}`}
                      onClick={() => isFollowing ? handleUnfollow(f.id) : handleFollow(f.id)}
                    >
                      {isFollowing ? 'Dejar de seguir' : 'Seguir'}
                    </button>
                  )}
                </li>
              );
            })
          )}
        </ul>
      </DialogContent>
    </Dialog>
  );
};
