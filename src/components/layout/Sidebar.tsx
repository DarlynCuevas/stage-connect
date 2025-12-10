import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Home,
  User,
  Calendar,
  MessageSquare,
  Search,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  Music,
  Building2,
  Megaphone,
  Heart,
  ChevronLeft,
} from 'lucide-react';

const roleConfig = {
  artist: {
    color: 'text-role-artist',
    bgColor: 'bg-role-artist/10',
    icon: Music,
    links: [
      { to: '/artist', icon: Home, label: 'Inicio' },
      { to: '/artist/profile', icon: User, label: 'Mi Perfil' },
      { to: '/artist/calendar', icon: Calendar, label: 'Calendario' },
      { to: '/artist/requests', icon: MessageSquare, label: 'Solicitudes' },
      { to: '/artist/settings', icon: Settings, label: 'Ajustes' },
    ],
  },
  manager: {
    color: 'text-role-manager',
    bgColor: 'bg-role-manager/10',
    icon: Users,
    links: [
      { to: '/manager', icon: Home, label: 'Inicio' },
      { to: '/manager/artists', icon: Music, label: 'Mis Artistas' },
      { to: '/manager/requests', icon: MessageSquare, label: 'Solicitudes' },
      { to: '/manager/settings', icon: Settings, label: 'Ajustes' },
    ],
  },
  venue: {
    color: 'text-role-venue',
    bgColor: 'bg-role-venue/10',
    icon: Building2,
    links: [
      { to: '/venue', icon: Home, label: 'Inicio' },
      { to: '/venue/search', icon: Search, label: 'Buscar Artistas' },
      { to: '/venue/requests', icon: MessageSquare, label: 'Mis Solicitudes' },
      { to: '/venue/favorites', icon: Heart, label: 'Favoritos' },
      { to: '/venue/settings', icon: Settings, label: 'Ajustes' },
    ],
  },
  promoter: {
    color: 'text-role-promoter',
    bgColor: 'bg-role-promoter/10',
    icon: Megaphone,
    links: [
      { to: '/promoter', icon: Home, label: 'Inicio' },
      { to: '/promoter/search', icon: Search, label: 'Buscar Artistas' },
      { to: '/promoter/events', icon: Calendar, label: 'Mis Eventos' },
      { to: '/promoter/requests', icon: MessageSquare, label: 'Mis Solicitudes' },
      { to: '/promoter/settings', icon: Settings, label: 'Ajustes' },
    ],
  },
};

export function Sidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  if (!user) return null;

  const config = roleConfig[user.role];
  const RoleIcon = config.icon;

  return (
    <>
      {/* Mobile toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X /> : <Menu />}
      </Button>

      {/* Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300 flex flex-col",
          collapsed ? "w-20" : "w-64",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Header */}
        <div className={cn(
          "flex items-center gap-3 p-4 border-b border-sidebar-border",
          collapsed && "justify-center"
        )}>
          <div className={cn(
            "flex items-center justify-center w-10 h-10 rounded-xl",
            config.bgColor
          )}>
            <RoleIcon className={cn("w-5 h-5", config.color)} />
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <h2 className="font-display font-bold text-foreground truncate">
                STAGEBOOK
              </h2>
              <p className={cn("text-xs capitalize", config.color)}>
                {user.role}
              </p>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="hidden lg:flex ml-auto"
            onClick={() => setCollapsed(!collapsed)}
          >
            <ChevronLeft className={cn(
              "h-4 w-4 transition-transform",
              collapsed && "rotate-180"
            )} />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {config.links.map((link) => {
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                  collapsed && "justify-center",
                  isActive
                    ? `${config.bgColor} ${config.color}`
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
              >
                <link.icon className="w-5 h-5 flex-shrink-0" />
                {!collapsed && <span className="font-medium">{link.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* User section */}
        <div className={cn(
          "p-4 border-t border-sidebar-border",
          collapsed && "flex flex-col items-center"
        )}>
          <div className={cn(
            "flex items-center gap-3 mb-3",
            collapsed && "flex-col"
          )}>
            <Avatar className="h-10 w-10">
              <AvatarImage src={user.avatar} />
              <AvatarFallback className={config.bgColor}>
                {user.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {user.name}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {user.email}
                </p>
              </div>
            )}
          </div>
          <Button
            variant="ghost"
            size={collapsed ? "icon" : "default"}
            onClick={logout}
            className={cn(
              "text-muted-foreground hover:text-destructive",
              !collapsed && "w-full justify-start"
            )}
          >
            <LogOut className="w-4 h-4" />
            {!collapsed && <span className="ml-2">Cerrar sesión</span>}
          </Button>
        </div>
      </aside>
    </>
  );
}
