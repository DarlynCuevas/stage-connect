import React from 'react';
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from '@/components/ui/dialog';

export interface Follower {
  id: number;
  name: string;
}

interface FollowersModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  followers: Follower[];
  trigger: React.ReactNode;
}

export const FollowersModal: React.FC<FollowersModalProps> = ({ open, setOpen, followers, trigger }) => {
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
            followers.map(f => (
              <li key={f.id} className="py-1 border-b last:border-b-0">{f.name}</li>
            ))
          )}
        </ul>
      </DialogContent>
    </Dialog>
  );
};
