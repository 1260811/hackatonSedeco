import type { AddParticipationRequest, Participation } from '@/types/api';
import { USE_MOCKS } from './index';
import { request } from './client';
import { db, delay, generateId } from '@/mocks/data';

export const listParticipations = async (tandaId: string): Promise<Participation[]> => {
  if (USE_MOCKS) return delay([...(db.participations[tandaId] ?? [])]);
  return request<Participation[]>(`/tandas/${tandaId}/participations`);
};

export const addParticipation = async (
  tandaId: string,
  payload: AddParticipationRequest,
): Promise<Participation> => {
  if (USE_MOCKS) {
    const created: Participation = {
      id: generateId('part'),
      userId: payload.userId,
      displayName: payload.userId,
      status: 'INVITED',
      selectedBankAccountId: null,
      selectedPosition: payload.selectedPosition ?? null,
    };
    const existing = db.participations[tandaId] ?? [];
    db.participations[tandaId] = [...existing, created];
    const tanda = db.tandas.find((t) => t.id === tandaId);
    if (tanda) {
      tanda.participantCount = (db.participations[tandaId] ?? []).length;
      tanda.distinctPersonCount = new Set(
        (db.participations[tandaId] ?? []).map((p) => p.userId),
      ).size;
    }
    return delay(created, 400);
  }
  return request<Participation>(`/tandas/${tandaId}/participations`, {
    method: 'POST',
    body: payload,
  });
};

export const selectBankAccount = async (
  tandaId: string,
  participationId: string,
  bankAccountId: string,
): Promise<Participation> => {
  if (USE_MOCKS) {
    const list = db.participations[tandaId] ?? [];
    const idx = list.findIndex((p) => p.id === participationId);
    if (idx === -1) throw new Error('Participación no encontrada');
    const prev = list[idx];
    if (!prev) throw new Error('Participación no encontrada');
    const updated: Participation = { ...prev, selectedBankAccountId: bankAccountId };
    list[idx] = updated;
    return delay(updated, 300);
  }
  return request<Participation>(
    `/tandas/${tandaId}/participations/${participationId}/bank-account`,
    { method: 'PUT', body: { bankAccountId } },
  );
};
