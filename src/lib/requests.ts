async function fetchConfirmedRequestsByVenueApi(venueId: number, token: string | null) {
  return apiFetch<BookingRequest[]>(`/requests/confirmed-venue/${venueId}`, {
    method: 'GET',
    token,
  });
}

export function useConfirmedRequestsByVenue(venueId: number | undefined) {
  const { token } = useAuth();
  return useQuery({
    queryKey: ['confirmed-requests-venue', venueId],
    queryFn: () => fetchConfirmedRequestsByVenueApi(venueId!, token ?? null),
    enabled: !!venueId,
  });
}
// Mutación profesional para crear solicitud de contratación (Local → Artista)
export function useCreateBookingRequest() {
  const queryClient = useQueryClient();
  const { token } = useAuth();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: {
      artistId: number;
      eventDate: string;
      eventLocation: string;
      eventType: string;
      offeredPrice: number;
      message?: string;
      nombreLocal?: string;
      ciudadLocal?: string;
    }) => {
      return apiFetch('/requests', {
        method: 'POST',
        body: {
          artistId: data.artistId,
          eventDate: data.eventDate,
          eventLocation: data.eventLocation,
          eventType: data.eventType,
          offeredPrice: data.offeredPrice,
          message: data.message,
          nombreLocal: data.nombreLocal,
          ciudadLocal: data.ciudadLocal,
        },
        token,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sent-requests'] });
      toast({
        title: 'Solicitud enviada',
        description: 'La solicitud de contratación fue enviada correctamente.',
        duration: 4000,
      });
    },
    onError: (error: any) => {
      let description = error?.message || 'No se pudo enviar la solicitud.';
      if (
        typeof description === 'string' &&
        description.includes('Ya existe una solicitud pendiente para este artista y fecha')
      ) {
        description = 'Ya has enviado una solicitud pendiente para este artista y fecha. Espera a que el artista responda antes de enviar otra.';
      }
      toast({
        title: 'Error',
        description,
        variant: 'destructive',
        duration: 4000,
      });
    },
  });
}
import { useQueryClient, useQuery, useMutation } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import apiFetch, { ApiError } from './api';
import { useAuth } from '@/contexts/AuthContext';
import { BookingRequest } from '@/types';

type FrontendStatus = 'Accepted' | 'Rejected';

async function fetchArtistRequestsApi(token: string | null) {
  try {
    return await apiFetch<BookingRequest[]>(`/requests`, {
      method: 'GET',
      token,
    });
  } catch (err: any) {
    if (err instanceof ApiError && err.status === 403) {
      console.info('No tienes permisos para ver las solicitudes de artista (403 Forbidden)');
      return [];
    }
    throw err;
  }
}

async function fetchSentRequestsApi(token: string | null) {
  try {
    return await apiFetch<BookingRequest[]>(`/requests/sent`, {
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

async function fetchConfirmedRequestsApi(artistId: number, token: string | null) {
  return apiFetch<BookingRequest[]>(`/requests/confirmed/${artistId}`, {
    method: 'GET',
    token,
  });
}

async function updateRequestStatusApi(id: string | number, status: FrontendStatus, token: string | null) {
  // Convert id to number for backend validation
  const numericId = typeof id === 'string' ? parseInt(id, 10) : id;

  return apiFetch<BookingRequest>(`/requests/${numericId}/status`, {
    method: 'PATCH',
    body: { status },
    token,
  });
}

/**
 * Hook to fetch artist's booking requests
 */
export function useArtistRequests() {
  const { token } = useAuth();

  return useQuery({
    queryKey: ['requests'],
    queryFn: () => fetchArtistRequestsApi(token ?? null),
    enabled: !!token,
  });
}

/**
 * Hook to fetch sent booking requests (for Local/Promotor)
 */
export function useSentRequests() {
  const { token } = useAuth();

  return useQuery({
    queryKey: ['sent-requests'],
    queryFn: () => fetchSentRequestsApi(token ?? null),
    enabled: !!token,
  });
}

/**
 * Hook to fetch confirmed requests for an artist (public)
 */
export function useConfirmedRequests(artistId: number | undefined) {
  const { token } = useAuth();

  return useQuery({
    queryKey: ['confirmed-requests', artistId],
    queryFn: () => fetchConfirmedRequestsApi(artistId!, token ?? null),
    enabled: !!artistId,
  });
}

/**
 * Hook to update request status with better error handling and typed mutation.
 * Returns mutateAsync so callers can perform optimistic UI changes and proper rollback.
 */
export function useUpdateRequestStatus() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { token, user } = useAuth();

  async function mutateAsync(variables: { id: string; status: FrontendStatus }) {
    try {
      const res = await updateRequestStatusApi(variables.id, variables.status, token ?? null);
      toast({ title: 'Request updated', description: `Request ${variables.status} successfully.`, duration: 4000 });
      queryClient.invalidateQueries({ queryKey: ['requests'] });
      queryClient.invalidateQueries({ queryKey: ['managerRequests'] });
      queryClient.invalidateQueries({ queryKey: ['managerStats'] });
      if (user?.id) {
        queryClient.invalidateQueries({ queryKey: ['confirmed-requests', Number(user.id)] });
      }
      return res;
    } catch (err: any) {
      const message = err?.message || 'Could not update request';
      toast({ title: 'Error', description: message, variant: 'destructive', duration: 4000 });
      throw err;
    }
  }

  function mutate(variables: { id: string; status: FrontendStatus }, options?: { onSuccess?: (data: BookingRequest, vars: any) => void; onError?: (err: any) => void; }) {
    mutateAsync(variables)
      .then((data) => options?.onSuccess?.(data, variables))
      .catch((err) => options?.onError?.(err));
  }

  return { mutate, mutateAsync } as const;
}

// Manager-specific hooks
export function useManagerRequests() {
  const { token } = useAuth();
  return useQuery({
    queryKey: ['managerRequests'],
    queryFn: () => apiFetch('/requests/manager/all', { method: 'GET', token: token as string }),
    enabled: !!token,
  });
}

export function useManagerStats() {
  const { token } = useAuth();
  return useQuery<{
    pendingRequests: number;
    eventsThisMonth: number;
    totalRevenue: number;
  }>({
    queryKey: ['managerStats'],
    queryFn: () => apiFetch('/requests/manager/stats', { method: 'GET', token: token as string }),
    enabled: !!token,
  });
}

export { updateRequestStatusApi };
