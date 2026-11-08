/**
 * Selector entre backend real y mocks.
 *
 * Cuando `VITE_USE_MOCKS=true`, los módulos usan `src/mocks/data.ts`.
 * Cuando es `false`, se usa `src/api/client.ts` contra el backend real.
 */
export const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === 'true';
