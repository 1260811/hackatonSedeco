import type { PaymentObligation } from '@/types/api';
import { USE_MOCKS } from './index';
import { request } from './client';
import { db, delay } from '@/mocks/data';

export const listObligations = async (tandaId: string): Promise<PaymentObligation[]> => {
  if (USE_MOCKS) return delay([...(db.obligations[tandaId] ?? [])]);
  return request<PaymentObligation[]>(`/tandas/${tandaId}/obligations`);
};

export const listAllObligations = async (): Promise<PaymentObligation[]> => {
  if (USE_MOCKS) {
    const all = Object.values(db.obligations).flat();
    return delay(all);
  }
  return request<PaymentObligation[]>('/obligations');
};
