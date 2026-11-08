import type { ApiError, ApiErrorCode } from '@/types/api';

export class HttpError extends Error {
  readonly status: number;
  readonly apiError: ApiError;

  constructor(status: number, apiError: ApiError) {
    super(apiError.message);
    this.status = status;
    this.apiError = apiError;
  }
}

const ERROR_MESSAGES: Record<ApiErrorCode, string> = {
  VALIDATION_ERROR: 'Los datos ingresados no son válidos.',
  UNAUTHENTICATED: 'Tu sesión expiró. Vuelve a iniciar sesión.',
  FORBIDDEN: 'No tienes permiso para realizar esta acción.',
  NOT_FOUND: 'El recurso solicitado no existe o no es visible.',
  CONFLICT: 'La operación entra en conflicto con el estado actual.',
  BUSINESS_RULE_VIOLATION: 'La operación incumple una regla del sistema.',
  PAYMENT_REQUIRES_REVIEW: 'El pago requiere revisión manual.',
  INTERNAL_ERROR: 'Ocurrió un error inesperado. Intenta más tarde.',
};

export const describeError = (error: unknown): string => {
  if (error instanceof HttpError) {
    return error.apiError.message || ERROR_MESSAGES[error.apiError.code];
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'Ocurrió un error inesperado.';
};
