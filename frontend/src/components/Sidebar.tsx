import { NavLink } from 'react-router-dom';
import {
  Home,
  Wallet,
  Users,
  Bell,
  FileText,
  History,
  CreditCard,
} from 'lucide-react';
import { clsx } from 'clsx';
import { useNotifications } from '@/hooks/useNotifications';
import { Logo } from './Logo';

const items = [
  { to: '/', label: 'Inicio', icon: Home, end: true },
  { to: '/tandas', label: 'Tandas', icon: Users },
  { to: '/accounts', label: 'Cuentas', icon: Wallet },
  { to: '/obligations', label: 'Obligaciones', icon: CreditCard },
  { to: '/history', label: 'Historial', icon: History },
  { to: '/agreements', label: 'Convenios', icon: FileText },
  { to: '/notifications', label: 'Notificaciones', icon: Bell, badgeKey: 'notifications' as const },
];

export function Sidebar() {
  const { data: notifications } = useNotifications();
  const unreadCount = notifications?.filter((n) => !n.read).length ?? 0;

  return (
    <aside className="hidden w-64 flex-shrink-0 bg-navy-800 px-3 py-5 md:block">
      <div className="mb-8 px-2">
        <Logo variant="horizontal-dark" size="sm" />
        <p className="mt-1 pl-10 text-[11px] uppercase tracking-wider text-sky-200/70">
          Tandas · SEDECO
        </p>
      </div>
      <nav className="flex flex-col gap-1">
        {items.map(({ to, label, icon: Icon, end, badgeKey }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              clsx(
                'group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all',
                isActive
                  ? 'bg-navy-900/60 text-white before:absolute before:left-0 before:top-2 before:bottom-2 before:w-1 before:rounded-r-full before:bg-gold-500'
                  : 'text-sky-100/80 hover:bg-navy-700 hover:text-white',
              )
            }
          >
            <Icon className="h-4 w-4" />
            <span className="flex-1">{label}</span>
            {badgeKey === 'notifications' && unreadCount > 0 && (
              <span className="inline-flex min-w-[20px] items-center justify-center rounded-full bg-brand-500 px-1.5 text-xs font-bold text-navy-900">
                {unreadCount}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="mt-10 rounded-xl bg-navy-900/40 p-3 text-xs text-sky-100/80">
        <p className="font-semibold text-white">Tu coperacha · 2026</p>
        <p className="mt-1 leading-relaxed">
          Ahorra en comunidad, cumple tus metas 💫
        </p>
      </div>
    </aside>
  );
}
