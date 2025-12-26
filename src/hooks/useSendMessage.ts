import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiFetch from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

export function useSendMessage() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ conversationId, content }: { conversationId: number; content: string }) => {
      return apiFetch(`/messages/conversations/${conversationId}/send`, {
        method: 'POST',
        body: { content },
        token,
      });
    },
    onSuccess: (_data, variables) => {
      // Refrescar mensajes de la conversación
      queryClient.invalidateQueries({ queryKey: ['messages', variables.conversationId] });
      // Refrescar lista de conversaciones (para actualizar lastMessage)
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
}
