import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CalendarDate } from '@/types';
import { format, isSameDay, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Check, X, Calendar as CalendarIcon } from 'lucide-react';

interface ArtistCalendarProps {
  dates: CalendarDate[];
  editable?: boolean;
  onDateToggle?: (date: Date) => void;
}

export function ArtistCalendar({ dates, editable = false, onDateToggle }: ArtistCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  const getDateStatus = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return dates.find(d => d.date === dateStr);
  };

  const handleDateClick = (date: Date | undefined) => {
    if (!date) return;
    setSelectedDate(date);
    if (editable && onDateToggle) {
      onDateToggle(date);
    }
  };

  const selectedDateInfo = selectedDate ? getDateStatus(selectedDate) : null;

  return (
    <Card variant="outline">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-primary" />
            Calendario de Disponibilidad
          </CardTitle>
          <div className="flex items-center gap-3 text-sm">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="text-muted-foreground">Disponible</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-destructive" />
              <span className="text-muted-foreground">No disponible</span>
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
              available: dates.filter(d => d.available).map(d => parseISO(d.date)),
              unavailable: dates.filter(d => !d.available).map(d => parseISO(d.date)),
            }}
            modifiersStyles={{
              available: {
                backgroundColor: 'hsl(var(--primary) / 0.2)',
                color: 'hsl(var(--primary))',
                fontWeight: 600,
              },
              unavailable: {
                backgroundColor: 'hsl(var(--destructive) / 0.2)',
                color: 'hsl(var(--destructive))',
                fontWeight: 600,
              },
            }}
          />

          {/* Selected date info */}
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
                      ) : (
                        <Badge variant="destructive">
                          <X className="w-3 h-3 mr-1" />
                          No disponible
                        </Badge>
                      )}
                    </div>
                    
                    {selectedDateInfo.note && (
                      <p className="text-sm text-muted-foreground">
                        {selectedDateInfo.note}
                      </p>
                    )}

                    {editable && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onDateToggle?.(selectedDate)}
                      >
                        {selectedDateInfo.available ? 'Marcar como no disponible' : 'Marcar como disponible'}
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      Sin información para esta fecha
                    </p>
                    {editable && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onDateToggle?.(selectedDate)}
                      >
                        Marcar disponibilidad
                      </Button>
                    )}
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
