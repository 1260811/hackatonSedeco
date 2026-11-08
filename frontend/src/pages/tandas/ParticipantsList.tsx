import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CheckCircle2, UserPlus, Wallet } from 'lucide-react';
import { useState } from 'react';
import { listAccounts } from '@/api/accounts';
import { addParticipation, listParticipations } from '@/api/participations';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { Input } from '@/components/ui/Input';
import { Spinner } from '@/components/ui/Spinner';
import { useAuthStore } from '@/stores/authStore';
import type { Participation } from '@/types/api';
import { describeError } from '@/utils/errors';
import {
  MIN_ACTIVE_PARTICIPATIONS,
  PARTICIPATION_STATUS_LABEL,
  PARTICIPATION_STATUS_TONE,
} from '@/utils/tanda';
import { SelectBankAccountDialog } from './SelectBankAccountDialog';

interface Props {
  tandaId: string;
}

export function ParticipantsList({ tandaId }: Props) {
  const queryClient = useQueryClient();
  const currentUserId = useAuthStore((s) => s.user?.id);
  const [showInvite, setShowInvite] = useState(false);
  const [newUserId, setNewUserId] = useState('');
  const [editingParticipation, setEditingParticipation] = useState<Participation | null>(null);

  const { data: participations, isLoading, error } = useQuery({
    queryKey: ['participations', tandaId],
    queryFn: () => listParticipations(tandaId),
  });

  const { data: accounts } = useQuery({ queryKey: ['accounts'], queryFn: listAccounts });

  const invite = useMutation({
    mutationFn: () => addParticipation(tandaId, { userId: newUserId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['participations', tandaId] });
      queryClient.invalidateQueries({ queryKey: ['tandas'] });
      queryClient.invalidateQueries({ queryKey: ['tanda', tandaId] });
      setNewUserId('');
      setShowInvite(false);
    },
  });

  const accountsById = new Map((accounts ?? []).map((a) => [a.id, a]));
  const activeCount = participations?.filter((p) => p.status === 'ACTIVE').length ?? 0;
  const distinctActivePersons = new Set(
    participations?.filter((p) => p.status === 'ACTIVE').map((p) => p.userId),
  ).size;

  return (
    <Card>
      <header className="flex items-end justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">Participantes</h3>
          <p className="mt-1 text-xs text-slate-500">
            {activeCount} activos · {distinctActivePersons} personas distintas
          </p>
        </div>
        <Button
          size="sm"
          variant="secondary"
          leftIcon={<UserPlus className="h-4 w-4" />}
          onClick={() => setShowInvite((v) => !v)}
        >
          Invitar
        </Button>
      </header>

      {distinctActivePersons < MIN_ACTIVE_PARTICIPATIONS && (
        <div className="mt-3 rounded-lg bg-amber-50 p-3 text-xs text-amber-700">
          Se requieren al menos {MIN_ACTIVE_PARTICIPATIONS} personas distintas activas para activar
          la tanda. Faltan {MIN_ACTIVE_PARTICIPATIONS - distinctActivePersons}.
        </div>
      )}

      {showInvite && (
        <div className="mt-3 space-y-2 rounded-lg border border-slate-200 bg-slate-50 p-3">
          <Input
            label="Identificador o correo del contacto"
            value={newUserId}
            onChange={(e) => setNewUserId(e.target.value)}
            placeholder="usuario@correo.com"
          />
          {invite.isError && <ErrorMessage message={describeError(invite.error)} />}
          <div className="flex justify-end gap-2">
            <Button size="sm" variant="ghost" onClick={() => setShowInvite(false)}>
              Cancelar
            </Button>
            <Button
              size="sm"
              onClick={() => invite.mutate()}
              disabled={!newUserId}
              loading={invite.isPending}
            >
              Enviar invitación
            </Button>
          </div>
        </div>
      )}

      <div className="mt-4 space-y-2">
        {isLoading && <Spinner />}
        {error && <ErrorMessage message={describeError(error)} />}
        {participations?.map((p) => {
          const isMe = p.userId === currentUserId;
          const selectedAccount = p.selectedBankAccountId
            ? accountsById.get(p.selectedBankAccountId)
            : undefined;
          return (
            <div
              key={p.id}
              className="flex items-start justify-between rounded-lg bg-slate-50 px-3 py-2 text-sm"
            >
              <div className="min-w-0 flex-1">
                <p className="font-medium text-slate-900">{p.displayName}</p>
                <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-slate-500">
                  {p.selectedPosition != null && <span>Turno #{p.selectedPosition}</span>}
                  {selectedAccount && (
                    <span className="inline-flex items-center gap-1 text-slate-600">
                      <Wallet className="h-3 w-3" />
                      {selectedAccount.displayAlias ?? selectedAccount.bankName}
                    </span>
                  )}
                  {isMe && !selectedAccount && (
                    <span className="inline-flex items-center gap-1 text-amber-700">
                      Falta seleccionar cuenta
                    </span>
                  )}
                </div>
                {isMe && (
                  <button
                    type="button"
                    onClick={() => setEditingParticipation(p)}
                    className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-brand-600 hover:underline"
                  >
                    {selectedAccount ? (
                      <>
                        <CheckCircle2 className="h-3 w-3" /> Cambiar cuenta
                      </>
                    ) : (
                      <>
                        <Wallet className="h-3 w-3" /> Seleccionar cuenta
                      </>
                    )}
                  </button>
                )}
              </div>
              <Badge tone={PARTICIPATION_STATUS_TONE[p.status]}>
                {PARTICIPATION_STATUS_LABEL[p.status]}
              </Badge>
            </div>
          );
        })}
      </div>

      {editingParticipation && (
        <SelectBankAccountDialog
          tandaId={tandaId}
          participation={editingParticipation}
          open
          onClose={() => setEditingParticipation(null)}
        />
      )}
    </Card>
  );
}
