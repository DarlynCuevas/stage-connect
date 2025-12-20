

import { CalendarDate } from "@/types";
import { Calendar } from '@/components/ui/calendar';
import { es } from 'date-fns/locale';
// Utilidad para parsear fechas ISO como locales (evita desfase por zona horaria)
function parseISOToLocal(dateStr: string) {
  // dateStr: '2025-12-15' => new Date('2025-12-15T00:00:00') en local
  return new Date(dateStr + 'T00:00:00');
}
import React from 'react';

export interface CalendarComponentProps {
  dates: CalendarDate[];
  selectedDate?: Date;
  onSelect?: (date: Date) => void;
  modifiers?: { [key: string]: Date[] };
  modifiersStyles?: { [key: string]: React.CSSProperties };
}

export const CalendarComponent: React.FC<CalendarComponentProps> = ({
  dates,
  selectedDate,
  onSelect,
  modifiers,
  modifiersStyles
}) => {
  // Si no se pasan modifiers, calcular los básicos por defecto
  const defaultModifiers = React.useMemo(() => ({
    available: dates.filter(d => d.available).map(d => parseISOToLocal(d.date)),
    unavailable: dates.filter(d => !d.available && (d as any).confirmed).map(d => parseISOToLocal(d.date)),
    blocked: dates.filter(d => (d as any).blocked).map(d => parseISOToLocal(d.date)),
    selected: selectedDate ? [selectedDate] : [],
  }), [dates, selectedDate]);

  // Handler para normalizar la fecha seleccionada (ajustar a mediodía)
  const handleSelect = (date: Date | undefined) => {
    if (!date) return;
    const safeDate = new Date(date);
    safeDate.setHours(12, 0, 0, 0); // Mediodía para evitar desfase
    onSelect?.(safeDate);
  };

  // Deshabilitar días anteriores a hoy
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <Calendar
      mode="single"
      selected={selectedDate}
      onSelect={handleSelect}
      locale={es}
      className="rounded-lg border border-border p-3"
      modifiers={modifiers || defaultModifiers}
      modifiersStyles={modifiersStyles}
      disabled={{ before: today }}
    />
  );
};
