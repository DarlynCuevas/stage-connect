import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiFetch from './api';
import { useAuth } from '@/contexts/AuthContext';
import { CalendarDate } from '@/types';

export interface BlockedDay {
  id: number;
  blockedDate: string;
}

async function fetchBlockedDaysApi(artistId: number) {
  return apiFetch<BlockedDay[]>(`/blocked-days/${artistId}`, {
    method: 'GET',
  });
}

async function createBlockedDayApi(blockedDate: string, token: string | null) {
  return apiFetch<BlockedDay>(`/blocked-days`, {
    method: 'POST',
    token,
    body: { blockedDate },
  });
}

async function deleteBlockedDayApi(id: number, token: string | null) {
  return apiFetch<{ message: string }>(`/blocked-days/${id}`, {
    method: 'DELETE',
    token,
  });
}

/**
 * Hook to fetch blocked days for an artist (public)
 */
export function useBlockedDays(artistId: number | undefined) {
  return useQuery({
    queryKey: ['blocked-days', artistId],
    queryFn: () => fetchBlockedDaysApi(artistId!),
    enabled: !!artistId,
  });
}

/**
 * Convert blocked days from API to CalendarDate format
 */
export function useBlockedDatesCalendar(artistId: number | undefined) {
  const { data: blockedDays = [] } = useBlockedDays(artistId);

  return blockedDays.map(bd => ({
    date: bd.blockedDate,
    available: false,
    note: 'Día bloqueado por el artista',
    blocked: true,
  })) as CalendarDate[];
}

/**
 * Hook to manage blocked days (create/delete)
 */
export function useManageBlockedDays() {
  const queryClient = useQueryClient();
  const { token, user } = useAuth();

  const createMutation = useMutation({
    mutationFn: (blockedDate: string) =>
      createBlockedDayApi(blockedDate, token ?? null),
    onSuccess: () => {
      if (user?.id) {
        queryClient.invalidateQueries({
          queryKey: ['blocked-days', Number(user.id)],
        });
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) =>
      deleteBlockedDayApi(id, token ?? null),
    onSuccess: () => {
      if (user?.id) {
        queryClient.invalidateQueries({
          queryKey: ['blocked-days', Number(user.id)],
        });
      }
    },
  });

  return { createMutation, deleteMutation };
}
