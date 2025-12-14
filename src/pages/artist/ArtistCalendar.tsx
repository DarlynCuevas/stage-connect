import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { HeaderLayout } from '@/components/layout/HeaderLayout';
import CalendarComponent from '@/components/calendar/CalendarComponent';
import { useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export default function ArtistCalendar() {
  const { id } = useParams();
  const { user: authUser } = useAuth();
  if (id && authUser && String(authUser.id) !== String(id)) {
    return <div className="flex items-center justify-center min-h-[60vh]"><p className="text-destructive text-lg font-semibold">Acceso denegado</p></div>;
  }
  const artistId = id ? Number(id) : undefined;
  const artistNav = [
    { to: artistId ? `/artist/${artistId}/discover` : '/login', label: 'Inicio' },
    { to: `/artist/${artistId}/dashboard`, label: 'Panel de datos' },
    { to: artistId ? `/artist/${artistId}/profile` : '/login', label: 'Mi perfil' },
    { to: artistId ? `/artist/${artistId}/calendar` : '/login', label: 'Calendario' },
    { to: `/artist/${artistId}/requests`, label: 'Solicitudes' },
  ];
  return (
    <HeaderLayout profileTabs={artistNav}>
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
    </HeaderLayout>
  );
}
