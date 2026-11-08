import { useQuery } from '@tanstack/react-query';
import { Calendar } from 'lucide-react';
import { listParticipations } from '@/api/participations';
import { listTurns } from '@/api/turns';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { Spinner } from '@/components/ui/Spinner';
import { formatDateTime } from '@/utils/dates';
import { describeError } from '@/utils/errors';

interface Props {
  tandaId: string;
}

export function TurnsList({ tandaId }: Props) {
  const { data: turns, isLoading, error } = useQuery({
    queryKey: ['turns', tandaId],
    queryFn: () => listTurns(tandaId),
  });
  const { data: participations } = useQuery({
    queryKey: ['participations', tandaId],
    queryFn: () => listParticipations(tandaId),
  });

  const participationsById = new Map((participations ?? []).map((p) => [p.id, p]));

  return (
    <Card>
      <h3 className="text-sm font-semibold text-slate-900">Turnos</h3>
      <p className="mt-0.5 text-xs text-slate-500">
        Cada turno indica quién recibe el acumulado y en qué fecha programada.
      </p>

      <div className="mt-4 space-y-2">
        {isLoading && <Spinner />}
        {error && <ErrorMessage message={describeError(error)} />}
        {turns && turns.length === 0 && (
          <EmptyState
            icon={<Calendar className="h-6 w-6" />}
            title="Aún no hay turnos"
            description="Los turnos se generan cuando la tanda queda activa."
          />
        )}
        {turns?.map((turn) => {
          const receiver = participationsById.get(turn.receiverParticipationId);
          return (
            <div
              key={turn.id}
              className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-sm"
            >
              <div>
                <p className="font-medium text-slate-900">Turno #{turn.position}</p>
                <p className="text-xs text-slate-500">
                  Recibe: {receiver?.displayName ?? '—'}
                </p>
              </div>
              <div className="text-right text-xs text-slate-500">
                <p>{formatDateTime(turn.scheduledAt)}</p>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
