import Discovery from "@/pages/Discovery";
import { useAuth } from '@/contexts/AuthContext';
import { HeaderLayout } from '@/components/layout/HeaderLayout';

export default function VenueDiscover() {
  const { user } = useAuth();
  const localNav = [
    { to: user ? `/venue/${user.id}/discover` : '/login', label: 'Inicio' },
    { to: '/venue/dashboard', label: 'Panel de datos' },
    { to: user ? `/venue/profile/${user.id}` : '/login', label: 'Mi perfil' },
    { to: user ? `/venue/calendar/${user.id}` : '/venue/calendar', label: 'Calendario' },
    { to: '/venue/requests', label: 'Solicitudes' },
  ];

  return (
    <HeaderLayout profileTabs={localNav}>
      <Discovery type="artists" />
    </HeaderLayout>
  );
}
