import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { createTanda } from '@/api/tandas';
import { Button } from '@/components/ui/Button';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { Input } from '@/components/ui/Input';
import { describeError } from '@/utils/errors';
import { isValidMoney } from '@/utils/money';

const schema = z
  .object({
    name: z.string().min(1, 'Nombre requerido').max(120),
    contributionAmount: z
      .string()
      .refine(isValidMoney, 'Importe inválido (máx 2 decimales)'),
    frequency: z.enum(['WEEKLY', 'BIWEEKLY', 'MONTHLY', 'CUSTOM']),
    startDate: z.string().min(1, 'Fecha requerida'),
    customPeriodDays: z.coerce.number().int().positive().optional(),
  })
  .refine(
    (data) =>
      data.frequency !== 'CUSTOM' || (data.customPeriodDays && data.customPeriodDays > 0),
    { path: ['customPeriodDays'], message: 'Indica la periodicidad en días' },
  );

type FormValues = z.infer<typeof schema>;

interface Props {
  open: boolean;
  onClose: () => void;
}

export function CreateTandaDialog({ open, onClose }: Props) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { frequency: 'WEEKLY' },
  });

  const mutation = useMutation({
    mutationFn: createTanda,
    onSuccess: (tanda) => {
      queryClient.invalidateQueries({ queryKey: ['tandas'] });
      reset({ frequency: 'WEEKLY' });
      onClose();
      navigate(`/tandas/${tanda.id}`);
    },
  });

  const frequency = watch('frequency');

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
        <header className="mb-4">
          <h2 className="text-lg font-bold text-slate-900">Nueva tanda</h2>
          <p className="mt-1 text-xs text-slate-500">
            La tanda se crea en borrador. Podrás invitar participantes y configurar el convenio
            antes de activarla.
          </p>
        </header>

        <form className="space-y-3" onSubmit={handleSubmit((v) => mutation.mutate(v))} noValidate>
          <Input
            label="Nombre"
            placeholder="Ej. Tanda familiar"
            error={errors.name?.message}
            {...register('name')}
          />
          <Input
            label="Aportación (MXN)"
            placeholder="500.00"
            inputMode="decimal"
            error={errors.contributionAmount?.message}
            {...register('contributionAmount')}
          />

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-slate-700">Frecuencia</label>
            <select
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              {...register('frequency')}
            >
              <option value="WEEKLY">Semanal</option>
              <option value="BIWEEKLY">Quincenal</option>
              <option value="MONTHLY">Mensual</option>
              <option value="CUSTOM">Personalizada</option>
            </select>
          </div>

          {frequency === 'CUSTOM' && (
            <Input
              label="Periodo (días)"
              type="number"
              min={1}
              error={errors.customPeriodDays?.message}
              {...register('customPeriodDays')}
            />
          )}

          <Input
            label="Fecha de inicio"
            type="date"
            error={errors.startDate?.message}
            {...register('startDate')}
          />

          {mutation.isError && <ErrorMessage message={describeError(mutation.error)} />}

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" loading={mutation.isPending}>
              Crear tanda
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
