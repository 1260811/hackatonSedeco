import { useQuery } from '@tanstack/react-query';
import { CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';
import { listObligations } from '@/api/obligations';
import { listParticipations } from '@/api/participations';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { Spinner } from '@/components/ui/Spinner';
import { useAuthStore } from '@/stores/authStore';
import { formatDateTime } from '@/utils/dates';
import { describeError } from '@/utils/errors';
import { formatMoney } from '@/utils/money';
import { OBLIGATION_STATUS_LABEL, OBLIGATION_STATUS_TONE } from '@/utils/obligation';

interface Props {
  tandaId: string;
}

export function ObligationsList({ tandaId }: Props) {
  const currentUserId = useAuthStore((s) => s.user?.id);

  const { data: obligations, isLoading, error } = useQuery({
    queryKey: ['obligations', tandaId],
    queryFn: () => listObligations(tandaId),
  });
  const { data: participations } = useQuery({
    queryKey: ['participations', tandaId],
    queryFn: () => listParticipations(tandaId),
  });

  const myParticipationIds = new Set(
    (participations ?? []).filter((p) => p.userId === currentUserId).map((p) => p.id),
  );
  const mine = obligations?.filter((o) => myParticipationIds.has(o.participationId)) ?? [];

  return (
    <Card>
      <h3 className="text-sm font-semibold text-slate-900">Mis obligaciones</h3>
      <p className="mt-0.5 text-xs text-slate-500">
        Aportaciones que debes realizar en esta tanda.
      </p>

      <div className="mt-4 space-y-2">
        {isLoading && <Spinner />}
        {error && <ErrorMessage message={describeError(error)} />}
        {!isLoading && mine.length === 0 && (
          <EmptyState
            icon={<CreditCard className="h-6 w-6" />}
            title="Sin obligaciones por ahora"
            description="Cuando la tanda genere aportaciones a tu cargo, aparecerán aquí."
          />
        )}
        {mine.map((obligation) => (
          <div
            key={obligation.id}
            className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-sm"
          >
            <div>
              <p className="font-medium text-slate-900">{formatMoney(obligation.amount)}</p>
              <p className="text-xs text-slate-500">
                Vence {formatDateTime(obligation.dueAt)}
              </p>
              {obligation.penaltyAmount && (
                <p className="text-xs text-red-600">
                  Sanción acumulada: {formatMoney(obligation.penaltyAmount)}
                </p>
              )}
            </div>
            <div className="flex items-center gap-3">
              <Badge tone={OBLIGATION_STATUS_TONE[obligation.status]}>
                {OBLIGATION_STATUS_LABEL[obligation.status]}
              </Badge>
              {(obligation.status === 'PENDING' || obligation.status === 'OVERDUE') && (
                <Link
                  to={`/obligations/${obligation.id}`}
                  className="text-xs font-medium text-brand-600 hover:underline"
                >
                  Pagar
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
