import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Calendar, User, Settings } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const navItems = [
  { key: 'home', icon: <Home className="w-6 h-6" />, label: 'Inicio', getPath: (user: any) => {
    if (!user) return '/';
    const role = String(user.role).toLowerCase();
    if (role.includes('art')) return `/artist/${user.id}/discover`;
    if (role.includes('local')) return `/venue/${user.id}/discover`;
    if (role.includes('manager')) return `/manager/${user.id}/discover`;
    if (role.includes('promoter')) return `/promoter/${user.id}/discover`;
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
  { key: 'profile', icon: <User className="w-6 h-6" />, label: 'Perfil', getPath: (user: any) => {
    if (!user) return '/';
    const role = String(user.role).toLowerCase();
    if (role.includes('art')) return `/artist/${user.id}/profile`;
    if (role.includes('local')) return `/venue/${user.id}/profile`;
    if (role.includes('manager')) return `/manager/${user.id}/profile`;
    if (role.includes('promoter')) return `/promoter/${user.id}/profile`;
    return '/';
  } },
  { key: 'settings', icon: <Settings className="w-6 h-6" />, label: 'Ajustes', getPath: (user: any) => {
    if (!user) return '/';
    const role = String(user.role).toLowerCase();
    if (role.includes('art')) return `/artist/${user.id}/settings`;
    if (role.includes('local')) return `/venue/${user.id}/settings`; 
    if (role.includes('manager')) return `/manager/${user.id}/settings`;
    if (role.includes('promoter')) return `/promoter/${user.id}/settings`;
    return '/';
  } },
];

export const BottomNav: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-border/20 flex justify-around items-center h-12 sm:h-16 shadow-lg sm:hidden">
      {navItems.map((item) => {
        const path = item.getPath(user);
        const isActive = location.pathname.startsWith(path);
        return (
          <Link
            key={item.key}
            to={path}
            className={`flex flex-col items-center justify-center flex-1 h-full text-[11px] sm:text-xs font-medium transition-colors ${isActive ? 'text-primary' : 'text-muted-foreground'}`}
          >
            {React.cloneElement(item.icon, { className: 'w-5 h-5 sm:w-6 sm:h-6' })}
            <span className="mt-0.5">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};
