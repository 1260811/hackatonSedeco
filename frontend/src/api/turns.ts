import type { Turn } from '@/types/api';
import { USE_MOCKS } from './index';
import { request } from './client';
import { db, delay } from '@/mocks/data';

export const listTurns = async (tandaId: string): Promise<Turn[]> => {
  if (USE_MOCKS) return delay([...(db.turns[tandaId] ?? [])]);
  return request<Turn[]>(`/tandas/${tandaId}/turns`);
};
