import type { CreatePaymentRequest, PaymentRequest } from '@/types/api';
import { USE_MOCKS } from './index';
import { request } from './client';
import { db, delay, generateId } from '@/mocks/data';

export const createPaymentRequest = async (
  obligationId: string,
  payload: CreatePaymentRequest,
  idempotencyKey: string,
): Promise<PaymentRequest> => {
  if (USE_MOCKS) {
    let obligation;
    for (const list of Object.values(db.obligations)) {
      obligation = list.find((o) => o.id === obligationId);
      if (obligation) break;
    }
    if (!obligation) throw new Error('Obligación no encontrada');
    const created: PaymentRequest = {
      id: generateId('pr'),
      obligationId,
      channel: payload.channel,
      amount: obligation.amount,
      recipientBankAccountId: 'acc_1',
      status: 'CREATED',
      qrPayload:
        payload.channel === 'CODI_QR'
          ? `codi://mock?oblig=${obligationId}&amount=${obligation.amount}`
          : null,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
    };
    db.paymentRequests.push(created);
    obligation.status = 'PAYMENT_REQUESTED';
    return delay(created, 500);
  }
  return request<PaymentRequest>(`/obligations/${obligationId}/payment-requests`, {
    method: 'POST',
    body: payload,
    idempotencyKey,
  });
};

export const getPaymentRequest = async (paymentRequestId: string): Promise<PaymentRequest> => {
  if (USE_MOCKS) {
    const found = db.paymentRequests.find((p) => p.id === paymentRequestId);
    if (!found) throw new Error('Solicitud no encontrada');
    return delay({ ...found });
  }
  return request<PaymentRequest>(`/payment-requests/${paymentRequestId}`);
};
