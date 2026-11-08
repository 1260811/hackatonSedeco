import { clsx } from 'clsx';

export function Spinner({ className }: { className?: string }) {
  return (
    <div
      role="status"
      aria-label="Cargando"
      className={clsx('h-6 w-6 animate-spin rounded-full border-2 border-brand-600 border-t-transparent', className)}
    />
  );
}

export function PageSpinner() {
  return (
    <div className="flex items-center justify-center py-16">
      <Spinner className="h-8 w-8" />
    </div>
  );
}
