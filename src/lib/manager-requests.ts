import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { io, Socket } from 'socket.io-client';
import apiFetch, { ApiError } from './api';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { API_BASE_URL } from '@/config';

export interface ManagerRequest {
  id: number;
  sender: any;
  receiver: any;
  message?: string;
  status: 'Pending' | 'Accepted' | 'Rejected';
  createdAt: string;
  updatedAt: string;
}

// API functions
async function fetchReceivedRequests(token: string) {
  try {
    return await apiFetch<ManagerRequest[]>('/manager-requests/received', {
      method: 'GET',
      token,
    });
  } catch (err: any) {
    if (err instanceof ApiError && err.status === 403) {
      console.info('No tienes permisos para ver las solicitudes recibidas (403 Forbidden)');
      return [];
    }
    throw err;
  }
}

async function fetchSentRequests(token: string) {
  try {
    return await apiFetch<ManagerRequest[]>('/manager-requests/sent', {
      method: 'GET',
      token,
    });
  } catch (err: any) {
    if (err instanceof ApiError && err.status === 403) {
      console.info('No tienes permisos para ver las solicitudes enviadas (403 Forbidden)');
      return [];
    }
    throw err;
  }
}

async function createManagerRequest(receiverId: number, message: string | undefined, token: string) {
  return apiFetch<ManagerRequest>('/manager-requests', {
    method: 'POST',
    body: { receiverId, message },
    token,
  });
}

async function updateRequestStatus(requestId: number, status: 'Accepted' | 'Rejected', token: string) {
  return apiFetch<ManagerRequest>(`/manager-requests/${requestId}/status`, {
    method: 'PATCH',
    body: { status },
    token,
  });
}

async function deleteSentRequest(requestId: number, token: string) {
  return apiFetch(`/manager-requests/${requestId}`, {
    method: 'DELETE',
    token,
  });
}

async function deleteAllSentRequests(token: string) {
  return apiFetch(`/manager-requests/sent`, {
    method: 'DELETE',
    token,
  });
}

async function removeManagerRelation(artistId: number, token: string) {
  return apiFetch(`/manager-requests/relation/${artistId}`, {
    method: 'DELETE',
    token,
  });
}

// Hooks
export function useReceivedManagerRequests() {
  const { token } = useAuth();
  return useQuery({
    queryKey: ['managerRequests', 'received'],
    queryFn: () => fetchReceivedRequests(token as string),
    enabled: !!token,
  });
}

export function useSentManagerRequests() {
  const { token } = useAuth();
  return useQuery({
    queryKey: ['managerRequests', 'sent'],
    queryFn: () => fetchSentRequests(token as string),
    enabled: !!token,
  });
}

export function useCreateManagerRequest() {
  const queryClient = useQueryClient();
  const { token } = useAuth();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ receiverId, message }: { receiverId: number; message?: string }) =>
      createManagerRequest(receiverId, message, token as string),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['managerRequests'] });
      toast({
        title: 'Solicitud enviada',
        description: 'La solicitud ha sido enviada correctamente.',
        duration: 4000,
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error?.message || 'No se pudo enviar la solicitud.',
        variant: 'destructive',
        duration: 4000,
      });
    },
  });
}

export function useUpdateManagerRequestStatus() {
  const queryClient = useQueryClient();
  const { token } = useAuth();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ requestId, status }: { requestId: number; status: 'Accepted' | 'Rejected' }) =>
      updateRequestStatus(requestId, status, token as string),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['managerRequests'] });
      queryClient.invalidateQueries({ queryKey: ['artist'] });
      queryClient.invalidateQueries({ queryKey: ['artists'] });
      toast({
        title: 'Solicitud actualizada',
        description: 'La solicitud ha sido actualizada correctamente.',
        duration: 4000,
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error?.message || 'No se pudo actualizar la solicitud.',
        variant: 'destructive',
        duration: 4000,
      });
    },
  });
}

export function useDeleteSentManagerRequest() {
  const queryClient = useQueryClient();
  const { token } = useAuth();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (requestId: number) => deleteSentRequest(requestId, token as string),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['managerRequests'] });
      toast({
        title: 'Solicitud eliminada',
        description: 'La solicitud fue eliminada exitosamente.',
        duration: 4000,
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error?.message || 'No se pudo eliminar la solicitud.',
        variant: 'destructive',
        duration: 4000,
      });
    },
  });
}

export function useDeleteAllSentManagerRequests() {
  const queryClient = useQueryClient();
  const { token } = useAuth();
  const { toast } = useToast();

  return useMutation({
    mutationFn: () => deleteAllSentRequests(token as string),
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ['managerRequests'] });
      const count = data?.deleted ?? 0;
      toast({
        title: 'Solicitudes eliminadas',
        description: count > 0 ? `${count} solicitud(es) eliminadas.` : 'No había solicitudes pendientes para eliminar.',
        duration: 4000,
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error?.message || 'No se pudieron eliminar las solicitudes.',
        variant: 'destructive',
        duration: 4000,
      });
    },
  });
}

export function useRemoveManagerRelation() {
  const queryClient = useQueryClient();
  const { token } = useAuth();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (artistId: number) => removeManagerRelation(artistId, token as string),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['artist'] });
      queryClient.invalidateQueries({ queryKey: ['artists'] });
      toast({
        title: 'Relación eliminada',
        description: 'La relación con el manager ha sido eliminada.',
        duration: 4000,
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error?.message || 'No se pudo eliminar la relación.',
        variant: 'destructive',
        duration: 4000,
      });
    },
  });
}

export function useManagerRequestsRealtime() {
  const { token } = useAuth();
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

    const invalidateRequests = () => {
      queryClient.invalidateQueries({ queryKey: ['managerRequests'] });
      queryClient.invalidateQueries({ queryKey: ['artists'] });
      queryClient.invalidateQueries({ queryKey: ['artist'] });
      queryClient.invalidateQueries({ queryKey: ['managerStats'] });
      queryClient.invalidateQueries({ queryKey: ['requests'] });
    };

    socket.on('manager-request.created', (payload: any) => {
      invalidateRequests();
      const senderName = payload?.senderName || 'Nueva solicitud';
      toast({
        title: 'Nueva solicitud manager-artista',
        description: senderName,
        duration: 4000,
      });
    });

    socket.on('manager-request.updated', () => {
      invalidateRequests();
    });

    socket.on('manager-request.deleted', () => {
      invalidateRequests();
    });

    socket.on('manager-relation.removed', () => {
      queryClient.invalidateQueries({ queryKey: ['artists'] });
      queryClient.invalidateQueries({ queryKey: ['artist'] });
    });

    // Listen to booking requests events (for managed artists)
    socket.on('request.created', () => {
      queryClient.invalidateQueries({ queryKey: ['managerStats'] });
      queryClient.invalidateQueries({ queryKey: ['managerRequests'] });
    });

    socket.on('request.updated', () => {
      queryClient.invalidateQueries({ queryKey: ['managerStats'] });
      queryClient.invalidateQueries({ queryKey: ['managerRequests'] });
    });

    return () => {
      socket.disconnect();
    };
  }, [token, queryClient, toast]);
}
