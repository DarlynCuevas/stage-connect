import { useState, useMemo } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ArtistCalendar as CalendarComponent } from '@/components/calendar/ArtistCalendar';
import { CalendarDate } from '@/types';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useConfirmedRequests } from '@/lib/requests';
import { useBlockedDays, useManageBlockedDays } from '@/lib/blocked-days';

export default function ArtistCalendar() {
  const { toast } = useToast();
  const { user } = useAuth();
  const { data: confirmedRequests = [] } = useConfirmedRequests(user?.id ? Number(user.id) : undefined);
  const { data: blockedDaysData = [] } = useBlockedDays(user?.id ? Number(user.id) : undefined);
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
    const dateStr = format(date, 'yyyy-MM-dd');
    
    // Check if this date has a confirmed booking
    const isConfirmedBooking = confirmedRequests.some(
      req => toDateStr(req.eventDate) === dateStr
    );

    if (isConfirmedBooking) {
      return;
    }

    const existingBlocked = blockedDaysData.find(bd => bd.blockedDate === dateStr);

    if (existingBlocked) {
      // Remove blocked date
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
      // Add blocked date
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

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-display font-bold mb-2">
            Mi Calendario
          </h1>
          <p className="text-muted-foreground">
            Gestiona tu disponibilidad para que los locales y promotores puedan ver cuándo estás libre. Bloquea días en los que no estés disponible.
          </p>
        </div>

        <CalendarComponent
          dates={dates}
          editable
          onDateToggle={handleBlockDate}
        />
      </div>
    </DashboardLayout>
  );
}
