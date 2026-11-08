import type { BankAccountStatus } from '@/types/api';

export const BANK_ACCOUNT_STATUS_LABEL: Record<BankAccountStatus, string> = {
  ACTIVE: 'Activa',
  PENDING: 'Pendiente',
  INACTIVE: 'Inactiva',
  REJECTED: 'Rechazada',
};

export const BANK_ACCOUNT_STATUS_HINT: Record<BankAccountStatus, string> = {
  ACTIVE: 'La cuenta puede recibir pagos CoDi.',
  PENDING: 'La activación con Pey puede tardar hasta 5 días hábiles.',
  INACTIVE: 'La cuenta está deshabilitada temporalmente.',
  REJECTED: 'La cuenta fue rechazada por Pey. Revisa los datos e inténtalo de nuevo.',
};

export const BANK_ACCOUNT_STATUS_TONE: Record<
  BankAccountStatus,
  'success' | 'warning' | 'neutral' | 'danger'
> = {
  ACTIVE: 'success',
  PENDING: 'warning',
  INACTIVE: 'neutral',
  REJECTED: 'danger',
};

export const CLABE_PATTERN = /^[0-9]{18}$/;
