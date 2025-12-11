import { useQueryClient, useQuery, useMutation } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import apiFetch, { ApiError } from './api';
import { useAuth } from '@/contexts/AuthContext';
import { BookingRequest } from '@/types';

type FrontendStatus = 'Accepted' | 'Rejected';

async function fetchArtistRequestsApi(token: string | null) {
  return apiFetch<BookingRequest[]>(`/requests`, {
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
 * Hook to update request status with better error handling and typed mutation.
 * Returns mutateAsync so callers can perform optimistic UI changes and proper rollback.
 */
export function useUpdateRequestStatus() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { token } = useAuth();

  async function mutateAsync(variables: { id: string; status: FrontendStatus }) {
    try {
      const res = await updateRequestStatusApi(variables.id, variables.status, token ?? null);
      toast({ title: 'Request updated', description: `Request ${variables.status} successfully.` });
      queryClient.invalidateQueries({ queryKey: ['requests'] });
      return res;
    } catch (err: any) {
      const message = err?.message || 'Could not update request';
      toast({ title: 'Error', description: message, variant: 'destructive' });
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

export { updateRequestStatusApi };
