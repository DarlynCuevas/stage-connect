import React, { ReactNode } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Music, Bell, Sun, Moon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useReceivedManagerRequests } from '@/lib/manager-requests';
import { useArtistRequests as useArtistReqFromRequestsLib } from '@/lib/requests';

interface HeaderLayoutProps {
  children: ReactNode;
}

export function HeaderLayout({ children }: HeaderLayoutProps) {
  const { user, isAuthenticated } = useAuth();
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

  // Badges: pending requests
  const { data: artistRequests = [] } = useArtistReqFromRequestsLib();
  const { data: receivedManagerRequests = [] } = useReceivedManagerRequests();
  const pendingCount = (() => {
    // For artist role, show pending from artist requests + manager requests
    if (user && String(user.role).toLowerCase().includes('art')) {
      const a = artistRequests.filter((r: any) => r.status === 'Pending').length;
      const m = receivedManagerRequests.filter((r: any) => r.status === 'Pending').length;
      return a + m;
    }
    return 0;
  })();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const nav = [
    { to: '/artist', label: 'Inicio' },
    { to: '/artist/calendar', label: 'Calendario' },
    { to: '/artist/requests', label: 'Solicitudes' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
              <Music className="w-4 h-4 text-primary" />
            </div>
            <span className="font-display font-bold">Bookify</span>
          </div>
          <nav className="flex items-center gap-6">
            {nav.map((item) => {
              const active = location.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    'text-sm',
                    active ? 'px-3 py-1 rounded-full bg-muted text-foreground' : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="flex items-center gap-4">
            <button
              aria-label="Cambiar tema"
              className="w-9 h-9 rounded-full border flex items-center justify-center text-muted-foreground hover:text-foreground"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
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
              <Avatar className="h-8 w-8 border border-border">
                <AvatarImage src={user.avatar} />
                <AvatarFallback>{String(user.name || 'U').charAt(0)}</AvatarFallback>
              </Avatar>
            )}
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  );
}
