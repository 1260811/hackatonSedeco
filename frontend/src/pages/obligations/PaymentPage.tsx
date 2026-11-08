import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AlertCircle, ArrowLeft, QrCode, RefreshCw, Smartphone } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { listAllObligations } from '@/api/obligations';
import { createPaymentRequest, getPaymentRequest } from '@/api/paymentRequests';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { Input } from '@/components/ui/Input';
import { PageSpinner } from '@/components/ui/Spinner';
import type { PaymentChannel, PaymentRequest } from '@/types/api';
import { formatDateTime, formatRelative } from '@/utils/dates';
import { describeError } from '@/utils/errors';
import { formatMoney } from '@/utils/money';
import { OBLIGATION_STATUS_LABEL, OBLIGATION_STATUS_TONE } from '@/utils/obligation';
import {
  PAYMENT_REQUEST_STATUS_LABEL,
  PAYMENT_REQUEST_STATUS_TONE,
} from '@/utils/paymentRequest';

export default function PaymentPage() {
  const { obligationId } = useParams<{ obligationId: string }>();
  const queryClient = useQueryClient();
  const [channel, setChannel] = useState<PaymentChannel>('CODI_QR');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [activeRequestId, setActiveRequestId] = useState<string | null>(null);

  const { data: obligations, isLoading } = useQuery({
    queryKey: ['obligations-all'],
    queryFn: listAllObligations,
  });
  const obligation = obligations?.find((o) => o.id === obligationId);

  const idempotencyKey = useMemo(
    () => (obligationId ? `create-pr-${obligationId}-${Date.now()}` : ''),
    [obligationId],
  );

  const createRequest = useMutation({
    mutationFn: () =>
      createPaymentRequest(
        obligationId!,
        { channel, phoneNumber: channel === 'CODI_PUSH' ? phoneNumber : undefined },
        idempotencyKey,
      ),
    onSuccess: (pr) => {
      setActiveRequestId(pr.id);
      queryClient.invalidateQueries({ queryKey: ['obligations-all'] });
      queryClient.invalidateQueries({ queryKey: ['obligations'] });
    },
  });

  const { data: activeRequest, refetch } = useQuery({
    queryKey: ['payment-request', activeRequestId],
    queryFn: () => getPaymentRequest(activeRequestId!),
    enabled: !!activeRequestId,
    refetchInterval: 5000,
  });

  if (isLoading) return <PageSpinner />;
  if (!obligation) {
    return (
      <div className="space-y-4">
        <Link to="/obligations" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700">
          <ArrowLeft className="h-4 w-4" /> Volver a obligaciones
        </Link>
        <ErrorMessage message="Obligación no encontrada" />
      </div>
    );
  }

  const canRequest =
    obligation.status === 'PENDING' || obligation.status === 'OVERDUE';

  return (
    <div className="space-y-5">
      <Link to="/obligations" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700">
        <ArrowLeft className="h-4 w-4" /> Volver a obligaciones
      </Link>

      <header>
        <h1 className="text-2xl font-bold text-slate-900">Pagar obligación</h1>
        <p className="text-sm text-slate-500">
          Genera una solicitud CoDi para realizar el pago a través de Pey.
        </p>
      </header>

      <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        <Card>
          <h3 className="text-sm font-semibold text-slate-900">Detalle de la obligación</h3>
          <dl className="mt-3 grid grid-cols-2 gap-y-2 text-sm">
            <dt className="text-slate-500">Importe</dt>
            <dd className="text-right font-medium text-slate-900">
              {formatMoney(obligation.amount)}
            </dd>
            <dt className="text-slate-500">Vence</dt>
            <dd className="text-right text-slate-700">{formatDateTime(obligation.dueAt)}</dd>
            {obligation.penaltyAmount && (
              <>
                <dt className="text-slate-500">Sanción acumulada</dt>
                <dd className="text-right text-red-600">
                  {formatMoney(obligation.penaltyAmount)}
                </dd>
              </>
            )}
            <dt className="text-slate-500">Estado</dt>
            <dd className="text-right">
              <Badge tone={OBLIGATION_STATUS_TONE[obligation.status]}>
                {OBLIGATION_STATUS_LABEL[obligation.status]}
              </Badge>
            </dd>
          </dl>

          <div className="mt-4 rounded-lg bg-amber-50 p-3 text-xs text-amber-700">
            <AlertCircle className="mr-1 inline h-3 w-3" />
            No se permiten pagos parciales. El importe debe cubrirse completo.
          </div>
        </Card>

        <Card>
          <h3 className="text-sm font-semibold text-slate-900">Método de cobro</h3>
          <div className="mt-3 space-y-2">
            <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200 p-3">
              <input
                type="radio"
                value="CODI_QR"
                checked={channel === 'CODI_QR'}
                onChange={() => setChannel('CODI_QR')}
                className="h-4 w-4 text-brand-600"
              />
              <QrCode className="h-4 w-4 text-slate-500" />
              <div className="text-sm">
                <p className="font-medium text-slate-900">QR CoDi</p>
                <p className="text-xs text-slate-500">
                  Escanea desde la app de tu banco
                </p>
              </div>
            </label>
            <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200 p-3">
              <input
                type="radio"
                value="CODI_PUSH"
                checked={channel === 'CODI_PUSH'}
                onChange={() => setChannel('CODI_PUSH')}
                className="h-4 w-4 text-brand-600"
              />
              <Smartphone className="h-4 w-4 text-slate-500" />
              <div className="text-sm">
                <p className="font-medium text-slate-900">Push CoDi</p>
                <p className="text-xs text-slate-500">
                  Recibe notificación al número registrado
                </p>
              </div>
            </label>

            {channel === 'CODI_PUSH' && (
              <Input
                label="Teléfono registrado"
                placeholder="10 dígitos"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                inputMode="tel"
                maxLength={10}
              />
            )}

            {createRequest.isError && (
              <ErrorMessage message={describeError(createRequest.error)} />
            )}

            <Button
              className="w-full"
              disabled={!canRequest || (channel === 'CODI_PUSH' && phoneNumber.length < 10)}
              loading={createRequest.isPending}
              onClick={() => createRequest.mutate()}
            >
              Generar solicitud de pago
            </Button>
          </div>
        </Card>
      </div>

      {activeRequest && (
        <PaymentRequestDetail request={activeRequest} onRefresh={() => refetch()} />
      )}
    </div>
  );
}

function PaymentRequestDetail({
  request,
  onRefresh,
}: {
  request: PaymentRequest;
  onRefresh: () => void;
}) {
  const isTerminal =
    request.status === 'PAID' ||
    request.status === 'FAILED' ||
    request.status === 'EXPIRED';
  return (
    <Card>
      <header className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">Solicitud de pago</h3>
          <p className="mt-0.5 text-xs text-slate-500">
            Creada {formatRelative(request.createdAt)}
          </p>
        </div>
        <Badge tone={PAYMENT_REQUEST_STATUS_TONE[request.status]}>
          {PAYMENT_REQUEST_STATUS_LABEL[request.status]}
        </Badge>
      </header>

      <div className="mt-4 grid gap-5 sm:grid-cols-[1fr_auto]">
        <div className="space-y-2 text-sm">
          <p className="text-slate-500">
            Importe <strong className="text-slate-900">{formatMoney(request.amount)}</strong>
          </p>
          <p className="text-slate-500">
            Canal <strong className="text-slate-900">{request.channel === 'CODI_QR' ? 'QR CoDi' : 'Push CoDi'}</strong>
          </p>
          {request.expiresAt && (
            <p className="text-slate-500">
              Expira <strong className="text-slate-900">{formatDateTime(request.expiresAt)}</strong>
            </p>
          )}
          <div className="rounded-lg bg-slate-50 p-3 text-xs text-slate-600">
            Esta solicitud se marcará como <strong>pagada</strong> únicamente después de la
            conciliación con Pey. Ni la generación del QR ni las notificaciones por sí mismas
            confirman el pago.
          </div>
          {!isTerminal && (
            <Button
              size="sm"
              variant="secondary"
              leftIcon={<RefreshCw className="h-4 w-4" />}
              onClick={onRefresh}
            >
              Actualizar estado
            </Button>
          )}
        </div>

        {request.channel === 'CODI_QR' && request.qrPayload && (
          <div className="flex flex-col items-center gap-2">
            <QrPlaceholder payload={request.qrPayload} />
            <p className="text-xs text-slate-500">Escanea con tu app bancaria</p>
          </div>
        )}
      </div>

      {request.status === 'EXPIRED' && (
        <div className="mt-4 rounded-lg bg-red-50 p-3 text-xs text-red-700">
          La solicitud expiró. Genera una nueva desde la obligación.
        </div>
      )}
      {request.status === 'UNDER_REVIEW' && (
        <div className="mt-4 rounded-lg bg-amber-50 p-3 text-xs text-amber-700">
          El pago requiere revisión manual por discrepancias. Ponte en contacto con el organizador.
        </div>
      )}
    </Card>
  );
}

/**
 * Renderizado mock del QR. En producción el backend puede entregar una imagen
 * base64 o el payload para que el frontend lo convierta con una librería QR.
 */
function QrPlaceholder({ payload }: { payload: string }) {
  return (
    <div className="flex h-40 w-40 items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 p-3 text-center text-xs text-slate-500">
      <span className="line-clamp-6 break-all">{payload}</span>
    </div>
  );
}
