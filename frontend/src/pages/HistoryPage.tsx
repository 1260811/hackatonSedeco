import { useQuery } from '@tanstack/react-query';
import { History } from 'lucide-react';
import { useState } from 'react';
import { listPayments } from '@/api/payments';
import { listTandas } from '@/api/tandas';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { PageSpinner } from '@/components/ui/Spinner';
import type { Payment, PaymentStatus, Tanda } from '@/types/api';
import { formatDateTime } from '@/utils/dates';
import { describeError } from '@/utils/errors';
import { formatMoney } from '@/utils/money';
import { PAYMENT_STATUS_LABEL, PAYMENT_STATUS_TONE } from '@/utils/payment';

const STATUS_FILTERS: Array<{ value: PaymentStatus | 'ALL'; label: string }> = [
  { value: 'ALL', label: 'Todos' },
  { value: 'CONFIRMED', label: 'Confirmados' },
  { value: 'LATE', label: 'Tardíos' },
  { value: 'UNDER_REVIEW', label: 'En revisión' },
];

export default function HistoryPage() {
  const [tandaFilter, setTandaFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<PaymentStatus | 'ALL'>('ALL');

  const { data: tandas, isLoading, error } = useQuery({
    queryKey: ['tandas'],
    queryFn: () => listTandas(),
  });

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">Historial</h1>
        <p className="text-sm text-slate-500">
          Movimientos confirmados por Pey. Los pagos externos registrados por el organizador
          requieren confirmación del receptor antes de aplicar al saldo.
        </p>
      </header>

      {isLoading && <PageSpinner />}
      {error && <ErrorMessage message={describeError(error)} />}

      {tandas && (
        <Card>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-slate-700">Tanda</label>
              <select
                value={tandaFilter}
                onChange={(e) => setTandaFilter(e.target.value)}
                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              >
                <option value="ALL">Todas</option>
                {tandas.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-slate-700">Estado</label>
              <div className="flex flex-wrap gap-2">
                {STATUS_FILTERS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setStatusFilter(option.value)}
                    className={
                      statusFilter === option.value
                        ? 'rounded-full bg-brand-600 px-3 py-1 text-xs font-medium text-white'
                        : 'rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 hover:bg-slate-200'
                    }
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Card>
      )}

      {tandas && tandas.length === 0 && (
        <EmptyState
          icon={<History className="h-8 w-8" />}
          title="Sin tandas"
          description="Únete o crea una tanda para comenzar a generar historial."
        />
      )}

      {tandas
        ?.filter((t) => tandaFilter === 'ALL' || t.id === tandaFilter)
        .map((tanda) => (
          <PaymentsGroup key={tanda.id} tanda={tanda} statusFilter={statusFilter} />
        ))}
    </div>
  );
}

function PaymentsGroup({
  tanda,
  statusFilter,
}: {
  tanda: Tanda;
  statusFilter: PaymentStatus | 'ALL';
}) {
  const { data, isLoading } = useQuery({
    queryKey: ['payments', tanda.id],
    queryFn: () => listPayments(tanda.id),
  });

  if (isLoading) return null;
  const filtered =
    data?.filter((p) => statusFilter === 'ALL' || p.status === statusFilter) ?? [];
  if (filtered.length === 0) return null;

  return (
    <Card>
      <h3 className="mb-3 text-sm font-semibold text-slate-900">{tanda.name}</h3>
      <div className="space-y-2">
        {filtered.map((payment) => (
          <PaymentRow key={payment.id} payment={payment} />
        ))}
      </div>
    </Card>
  );
}

function PaymentRow({ payment }: { payment: Payment }) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-sm">
      <div>
        <p className="font-medium text-slate-900">{formatMoney(payment.amount)}</p>
        <p className="text-xs text-slate-500">
          Pagado {formatDateTime(payment.paidAt)}
        </p>
        <p className="font-mono text-xs text-slate-400">tx: {payment.peyTransactionId}</p>
      </div>
      <Badge tone={PAYMENT_STATUS_TONE[payment.status]}>
        {PAYMENT_STATUS_LABEL[payment.status]}
      </Badge>
    </div>
  );
}
