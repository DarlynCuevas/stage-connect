import { ChartContainer, ChartTooltip, ChartLegend } from '@/components/ui/chart';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { useMemo } from 'react';
import { es } from 'date-fns/locale';
import { format, parseISO } from 'date-fns';

function getMonthlyIncomeData(confirmedRequests) {
  // Agrupa ingresos por mes (YYYY-MM)
  const incomeByMonth = {};
  confirmedRequests.forEach(req => {
    const eventDate = typeof req.eventDate === 'string' ? parseISO(req.eventDate) : new Date(req.eventDate);
    const key = format(eventDate, 'yyyy-MM');
    incomeByMonth[key] = (incomeByMonth[key] || 0) + (Number(req.offeredPrice) || 0);
  });
  // Convierte a array ordenado por fecha ascendente
  return Object.entries(incomeByMonth)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => ({
      month: format(parseISO(key + '-01'), 'MMM yyyy', { locale: es }),
      ingresos: value
    }));
}

export function ArtistIncomeChart({ confirmedRequests }) {
  const data = useMemo(() => getMonthlyIncomeData(confirmedRequests), [confirmedRequests]);

  return (
    <ChartContainer config={{ ingresos: { label: 'Ingresos', color: '#10b981' } }}>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
          <XAxis dataKey="month" stroke="#888" tick={{ fontSize: 12 }} />
          <YAxis stroke="#888" tick={{ fontSize: 12 }} tickFormatter={v => v.toLocaleString('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })} />
          <Tooltip content={<ChartTooltip />} cursor={{ fill: '#e0e7ef22' }} />
          <Legend content={<ChartLegend />} />
          <Bar dataKey="ingresos" fill="#10b981" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}