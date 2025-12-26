import { useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '@/contexts/AuthContext';
import { useQueryClient } from '@tanstack/react-query';
import { API_BASE_URL } from '@/config';
import { useToast } from '@/hooks/use-toast';

export function useMessagesWebSocket() {
  const { token, user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  useEffect(() => {
    if (!token) return;
    const socket: Socket = io(API_BASE_URL.replace('/api', ''), {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 500,
      reconnectionAttempts: 10,
      auth: { token },
      extraHeaders: { Authorization: `Bearer ${token}` },
    });

    socket.on('message.new', (payload: any) => {
      // payload: { conversationId, message }
      if (payload?.conversationId) {
        queryClient.invalidateQueries({ queryKey: ['messages', payload.conversationId] });
        queryClient.invalidateQueries({ queryKey: ['conversations'] });
        toast({
          title: 'Nuevo mensaje',
          description: payload?.message?.content || 'Has recibido un nuevo mensaje.',
          duration: 3500,
        });
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [token, user?.id, queryClient, toast]);
}
