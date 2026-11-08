import { useQuery } from '@tanstack/react-query';
import { ArrowRight, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { listTandas } from '@/api/tandas';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { PageSpinner } from '@/components/ui/Spinner';
import { describeError } from '@/utils/errors';
import { TANDA_STATUS_LABEL, TANDA_STATUS_TONE } from '@/utils/tanda';

export default function AgreementsPage() {
  const { data, isLoading, error } = useQuery({ queryKey: ['tandas'], queryFn: () => listTandas() });

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">Convenios</h1>
        <p className="text-sm text-slate-500">
          Consulta y acepta los convenios de cada tanda en la que participas.
        </p>
      </header>

      {isLoading && <PageSpinner />}
      {error && <ErrorMessage message={describeError(error)} />}

      {data && data.length === 0 && (
        <EmptyState
          icon={<FileText className="h-8 w-8" />}
          title="No tienes tandas con convenios"
          description="Crea una tanda o acepta una invitación para ver convenios."
        />
      )}

      {data && data.length > 0 && (
        <div className="space-y-2">
          {data.map((tanda) => (
            <Link key={tanda.id} to={`/tandas/${tanda.id}/agreement`}>
              <Card className="flex items-center justify-between transition hover:border-brand-400">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">{tanda.name}</h3>
                  <p className="mt-0.5 text-xs text-slate-500">Convenio de la tanda</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge tone={TANDA_STATUS_TONE[tanda.status]}>
                    {TANDA_STATUS_LABEL[tanda.status]}
                  </Badge>
                  <ArrowRight className="h-4 w-4 text-slate-400" />
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
