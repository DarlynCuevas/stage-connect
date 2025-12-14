import React, { ReactNode } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Music, Bell, Sun, Moon, LayoutDashboard, User, Calendar, MessageSquare, Settings, LogOut } from 'lucide-react';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { useReceivedManagerRequests, useManagerRequestsRealtime } from '@/lib/manager-requests';
import { useArtistRequests as useArtistReqFromRequestsLib } from '@/lib/requests';


export interface HeaderLayoutProps {
  children: ReactNode;
  profileTabs?: Array<{ to: string; label: string; icon?: React.ReactNode }>;
}

export function HeaderLayout({ children, profileTabs }: HeaderLayoutProps) {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const [theme, setTheme] = React.useState<'dark' | 'light'>(() => {
    const t = localStorage.getItem('theme');
    return (t === 'light' ? 'light' : 'dark');
  });

  React.useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    if (theme === 'light') {
      root.classList.add('light');
      root.classList.remove('dark');
      body.classList.add('light');
      body.classList.remove('dark');
    } else {
      root.classList.remove('light');
      root.classList.add('dark');
      body.classList.remove('light');
      body.classList.add('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Suscripción en tiempo real global para cualquier usuario autenticado
  useManagerRequestsRealtime();

  // Badges: pending requests (adaptar para todos los roles)
  const { data: artistRequests = [] } = useArtistReqFromRequestsLib();
  const { data: receivedManagerRequests = [] } = useReceivedManagerRequests();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const pendingCount = (() => {
    if (!user) return 0;
    const role = String(user.role).toLowerCase();
    if (role.includes('art')) {
      // Artista: solicitudes + manager
      const a = artistRequests.filter((r: any) => r.status === 'Pending').length;
      const m = receivedManagerRequests.filter((r: any) => r.status === 'Pending').length;
      return a + m;
    }
    if (role.includes('manager')) {
      // Manager: solo manager requests recibidas
      return receivedManagerRequests.filter((r: any) => r.status === 'Pending').length;
    }
    if (role.includes('local') || role.includes('promotor')) {
      // Local/Promotor: solo solicitudes recibidas (puedes adaptar si hay endpoint específico)
      return artistRequests.filter((r: any) => r.status === 'Pending').length;
    }
    return 0;
  })();

  // Tabs: siempre mostrar las 5 opciones para artistas
  let nav: Array<{ to: string; label: string; icon?: React.ReactNode }> = [];
  if (user && String(user.role).toLowerCase().includes('art')) {
    nav = [
      { to: '/artist', label: 'Inicio' },
      { to: '/artist/dashboard', label: 'Panel de datos' },
      { to: user ? `/artist/profile/${user.id}` : '/login', label: 'Mi perfil' },
      { to: user ? `/artist/calendar/${user.id}` : '/artist/calendar', label: 'Calendario' },
      { to: '/artist/requests', label: 'Solicitudes' },
    ];
  } else {
    nav = [
      { to: '/', label: 'Inicio' },
    ];
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b">
        <div className="w-full px-0">
          <div className="h-14 flex items-center justify-between">
            <Link to="/artist" className="flex items-center gap-3 hover:opacity-80 transition-opacity ml-8 sm:ml-16">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <Music className="w-4 h-4 text-primary" />
              </div>
              <span className="font-display font-bold">Artime</span>
            </Link>
            {/* Profile navigation tabs integrated into header */}
            <nav className="flex items-center gap-2">
              {nav.map((item) => {
                const active = location.pathname === item.to;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={cn(
                      'px-5 py-2 rounded-full font-medium text-sm transition-colors',
                      active
                        ? 'bg-[#232329] text-white shadow-sm'
                        : 'text-muted-foreground hover:text-primary'
                    )}
                    style={{ minWidth: 90, textAlign: 'center' }}
                  >
                    {item.icon && <span className="mr-2 align-middle">{item.icon}</span>}
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            <div className="flex items-center gap-4 mr-8 sm:mr-16">
              <button
                aria-label="Cambiar tema"
                className="w-9 h-9 rounded-full border flex items-center justify-center text-muted-foreground hover:text-foreground"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              >
                {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
              <button
                onClick={logout}
                className="w-9 h-9 rounded-full border flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors"
                title="Cerrar sesión"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1" />
                </svg>
              </button>
              <div className="relative">
                <Bell className="w-5 h-5 text-muted-foreground" />
                {pendingCount > 0 && (
                  <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 min-w-5 px-1.5 text-xs">
                    {pendingCount > 99 ? '99+' : pendingCount}
                  </Badge>
                )}
              </div>
              {user && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Avatar className="h-8 w-8 border border-border cursor-pointer">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback>{String(user.name || 'U').charAt(0)}</AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem asChild>
                      <Link to={user && user.managerId ? `/manager/profile/${user.managerId}` : '/manager/profile'} className="flex items-center gap-2">
                        <User className="w-4 h-4" /> Mi Manager
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/artist/billing" className="flex items-center gap-2">
                        <span className="w-4 h-4 inline-block">💳</span> Facturación
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/artist/invite" to="/artist/invite" className="flex items-center gap-2">
                        <span className="w-4 h-4 inline-block">🎉</span> Invita a un amigo
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/artist/settings" className="flex items-center gap-2">
                        <Settings className="w-4 h-4" /> Ajustes
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={logout} className="text-destructive flex items-center gap-2">
                      <LogOut className="w-4 h-4" /> Cerrar sesión
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  );
}
