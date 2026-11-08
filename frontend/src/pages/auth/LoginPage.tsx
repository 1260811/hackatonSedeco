import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { login } from '@/api/auth';
import { Button } from '@/components/ui/Button';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { Input } from '@/components/ui/Input';
import { Logo } from '@/components/Logo';
import { CoinBasketScene } from '@/components/CoinBasketScene';
import { useAuthStore } from '@/stores/authStore';
import { describeError } from '@/utils/errors';

const schema = z.object({
  email: z.string().email('Ingresa un correo válido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
});

type FormValues = z.infer<typeof schema>;

interface LocationState {
  from?: { pathname?: string };
}

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const setSession = useAuthStore((s) => s.setSession);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const mutation = useMutation({
    mutationFn: login,
    onSuccess: ({ user, token }) => {
      setSession(user, token);
      const from = (location.state as LocationState | null)?.from?.pathname ?? '/';
      navigate(from, { replace: true });
    },
  });

  const onSubmit = (values: FormValues) => mutation.mutate(values);

  return (
    <div className="grid min-h-full grid-cols-1 bg-sky-50 md:grid-cols-2">
      {/* Columna izquierda: ilustración */}
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
            Ahorra en comunidad
          </h2>
          <p className="mt-2 text-sm text-ink-600">
            Organiza tandas con tu gente, cumple tus metas y mantén todo claro desde un solo lugar.
          </p>
        </div>
      </section>

      {/* Columna derecha: formulario */}
      <section className="flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md animate-fadeInUp">
          <div className="mb-8 flex md:hidden">
            <Logo size="md" />
          </div>

          <header className="mb-6">
            <h1 className="font-display text-3xl font-bold text-navy-800">
              Bienvenida de vuelta 👋
            </h1>
            <p className="mt-2 text-sm text-ink-600">
              Ingresa a tu cuenta para continuar con tus tandas.
            </p>
          </header>

          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
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
              placeholder="••••••••"
              autoComplete="current-password"
              error={errors.password?.message}
              {...register('password')}
            />

            {mutation.isError && <ErrorMessage message={describeError(mutation.error)} />}

            <Button type="submit" size="lg" className="w-full" loading={mutation.isPending}>
              Iniciar sesión
            </Button>
          </form>

          <div className="mt-6 flex items-center justify-between text-sm">
            <Link to="/forgot-password" className="font-medium text-brand-700 hover:underline">
              ¿Olvidaste tu contraseña?
            </Link>
            <Link to="/register" className="font-medium text-brand-700 hover:underline">
              Crear cuenta
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
