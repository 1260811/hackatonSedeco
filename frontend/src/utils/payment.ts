import type { PaymentStatus } from '@/types/api';

export const PAYMENT_STATUS_LABEL: Record<PaymentStatus, string> = {
  CONFIRMED: 'Confirmado',
  LATE: 'Tardío',
  UNDER_REVIEW: 'En revisión',
};

export const PAYMENT_STATUS_TONE: Record<
  PaymentStatus,
  'success' | 'warning' | 'danger'
> = {
  CONFIRMED: 'success',
  LATE: 'warning',
  UNDER_REVIEW: 'warning',
};
