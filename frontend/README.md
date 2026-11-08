# Frontend · HackatonSedeco

Aplicación web del sistema de gestión de tandas. React 18 + TypeScript + Vite.

## Requisitos

- Node.js ≥ 20
- npm ≥ 10

## Comandos

```bash
npm install          # Instalar dependencias
npm run dev          # Levantar dev server (http://localhost:5173)
npm run build        # Build de producción
npm run preview      # Previsualizar build
npm run lint         # Linter
npm run typecheck    # Verificación de tipos
npm run format       # Prettier
```

## Variables de entorno

Copia `.env.example` a `.env.local` y ajusta valores locales:

```env
VITE_API_URL=http://localhost:8080/api/v1
VITE_APP_ENV=development
VITE_USE_MOCKS=true
```

- `VITE_USE_MOCKS=true` — usa data en memoria (`src/mocks/`) sin conectar al backend.

## Estructura

```
src/
├── api/          Clientes HTTP por dominio
├── components/   Componentes reutilizables
├── pages/        Vistas por ruta
├── hooks/        Custom hooks
├── stores/       Estado global (Zustand)
├── types/        Tipos derivados del OpenAPI
├── utils/        Utilidades (money, dates, errors)
├── mocks/        Data y handlers mock para desarrollo
├── router.tsx    Definición de rutas
├── App.tsx
└── main.tsx
```

## Stack

| Área | Tecnología |
|------|-----------|
| Framework | React 18 + TypeScript (strict) |
| Build | Vite 5 |
| Router | React Router v6 |
| Estado servidor | TanStack Query v5 |
| Estado cliente | Zustand |
| Formularios | React Hook Form + Zod |
| Estilos | Tailwind CSS v3 |
| Iconos | lucide-react |
| Fechas | date-fns |

## Convenciones

Ver `../CLAUDE.md` en la raíz del repo.
