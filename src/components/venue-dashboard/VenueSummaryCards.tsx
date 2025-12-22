import React from 'react';
import { VenueDashboardSummary } from '@/types/venue-dashboard';

import { CreditCard, AlertCircle, Users, Calendar } from 'lucide-react';

const cards = [
  {
    label: 'Total gastado este mes',
    value: (summary: VenueDashboardSummary) => `$${summary.totalSpentThisMonth}`,
    icon: CreditCard,
    color: 'bg-primary/10 text-primary',
  },
  {
    label: 'Pagos pendientes',
    value: (summary: VenueDashboardSummary) => summary.pendingPayments,
    icon: AlertCircle,
    color: 'bg-yellow-100 text-yellow-600',
  },
  {
    label: 'Artistas contratados',
    value: (summary: VenueDashboardSummary) => summary.artistsHiredThisMonth,
    icon: Users,
    color: 'bg-emerald-100 text-emerald-600',
  },
  {
    label: 'Eventos próximos',
    value: (summary: VenueDashboardSummary) => summary.upcomingEvents,
    icon: Calendar,
    color: 'bg-blue-100 text-blue-600',
  },
];

export function VenueSummaryCards({ summary }: { summary: VenueDashboardSummary }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10 px-2 sm:px-6">
      {cards.map((card, i) => (
        <div
          key={card.label}
          className="bg-background border border-border/20 rounded-xl shadow-sm p-4 flex flex-col items-center gap-2 transition hover:shadow-md w-full min-w-[140px] max-w-[180px] h-[140px] justify-center mx-auto"
        >
          <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${card.color}`}>
            <card.icon className="w-5 h-5" />
          </div>
          <span className="text-xs text-muted-foreground mb-1 text-center">{card.label}</span>
          <span className="text-xl font-bold text-center">{card.value(summary)}</span>
        </div>
      ))}
    </div>
  );
}
