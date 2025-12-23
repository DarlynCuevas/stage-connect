import React, { useState } from 'react';

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

  // Estado para paginación
  const [eventsToShow, setEventsToShow] = useState(10);
  const [paymentsToShow, setPaymentsToShow] = useState(10);

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
        <div className="flex flex-col gap-8 w-full">
          {loadingEvents || !upcomingEvents ? (
            <div className="h-32 flex items-center justify-center text-muted-foreground w-full">Cargando próximos eventos...</div>
          ) : (
            <div className="w-full">
              <UpcomingEventsTable events={upcomingEvents.slice(0, eventsToShow)} />
              {upcomingEvents.length > eventsToShow && (
                <div className="flex justify-center mt-2">
                  <button
                    className="px-4 py-2 rounded-full bg-primary text-white font-semibold hover:bg-primary/90 transition"
                    onClick={() => setEventsToShow(eventsToShow + 10)}
                  >
                    Cargar más eventos
                  </button>
                </div>
              )}
            </div>
          )}
          {loadingPayments || !paymentHistory ? (
            <div className="h-32 flex items-center justify-center text-muted-foreground w-full">Cargando historial de pagos...</div>
          ) : (
            <div className="w-full">
              <PaymentsHistoryTable payments={paymentHistory.slice(0, paymentsToShow)} />
              {paymentHistory.length > paymentsToShow && (
                <div className="flex justify-center mt-2">
                  <button
                    className="px-4 py-2 rounded-full bg-primary text-white font-semibold hover:bg-primary/90 transition"
                    onClick={() => setPaymentsToShow(paymentsToShow + 10)}
                  >
                    Cargar más pagos
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        {loadingAlerts || !alerts ? (
          <div className="h-20 flex items-center justify-center text-muted-foreground">Cargando alertas...</div>
        ) : (
          <VenueAlerts alerts={alerts} />
        )}
      </div>
    </HeaderLayout>
  );
}
