import { HeaderLayout } from '@/components/layout/HeaderLayout';
import { CalendarComponent } from '@/components/calendar/CalendarComponent';
import { useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { VenueCalendarComponent } from '@/components/calendar/VenueCalendarComponent';

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
    <HeaderLayout>
      <div className="space-y-6 px-2 sm:px-0">
        <div className="text-center mt-10">
          <h1 className="text-2xl sm:text-3xl font-display font-bold mb-2">
            Calendario de la sala
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Gestiona la disponibilidad de tu sala
          </p>
        </div>
        <div className="flex justify-center w-full">
          <div className="w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-2xl">
            {venueId && authUser ? (
              <VenueCalendarComponent venueId={venueId} editable={true} />
            ) : (
              <div className="text-center text-muted-foreground py-10">Cargando calendario...</div>
            )}
          </div>
        </div>
      </div>
    </HeaderLayout>
  );
}
