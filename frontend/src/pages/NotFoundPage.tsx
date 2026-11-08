import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export default function NotFoundPage() {
  return (
    <div className="flex min-h-full items-center justify-center p-6">
      <Card className="w-full max-w-md text-center">
        <p className="text-5xl font-bold text-brand-600">404</p>
        <h1 className="mt-3 text-xl font-bold text-slate-900">Ruta no encontrada</h1>
        <p className="mt-1 text-sm text-slate-500">
          La página que buscas no existe o fue movida.
        </p>
        <Link to="/" className="mt-4 inline-block">
          <Button>Ir al inicio</Button>
        </Link>
      </Card>
    </div>
  );
}
