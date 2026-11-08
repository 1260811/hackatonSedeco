import { useQuery } from '@tanstack/react-query';
import { listNotifications } from '@/api/notifications';

export function useNotifications() {
  return useQuery({
    queryKey: ['notifications'],
    queryFn: listNotifications,
    refetchInterval: 30_000,
  });
}
