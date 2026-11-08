import { clsx } from 'clsx';
import { forwardRef, type InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, hint, className, id, ...rest },
  ref,
) {
  const inputId = id ?? rest.name;
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-semibold text-navy-800">
          {label}
        </label>
      )}
      <input
        id={inputId}
        ref={ref}
        className={clsx(
          'rounded-xl border border-navy-200 bg-white px-3.5 py-2.5 text-sm text-ink-900 placeholder:text-ink-300',
          'transition focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-400/40',
          'disabled:cursor-not-allowed disabled:bg-sky-50',
          error && 'border-red-500 focus:border-red-500 focus:ring-red-400/40',
          className,
        )}
        {...rest}
      />
      {hint && !error && <span className="text-xs text-ink-600">{hint}</span>}
      {error && <span className="text-xs font-medium text-red-600">{error}</span>}
    </div>
  );
});
