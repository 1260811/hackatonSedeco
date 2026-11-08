import { Card } from '@/components/ui/Card';
import { useAuthStore } from '@/stores/authStore';

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);
  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">
          Hola, {user?.displayName ?? 'bienvenida'}
        </h1>
        <p className="text-sm text-slate-500">
          Resumen de tu actividad en las tandas.
        </p>
      </header>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <h3 className="text-sm font-medium text-slate-500">Tandas activas</h3>
          <p className="mt-1 text-2xl font-bold text-slate-900">—</p>
        </Card>
        <Card>
          <h3 className="text-sm font-medium text-slate-500">Aportaciones pendientes</h3>
          <p className="mt-1 text-2xl font-bold text-slate-900">—</p>
        </Card>
        <Card>
          <h3 className="text-sm font-medium text-slate-500">Próximo turno</h3>
          <p className="mt-1 text-2xl font-bold text-slate-900">—</p>
        </Card>
      </div>
      <Card>
        <p className="text-sm text-slate-500">
          El dashboard se enriquece a lo largo de las issues FE-04 a FE-10.
        </p>
      </Card>
    </div>
  );
}
