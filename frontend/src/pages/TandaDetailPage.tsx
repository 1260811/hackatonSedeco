import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Play } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { activateTanda, getTanda } from '@/api/tandas';
import { listParticipations } from '@/api/participations';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { PageSpinner } from '@/components/ui/Spinner';
import { describeError } from '@/utils/errors';
import { formatDate } from '@/utils/dates';
import { formatMoney } from '@/utils/money';
import {
  FREQUENCY_LABEL,
  MIN_ACTIVE_PARTICIPATIONS,
  TANDA_STATUS_LABEL,
  TANDA_STATUS_TONE,
} from '@/utils/tanda';
import { ObligationsList } from './tandas/ObligationsList';
import { ParticipantsList } from './tandas/ParticipantsList';
import { TurnsList } from './tandas/TurnsList';

export default function TandaDetailPage() {
  const { tandaId } = useParams<{ tandaId: string }>();
  const queryClient = useQueryClient();

  const { data: tanda, isLoading, error } = useQuery({
    queryKey: ['tanda', tandaId],
    queryFn: () => getTanda(tandaId!),
    enabled: !!tandaId,
  });

  const { data: participations } = useQuery({
    queryKey: ['participations', tandaId],
    queryFn: () => listParticipations(tandaId!),
    enabled: !!tandaId,
  });

  const activate = useMutation({
    mutationFn: () => activateTanda(tandaId!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tanda', tandaId] });
      queryClient.invalidateQueries({ queryKey: ['tandas'] });
    },
  });

  if (isLoading) return <PageSpinner />;
  if (error) return <ErrorMessage message={describeError(error)} />;
  if (!tanda) return null;

  const activeDistinct = new Set(
    participations?.filter((p) => p.status === 'ACTIVE').map((p) => p.userId),
  ).size;
  const canActivate = tanda.status === 'DRAFT' && activeDistinct >= MIN_ACTIVE_PARTICIPATIONS;
  const activationRequirements = [
    {
      ok: activeDistinct >= MIN_ACTIVE_PARTICIPATIONS,
      label: `Al menos ${MIN_ACTIVE_PARTICIPATIONS} personas distintas activas`,
    },
  ];

  return (
    <div className="space-y-5">
      <Link
        to="/tandas"
        className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700"
      >
        <ArrowLeft className="h-4 w-4" /> Volver a tandas
      </Link>

      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-900">{tanda.name}</h1>
            <Badge tone={TANDA_STATUS_TONE[tanda.status]}>
              {TANDA_STATUS_LABEL[tanda.status]}
            </Badge>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            {FREQUENCY_LABEL[tanda.frequency]} · Inicia {formatDate(tanda.startDate)} ·{' '}
            {formatMoney(tanda.contributionAmount)} por aportación
          </p>
        </div>
        {tanda.status === 'DRAFT' && (
          <Button
            leftIcon={<Play className="h-4 w-4" />}
            disabled={!canActivate}
            loading={activate.isPending}
            onClick={() => activate.mutate()}
          >
            Activar tanda
          </Button>
        )}
      </header>

      {tanda.status === 'DRAFT' && (
        <Card>
          <h3 className="text-sm font-semibold text-slate-900">Requisitos para activar</h3>
          <ul className="mt-2 space-y-1 text-sm">
            {activationRequirements.map((req) => (
              <li key={req.label} className="flex items-center gap-2">
                <span
                  className={
                    req.ok
                      ? 'inline-block h-2 w-2 rounded-full bg-green-500'
                      : 'inline-block h-2 w-2 rounded-full bg-amber-500'
                  }
                />
                <span className={req.ok ? 'text-slate-600' : 'text-slate-900'}>
                  {req.label}
                </span>
              </li>
            ))}
            <li className="flex items-center gap-2 text-sm text-slate-500">
              <span className="inline-block h-2 w-2 rounded-full bg-slate-300" />
              <Link to={`/tandas/${tanda.id}/agreement`} className="text-brand-600 hover:underline">
                Convenio aceptado por todos los participantes activos
              </Link>
            </li>
          </ul>
          {activate.isError && (
            <div className="mt-3">
              <ErrorMessage message={describeError(activate.error)} />
            </div>
          )}
        </Card>
      )}

      <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-4">
          <ParticipantsList tandaId={tanda.id} />
          {tanda.status !== 'DRAFT' && (
            <>
              <TurnsList tandaId={tanda.id} />
              <ObligationsList tandaId={tanda.id} />
            </>
          )}
        </div>
        <Card>
          <h3 className="text-sm font-semibold text-slate-900">Resumen</h3>
          <dl className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-slate-500">Aportación</dt>
              <dd className="font-medium text-slate-900">
                {formatMoney(tanda.contributionAmount)}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">Frecuencia</dt>
              <dd className="text-slate-700">{FREQUENCY_LABEL[tanda.frequency]}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">Inicio</dt>
              <dd className="text-slate-700">{formatDate(tanda.startDate)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">Participaciones</dt>
              <dd className="text-slate-700">{tanda.participantCount}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">Personas distintas</dt>
              <dd className="text-slate-700">{tanda.distinctPersonCount}</dd>
            </div>
          </dl>
        </Card>
      </div>
    </div>
  );
}
