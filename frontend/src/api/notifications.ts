import type { Notification } from '@/types/api';
import { USE_MOCKS } from './index';
import { request } from './client';
import { db, delay } from '@/mocks/data';

export const listNotifications = async (): Promise<Notification[]> => {
  if (USE_MOCKS) return delay([...db.notifications]);
  return request<Notification[]>('/notifications');
};

export const markNotificationRead = async (id: string): Promise<Notification> => {
  if (USE_MOCKS) {
    const found = db.notifications.find((n) => n.id === id);
    if (!found) throw new Error('Notificación no encontrada');
    found.read = true;
    return delay({ ...found }, 150);
  }
  return request<Notification>(`/notifications/${id}/read`, { method: 'POST' });
};
