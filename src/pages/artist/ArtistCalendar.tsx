import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ArtistCalendar as CalendarComponent } from '@/components/calendar/ArtistCalendar';
import { mockCalendarDates } from '@/data/mockData';
import { CalendarDate } from '@/types';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

export default function ArtistCalendar() {
  const [dates, setDates] = useState<CalendarDate[]>(mockCalendarDates);
  const { toast } = useToast();

  const handleDateToggle = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const existingDate = dates.find(d => d.date === dateStr);

    if (existingDate) {
      setDates(dates.map(d =>
        d.date === dateStr ? { ...d, available: !d.available } : d
      ));
    } else {
      setDates([...dates, { date: dateStr, available: true }]);
    }

    toast({
      title: 'Disponibilidad actualizada',
      description: `Fecha ${format(date, 'dd/MM/yyyy')} actualizada.`,
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-display font-bold mb-2">
            Mi Calendario
          </h1>
          <p className="text-muted-foreground">
            Gestiona tu disponibilidad para que los locales y promotores puedan ver cuándo estás libre.
          </p>
        </div>

        <CalendarComponent
          dates={dates}
          editable
          onDateToggle={handleDateToggle}
        />
      </div>
    </DashboardLayout>
  );
}
