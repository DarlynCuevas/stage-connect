// Tipos para el dashboard del local (venue)

export type VenueDashboardSummary = {
  totalSpentThisMonth: number;
  pendingPayments: number;
  artistsHiredThisMonth: number;
  upcomingEvents: number;
};

export type MonthlyArtistSpending = {
  month: string; // '2025-12'
  total: number;
}[];

export type UpcomingEvent = {
  id: string;
  date: string;
  artist: string;
  amount: number;
  paymentStatus: 'Pagado' | 'Pendiente';
  eventName?: string;
};

export type PaymentHistory = {
  id: string;
  date: string;
  artist: string;
  event: string;
  amount: number;
  status: 'Pagado' | 'Devuelto' | 'Cancelado';
};

export type VenueAlert = {
  type: 'payment_due' | 'event_unpaid' | 'rate_artist';
  message: string;
  relatedId?: string;
};
