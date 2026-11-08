import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { register as registerApi } from '@/api/auth';
import { Button } from '@/components/ui/Button';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { Input } from '@/components/ui/Input';
import { Logo } from '@/components/Logo';
import { CoinBasketScene } from '@/components/CoinBasketScene';
import { useAuthStore } from '@/stores/authStore';
import { describeError } from '@/utils/errors';

const schema = z
  .object({
    displayName: z.string().min(2, 'Mínimo 2 caracteres'),
    email: z.string().email('Ingresa un correo válido'),
    password: z.string().min(8, 'Mínimo 8 caracteres'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Las contraseñas no coinciden',
  });

type FormValues = z.infer<typeof schema>;

export default function RegisterPage() {
  const navigate = useNavigate();
  const setSession = useAuthStore((s) => s.setSession);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const mutation = useMutation({
    mutationFn: registerApi,
    onSuccess: ({ user, token }) => {
      setSession(user, token);
      navigate('/', { replace: true });
    },
  });

  const onSubmit = ({ displayName, email, password }: FormValues) =>
    mutation.mutate({ displayName, email, password });

  return (
    <div className="grid min-h-full grid-cols-1 bg-sky-50 md:grid-cols-2">
      <section className="relative hidden flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-sky-200 via-sky-100 to-brand-50 p-10 md:flex">
        <div className="absolute -left-20 -top-20 h-80 w-80 rounded-full bg-sky-300/40 blur-3xl" />
        <div className="absolute -bottom-24 -right-16 h-96 w-96 rounded-full bg-brand-200/40 blur-3xl" />

        <div className="relative z-10 mb-6 animate-fadeInUp">
          <Logo size="lg" />
        </div>

        <div className="relative z-10 animate-fadeInUp [animation-delay:0.1s]">
          <CoinBasketScene />
        </div>

        <div className="relative z-10 mt-6 max-w-sm text-center animate-fadeInUp [animation-delay:0.2s]">
          <h2 className="font-display text-2xl font-bold text-navy-800">
            Únete a la coperacha
          </h2>
          <p className="mt-2 text-sm text-ink-600">
            Crea tu cuenta y empieza a gestionar tandas con tu comunidad en minutos.
          </p>
        </div>
      </section>

      <section className="flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md animate-fadeInUp">
          <div className="mb-8 flex md:hidden">
            <Logo size="md" />
          </div>

          <header className="mb-6">
            <h1 className="font-display text-3xl font-bold text-navy-800">Crear cuenta ✨</h1>
            <p className="mt-2 text-sm text-ink-600">
              Empieza a gestionar tus tandas con tus contactos.
            </p>
          </header>

          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
            <Input
              label="Nombre"
              placeholder="¿Cómo te llamas?"
              autoComplete="name"
              error={errors.displayName?.message}
              {...register('displayName')}
            />
            <Input
              type="email"
              label="Correo electrónico"
              placeholder="tu@correo.com"
              autoComplete="email"
              error={errors.email?.message}
              {...register('email')}
            />
            <Input
              type="password"
              label="Contraseña"
              placeholder="Mínimo 8 caracteres"
              autoComplete="new-password"
              error={errors.password?.message}
              {...register('password')}
            />
            <Input
              type="password"
              label="Confirmar contraseña"
              autoComplete="new-password"
              error={errors.confirmPassword?.message}
              {...register('confirmPassword')}
            />

            {mutation.isError && <ErrorMessage message={describeError(mutation.error)} />}

            <Button type="submit" size="lg" className="w-full" loading={mutation.isPending}>
              Crear cuenta
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-ink-600">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="font-medium text-brand-700 hover:underline">
              Inicia sesión
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
