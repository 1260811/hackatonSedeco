import type { Agreement, AgreementConfiguration } from '@/types/api';
import { USE_MOCKS } from './index';
import { request } from './client';
import { db, delay } from '@/mocks/data';

export const getAgreement = async (tandaId: string): Promise<Agreement> => {
  if (USE_MOCKS) {
    const found = db.agreements[tandaId];
    if (!found) throw new Error('Convenio no encontrado');
    return delay({ ...found, acceptances: [...found.acceptances] });
  }
  return request<Agreement>(`/tandas/${tandaId}/agreement`);
};

export const updateAgreement = async (
  tandaId: string,
  config: AgreementConfiguration,
): Promise<Agreement> => {
  if (USE_MOCKS) {
    const current = db.agreements[tandaId];
    if (!current) throw new Error('Convenio no encontrado');
    const updated: Agreement = {
      ...current,
      ...config,
      version: current.version + 1,
      acceptances: [],
    };
    db.agreements[tandaId] = updated;
    return delay(updated, 400);
  }
  return request<Agreement>(`/tandas/${tandaId}/agreement`, {
    method: 'PUT',
    body: config,
  });
};

export const acceptAgreement = async (
  tandaId: string,
  participationId: string,
): Promise<Agreement> => {
  if (USE_MOCKS) {
    const current = db.agreements[tandaId];
    if (!current) throw new Error('Convenio no encontrado');
    const already = current.acceptances.some(
      (a) => a.participationId === participationId && a.agreementVersion === current.version,
    );
    if (!already) {
      current.acceptances.push({
        participationId,
        agreementVersion: current.version,
        acceptedAt: new Date().toISOString(),
      });
    }
    return delay({ ...current, acceptances: [...current.acceptances] }, 400);
  }
  return request<Agreement>(`/tandas/${tandaId}/agreement/acceptance`, {
    method: 'POST',
    body: { participationId },
  });
};
