import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { registerAccount } from '@/api/accounts';
import { Button } from '@/components/ui/Button';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { Input } from '@/components/ui/Input';
import { describeError } from '@/utils/errors';
import { CLABE_PATTERN } from '@/utils/bankAccount';

const schema = z
  .object({
    clabe: z.string().regex(CLABE_PATTERN, 'La CLABE debe tener 18 dígitos'),
    displayAlias: z.string().max(60).optional(),
    isDeclaredOwner: z.boolean(),
    declaredOwnerName: z.string().optional(),
  })
  .refine(
    (data) => data.isDeclaredOwner || (data.declaredOwnerName && data.declaredOwnerName.length > 1),
    {
      path: ['declaredOwnerName'],
      message: 'Ingresa el nombre del titular declarado.',
    },
  );

type FormValues = z.infer<typeof schema>;

interface Props {
  open: boolean;
  onClose: () => void;
}

export function RegisterAccountDialog({ open, onClose }: Props) {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { isDeclaredOwner: true },
  });

  const mutation = useMutation({
    mutationFn: registerAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      reset({ isDeclaredOwner: true });
      onClose();
    },
  });

  const isDeclaredOwner = watch('isDeclaredOwner');

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
        <header className="mb-4">
          <h2 className="text-lg font-bold text-slate-900">Registrar cuenta bancaria</h2>
          <p className="mt-1 text-xs text-slate-500">
            La activación con Pey puede tardar hasta 5 días hábiles.
          </p>
        </header>

        <form className="space-y-3" onSubmit={handleSubmit((v) => mutation.mutate(v))} noValidate>
          <Input
            label="CLABE interbancaria (18 dígitos)"
            placeholder="012345678901234567"
            inputMode="numeric"
            maxLength={18}
            error={errors.clabe?.message}
            {...register('clabe')}
          />
          <Input
            label="Alias (opcional)"
            placeholder="Ej. Cuenta de nómina"
            error={errors.displayAlias?.message}
            {...register('displayAlias')}
          />

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
              {...register('isDeclaredOwner')}
            />
            Soy el titular de la cuenta
          </label>

          {!isDeclaredOwner && (
            <Input
              label="Nombre del titular declarado"
              placeholder="Nombre completo"
              error={errors.declaredOwnerName?.message}
              {...register('declaredOwnerName')}
            />
          )}

          {mutation.isError && <ErrorMessage message={describeError(mutation.error)} />}

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" loading={mutation.isPending}>
              Registrar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
