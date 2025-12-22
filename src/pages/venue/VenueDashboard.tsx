import React from 'react';

import { useVenueDashboardSummary } from '@/hooks/useVenueDashboardSummary';
import { useVenueMonthlySpending } from '@/hooks/useVenueMonthlySpending';
import { useVenueUpcomingEvents } from '@/hooks/useVenueUpcomingEvents';
import { useVenuePaymentHistory } from '@/hooks/useVenuePaymentHistory';
import { useVenueAlerts } from '@/hooks/useVenueAlerts';
import { HeaderLayout } from '@/components/layout/HeaderLayout';
import { useAuth } from '@/contexts/AuthContext';
import { VenueDashboardHeader } from '@/components/venue-dashboard/VenueDashboardHeader';
import { VenueSummaryCards } from '@/components/venue-dashboard/VenueSummaryCards';
import { ArtistSpendingChart } from '@/components/venue-dashboard/ArtistSpendingChart';
import { UpcomingEventsTable } from '@/components/venue-dashboard/UpcomingEventsTable';
import { PaymentsHistoryTable } from '@/components/venue-dashboard/PaymentsHistoryTable';
import { VenueAlerts } from '@/components/venue-dashboard/VenueAlerts';



export default function VenueDashboard() {
    // TODO: Obtener el venueId real del usuario autenticado/contexto
  const { user } = useAuth();
  const venueId = user?.id ? Number(user.id) : undefined;
  const { data: summary, loading: loadingSummary } = useVenueDashboardSummary(venueId);
  const { data: monthlySpending, loading: loadingSpending } = useVenueMonthlySpending(venueId);
  const { data: upcomingEvents, loading: loadingEvents } = useVenueUpcomingEvents(venueId);
  const { data: paymentHistory, loading: loadingPayments } = useVenuePaymentHistory(venueId);
  const { data: alerts, loading: loadingAlerts } = useVenueAlerts(venueId);

  return (
    <HeaderLayout>
      <div className="max-w-5xl mx-auto w-full space-y-8">
        <VenueDashboardHeader />
        {loadingSummary || !summary ? (
          <div className="h-32 flex items-center justify-center text-muted-foreground">Cargando resumen...</div>
        ) : (
          <VenueSummaryCards summary={summary} />
        )}
        {loadingSpending || !monthlySpending ? (
          <div className="h-32 flex items-center justify-center text-muted-foreground">Cargando gastos mensuales...</div>
        ) : (
          <ArtistSpendingChart data={monthlySpending} />
        )}
        {loadingEvents || !upcomingEvents ? (
          <div className="h-32 flex items-center justify-center text-muted-foreground">Cargando próximos eventos...</div>
        ) : (
          <UpcomingEventsTable events={upcomingEvents} />
        )}
        {loadingPayments || !paymentHistory ? (
          <div className="h-32 flex items-center justify-center text-muted-foreground">Cargando historial de pagos...</div>
        ) : (
          <PaymentsHistoryTable payments={paymentHistory} />
        )}
        {loadingAlerts || !alerts ? (
          <div className="h-20 flex items-center justify-center text-muted-foreground">Cargando alertas...</div>
        ) : (
          <VenueAlerts alerts={alerts} />
        )}
      </div>
    </HeaderLayout>
  );
}
