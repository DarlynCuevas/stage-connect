import React from 'react';
import { UpcomingEvent } from '@/types/venue-dashboard';

export function UpcomingEventsTable({ events }: { events: UpcomingEvent[] }) {
  return (
    <div className="bg-background border border-border/20 rounded-xl p-4 mb-8 overflow-x-auto shadow-sm mx-2 sm:mx-6 max-w-2xl mx-auto">
      <h2 className="text-lg font-semibold mb-2 text-black dark:text-white px-2 sm:px-6">Próximos eventos y pagos</h2>
      <table className="min-w-full text-xs">
        <thead>
          <tr className="text-left text-muted-foreground">
            <th className="py-2 pr-4 font-semibold">Fecha</th>
            <th className="py-2 pr-4 font-semibold">Artista</th>
            <th className="py-2 pr-4 font-semibold">Monto</th>
            <th className="py-2 pr-4 font-semibold">Estado</th>
            <th className="py-2 pr-4 font-semibold">Acción</th>
          </tr>
        </thead>
        <tbody>
          {events.map(ev => (
            <tr key={ev.id} className="border-t border-border/10 hover:bg-primary/5 transition">
              <td className="py-2 pr-4">{ev.date}</td>
              <td className="py-2 pr-4">{ev.artist}</td>
              <td className="py-2 pr-4 font-medium text-primary">${ev.amount}</td>
              <td className="py-2 pr-4">
                <span className={
                  ev.paymentStatus === 'Pagado'
                    ? 'text-emerald-600 font-semibold'
                    : 'text-yellow-600 font-semibold'
                }>
                  {ev.paymentStatus}
                </span>
              </td>
              <td className="py-2 pr-4">
                <button className="text-primary underline text-xs font-medium hover:text-primary/80">Ver/Realizar pago</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
