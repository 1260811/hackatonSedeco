import { clsx } from 'clsx';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  leftIcon?: ReactNode;
}

const variantStyles: Record<Variant, string> = {
  primary:
    'bg-brand-500 text-navy-900 hover:bg-brand-400 active:bg-brand-600 disabled:bg-brand-200 shadow-tactile hover:-translate-y-0.5 active:translate-y-0',
  secondary:
    'bg-sky-100 text-navy-800 hover:bg-sky-200 disabled:bg-sky-50 border border-sky-200',
  danger: 'bg-red-600 text-white hover:bg-red-700 disabled:bg-red-300 shadow-tactile-sm',
  ghost: 'bg-transparent text-navy-700 hover:bg-sky-100',
};

const sizeStyles: Record<Size, string> = {
  sm: 'text-sm px-3 py-1.5',
  md: 'text-sm px-4 py-2.5',
  lg: 'text-base px-5 py-3',
};

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  leftIcon,
  disabled,
  className,
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={clsx(
        'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-150',
        'focus:outline-none focus:ring-2 focus:ring-brand-400 focus:ring-offset-2 focus:ring-offset-white',
        'disabled:cursor-not-allowed disabled:shadow-none disabled:translate-y-0',
        variantStyles[variant],
        sizeStyles[size],
        className,
      )}
      {...rest}
    >
      {loading ? (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : (
        leftIcon
      )}
      {children}
    </button>
  );
}
