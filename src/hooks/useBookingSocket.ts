import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { API_BASE_URL } from '@/config';
import { useAuth } from '@/contexts/AuthContext';

export function useBookingSocket(onRequestAccepted: (payload: { eventDate: string }) => void) {
  const { token, user } = useAuth();
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!token || !user?.id) return;
    const socket = io(API_BASE_URL, {
      auth: { token },
      transports: ['websocket'],
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      // Connected
    });

    socket.on('request.updated', (payload: any) => {
      if (payload.status === 'Accepted' && payload.artistId === user.id && payload.eventDate) {
        onRequestAccepted(payload);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [token, user, onRequestAccepted]);
}
