import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { z } from 'zod';
import { requestPasswordReset } from '@/api/auth';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { Input } from '@/components/ui/Input';
import { describeError } from '@/utils/errors';

const schema = z.object({
  email: z.string().email('Ingresa un correo válido'),
});

type FormValues = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const mutation = useMutation({
    mutationFn: ({ email }: FormValues) => requestPasswordReset(email),
  });

  return (
    <div className="flex min-h-full items-center justify-center bg-slate-50 p-6">
      <Card className="w-full max-w-md">
        <header className="mb-5">
          <h1 className="text-xl font-bold text-slate-900">Recuperar acceso</h1>
          <p className="mt-1 text-sm text-slate-500">
            Enviaremos instrucciones al correo que registraste.
          </p>
        </header>

        {mutation.isSuccess ? (
          <div className="rounded-lg bg-green-50 p-4 text-sm text-green-700">
            Si el correo existe en nuestros registros, recibirás un mensaje con instrucciones.
          </div>
        ) : (
          <form className="space-y-4" onSubmit={handleSubmit((v) => mutation.mutate(v))} noValidate>
            <Input
              type="email"
              label="Correo electrónico"
              placeholder="tu@correo.com"
              autoComplete="email"
              error={errors.email?.message}
              {...register('email')}
            />
            {mutation.isError && <ErrorMessage message={describeError(mutation.error)} />}
            <Button type="submit" className="w-full" loading={mutation.isPending}>
              Enviar instrucciones
            </Button>
          </form>
        )}

        <p className="mt-5 text-center text-sm text-slate-500">
          <Link to="/login" className="text-brand-600 hover:underline">
            Volver a iniciar sesión
          </Link>
        </p>
      </Card>
    </div>
  );
}
