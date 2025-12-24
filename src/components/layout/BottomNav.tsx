import React from 'react';
import { useArtistRequests, useSentRequests } from '@/lib/requests';
import { useReceivedManagerRequests } from '@/lib/manager-requests';
import { UserRole } from '@/types';
import { Link, useLocation } from 'react-router-dom';
import { Home, Calendar, User, Settings, Search, Inbox, BarChart } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const navItems = [

    { key: 'dashboard', icon: <BarChart  className="w-6 h-6" />, label: 'Panel', getPath: (user: any) => {
    if (!user) return '/';
    const role = String(user.role).toLowerCase();
    if (role.includes('art')) return `/artist/${user.id}/dashboard`;
    if (role.includes('local')) return `/venue/${user.id}/dashboard`;
    if (role.includes('manager')) return `/manager/${user.id}/dashboard`;
    if (role.includes('promoter')) return `/promoter/${user.id}/dashboard`;
    return '/';
  } },
    { key: 'calendar', icon: <Calendar className="w-6 h-6" />, label: 'Calendario', getPath: (user: any) => {
    if (!user) return '/';
    const role = String(user.role).toLowerCase();
    if (role.includes('art')) return `/artist/${user.id}/calendar`;
    if (role.includes('local')) return `/venue/${user.id}/calendar`;
    if (role.includes('manager')) return `/manager/${user.id}/calendar`;
    if (role.includes('promoter')) return `/promoter/${user.id}/calendar`;
    return '/';
  } },

   { key: 'home', icon: <Search className="w-6 h-6" />, label: 'Discover', getPath: (user: any) => {
    if (!user) return '/';
    const role = String(user.role).toLowerCase();
    if (role.includes('art')) return `/artist/${user.id}/discover`;
    if (role.includes('local')) return `/venue/${user.id}/discover`;
    if (role.includes('manager')) return `/manager/${user.id}/discover`;
    if (role.includes('promoter')) return `/promoter/${user.id}/discover`;
    return '/';
  } },
  { key: 'request', icon: <Inbox className="w-6 h-6" />, label: 'Solicitudes', getPath: (user: any) => {
    if (!user) return '/';
    const role = String(user.role).toLowerCase();
    if (role.includes('art')) return `/artist/${user.id}/requests`;
    if (role.includes('local')) return `/venue/${user.id}/requests`;
    if (role.includes('manager')) return `/manager/${user.id}/requests`;
    if (role.includes('promoter')) return `/promoter/${user.id}/requests`;
    return '/';
  } },
  { key: 'profile', icon: <User className="w-6 h-6" />, label: 'Mi Perfil', getPath: (user: any) => {
    if (!user) return '/';
    const role = String(user.role).toLowerCase();
    if (role.includes('art')) return `/artist/${user.id}/profile`;
    if (role.includes('local')) return `/venue/${user.id}/profile`;
    if (role.includes('manager')) return `/manager/${user.id}/profile`;
    if (role.includes('promoter')) return `/promoter/${user.id}/profile`;
    return '/';
  } },
];

export const BottomNav: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();

  // Solo para artista: obtener solicitudes pendientes y su origen
  let showBadges: string[] = [];
  if (user) {
    const role = String(user.role).toLowerCase();
    if (role.includes('art')) {
      const { data: requests = [] } = useArtistRequests();
      const { data: sentRequests = [] } = useSentRequests();
      const { data: managerRequests = [] } = useReceivedManagerRequests();
      // Solicitudes de representación pendientes
      const pendingManagerRequests = managerRequests.filter((r: any) => r.status === 'Pending');
      const pendingReceived = requests.filter((r: any) => r.status === 'Pending');
      // Flags para cada tipo
      const hasManager = pendingManagerRequests.length > 0;
      const hasLocal = pendingReceived.some((r: any) => r.requester?.role === 'Local');
      const hasPromoter = pendingReceived.some((r: any) => r.requester?.role === 'Promotor');
      showBadges = [];
      if (hasManager) showBadges.push('bg-role-manager');
      if (hasLocal) showBadges.push('bg-role-venue');
      if (hasPromoter) showBadges.push('bg-role-promoter');
    } else if (role.includes('local')) {
      // Venue: solicitudes de artistas y managers
      const { data: requests = [] } = useArtistRequests();
      // Artistas: requests recibidas con requester.role === 'Artista'
      const pendingArtistRequests = requests.filter((r: any) => r.status === 'Pending' && r.requester?.role === 'Artista');
      // Managers: requests recibidas con requester.role === 'Manager'
      const pendingManagerRequests = requests.filter((r: any) => r.status === 'Pending' && r.requester?.role === 'Manager');
      showBadges = [];
      if (pendingArtistRequests.length > 0) showBadges.push('bg-role-artist');
      if (pendingManagerRequests.length > 0) showBadges.push('bg-role-manager');
    }
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-border/20 flex justify-center items-center h-12 sm:h-16 shadow-lg sm:hidden">
      <div className="flex w-full max-w-md justify-center items-center gap-2 px-2">
        {navItems.map((item) => {
          const path = item.getPath(user);
          const isActive = location.pathname.startsWith(path);
          // Si es el icono de solicitudes y hay badges, mostrarlos alineados
          const showBadge = item.key === 'request' && showBadges.length > 0;
          return (
            <Link
              key={item.key}
              to={path}
              className={`flex flex-col items-center justify-center flex-1 h-full text-[11px] sm:text-xs font-medium transition-colors ${isActive ? 'text-primary' : 'text-muted-foreground'}`}
              style={{ minWidth: 0, position: 'relative' }}
            >
              <span className="relative">
                {React.cloneElement(item.icon, { className: 'w-5 h-5 sm:w-6 sm:h-6' })}
                {showBadge && (
                  <span className="absolute -top-1.5 -right-1.5 flex flex-row gap-0.5">
                    {showBadges.map((color, idx) => (
                      <span key={color} className={`w-2.5 h-2.5 rounded-full ${color} border-2 border-white animate-pulse`} style={{ marginLeft: idx > 0 ? '-2px' : 0 }} />
                    ))}
                  </span>
                )}
              </span>
              <span className="mt-0.5">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
