/**
 * Mapea un tipo de notificación conocido a su ruta destino.
 * Si el tipo no está mapeado, devuelve null (no navegable).
 */
export const notificationTargetRoute = (
  type: string,
  context?: Record<string, string>,
): string | null => {
  switch (type) {
    case 'OBLIGATION_DUE':
    case 'OBLIGATION_OVERDUE':
      return context?.obligationId ? `/obligations/${context.obligationId}` : '/obligations';
    case 'INVITATION':
    case 'TANDA_PAUSED':
    case 'TANDA_RESUMED':
    case 'TANDA_CANCELLATION':
      return context?.tandaId ? `/tandas/${context.tandaId}` : '/tandas';
    case 'AGREEMENT_UPDATE':
      return context?.tandaId ? `/tandas/${context.tandaId}/agreement` : '/agreements';
    case 'PAYMENT_CONFIRMED':
    case 'PAYMENT_FAILED':
      return '/history';
    default:
      return null;
  }
};

export const notificationTypeLabel = (type: string): string => {
  switch (type) {
    case 'OBLIGATION_DUE':
      return 'Aportación próxima';
    case 'OBLIGATION_OVERDUE':
      return 'Aportación vencida';
    case 'INVITATION':
      return 'Invitación a tanda';
    case 'TANDA_PAUSED':
      return 'Tanda en pausa';
    case 'TANDA_RESUMED':
      return 'Tanda reanudada';
    case 'TANDA_CANCELLATION':
      return 'Cancelación en proceso';
    case 'AGREEMENT_UPDATE':
      return 'Convenio actualizado';
    case 'PAYMENT_CONFIRMED':
      return 'Pago confirmado';
    case 'PAYMENT_FAILED':
      return 'Pago fallido';
    default:
      return 'Aviso';
  }
};
