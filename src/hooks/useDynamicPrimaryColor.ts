import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

// Este hook cambia el color primario dinámicamente según el rol del usuario
export function useDynamicPrimaryColor() {
  const { user } = useAuth();

  useEffect(() => {
    console.log('[useDynamicPrimaryColor] user.role:', user?.role);
    const primaryValue = getComputedStyle(document.documentElement).getPropertyValue('--artistPrimary') || '16 90% 58%';
    document.documentElement.style.setProperty('--primary', primaryValue.trim());
    document.documentElement.style.setProperty('--primary-foreground', '0 0% 100%');
  }, [user?.role]);
}
