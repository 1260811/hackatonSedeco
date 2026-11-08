import { useQuery } from '@tanstack/react-query';
import { Plus, Wallet } from 'lucide-react';
import { useState } from 'react';
import { listAccounts } from '@/api/accounts';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { PageSpinner } from '@/components/ui/Spinner';
import type { BankAccount } from '@/types/api';
import {
  BANK_ACCOUNT_STATUS_HINT,
  BANK_ACCOUNT_STATUS_LABEL,
  BANK_ACCOUNT_STATUS_TONE,
} from '@/utils/bankAccount';
import { describeError } from '@/utils/errors';
import { RegisterAccountDialog } from './accounts/RegisterAccountDialog';

export default function AccountsPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { data, isLoading, error } = useQuery({
    queryKey: ['accounts'],
    queryFn: listAccounts,
  });

  return (
    <div className="space-y-5">
      <header className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Cuentas bancarias</h1>
          <p className="text-sm text-slate-500">
            Registra cuentas para recibir pagos. Una cuenta puede ser compartida por hasta 5 usuarios.
          </p>
        </div>
        <Button leftIcon={<Plus className="h-4 w-4" />} onClick={() => setDialogOpen(true)}>
          Registrar cuenta
        </Button>
      </header>

      {isLoading && <PageSpinner />}
      {error && <ErrorMessage message={describeError(error)} />}

      {data && data.length === 0 && (
        <EmptyState
          icon={<Wallet className="h-8 w-8" />}
          title="Aún no tienes cuentas bancarias"
          description="Registra una cuenta para poder recibir pagos de tus tandas."
          action={
            <Button leftIcon={<Plus className="h-4 w-4" />} onClick={() => setDialogOpen(true)}>
              Registrar cuenta
            </Button>
          }
        />
      )}

      {data && data.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-2">
          {data.map((account) => (
            <AccountCard key={account.id} account={account} />
          ))}
        </div>
      )}

      <RegisterAccountDialog open={dialogOpen} onClose={() => setDialogOpen(false)} />
    </div>
  );
}

function AccountCard({ account }: { account: BankAccount }) {
  return (
    <Card>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">
            {account.displayAlias ?? account.bankName}
          </h3>
          {account.displayAlias && (
            <p className="text-xs text-slate-500">{account.bankName}</p>
          )}
          <p className="mt-2 font-mono text-sm text-slate-700">{account.maskedAccount}</p>
        </div>
        <Badge tone={BANK_ACCOUNT_STATUS_TONE[account.peyStatus]}>
          {BANK_ACCOUNT_STATUS_LABEL[account.peyStatus]}
        </Badge>
      </div>

      <p className="mt-3 text-xs text-slate-500">
        {BANK_ACCOUNT_STATUS_HINT[account.peyStatus]}
      </p>

      {!account.isDeclaredOwner && (
        <p className="mt-2 text-xs text-amber-700">
          Esta cuenta está registrada a nombre de un tercero.
        </p>
      )}
    </Card>
  );
}
