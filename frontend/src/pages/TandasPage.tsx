import { useQuery } from '@tanstack/react-query';
import { Plus, Users } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { listTandas } from '@/api/tandas';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { PageSpinner } from '@/components/ui/Spinner';
import type { Tanda, TandaStatus } from '@/types/api';
import { describeError } from '@/utils/errors';
import { formatMoney } from '@/utils/money';
import { FREQUENCY_LABEL, TANDA_STATUS_LABEL, TANDA_STATUS_TONE } from '@/utils/tanda';
import { CreateTandaDialog } from './tandas/CreateTandaDialog';

const FILTER_OPTIONS: Array<{ value: TandaStatus | 'ALL'; label: string }> = [
  { value: 'ALL', label: 'Todas' },
  { value: 'DRAFT', label: 'Borradores' },
  { value: 'ACTIVE', label: 'Activas' },
  { value: 'PAUSED', label: 'Pausadas' },
  { value: 'COMPLETED', label: 'Finalizadas' },
];

export default function TandasPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [filter, setFilter] = useState<TandaStatus | 'ALL'>('ALL');

  const { data, isLoading, error } = useQuery({
    queryKey: ['tandas', filter],
    queryFn: () => listTandas(filter === 'ALL' ? undefined : filter),
  });

  return (
    <div className="space-y-5">
      <header className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Tandas</h1>
          <p className="text-sm text-slate-500">
            Crea, administra y participa en tandas con tus contactos.
          </p>
        </div>
        <Button leftIcon={<Plus className="h-4 w-4" />} onClick={() => setDialogOpen(true)}>
          Nueva tanda
        </Button>
      </header>

      <div className="flex flex-wrap gap-2">
        {FILTER_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => setFilter(option.value)}
            className={
              filter === option.value
                ? 'rounded-full bg-brand-600 px-3 py-1 text-xs font-medium text-white'
                : 'rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 hover:bg-slate-200'
            }
          >
            {option.label}
          </button>
        ))}
      </div>

      {isLoading && <PageSpinner />}
      {error && <ErrorMessage message={describeError(error)} />}

      {data && data.length === 0 && (
        <EmptyState
          icon={<Users className="h-8 w-8" />}
          title="No hay tandas para mostrar"
          description="Crea tu primera tanda o espera invitaciones de otras personas."
          action={
            <Button leftIcon={<Plus className="h-4 w-4" />} onClick={() => setDialogOpen(true)}>
              Nueva tanda
            </Button>
          }
        />
      )}

      {data && data.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {data.map((tanda) => (
            <TandaRow key={tanda.id} tanda={tanda} />
          ))}
        </div>
      )}

      <CreateTandaDialog open={dialogOpen} onClose={() => setDialogOpen(false)} />
    </div>
  );
}

function TandaRow({ tanda }: { tanda: Tanda }) {
  return (
    <Link to={`/tandas/${tanda.id}`}>
      <Card className="h-full transition hover:border-brand-400 hover:shadow-md">
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-2 text-base font-semibold text-slate-900">
            {tanda.name}
          </h3>
          <Badge tone={TANDA_STATUS_TONE[tanda.status]}>
            {TANDA_STATUS_LABEL[tanda.status]}
          </Badge>
        </div>
        <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1 text-sm">
          <dt className="text-slate-500">Aportación</dt>
          <dd className="text-right font-medium text-slate-900">
            {formatMoney(tanda.contributionAmount)}
          </dd>
          <dt className="text-slate-500">Frecuencia</dt>
          <dd className="text-right text-slate-700">{FREQUENCY_LABEL[tanda.frequency]}</dd>
          <dt className="text-slate-500">Participantes</dt>
          <dd className="text-right text-slate-700">
            {tanda.participantCount}
            {tanda.participantCount !== tanda.distinctPersonCount && (
              <span className="text-slate-400"> ({tanda.distinctPersonCount} personas)</span>
            )}
          </dd>
        </dl>
      </Card>
    </Link>
  );
}
