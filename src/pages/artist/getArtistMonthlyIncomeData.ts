import { parseISO, format } from 'date-fns';
// Devuelve un array tipo MonthlyArtistSpending: [{ month: '2025-12', total: 123 }]
export function getArtistMonthlyIncomeData(confirmedRequests) {
  const incomeByMonth = {};
  confirmedRequests.forEach(req => {
    const eventDate = typeof req.eventDate === 'string' ? parseISO(req.eventDate) : new Date(req.eventDate);
    const key = format(eventDate, 'yyyy-MM');
    incomeByMonth[key] = (incomeByMonth[key] || 0) + (Number(req.offeredPrice) || 0);
  });
  return Object.entries(incomeByMonth)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, total]) => ({ month, total }));
}