import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { Button } from './ui/Button';
import { Logo } from './Logo';

export function Topbar() {
  const user = useAuthStore((s) => s.user);
  const clear = useAuthStore((s) => s.clear);
  const navigate = useNavigate();

  const handleLogout = () => {
    clear();
    navigate('/login', { replace: true });
  };

  const initial = user?.displayName?.[0]?.toUpperCase() ?? 'U';

  return (
    <header className="flex items-center justify-between border-b border-sky-200 bg-white px-4 py-3 sm:px-8">
      <div className="md:hidden">
        <Logo variant="horizontal" size="sm" />
      </div>
      <div className="ml-auto flex items-center gap-3">
        <div className="hidden text-right sm:block">
          <p className="text-sm font-semibold text-navy-800">{user?.displayName ?? 'Usuario'}</p>
          <p className="text-xs text-ink-600">{user?.email ?? ''}</p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-500 font-display font-bold text-navy-900 shadow-tactile-sm">
          {initial}
        </div>
        <Button
          variant="ghost"
          size="sm"
          leftIcon={<LogOut className="h-4 w-4" />}
          onClick={handleLogout}
        >
          Salir
        </Button>
      </div>
    </header>
  );
}
