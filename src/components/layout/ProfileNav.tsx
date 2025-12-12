import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

export interface ProfileNavTab {
  label: string;
  to: string;
  icon?: React.ReactNode;
}

interface ProfileNavProps {
  tabs: ProfileNavTab[];
}

export function ProfileNav({ tabs }: ProfileNavProps) {
  const location = useLocation();
  return (
    <nav className="w-full flex justify-center mt-4 mb-8">
      <div className="flex gap-2 bg-[#18181b] rounded-full px-4 py-1 shadow-sm border border-[#232329]">
        {tabs.map((tab) => (
          <Link
            key={tab.to}
            to={tab.to}
            className={cn(
              'px-5 py-2 rounded-full font-medium text-sm transition-colors',
              location.pathname === tab.to
                ? 'bg-[#232329] text-white shadow-sm'
                : 'text-muted-foreground hover:text-primary'
            )}
            style={{ minWidth: 90, textAlign: 'center' }}
          >
            {tab.icon && <span className="mr-2 align-middle">{tab.icon}</span>}
            {tab.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
