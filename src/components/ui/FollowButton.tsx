import React from 'react';

interface FollowButtonProps {
  isFollowing: boolean;
  onFollow: () => void;
  onUnfollow: () => void;
  loading?: boolean;
}

export const FollowButton: React.FC<FollowButtonProps> = ({ isFollowing, onFollow, onUnfollow, loading }) => {
  return (
    <button
      className={`px-3 py-1.5 text-sm rounded-full font-semibold transition border focus:outline-none min-w-[80px]
        ${isFollowing ? 'bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300' : 'bg-primary text-white border-primary hover:bg-primary/80'}
      `}
      onClick={isFollowing ? onUnfollow : onFollow}
      disabled={loading}
      aria-pressed={isFollowing}
      style={{lineHeight: 1.1}}
    >
      {loading
        ? '...'
        : isFollowing
          ? 'Siguiendo'
          : 'Seguir'}
    </button>
  );
};
