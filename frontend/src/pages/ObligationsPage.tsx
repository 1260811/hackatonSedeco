import { useQuery } from '@tanstack/react-query';
import { CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';
import { listObligations } from '@/api/obligations';
import { listTandas } from '@/api/tandas';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { PageSpinner } from '@/components/ui/Spinner';
import type { PaymentObligation, Tanda } from '@/types/api';
import { formatDateTime } from '@/utils/dates';
import { describeError } from '@/utils/errors';
import { formatMoney } from '@/utils/money';
import { OBLIGATION_STATUS_LABEL, OBLIGATION_STATUS_TONE } from '@/utils/obligation';

export default function ObligationsPage() {
  const { data: tandas, isLoading, error } = useQuery({
    queryKey: ['tandas'],
    queryFn: () => listTandas(),
  });

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">Obligaciones</h1>
        <p className="text-sm text-slate-500">
          Aportaciones pendientes y realizadas en todas tus tandas.
        </p>
      </header>

      {isLoading && <PageSpinner />}
      {error && <ErrorMessage message={describeError(error)} />}

      {tandas && tandas.length === 0 && (
        <EmptyState
          icon={<CreditCard className="h-8 w-8" />}
          title="Sin tandas activas"
          description="Únete o crea una tanda para ver obligaciones."
        />
      )}

      {tandas?.map((tanda) => (
        <ObligationGroup key={tanda.id} tanda={tanda} />
      ))}
    </div>
  );
}

function ObligationGroup({ tanda }: { tanda: Tanda }) {
  const { data, isLoading } = useQuery({
    queryKey: ['obligations', tanda.id],
    queryFn: () => listObligations(tanda.id),
  });

  if (isLoading) return null;
  if (!data || data.length === 0) return null;

  return (
    <Card>
      <header className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-900">{tanda.name}</h3>
        <Link
          to={`/tandas/${tanda.id}`}
          className="text-xs text-brand-600 hover:underline"
        >
          Ver tanda
        </Link>
      </header>
      <div className="space-y-2">
        {data.map((obligation) => (
          <ObligationRow key={obligation.id} obligation={obligation} />
        ))}
      </div>
    </Card>
  );
}

function ObligationRow({ obligation }: { obligation: PaymentObligation }) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-sm">
      <div>
        <p className="font-medium text-slate-900">{formatMoney(obligation.amount)}</p>
        <p className="text-xs text-slate-500">Vence {formatDateTime(obligation.dueAt)}</p>
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
  );
}
