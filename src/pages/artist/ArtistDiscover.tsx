import Discovery from "@/pages/Discovery";
import { useAuth } from '@/contexts/AuthContext';
import { HeaderLayout } from '@/components/layout/HeaderLayout';
import { useParams } from "react-router-dom";

export default function ArtistDiscover() {
  const { user } = useAuth();
  const { id } = useParams();
  if (id && user && String(user.id) !== String(id)) {
    return <div className="flex items-center justify-center min-h-[60vh]"><p className="text-destructive text-lg font-semibold">Acceso denegado</p></div>;
  }
  const artistNav = [
    { to: user ? `/artist/${user.id}/discover` : '/login', label: 'Inicio' },
    { to: `/artist/${user.id}/dashboard`, label: 'Panel de datos' },
    { to: user ? `/artist/${user.id}/profile` : '/login', label: 'Mi perfil' },
    { to: user ? `/artist/${user.id}/calendar` : '/login', label: 'Calendario' },
    { to: `/artist/${user.id}/requests`, label: 'Solicitudes' },
  ];
  return (
    <HeaderLayout profileTabs={artistNav}>
      <Discovery type="venues" />
    </HeaderLayout>
  );
}