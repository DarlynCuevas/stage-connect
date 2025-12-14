import Discovery from "@/pages/Discovery";
import { useAuth } from '@/contexts/AuthContext';
import { HeaderLayout } from '@/components/layout/HeaderLayout';
import { useParams } from 'react-router-dom';

export default function VenueDiscover() {
  const { user } = useAuth();
  const { id } = useParams();
  if (id && user && String(user.id) !== String(id)) {
    return <div className="flex items-center justify-center min-h-[60vh]"><p className="text-destructive text-lg font-semibold">Acceso denegado</p></div>;
  }
  const localNav = [
     { to: `/venue/${id}/discover`, label: 'Inicio' },
    { to: `/venue/${id}/dashboard`, label: 'Panel de datos' },
    { to: `/venue/${id}/profile`, label: 'Mi perfil' },
    { to: `/venue/${id}/calendar`, label: 'Calendario' },
    { to: `/venue/${id}/requests`, label: 'Solicitudes' },
  ];

  return (
    <HeaderLayout profileTabs={localNav}>
      <Discovery type="artists" />
    </HeaderLayout>
  );
}
