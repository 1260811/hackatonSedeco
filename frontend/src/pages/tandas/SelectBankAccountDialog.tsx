import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { listAccounts } from '@/api/accounts';
import { selectBankAccount } from '@/api/participations';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { Spinner } from '@/components/ui/Spinner';
import type { Participation } from '@/types/api';
import { BANK_ACCOUNT_STATUS_LABEL, BANK_ACCOUNT_STATUS_TONE } from '@/utils/bankAccount';
import { describeError } from '@/utils/errors';

interface Props {
  tandaId: string;
  participation: Participation;
  open: boolean;
  onClose: () => void;
}

export function SelectBankAccountDialog({ tandaId, participation, open, onClose }: Props) {
  const queryClient = useQueryClient();
  const [selected, setSelected] = useState<string | null>(participation.selectedBankAccountId);

  const { data: accounts, isLoading, error } = useQuery({
    queryKey: ['accounts'],
    queryFn: listAccounts,
    enabled: open,
  });

  useEffect(() => {
    if (open) setSelected(participation.selectedBankAccountId);
  }, [open, participation.selectedBankAccountId]);

  const mutation = useMutation({
    mutationFn: (accountId: string) => selectBankAccount(tandaId, participation.id, accountId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['participations', tandaId] });
      onClose();
    },
  });

  if (!open) return null;

  const activeAccounts = accounts?.filter((a) => a.peyStatus === 'ACTIVE') ?? [];
  const hasActive = activeAccounts.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
        <header className="mb-4">
          <h2 className="text-lg font-bold text-slate-900">Seleccionar cuenta para esta tanda</h2>
          <p className="mt-1 text-xs text-slate-500">
            La cuenta elegida recibirá el pago cuando sea tu turno en esta tanda. Solo cuentas
            ACTIVE pueden recibir pagos CoDi.
          </p>
        </header>

        {isLoading && <Spinner />}
        {error && <ErrorMessage message={describeError(error)} />}

        {accounts && !hasActive && (
          <div className="rounded-lg bg-amber-50 p-3 text-sm text-amber-700">
            No tienes cuentas en estado <strong>ACTIVE</strong>. Registra o espera la activación de
            una cuenta antes de participar.
          </div>
        )}

        {accounts && accounts.length > 0 && (
          <div className="space-y-2">
            {accounts.map((account) => {
              const disabled = account.peyStatus !== 'ACTIVE';
              return (
                <label
                  key={account.id}
                  className={
                    disabled
                      ? 'flex cursor-not-allowed items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-3 opacity-60'
                      : selected === account.id
                        ? 'flex cursor-pointer items-center justify-between rounded-lg border-2 border-brand-500 bg-brand-50 p-3'
                        : 'flex cursor-pointer items-center justify-between rounded-lg border border-slate-200 p-3 hover:border-brand-300'
                  }
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="account"
                      value={account.id}
                      disabled={disabled}
                      checked={selected === account.id}
                      onChange={() => setSelected(account.id)}
                      className="h-4 w-4 text-brand-600 focus:ring-brand-500"
                    />
                    <div>
                      <p className="text-sm font-medium text-slate-900">
                        {account.displayAlias ?? account.bankName}
                      </p>
                      <p className="font-mono text-xs text-slate-500">{account.maskedAccount}</p>
                    </div>
                  </div>
                  <Badge tone={BANK_ACCOUNT_STATUS_TONE[account.peyStatus]}>
                    {BANK_ACCOUNT_STATUS_LABEL[account.peyStatus]}
                  </Badge>
                </label>
              );
            })}
          </div>
        )}

        {mutation.isError && (
          <div className="mt-3">
            <ErrorMessage message={describeError(mutation.error)} />
          </div>
        )}

        <div className="mt-5 flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            onClick={() => selected && mutation.mutate(selected)}
            disabled={!selected || selected === participation.selectedBankAccountId}
            loading={mutation.isPending}
          >
            Confirmar selección
          </Button>
        </div>
      </div>
    </div>
  );
}
