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
    hoverBg: 'hover:bg-role-artist/10',
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
    hoverBg: 'hover:bg-role-manager/10',
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
    hoverBg: 'hover:bg-role-venue/10',
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
    hoverBg: 'hover:bg-role-promoter/10',
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
        size="icon-sm"
        className="fixed top-3 left-3 z-50 lg:hidden bg-card/80 backdrop-blur-sm border border-border/50"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
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
          collapsed ? "w-[4.5rem]" : "w-60",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Header */}
        <div className={cn(
          "flex items-center gap-3 px-4 py-4 border-b border-sidebar-border",
          collapsed && "justify-center px-3"
        )}>
          <div className={cn(
            "flex items-center justify-center w-9 h-9 rounded-lg shrink-0",
            config.bgColor
          )}>
            <RoleIcon className={cn("w-4.5 h-4.5", config.color)} />
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <h2 className="font-display font-bold text-foreground text-sm tracking-tight truncate">
                STAGEBOOK
              </h2>
              <p className={cn("text-2xs capitalize", config.color)}>
                {user.role}
              </p>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon-sm"
            className="hidden lg:flex shrink-0"
            onClick={() => setCollapsed(!collapsed)}
          >
            <ChevronLeft className={cn(
              "h-4 w-4 transition-transform duration-200",
              collapsed && "rotate-180"
            )} />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto">
          {config.links.map((link) => {
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group",
                  collapsed && "justify-center px-2",
                  isActive
                    ? `${config.bgColor} ${config.color}`
                    : `text-sidebar-foreground ${config.hoverBg} hover:text-foreground`
                )}
              >
                <link.icon className={cn(
                  "w-[18px] h-[18px] shrink-0 transition-colors",
                  isActive && config.color
                )} />
                {!collapsed && (
                  <span className="text-sm font-medium truncate">{link.label}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User section */}
        <div className={cn(
          "px-3 py-3 border-t border-sidebar-border",
          collapsed && "flex flex-col items-center"
        )}>
          <div className={cn(
            "flex items-center gap-3 mb-2",
            collapsed && "flex-col"
          )}>
            <Avatar className="h-9 w-9 border-2 border-sidebar-border shrink-0">
              <AvatarImage src={user.avatar} />
              <AvatarFallback className={cn(config.bgColor, "text-sm")}>
                {user.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {user.name}
                </p>
                <p className="text-2xs text-muted-foreground truncate">
                  {user.email}
                </p>
              </div>
            )}
          </div>
          <Button
            variant="ghost"
            size={collapsed ? "icon-sm" : "sm"}
            onClick={logout}
            className={cn(
              "text-muted-foreground hover:text-destructive hover:bg-destructive/10",
              !collapsed && "w-full justify-start"
            )}
          >
            <LogOut className="w-4 h-4" />
            {!collapsed && <span className="ml-2 text-sm">Cerrar sesión</span>}
          </Button>
        </div>
      </aside>
    </>
  );
}
