import type { PaymentRequestStatus } from '@/types/api';

export const PAYMENT_REQUEST_STATUS_LABEL: Record<PaymentRequestStatus, string> = {
  CREATED: 'Creada',
  PENDING: 'Pendiente',
  PROCESSING: 'En proceso',
  EXPIRED: 'Expirada',
  PAID: 'Pagada',
  FAILED: 'Falló',
  UNDER_REVIEW: 'En revisión',
};

export const PAYMENT_REQUEST_STATUS_TONE: Record<
  PaymentRequestStatus,
  'neutral' | 'success' | 'warning' | 'danger' | 'info'
> = {
  CREATED: 'info',
  PENDING: 'warning',
  PROCESSING: 'info',
  EXPIRED: 'danger',
  PAID: 'success',
  FAILED: 'danger',
  UNDER_REVIEW: 'warning',
};
