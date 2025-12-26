import { useQuery } from '@tanstack/react-query';
import apiFetch from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

export interface Message {
  id: number;
  conversationId: number;
  senderId: number;
  receiverId: number;
  content: string;
  createdAt: string;
  read: boolean;
}

export interface Conversation {
  id: number;
  participants: Array<{
    id: number;
    name: string;
    avatar?: string;
    role: string;
  }>;
  lastMessage?: Message;
  updatedAt: string;
}

export function useConversations() {
  const { token } = useAuth();
  return useQuery<Conversation[]>({
    queryKey: ['conversations'],
    queryFn: async () => {
      return apiFetch('/messages/conversations', { token });
    },
    enabled: !!token,
  });
}

export function useMessages(conversationId: number) {
  const { token } = useAuth();
  return useQuery<Message[]>({
    queryKey: ['messages', conversationId],
    queryFn: async () => {
      return apiFetch(`/messages/conversations/${conversationId}`, { token });
    },
    enabled: !!token && !!conversationId,
  });
}
