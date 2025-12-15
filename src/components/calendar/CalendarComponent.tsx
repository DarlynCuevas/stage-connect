
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useBlockedDays, useManageBlockedDays } from "@/lib/blocked-days";
import { useConfirmedRequests, useConfirmedRequestsByVenue } from "@/lib/requests";
import { useVenueBlockedDays } from "@/lib/venue-blocked-days";
import { CalendarDate } from "@/types";

import { format, startOfDay, isBefore } from 'date-fns';
import { useMemo } from "react";
import { ArtistCalendar } from './ArtistCalendar';


export type CalendarType = 'artist' | 'venue';
export interface CalendarComponentProps {
  artistId?: number;
  venueId?: number;
  tipo?: CalendarType;
  editable?: boolean;
  onDateSelect?: (date: Date) => void;
}

export function CalendarComponent({ artistId, venueId, tipo: tipoProp, editable, onDateSelect }: CalendarComponentProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  // Decidir por tipo
  let confirmedRequests: any[] = [];
  let blockedDaysData: any[] = [];
  let createMutation: any = { mutate: () => {} };
  let deleteMutation: any = { mutate: () => {} };

  // Usar el prop tipo si está definido, si no, deducirlo
  const tipo: CalendarType = tipoProp ? tipoProp : (typeof venueId !== 'undefined' ? 'venue' : 'artist');

  if ((tipo === 'venue' && typeof venueId !== 'undefined')) {
    ({ data: confirmedRequests = [] } = useConfirmedRequestsByVenue(venueId));
    ({ data: blockedDaysData = [] } = useVenueBlockedDays(venueId));
    // No permitir bloquear desde el frontend para venues (solo lectura)
  } else if (artistId) {
    ({ data: confirmedRequests = [] } = useConfirmedRequests(artistId));
    ({ data: blockedDaysData = [] } = useBlockedDays(artistId));
    ({ createMutation, deleteMutation } = useManageBlockedDays());
  }

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
    if (!editable) return;
    // Solo permitir bloquear días si es calendario de artista
    if (tipo !== 'artist' || !artistId) return;
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
  const handleDateSelect = (date: Date) => {
    const today = startOfDay(new Date());
    const selected = startOfDay(date);
    if (isBefore(selected, today)) return; // No permitir seleccionar días pasados
    if (onDateSelect) onDateSelect(date);
  };

  return (
    <ArtistCalendar
      dates={dates}
      editable={editable && !!artistId}
      onDateToggle={handleBlockDate}
      onDateSelect={handleDateSelect}
    />
  );
}
