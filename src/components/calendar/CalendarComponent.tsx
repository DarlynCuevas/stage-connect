import { useMemo } from 'react';
import { ArtistCalendar } from '@/components/calendar/ArtistCalendar';
import { CalendarDate } from '@/types';
import { format, isBefore, startOfDay } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useConfirmedRequests } from '@/lib/requests';
import { useBlockedDays, useManageBlockedDays } from '@/lib/blocked-days';

interface CalendarComponentProps {
  artistId: number;
  editable?: boolean;
  onDateSelect?: (date: Date) => void;
}

export default function CalendarComponent({ artistId, editable = true, onDateSelect }: CalendarComponentProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const { data: confirmedRequests = [] } = useConfirmedRequests(artistId);
  const { data: blockedDaysData = [] } = useBlockedDays(artistId);
  const { createMutation, deleteMutation } = useManageBlockedDays();

  const toDateStr = (value: string | Date) =>
    typeof value === 'string' ? value.slice(0, 10) : format(value, 'yyyy-MM-dd');

  // Merge blocked dates with confirmed booking dates
  const dates = useMemo(() => {
    const confirmedDates: CalendarDate[] = confirmedRequests.map(req => ({
      date: toDateStr(req.eventDate),
      available: false,
      note: `${req.eventType} - ${req.eventLocation}`,
      confirmed: true,
    }));

    const blockedDates: CalendarDate[] = blockedDaysData.map(bd => ({
      date: bd.blockedDate,
      available: false,
      note: 'Día bloqueado por el artista',
      blocked: true,
    }));

    // Merge, prioritizing confirmed bookings
    const mergedMap = new Map<string, CalendarDate>();
    blockedDates.forEach(d => mergedMap.set(d.date, d));
    confirmedDates.forEach(d => mergedMap.set(d.date, d));
    return Array.from(mergedMap.values());
  }, [confirmedRequests, blockedDaysData]);

  const handleBlockDate = (date: Date) => {
    if (!editable) return; // No permitir bloquear si no es editable
    const dateStr = format(date, 'yyyy-MM-dd');
    const isConfirmedBooking = confirmedRequests.some(
      req => toDateStr(req.eventDate) === dateStr
    );
    if (isConfirmedBooking) return;
    const existingBlocked = blockedDaysData.find(bd => bd.blockedDate === dateStr);
    if (existingBlocked) {
      deleteMutation.mutate(existingBlocked.id, {
        onSuccess: () => {
          toast({
            title: 'Fecha desbloqueada',
            description: `Fecha ${format(date, 'dd/MM/yyyy')} ahora está disponible.`,
            duration: 4000,
          });
        },
      });
    } else {
      createMutation.mutate(dateStr, {
        onSuccess: () => {
          toast({
            title: 'Fecha bloqueada',
            description: `Fecha ${format(date, 'dd/MM/yyyy')} bloqueada.`,
            duration: 4000,
          });
        },
      });
    }
  };

  // Evitar selección de días pasados
  const handleDateSelect = (date: string) => {
    const today = startOfDay(new Date());
    const selected = startOfDay(new Date(date));
    if (isBefore(selected, today)) return; // No permitir seleccionar días pasados
    if (onDateSelect) onDateSelect(date);
  };

  return (
    <ArtistCalendar
      dates={dates}
      editable={editable}
      onDateToggle={handleBlockDate}
      onDateSelect={handleDateSelect}
    />
  );
}
