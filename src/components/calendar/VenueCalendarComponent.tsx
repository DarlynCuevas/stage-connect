import { useState, useCallback, useEffect, useMemo } from 'react';
import { useBookingSocket } from '@/hooks/useBookingSocket';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CalendarDate } from '@/types';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { Lock, Check, X, Calendar as CalendarIcon } from 'lucide-react';

import { useVenueBlockedDays } from '@/lib/venue-blocked-days';
import { useConfirmedRequestsByVenue } from '@/lib/requests';
import { useManageBlockedDays } from '@/lib/blocked-days';

interface VenueCalendarProps {
  venueId?: number;
  editable?: boolean;
  onDateSelect?: (date: Date) => void;
}

export function VenueCalendarComponent({ venueId, editable = false, onDateSelect }: VenueCalendarProps) {
  // Obtener fechas y lógica a partir del venueId
  const confirmed = venueId ? useConfirmedRequestsByVenue(venueId)?.data : [];
  const blocked = venueId ? useVenueBlockedDays(venueId)?.data : [];
  const confirmedRequests = Array.isArray(confirmed) ? confirmed : [];
  const blockedDaysData = Array.isArray(blocked) ? blocked : [];
  const { createMutation, deleteMutation } = useManageBlockedDays();

  // Unir fechas bloqueadas y reservadas (memorizado para evitar bucles)
  const dates: CalendarDate[] = useMemo(() => [
    ...confirmedRequests.map(req => ({
      date: req.eventDate.slice(0, 10),
      available: false,
      note: `${req.eventType} - ${req.eventLocation}`,
      confirmed: true,
    })),
    ...blockedDaysData.map(bd => ({
      date: bd.blockedDate,
      available: false,
      note: 'Día bloqueado por la sala',
      blocked: true,
    })),
  ], [confirmedRequests, blockedDaysData]);

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [localDates, setLocalDates] = useState<CalendarDate[]>(dates);



  // Callback para bloquear el día cuando se acepte una solicitud (puedes personalizarlo para venue)
  const handleRequestAccepted = useCallback((payload: { eventDate: string }) => {
    setLocalDates(prev => {
      const dateStr = payload.eventDate.split('T')[0];
      if (prev.some(d => d.date === dateStr && d.blocked)) return prev;
      return [
        ...prev,
        { date: dateStr, available: false, note: 'Día bloqueado por reserva aceptada', blocked: true },
      ];
    });
  }, []);

  useBookingSocket(handleRequestAccepted);

  const getDateStatus = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return localDates.find(d => d.date === dateStr);
  };

  const handleDateClick = (date: Date | undefined) => {
    if (!date) return;
    // Normalizar la hora a mediodía para evitar desfase por zona horaria
    const safeDate = new Date(date);
    safeDate.setHours(12, 0, 0, 0);
    setSelectedDate(safeDate);
    if (!editable && onDateSelect) {
      onDateSelect(safeDate);
    }
  };

  const selectedDateInfo = selectedDate ? getDateStatus(selectedDate) : null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <Card variant="gradient">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-primary" />
            Calendario de Disponibilidad (Local)
          </CardTitle>
          <div className="flex items-center gap-3 text-sm">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="text-muted-foreground">Disponible</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-destructive" />
              <span className="text-muted-foreground">Reservado</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'hsl(38, 92%, 50%)' }} />
              <span className="text-muted-foreground">Bloqueado</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col lg:flex-row gap-6">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateClick}
            locale={es}
            className="rounded-lg border border-border p-3"
            modifiers={{
              available: localDates.filter(d => d.available).map(d => parseISO(d.date)),
              unavailable: localDates.filter(d => !d.available && (d as any).confirmed).map(d => parseISO(d.date)),
              blocked: localDates.filter(d => (d as any).blocked).map(d => parseISO(d.date)),
              past: Array.from({ length: 365 }, (_, i) => {
                const d = new Date();
                d.setDate(d.getDate() - i);
                d.setHours(0,0,0,0);
                return d;
              }).filter(d => d < today),
              selected: selectedDate ? [selectedDate] : [],
              today: [today],
            }}
            modifiersStyles={{
              available: {
                backgroundColor: 'transparent',
                color: 'inherit',
              },
              unavailable: {
                backgroundColor: 'hsl(var(--destructive) / 0.3)',
                color: 'hsl(var(--destructive))',
                fontWeight: 600,
                borderRadius: '50%',
              },
              blocked: {
                backgroundColor: 'hsl(38, 92%, 50%)',
                color: 'white',
                fontWeight: 600,
                borderRadius: '50%',
              },
              past: {
                backgroundColor: 'rgba(156,163,175,0.15)',
                color: '#d1d5db',
                pointerEvents: 'none',
                opacity: 1,
                borderRadius: '50%',
              },
              selected: {
                backgroundColor: 'hsl(var(--accent))',
                color: 'inherit',
                borderRadius: '50%',
              },
              today: {
                border: '2px solid #2563eb',
                borderRadius: '50%',
              },
            }}
          />
          <div className="flex-1 min-w-[250px]">
            {selectedDate ? (
              <div className="p-4 rounded-lg bg-secondary/50 border border-border">
                <p className="text-lg font-display font-semibold mb-2">
                  {format(selectedDate, "d 'de' MMMM, yyyy", { locale: es })}
                </p>
                {selectedDateInfo ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      {selectedDateInfo.available ? (
                        <Badge variant="success">
                          <Check className="w-3 h-3 mr-1" />
                          Disponible
                        </Badge>
                      ) : (selectedDateInfo as any).confirmed ? (
                        <Badge variant="destructive">
                          <X className="w-3 h-3 mr-1" />
                          Reserva confirmada
                        </Badge>
                      ) : (
                        <Badge variant="destructive">
                          <Lock className="w-3 h-3 mr-1" />
                          Día bloqueado
                        </Badge>
                      )}
                    </div>
                    {selectedDateInfo.note && (
                      <p className="text-sm text-muted-foreground">
                        {selectedDateInfo.note}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      Disponible
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-4 rounded-lg bg-secondary/30 border border-border/50 text-center">
                <p className="text-muted-foreground">
                  Selecciona una fecha para ver detalles
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
