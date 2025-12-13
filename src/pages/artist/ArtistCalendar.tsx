import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { HeaderLayout } from '@/components/layout/HeaderLayout';
import CalendarComponent from '@/components/calendar/CalendarComponent';
import { useParams } from 'react-router-dom';

export default function ArtistCalendar() {
  const { id } = useParams();
  const artistId = id ? Number(id) : undefined;
  return (
    <HeaderLayout>
      <DashboardLayout noSidebar>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-display font-bold mb-2">
              Mi Calendario
            </h1>
            <p className="text-muted-foreground">
              Gestiona tu disponibilidad para que los locales y promotores puedan ver cuándo estás libre. Bloquea días en los que no estés disponible.
            </p>
          </div>
          <CalendarComponent artistId={artistId} />
        </div>
      </DashboardLayout>
    </HeaderLayout>
  );
}
