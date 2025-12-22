import React from 'react';
import { VenueAlert } from '@/types/venue-dashboard';

import { AlertTriangle } from 'lucide-react';

export function VenueAlerts({ alerts }: { alerts: VenueAlert[] }) {
  if (!alerts.length) return null;
  return (
    <div className="bg-yellow-50/80 border border-yellow-200 rounded-xl p-4 mb-8 flex flex-col gap-2 shadow-sm mx-2 sm:mx-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-2 mb-2">
        <AlertTriangle className="w-5 h-5 text-yellow-600" />
        <h2 className="text-lg font-semibold text-yellow-800">Alertas y notificaciones</h2>
      </div>
      <ul className="list-disc pl-7 space-y-1">
        {alerts.map((alert, idx) => (
          <li key={idx} className="text-yellow-900 text-sm font-medium">
            {alert.message}
          </li>
        ))}
      </ul>
    </div>
  );
}
