import type { Payment } from '@/types/api';
import { USE_MOCKS } from './index';
import { request } from './client';
import { db, delay } from '@/mocks/data';

export const listPayments = async (tandaId: string): Promise<Payment[]> => {
  if (USE_MOCKS) return delay([...(db.payments[tandaId] ?? [])]);
  return request<Payment[]>(`/tandas/${tandaId}/payments`);
};
