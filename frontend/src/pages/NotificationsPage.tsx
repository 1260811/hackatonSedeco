import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Bell, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { markNotificationRead } from '@/api/notifications';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { PageSpinner } from '@/components/ui/Spinner';
import { useNotifications } from '@/hooks/useNotifications';
import type { Notification } from '@/types/api';
import { formatRelative } from '@/utils/dates';
import { describeError } from '@/utils/errors';
import { notificationTargetRoute, notificationTypeLabel } from '@/utils/notification';

export default function NotificationsPage() {
  const { data, isLoading, error } = useNotifications();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const markRead = useMutation({
    mutationFn: markNotificationRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const unreadCount = data?.filter((n) => !n.read).length ?? 0;

  const handleClick = (notification: Notification) => {
    if (!notification.read) markRead.mutate(notification.id);
    const route = notificationTargetRoute(notification.type);
    if (route) navigate(route);
  };

  return (
    <div className="space-y-5">
      <header className="flex items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Notificaciones</h1>
          <p className="text-sm text-slate-500">
            {unreadCount > 0 ? `Tienes ${unreadCount} sin leer.` : 'Estás al día.'}
          </p>
        </div>
      </header>

      {isLoading && <PageSpinner />}
      {error && <ErrorMessage message={describeError(error)} />}

      {data && data.length === 0 && (
        <EmptyState
          icon={<Bell className="h-8 w-8" />}
          title="Sin notificaciones"
          description="Cuando haya avisos importantes aparecerán aquí."
        />
      )}

      {data && data.length > 0 && (
        <Card className="divide-y divide-slate-100 p-0">
          {data.map((notification) => (
            <button
              key={notification.id}
              type="button"
              onClick={() => handleClick(notification)}
              className={
                notification.read
                  ? 'block w-full px-5 py-4 text-left transition hover:bg-slate-50'
                  : 'block w-full bg-brand-50/60 px-5 py-4 text-left transition hover:bg-brand-50'
              }
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <Badge tone={notification.read ? 'neutral' : 'info'}>
                      {notificationTypeLabel(notification.type)}
                    </Badge>
                    {!notification.read && (
                      <span className="inline-block h-2 w-2 rounded-full bg-brand-500" />
                    )}
                  </div>
                  <p className="mt-1 text-sm text-slate-900">{notification.message}</p>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {formatRelative(notification.createdAt)}
                  </p>
                </div>
                {!notification.read && (
                  <Button
                    size="sm"
                    variant="ghost"
                    leftIcon={<Check className="h-4 w-4" />}
                    onClick={(e) => {
                      e.stopPropagation();
                      markRead.mutate(notification.id);
                    }}
                  >
                    Marcar leída
                  </Button>
                )}
              </div>
            </button>
          ))}
        </Card>
      )}
    </div>
  );
}
