import { HeaderLayout } from '@/components/layout/HeaderLayout';
import { CalendarComponent } from '@/components/calendar/CalendarComponent';
import { useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export default function VenueCalendar() {
  const { id } = useParams();
  const { user: authUser } = useAuth();
  if (id && authUser && String(authUser.id) !== String(id)) {
    return <div className="flex items-center justify-center min-h-[60vh]"><p className="text-destructive text-lg font-semibold">Acceso denegado</p></div>;
  }
  const venueId = id ? Number(id) : undefined;
  const venueNav = [
    { to: venueId ? `/venue/${venueId}/discover` : '/login', label: 'Inicio' },
    { to: `/venue/${venueId}/dashboard`, label: 'Panel de datos' },
    { to: venueId ? `/venue/${venueId}/profile` : '/login', label: 'Mi perfil' },
    { to: venueId ? `/venue/${venueId}/calendar` : '/login', label: 'Calendario' },
    { to: `/venue/${venueId}/requests`, label: 'Solicitudes' },
  ];
  return (
    <HeaderLayout profileTabs={venueNav}>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-display font-bold mb-2">
              Calendario de la sala
            </h1>
            <p className="text-muted-foreground">
              Gestiona la disponibilidad de tu sala para que los artistas y promotores puedan ver cuándo está libre. Bloquea días en los que no esté disponible.
            </p>
          </div>
          <CalendarComponent venueId={venueId} editable={true} />
        </div>
    </HeaderLayout>
  );
}
