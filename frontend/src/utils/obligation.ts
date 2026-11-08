import type { PaymentObligationStatus } from '@/types/api';

export const OBLIGATION_STATUS_LABEL: Record<PaymentObligationStatus, string> = {
  PENDING: 'Pendiente',
  PAYMENT_REQUESTED: 'Solicitud generada',
  PAID: 'Pagada',
  OVERDUE: 'Vencida',
  UNDER_REVIEW: 'En revisión',
  CANCELLED: 'Cancelada',
};

export const OBLIGATION_STATUS_TONE: Record<
  PaymentObligationStatus,
  'neutral' | 'success' | 'warning' | 'danger' | 'info'
> = {
  PENDING: 'warning',
  PAYMENT_REQUESTED: 'info',
  PAID: 'success',
  OVERDUE: 'danger',
  UNDER_REVIEW: 'warning',
  CANCELLED: 'neutral',
};
