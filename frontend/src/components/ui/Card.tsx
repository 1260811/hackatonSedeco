import { clsx } from 'clsx';
import type { HTMLAttributes } from 'react';

export function Card({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={clsx(
        'rounded-2xl border border-sky-200 bg-white p-6 shadow-sm',
        className,
      )}
      {...rest}
    />
  );
}
