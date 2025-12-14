import Discovery from "@/pages/Discovery";
import { useAuth } from '@/contexts/AuthContext';
import { HeaderLayout } from '@/components/layout/HeaderLayout';

export default function ArtistDiscover() {
  const { user } = useAuth();
  const artistNav = [
    { to: user ? `/artist/${user.id}/discover` : '/login', label: 'Inicio' },
    { to: '/artist/dashboard', label: 'Panel de datos' },
    { to: user ? `/artist/profile/${user.id}` : '/login', label: 'Mi perfil' },
    { to: user ? `/artist/calendar/${user.id}` : '/artist/calendar', label: 'Calendario' },
    { to: '/artist/requests', label: 'Solicitudes' },
  ];
  return (
    <HeaderLayout profileTabs={artistNav}>
      <Discovery type="venues" />
    </HeaderLayout>
  );
}