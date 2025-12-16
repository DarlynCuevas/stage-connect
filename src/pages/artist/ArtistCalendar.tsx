import { HeaderLayout } from '@/components/layout/HeaderLayout';
import { useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ArtistCalendarComponent } from '@/components/calendar/ArtistCalendarComponent';

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
            <div className="relative rounded-2xl overflow-hidden mb-8">
          <div className="h-48 lg:h-64">
            <img
              src={`https://picsum.photos/1200/400?random=1}`}
              alt="Banner"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
          </div>
          {/* Rating sobre la imagen, esquina inferior derecha */}
          <div className="absolute bottom-4 right-6 flex items-center gap-2 bg-black/70 px-3 py-1.5 rounded-full shadow-lg">
          </div>
        </div>
          <div>
            <h1 className="text-3xl font-display font-bold mb-2">
              Mi Calendario
            </h1>
            <p className="text-muted-foreground">
              Gestiona tu disponibilidad para que los locales y promotores puedan ver cuándo estás libre. Bloquea días en los que no estés disponible.
            </p>
          </div>
          <ArtistCalendarComponent artistId={artistId} />
        </div>
    </HeaderLayout>
  );
}
