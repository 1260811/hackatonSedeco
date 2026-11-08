import type { CreateTandaRequest, Tanda, TandaStatus } from '@/types/api';
import { USE_MOCKS } from './index';
import { request } from './client';
import { db, delay, generateId } from '@/mocks/data';

export const listTandas = async (status?: TandaStatus): Promise<Tanda[]> => {
  if (USE_MOCKS) {
    const filtered = status ? db.tandas.filter((t) => t.status === status) : db.tandas;
    return delay([...filtered]);
  }
  const path = status ? `/tandas?status=${status}` : '/tandas';
  return request<Tanda[]>(path);
};

export const getTanda = async (tandaId: string): Promise<Tanda> => {
  if (USE_MOCKS) {
    const found = db.tandas.find((t) => t.id === tandaId);
    if (!found) throw new Error('Tanda no encontrada');
    return delay({ ...found });
  }
  return request<Tanda>(`/tandas/${tandaId}`);
};

export const createTanda = async (payload: CreateTandaRequest): Promise<Tanda> => {
  if (USE_MOCKS) {
    const created: Tanda = {
      id: generateId('tanda'),
      name: payload.name,
      status: 'DRAFT',
      contributionAmount: payload.contributionAmount,
      frequency: payload.frequency,
      startDate: payload.startDate,
      participantCount: 1,
      distinctPersonCount: 1,
    };
    db.tandas.push(created);
    db.participations[created.id] = [
      {
        id: generateId('part'),
        userId: 'me',
        displayName: 'Yudexi (tú)',
        status: 'ACTIVE',
        selectedBankAccountId: null,
        selectedPosition: 1,
      },
    ];
    db.agreements[created.id] = {
      version: 1,
      penaltyEnabled: false,
      terms: '',
      acceptances: [],
    };
    return delay(created, 500);
  }
  return request<Tanda>('/tandas', { method: 'POST', body: payload });
};

export const activateTanda = async (tandaId: string): Promise<Tanda> => {
  if (USE_MOCKS) {
    const tanda = db.tandas.find((t) => t.id === tandaId);
    if (!tanda) throw new Error('Tanda no encontrada');
    const participations = db.participations[tandaId] ?? [];
    const activeCount = participations.filter((p) => p.status === 'ACTIVE').length;
    if (activeCount < 3) {
      throw new Error('Se requieren mínimo 3 participantes activos para activar la tanda.');
    }
    tanda.status = 'ACTIVE';
    return delay({ ...tanda }, 500);
  }
  return request<Tanda>(`/tandas/${tandaId}/activation`, { method: 'POST' });
};
