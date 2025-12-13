import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Sidebar } from './Sidebar';
import { cn } from '@/lib/utils';



interface DashboardLayoutProps {
  children: ReactNode;
  noSidebar?: boolean;
}

export function DashboardLayout({ children, noSidebar }: DashboardLayoutProps) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      {!noSidebar && <Sidebar />}
      <main className={noSidebar ? 'min-h-screen transition-all duration-300' : 'lg:ml-64 min-h-screen transition-all duration-300'}>
        <div>
          {children}
        </div>
      </main>
    </div>
  );
}

