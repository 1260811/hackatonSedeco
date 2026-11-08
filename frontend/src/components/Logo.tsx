import { clsx } from 'clsx';

type Size = 'sm' | 'md' | 'lg';
type Variant = 'horizontal' | 'icon' | 'horizontal-dark';

interface LogoProps {
  size?: Size;
  variant?: Variant;
  animated?: boolean;
  className?: string;
}

const iconSize: Record<Size, number> = { sm: 28, md: 40, lg: 56 };
const wordmarkText: Record<Size, string> = {
  sm: 'text-base',
  md: 'text-xl',
  lg: 'text-3xl',
};

export function Logo({
  size = 'md',
  variant = 'horizontal',
  animated = false,
  className,
}: LogoProps) {
  const dim = iconSize[size];
  const onDark = variant === 'horizontal-dark';

  const icon = (
    <svg
      width={dim}
      height={dim}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={clsx('flex-shrink-0 drop-shadow-sm', animated && 'animate-float')}
    >
      <circle cx="24" cy="24" r="22" fill={onDark ? '#FFFFFF' : '#1E323D'} />
      <circle cx="24" cy="24" r="18" fill="#FBCE07" />
      <circle cx="24" cy="24" r="14" fill="#F3960C" />
      <text
        x="24"
        y="31"
        textAnchor="middle"
        fontFamily="Poppins, sans-serif"
        fontWeight="700"
        fontSize="20"
        fill="#1E323D"
      >
        $
      </text>
      {/* rayitos / destellos */}
      <circle cx="42" cy="10" r="1.5" fill="#FBCE07" className={animated ? 'animate-sparkle' : ''} />
      <circle cx="6" cy="36" r="1.2" fill="#FBCE07" className={animated ? 'animate-sparkle' : ''} />
      <circle cx="40" cy="38" r="1" fill="#FFFFFF" />
    </svg>
  );

  if (variant === 'icon') {
    return <div className={className}>{icon}</div>;
  }

  return (
    <div className={clsx('inline-flex items-center gap-2', className)}>
      {icon}
      <div
        className={clsx(
          'font-display font-bold leading-none tracking-tight',
          wordmarkText[size],
        )}
      >
        <span className={onDark ? 'text-white' : 'text-navy-800'}>Tu </span>
        <span className={onDark ? 'text-brand-400' : 'text-brand-700'}>Coperacha</span>
      </div>
    </div>
  );
}
