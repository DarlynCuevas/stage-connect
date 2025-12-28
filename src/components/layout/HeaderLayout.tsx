import React, { ReactNode } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Music, Bell, Sun, Moon,  User,Settings, LogOut, MessageCircle, BarChart } from 'lucide-react';
import artimeLogo from '../../images/artime_logo.png';
import { BottomNav } from './BottomNav';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { useReceivedManagerRequests, useManagerRequestsRealtime } from '@/lib/manager-requests';
import { useArtistRequests as useArtistReqFromRequestsLib } from '@/lib/requests';


export interface HeaderLayoutProps {
  children: ReactNode;
  profileTabs?: Array<{ to: string; label: string; icon?: React.ReactNode }>;
}

export function HeaderLayout({ children }: HeaderLayoutProps) {
  const getSettingsPath = () => {
    if (!user) return '/';
    const role = String(user.role).toLowerCase();
    if (role.includes('art')) return `/artist/${user.id}/settings`;
    if (role.includes('local')) return `/venue/${user.id}/settings`;
    if (role.includes('manager')) return `/manager/${user.id}/settings`;
    if (role.includes('promotor')) return `/promoter/${user.id}/settings`;
    return '/';
  };
  const { user, isAuthenticated, logout } = useAuth();
  React.useEffect(() => {}, [user, isAuthenticated]);
  const location = useLocation();

  // Extraer venueId o artistId dinámicamente de la URL si estamos en un perfil de venue o artista
  let venueIdFromUrl: string | null = null;
  let artistIdFromUrl: string | null = null;
  const venueProfileMatch = location.pathname.match(/^\/venue\/(\d+)/);
  if (venueProfileMatch) {
    venueIdFromUrl = venueProfileMatch[1];
  }
  const artistProfileMatch = location.pathname.match(/^\/artist\/(\d+)/);
  if (artistProfileMatch) {
    artistIdFromUrl = artistProfileMatch[1];
  }

  // Mapeo de rutas a títulos amigables
  const getMobileTitle = () => {
    const path = location.pathname;
    if (path.includes('/requests')) return 'Solicitudes';
    if (path.includes('/dashboard')) return 'Panel';
    if (path.includes('/discover')) return 'Discover';
    if (path.includes('/calendar')) return 'Calendario';
    if (path.includes('/profile')) return 'Perfil';
    if (path.includes('/settings')) return 'Ajustes';
    return '';
  };
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

  // Menú por defecto según el usuario autenticado (igual que BottomNav)
  const layoutItems = [
    {
      key: 'home', label: 'Inicio', getPath: (user: any) => {
        if (!user) return '/';
        const role = String(user.role).toLowerCase();
        if (role.includes('art')) return `/artist/${user.id}/discover`;
        if (role.includes('local')) return `/venue/${user.id}/discover`;
        if (role.includes('manager')) return `/manager/${user.id}/discover`;
        if (role.includes('promotor')) return `/promoter/${user.id}/discover`;
        return '/';
      }
    },
     {
      key: 'dashboard', label: 'Panel', getPath: (user: any) => {
        if (!user) return '/';
        const role = String(user.role).toLowerCase();
        if (role.includes('art')) return `/artist/${user.id}/dashboard`;
        if (role.includes('local')) return `/venue/${user.id}/dashboard`;
        if (role.includes('manager')) return `/manager/${user.id}/dashboard`;
        if (role.includes('promotor')) return `/promoter/${user.id}/dashboard`;
        return '/';
      }
    },
       {
      key: 'profile', label: 'Perfil', getPath: (user: any) => {
        if (!user) return '/';
        const role = String(user.role).toLowerCase();
        if (role.includes('art')) return `/artist/${user.id}/profile`;
        if (role.includes('local')) return `/venue/${user.id}/profile`;
        if (role.includes('manager')) return `/manager/${user.id}/profile`;
        if (role.includes('promotor')) return `/promoter/${user.id}/profile`;
        return '/';
      }
    },
    // Calendario solo para artista, local y promotor
    {
      key: 'calendar', label: 'Calendario', getPath: (user: any) => {
        if (!user) return '/';
        const role = String(user.role).toLowerCase();
        if (role.includes('art')) return `/artist/${user.id}/calendar`;
        if (role.includes('local')) return `/venue/${user.id}/calendar`;
        // No calendar for manager
        return null;
      }
    },
    {
      key: 'request', label: 'Solicitudes', getPath: (user: any) => {
        if (!user) return '/';
        const role = String(user.role).toLowerCase();
        if (role.includes('art')) return `/artist/${user.id}/requests`;
        if (role.includes('local')) return `/venue/${user.id}/requests`;
        if (role.includes('manager')) return `/manager/${user.id}/requests`;
        if (role.includes('promotor')) return `/promoter/${user.id}/requests`;
        return '/';
      }
    },
  ];

 

  return (
    <div className="min-h-screen bg-background flex flex-col items-center font-sans">
      {/* Header solo para móvil, con icono de ajustes */}
      <header className="sm:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-border/20 flex items-center h-12 px-4 gap-2">
        <span className="flex-1 text-base font-light font-display text-black truncate text-ellipsis">
          {getMobileTitle()}
        </span>
        <button
          aria-label="Cambiar tema"
          className="w-6 h-6 rounded-full border flex items-center justify-center text-muted-foreground hover:text-foreground mr-2 p-0"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
        <Link
          to={
            artistIdFromUrl
              ? `/artist/${artistIdFromUrl}/pages`
              : venueIdFromUrl
                ? `/venue/${venueIdFromUrl}/pages`
                : "/messages"
          }
          className="w-7 h-7 rounded-full border flex items-center justify-center text-muted-foreground hover:text-primary transition-colors mr-2"
          title="Mensajes"
        >
          <MessageCircle className="w-4 h-4" />
        </Link>
        {/* Menú de usuario/avatar para móvil */}
        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="relative">
                <Avatar className="h-7 w-7 border cursor-pointer border-border">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback>{String(user.name || 'U').charAt(0)}</AvatarFallback>
                </Avatar>
                {user?.verified && (
                  <span className="absolute -bottom-1 -right-1 bg-white dark:bg-background rounded-full p-[2px] shadow">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  </span>
                )}
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuItem asChild>
                <Link to="/billing" className="flex items-center gap-2">
                  <BarChart className="w-4 h-4" /> Facturación
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to={user ? `/artist/${user.id}/invite` : '/'} className="flex items-center gap-2">
                  <User className="w-4 h-4" /> Invita a un amigo
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to={getSettingsPath()} className="flex items-center gap-2">
                  <Settings className="w-4 h-4" /> Ajustes
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={logout} className="text-destructive flex items-center gap-2">
                <LogOut className="w-4 h-4" /> Cerrar sesión
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </header>
      {/* Header y tabs solo en escritorio (sm+) */}
      <header className="hidden sm:block sticky top-0 z-50 bg-background/80 backdrop-blur-md shadow-sm w-full transition-all">
        <div className="w-full px-0 flex flex-col items-center">
          <div className="h-16 flex items-center justify-center w-full max-w-6xl px-6">
            {/* Logo y nombre solo visibles en escritorio (sm+) */}
            <Link
              to={user && user.role
                ? (String(user.role).toLowerCase().includes('art')
                  ? `/artist/${user.id}/discover`
                  : String(user.role).toLowerCase().includes('local')
                  ? `/venue/${user.id}/discover`
                  : String(user.role).toLowerCase().includes('manager')
                  ? `/manager/${user.id}/discover`
                  : String(user.role).toLowerCase().includes('promotor')
                  ? `/promoter/${user.id}/discover`
                  : '/')
                : '/'}
              className="flex items-center gap-2 ml-1 sm:ml-3 mr-8 sm:mr-16 select-none"
            >
              <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shadow-sm">
                <img
                  src={artimeLogo}
                  alt="Artime Logo"
                  className=""
                />
              </div>
              <span className="font-display font-bold text-xl tracking-tight">Artime</span>
            </Link>
            {layoutItems.map((item) => {
              const path = item.getPath(user);
              if (!path || path === '/') return null;
              const isActive = location.pathname.startsWith(path);
              // Badges para la opción Solicitudes
              let showBadges: string[] = [];
              if (item.key === 'request' && user) {
                const role = String(user.role).toLowerCase();
                showBadges = [];
                if (role.includes('art')) {
                  // Artista: solicitudes + manager
                  const pendingManagerRequests = receivedManagerRequests.filter((r: any) => r.status === 'Pending');
                  const pendingReceived = artistRequests.filter((r: any) => r.status === 'Pending');
                  const hasManager = pendingManagerRequests.length > 0;
                  const hasLocal = pendingReceived.some((r: any) => r.requester?.role === 'Local');
                  const hasPromoter = pendingReceived.some((r: any) => r.requester?.role === 'Promotor');
                  if (hasManager) showBadges.push('bg-role-manager');
                  if (hasLocal) showBadges.push('bg-role-venue');
                  if (hasPromoter) showBadges.push('bg-role-promoter');
                } else if (role.includes('local')) {
                  // Venue: solicitudes de artistas y managers
                  // Artistas: requests recibidas con requester.role === 'Artista'
                  const pendingArtistRequests = artistRequests.filter((r: any) => r.status === 'Pending' && r.requester?.role === 'Artista');
                  // Managers: requests recibidas con requester.role === 'Manager'
                  const pendingManagerRequests = artistRequests.filter((r: any) => r.status === 'Pending' && r.requester?.role === 'Manager');
                  if (pendingArtistRequests.length > 0) showBadges.push('bg-role-artist');
                  if (pendingManagerRequests.length > 0) showBadges.push('bg-role-manager');
                }
              }
              return (
                <Link
                  key={item.key}
                  to={path}
                  className={cn(
                    'px-5 py-2 rounded-full font-semibold text-base transition-all duration-200 relative',
                    isActive
                      ? 'bg-primary text-white shadow-md'
                      : 'text-muted-foreground hover:text-primary/80 hover:bg-primary/10'
                  )}
                  style={{ minWidth: 100, textAlign: 'center', letterSpacing: '-0.01em' }}
                >
                  <span className="relative">
                    {item.label}
                    {item.key === 'request' && showBadges.length > 0 && (
                      <span
                        className="hidden sm:flex absolute -top-3 -right-4 flex-row items-center"
                        style={{ minWidth: `${showBadges.length * 22}px` }}
                      >
                        {showBadges.map((color, idx) => (
                          <span
                            key={color}
                            className={`w-4 h-4 rounded-full ${color} border-2 border-white shadow-lg ${idx === showBadges.length - 1 ? 'animate-pulse' : ''}`}
                            style={{
                              marginLeft: idx > 0 ? '-8px' : 0,
                              boxShadow: '0 2px 8px 0 rgba(0,0,0,0.18)',
                              zIndex: 10 + idx,
                            }}
                          />
                        ))}
                      </span>
                    )}
                  </span>
                </Link>
              );
            })}
            {/* Profile navigation tabs integrated into header */}
            {/** Define nav as profileTabs or empty array */}
            {(() => {
              const nav = [];
              return (
                <nav className="flex items-center gap-2">
                  {nav.map((item, idx) => {
                    const active = location.pathname === item.to;
                    // Mostrar badge solo en la pestaña de Solicitudes para Artista
                    const isArtistRequestsTab = user && String(user.role).toLowerCase().includes('art') && item.to.includes('/requests') && item.label === 'Solicitudes';
                    // Usar key única combinando ruta y el índice
                    return (
                      <Link
                        key={item.to + '-' + idx}
                        to={item.to}
                        className={cn(
                          'px-5 py-2 rounded-full font-medium text-sm transition-colors relative',
                          active
                            ? 'bg-[#232329] text-white shadow-sm'
                            : 'text-muted-foreground hover:text-primary'
                        )}
                        style={{ minWidth: 90, textAlign: 'center' }}
                      >
                        {item.icon && <span className="mr-2 align-middle">{item.icon}</span>}
                        {item.label}
                        {isArtistRequestsTab && pendingCount > 0 && (
                          <Badge variant="destructive" className="absolute -bottom-2 -right-2 h-5 min-w-5 px-1.5 text-xs">
                            {pendingCount > 99 ? '99+' : pendingCount}
                          </Badge>
                        )}
                      </Link>
                    );
                  })}
                </nav>
              );
            })()}
            <div className="flex items-center gap-4 ml-auto">
              <button
                aria-label="Cambiar tema"
                className="w-9 h-9 rounded-full border flex items-center justify-center text-muted-foreground hover:text-foreground"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              >
                {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
              <Link
                to={
                  artistIdFromUrl
                    ? `/artist/${artistIdFromUrl}/pages`
                    : venueIdFromUrl
                      ? `/venue/${venueIdFromUrl}/pages`
                      : "/messages"
                }
                className="w-9 h-9 rounded-full border flex items-center justify-center text-muted-foreground hover:text-primary transition-colors"
                title="Mensajes"
              >
                <MessageCircle className="w-5 h-5" />
              </Link>

              {user && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <div className="relative">
                      <Avatar
                        className={
                          'h-8 w-8 border cursor-pointer border-border'
                        }
                      >
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback>{String(user.name || 'U').charAt(0)}</AvatarFallback>
                      </Avatar>
                      {user?.verified && (
                        <span className="absolute -bottom-1 -right-1 bg-white dark:bg-background rounded-full p-[2px] shadow">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        </span>
                      )}
                    </div>
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
                      <Link to="/artist/invite" className="flex items-center gap-2">
                        <span className="w-4 h-4 inline-block">🎉</span> Invita a un amigo
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to={user ? `/artist/${user.id}/settings` : '/artist/settings'} className="flex items-center gap-2">
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
      <main
        className="container mx-auto px-2 sm:px-8 py-4 sm:py-10 pb-20 sm:pb-10 flex flex-col items-center min-h-[70vh]"
        style={{ paddingTop: '3.5rem', paddingBottom: '4.5rem' }}
      >
        {children}
      </main>
      {/* BottomNav solo en móvil, fijo en la parte inferior */}
      <div className="sm:hidden fixed bottom-0 left-0 w-full z-50">
        <BottomNav />
      </div>
    </div>
  );
}
