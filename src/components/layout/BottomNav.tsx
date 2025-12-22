import React from 'react';
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
  { key: 'profile', icon: <User className="w-6 h-6" />, label: 'Perfil', getPath: (user: any) => {
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

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-border/20 flex justify-center items-center h-12 sm:h-16 shadow-lg sm:hidden">
      <div className="flex w-full max-w-md justify-center items-center gap-2 px-2">
        {navItems.map((item) => {
          const path = item.getPath(user);
          const isActive = location.pathname.startsWith(path);
          return (
            <Link
              key={item.key}
              to={path}
              className={`flex flex-col items-center justify-center flex-1 h-full text-[11px] sm:text-xs font-medium transition-colors ${isActive ? 'text-primary' : 'text-muted-foreground'}`}
              style={{ minWidth: 0 }}
            >
              {React.cloneElement(item.icon, { className: 'w-5 h-5 sm:w-6 sm:h-6' })}
              <span className="mt-0.5">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
