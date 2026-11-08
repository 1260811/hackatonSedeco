import type {
  ParticipationStatus,
  TandaFrequency,
  TandaStatus,
} from '@/types/api';

export const TANDA_STATUS_LABEL: Record<TandaStatus, string> = {
  DRAFT: 'Borrador',
  ACTIVE: 'Activa',
  PAUSED: 'Pausada',
  CANCELLATION_PENDING: 'Cancelación pendiente',
  CANCELLED: 'Cancelada',
  COMPLETED: 'Finalizada',
};

export const TANDA_STATUS_TONE: Record<
  TandaStatus,
  'neutral' | 'success' | 'warning' | 'danger' | 'info'
> = {
  DRAFT: 'neutral',
  ACTIVE: 'success',
  PAUSED: 'warning',
  CANCELLATION_PENDING: 'warning',
  CANCELLED: 'danger',
  COMPLETED: 'info',
};

export const FREQUENCY_LABEL: Record<TandaFrequency, string> = {
  WEEKLY: 'Semanal',
  BIWEEKLY: 'Quincenal',
  MONTHLY: 'Mensual',
  CUSTOM: 'Personalizada',
};

export const PARTICIPATION_STATUS_LABEL: Record<ParticipationStatus, string> = {
  INVITED: 'Invitado',
  ACTIVE: 'Activo',
  LEFT: 'Abandonó',
  REMOVED: 'Removido',
};

export const PARTICIPATION_STATUS_TONE: Record<
  ParticipationStatus,
  'neutral' | 'success' | 'warning' | 'danger'
> = {
  INVITED: 'warning',
  ACTIVE: 'success',
  LEFT: 'neutral',
  REMOVED: 'danger',
};

export const MIN_ACTIVE_PARTICIPATIONS = 3;
