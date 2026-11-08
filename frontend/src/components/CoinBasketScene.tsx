export function CoinBasketScene() {
  return (
    <div className="relative mx-auto flex h-80 w-80 items-center justify-center" aria-hidden="true">
      {/* Fondo circular cielo */}
      <div className="absolute inset-0 rounded-full bg-sky-200/60 blur-2xl" />
      <div className="absolute inset-6 rounded-full bg-sky-100" />

      {/* Nubecitas */}
      <div className="absolute left-6 top-10 h-4 w-10 rounded-full bg-white/80 animate-float" />
      <div className="absolute right-8 top-20 h-3 w-8 rounded-full bg-white/70 animate-float [animation-delay:0.6s]" />

      {/* Monedas cayendo */}
      <div className="absolute left-1/2 top-4 -translate-x-1/2">
        <div className="relative h-56 w-56">
          <Coin className="absolute left-6 animate-coinDrop [animation-delay:0s]" />
          <Coin className="absolute left-20 animate-coinDrop [animation-delay:0.6s]" />
          <Coin className="absolute left-36 animate-coinDrop [animation-delay:1.2s]" />
        </div>
      </div>

      {/* Personas (abstractas) */}
      <svg
        className="absolute bottom-10 z-10"
        width="240"
        height="90"
        viewBox="0 0 240 90"
        fill="none"
      >
        {/* Persona izquierda */}
        <circle cx="50" cy="28" r="14" fill="#F3960C" />
        <rect x="36" y="42" width="28" height="42" rx="12" fill="#1E323D" />
        <rect x="56" y="48" width="18" height="6" rx="3" fill="#F3960C" transform="rotate(-25 56 48)" />
        {/* Persona derecha */}
        <circle cx="190" cy="28" r="14" fill="#F2B3BE" />
        <rect x="176" y="42" width="28" height="42" rx="12" fill="#0F8AD4" />
        <rect x="166" y="48" width="18" height="6" rx="3" fill="#F2B3BE" transform="rotate(25 166 48)" />
      </svg>

      {/* Canasta */}
      <svg
        className="absolute bottom-4 z-20"
        width="160"
        height="80"
        viewBox="0 0 160 80"
        fill="none"
      >
        <ellipse cx="80" cy="18" rx="60" ry="10" fill="#C85A00" />
        <path
          d="M18 20 L30 72 Q80 84 130 72 L142 20 Z"
          fill="#EB6C01"
          stroke="#C85A00"
          strokeWidth="2"
        />
        {/* trenzado */}
        <path d="M22 30 Q80 42 138 30" stroke="#C85A00" strokeWidth="2" fill="none" />
        <path d="M24 44 Q80 56 136 44" stroke="#C85A00" strokeWidth="2" fill="none" />
        <path d="M28 58 Q80 68 132 58" stroke="#C85A00" strokeWidth="2" fill="none" />
        {/* asa */}
        <path
          d="M30 18 Q80 -28 130 18"
          stroke="#F3960C"
          strokeWidth="6"
          fill="none"
          strokeLinecap="round"
        />
      </svg>

      {/* Sparkles */}
      <div className="absolute right-12 top-16 h-2 w-2 rounded-full bg-gold-500 animate-sparkle" />
      <div className="absolute left-14 top-24 h-1.5 w-1.5 rounded-full bg-gold-400 animate-sparkle [animation-delay:0.4s]" />
      <div className="absolute right-20 bottom-24 h-1 w-1 rounded-full bg-white animate-sparkle [animation-delay:0.8s]" />
    </div>
  );
}

function Coin({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="14" cy="14" r="13" fill="#FBCE07" stroke="#C97800" strokeWidth="1.5" />
      <circle cx="14" cy="14" r="9" fill="#F3960C" />
      <text
        x="14"
        y="18"
        textAnchor="middle"
        fontFamily="Poppins, sans-serif"
        fontWeight="700"
        fontSize="12"
        fill="#1E323D"
      >
        $
      </text>
    </svg>
  );
}
