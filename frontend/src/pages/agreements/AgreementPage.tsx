import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, CheckCircle2, ShieldCheck } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { getAgreement } from '@/api/agreements';
import { listParticipations } from '@/api/participations';
import { getTanda } from '@/api/tandas';
import { acceptAgreement } from '@/api/agreements';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { PageSpinner } from '@/components/ui/Spinner';
import { useAuthStore } from '@/stores/authStore';
import { describeError } from '@/utils/errors';
import { formatDateTime } from '@/utils/dates';
import { formatMoney } from '@/utils/money';

export default function AgreementPage() {
  const { tandaId } = useParams<{ tandaId: string }>();
  const queryClient = useQueryClient();
  const currentUserId = useAuthStore((s) => s.user?.id);

  const { data: tanda } = useQuery({
    queryKey: ['tanda', tandaId],
    queryFn: () => getTanda(tandaId!),
    enabled: !!tandaId,
  });

  const { data: agreement, isLoading, error } = useQuery({
    queryKey: ['agreement', tandaId],
    queryFn: () => getAgreement(tandaId!),
    enabled: !!tandaId,
  });

  const { data: participations } = useQuery({
    queryKey: ['participations', tandaId],
    queryFn: () => listParticipations(tandaId!),
    enabled: !!tandaId,
  });

  const myParticipation = participations?.find((p) => p.userId === currentUserId);
  const myAcceptance = agreement?.acceptances.find(
    (a) => a.participationId === myParticipation?.id && a.agreementVersion === agreement.version,
  );

  const accept = useMutation({
    mutationFn: () => acceptAgreement(tandaId!, myParticipation!.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agreement', tandaId] });
    },
  });

  if (isLoading) return <PageSpinner />;
  if (error) return <ErrorMessage message={describeError(error)} />;
  if (!agreement) return null;

  const totalActive = participations?.filter((p) => p.status === 'ACTIVE').length ?? 0;
  const totalAcceptedCurrentVersion = agreement.acceptances.filter(
    (a) => a.agreementVersion === agreement.version,
  ).length;

  return (
    <div className="space-y-5">
      <Link
        to={tandaId ? `/tandas/${tandaId}` : '/tandas'}
        className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700"
      >
        <ArrowLeft className="h-4 w-4" /> Volver a la tanda
      </Link>

      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Convenio {tanda ? `· ${tanda.name}` : ''}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Versión {agreement.version} · {totalAcceptedCurrentVersion} de {totalActive} aceptaciones
          </p>
        </div>
        {myParticipation && myParticipation.status === 'ACTIVE' && !myAcceptance && (
          <Button
            leftIcon={<CheckCircle2 className="h-4 w-4" />}
            onClick={() => accept.mutate()}
            loading={accept.isPending}
          >
            Aceptar convenio
          </Button>
        )}
        {myAcceptance && (
          <Badge tone="success">
            Aceptado el {formatDateTime(myAcceptance.acceptedAt)}
          </Badge>
        )}
      </header>

      <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        <Card>
          <h3 className="text-sm font-semibold text-slate-900">Condiciones</h3>
          <div className="mt-3 space-y-4 text-sm text-slate-700">
            <section>
              <h4 className="font-medium text-slate-900">Sanciones</h4>
              {agreement.penaltyEnabled ? (
                <ul className="mt-1 space-y-1 text-sm text-slate-600">
                  <li>
                    Tipo: <strong>{agreement.penaltyType === 'FIXED' ? 'Monto fijo' : 'Porcentaje'}</strong>
                  </li>
                  {agreement.penaltyValue && (
                    <li>
                      Valor: <strong>
                        {agreement.penaltyType === 'FIXED'
                          ? formatMoney(agreement.penaltyValue)
                          : `${agreement.penaltyValue}%`}
                      </strong>
                    </li>
                  )}
                  {agreement.gracePeriodDays != null && (
                    <li>Periodo de gracia: {agreement.gracePeriodDays} día(s)</li>
                  )}
                  {agreement.penaltyPeriodDays != null && (
                    <li>Periodo de aplicación: cada {agreement.penaltyPeriodDays} día(s)</li>
                  )}
                </ul>
              ) : (
                <p className="mt-1 inline-flex items-center gap-2 text-sm text-green-700">
                  <ShieldCheck className="h-4 w-4" />
                  No se configuraron sanciones para esta tanda.
                </p>
              )}
            </section>

            {agreement.terms && (
              <section>
                <h4 className="font-medium text-slate-900">Términos</h4>
                <p className="mt-1 whitespace-pre-wrap text-sm text-slate-600">
                  {agreement.terms}
                </p>
              </section>
            )}
          </div>

          {accept.isError && (
            <div className="mt-3">
              <ErrorMessage message={describeError(accept.error)} />
            </div>
          )}

          <p className="mt-5 rounded-lg bg-slate-50 p-3 text-xs text-slate-500">
            La tanda no puede activarse hasta que todos los participantes activos acepten esta
            versión del convenio.
          </p>
        </Card>

        <Card>
          <h3 className="text-sm font-semibold text-slate-900">Aceptaciones</h3>
          <div className="mt-3 space-y-2 text-sm">
            {participations
              ?.filter((p) => p.status === 'ACTIVE')
              .map((p) => {
                const acceptance = agreement.acceptances.find(
                  (a) =>
                    a.participationId === p.id && a.agreementVersion === agreement.version,
                );
                return (
                  <div
                    key={p.id}
                    className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2"
                  >
                    <span className="text-slate-900">{p.displayName}</span>
                    {acceptance ? (
                      <Badge tone="success">Aceptado</Badge>
                    ) : (
                      <Badge tone="warning">Pendiente</Badge>
                    )}
                  </div>
                );
              })}
          </div>
        </Card>
      </div>
    </div>
  );
}
