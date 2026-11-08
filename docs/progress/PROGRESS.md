# Seguimiento de Progreso — Frontend · HackatonSedeco

> **Responsable:** Yudexi Orozco (`YudexiOrozco`)
> **Rol:** Frontend Developer (React + TypeScript)
> **Última actualización:** 2026-11-08
> **Issues GitHub:** https://github.com/1260811/hackatonSedeco/issues
> **Branch:** [`feat/frontend-setup`](https://github.com/1260811/hackatonSedeco/tree/feat/frontend-setup)

---

## Estado actual

🎉 **10/10 issues FE implementadas** con mocks funcionales en la rama
`feat/frontend-setup`. Build y typecheck verdes. Pendiente PR a `dev`.

- Stack: Vite 5 + React 18 + TypeScript strict + React Router v6 + TanStack Query + Zustand + Tailwind 3
- Mocks activos con `VITE_USE_MOCKS=true` — app completamente navegable sin backend
- Las 10 issues se cerrarán automáticamente al mergear a `dev` (gracias a `Closes #N` en los commits)

Verificación local:
```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev   # http://localhost:5173
```

---

## Leyenda de estados

| Símbolo | Estado |
|---------|--------|
| ⬜ | Pendiente |
| 🔵 | En progreso |
| ✅ | Completado |
| 🔴 | Bloqueado |
| ⏸️ | En pausa |

---

## Issues asignadas a Yudexi Orozco

| Issue | Título | Prioridad | Estado | Commit | Dependencias |
|-------|--------|-----------|--------|--------|-------------|
| [#1](https://github.com/1260811/hackatonSedeco/issues/1) | [FE-01] Estructura inicial de la aplicación frontend | P0 | ✅ Implementado | [`d0d2a20`](https://github.com/1260811/hackatonSedeco/commit/d0d2a20) | — |
| [#2](https://github.com/1260811/hackatonSedeco/issues/2) | [FE-02] Interfaz de autenticación y sesión de usuario | P0 | ✅ Implementado | [`ced7a49`](https://github.com/1260811/hackatonSedeco/commit/ced7a49) | FE-01 |
| [#3](https://github.com/1260811/hackatonSedeco/issues/3) | [FE-03] Interfaz de gestión de cuentas bancarias | P0 | ✅ Implementado | [`8b67f88`](https://github.com/1260811/hackatonSedeco/commit/8b67f88) | FE-01 |
| [#4](https://github.com/1260811/hackatonSedeco/issues/4) | [FE-04] Interfaz de creación y administración de tandas | P0 | ✅ Implementado | [`20bf8ac`](https://github.com/1260811/hackatonSedeco/commit/20bf8ac) | FE-01 |
| [#5](https://github.com/1260811/hackatonSedeco/issues/5) | [FE-05] Selección de cuenta bancaria para cada participación | P0 | ✅ Implementado | [`5f56d23`](https://github.com/1260811/hackatonSedeco/commit/5f56d23) | FE-03, FE-04 |
| [#6](https://github.com/1260811/hackatonSedeco/issues/6) | [FE-06] Visualización y aceptación del convenio de la tanda | P0 | ✅ Implementado | [`adcf0f2`](https://github.com/1260811/hackatonSedeco/commit/adcf0f2) | FE-04 |
| [#7](https://github.com/1260811/hackatonSedeco/issues/7) | [FE-07] Consulta de turnos y obligaciones de la tanda | P0 | ✅ Implementado | [`f062984`](https://github.com/1260811/hackatonSedeco/commit/f062984) | FE-04, FE-05 |
| [#8](https://github.com/1260811/hackatonSedeco/issues/8) | [FE-08] Interfaz de pago de obligaciones mediante CoDi | P0 | ✅ Implementado | [`1c9c960`](https://github.com/1260811/hackatonSedeco/commit/1c9c960) | FE-07 |
| [#9](https://github.com/1260811/hackatonSedeco/issues/9) | [FE-09] Historial de pagos y movimientos | P0 | ✅ Implementado | [`17698b8`](https://github.com/1260811/hackatonSedeco/commit/17698b8) | FE-07, FE-08 |
| [#10](https://github.com/1260811/hackatonSedeco/issues/10) | [FE-10] Centro de notificaciones | P1 | ✅ Implementado | [`559c54d`](https://github.com/1260811/hackatonSedeco/commit/559c54d) | FE-01 |

---

## FE-01 · Estructura inicial de la aplicación frontend — [#1](https://github.com/1260811/hackatonSedeco/issues/1)

**Prioridad:** P0 | **Dependencias:** ninguna
**✅ Implementado en commit [`d0d2a20`](https://github.com/1260811/hackatonSedeco/commit/d0d2a20) el 2026-11-08.**

| # | Tarea | Estado | Notas |
|---|-------|--------|-------|
| S-01 | Inicializar Vite + React 18 + TypeScript en `/frontend` | ✅ | `strict: true` en tsconfig |
| S-02 | Definir estructura de carpetas (pages, components, api, hooks, types, utils) | ✅ | api/ components/ui/ hooks/ pages/ stores/ types/ utils/ mocks/ |
| S-03 | Configurar React Router v6 con rutas base | ✅ | Rutas privadas vía `ProtectedRoute` |
| S-04 | Configurar layout responsivo y componentes base reutilizables | ✅ | Sidebar + Topbar + Layout; Button, Input, Card, Badge, Spinner, EmptyState, ErrorMessage |
| S-05 | Configurar variables de entorno `.env.example` (`VITE_API_URL`) | ✅ | + `VITE_USE_MOCKS` |
| S-06 | Configurar cliente HTTP base (`/api/v1`) con interceptor de errores | ✅ | Bearer token, 401 → clear session, `Idempotency-Key` opcional |
| S-07 | Generar tipos TypeScript desde `docs/api-contracts/openapi.yaml` | ✅ | `src/types/api.ts` con los 20 esquemas |
| S-08 | Configurar ESLint + Prettier | ✅ | ESLint + `@typescript-eslint` + `react-hooks` + `react-refresh` |
| S-09 | Documentar comandos de instalación y ejecución en `/frontend/README.md` | ✅ | Instalación, dev, build, typecheck, lint |

**Criterios de aceptación:**
- [x] La app corre localmente siguiendo instrucciones documentadas
- [x] Estructura clara para agregar módulos sin mezclar responsabilidades
- [x] Navegación permite incorporar las pantallas del MVP
- [x] API URL desde variables de entorno
- [x] Layout responsivo y componentes base presentes

---

## FE-02 · Autenticación y sesión — [#2](https://github.com/1260811/hackatonSedeco/issues/2)

**Prioridad:** P0 | **Dependencias:** FE-01
**✅ Implementado en commit [`ced7a49`](https://github.com/1260811/hackatonSedeco/commit/ced7a49) el 2026-11-08.**
**⚠️ Mecanismo real de auth pendiente de decisión (Q-13) — mock funcional por el momento.**

| # | Tarea | Estado | Notas |
|---|-------|--------|-------|
| A-01 | Pantalla de registro | ✅ | React Hook Form + Zod, confirmación de contraseña |
| A-02 | Pantalla de inicio de sesión | ✅ | Preserva ubicación origen vía `location.state.from` |
| A-03 | Flujo visual de recuperación de acceso | ✅ | Success state sin revelar existencia del usuario |
| A-04 | Manejo del estado de sesión (almacenamiento de Bearer token) | ✅ | Zustand con `persist` middleware (`auth-session` key) |
| A-05 | Protección de rutas privadas | ✅ | `ProtectedRoute` component con `Navigate` + state |
| A-06 | Interceptor HTTP: 401 → redirigir / renovar token | ✅ | `client.ts` llama `clear()` en 401; redirección en próxima navegación |
| A-07 | Acción de cierre de sesión | ✅ | Botón en Topbar, limpia store y navega a `/login` |

**Criterios de aceptación:**
- [x] Navegación entre registro, login y recuperación
- [x] Formularios validan campos obligatorios y formatos básicos
- [x] Mensajes comprensibles en error y carga
- [x] Rutas privadas requieren sesión válida
- [x] Cierre de sesión funcional
- [x] Integración encapsulada en servicios, sin credenciales en código productivo

---

## FE-03 · Gestión de cuentas bancarias — [#3](https://github.com/1260811/hackatonSedeco/issues/3)

**Prioridad:** P0 | **Dependencias:** FE-01
**✅ Implementado en commit [`8b67f88`](https://github.com/1260811/hackatonSedeco/commit/8b67f88) el 2026-11-08.**

| # | Tarea | Estado | Notas |
|---|-------|--------|-------|
| C-01 | Listar cuentas bancarias del usuario | ✅ | `GET /accounts` |
| C-02 | Formulario de registro de cuenta (CLABE 18 dígitos) | ✅ | `RegisterAccountDialog` con regex `^[0-9]{18}$` |
| C-03 | Ver detalle de cuenta | ✅ | Card con bank, alias, CLABE enmascarada |
| C-04 | Mostrar estado Pey: PENDING, ACTIVE, INACTIVE, REJECTED | ✅ | Badges con tonos tone-aware en `utils/bankAccount.ts` |
| C-05 | Informar proceso de activación (hasta 5 días hábiles) | ✅ | Hint en registro + hint en estado PENDING |
| C-06 | Informar límite de 5 usuarios por cuenta (sin duplicar validación del BE) | ✅ | Texto informativo en header |
| C-07 | Estados vacíos y manejo de errores | ✅ | `EmptyState` con CTA cuando no hay cuentas |

**Criterios de aceptación:**
- [x] Listado de cuentas visible
- [x] Registro de cuenta funcional con validación de CLABE
- [x] Estados Pey diferenciados visualmente
- [x] Info sobre cuenta ACTIVE como requisito para recibir CoDi
- [x] No se muestran datos bancarios sensibles innecesarios
- [x] UI contempla el límite de 5 usuarios por cuenta

---

## FE-04 · Creación y administración de tandas — [#4](https://github.com/1260811/hackatonSedeco/issues/4)

**Prioridad:** P0 | **Dependencias:** FE-01
**✅ Implementado en commit [`20bf8ac`](https://github.com/1260811/hackatonSedeco/commit/20bf8ac) el 2026-11-08.**

| # | Tarea | Estado | Notas |
|---|-------|--------|-------|
| T-01 | Listar tandas del usuario con filtro por estado | ✅ | Filtros: Todas / Borradores / Activas / Pausadas / Finalizadas |
| T-02 | Formulario de creación de tanda (borrador) | ✅ | `CreateTandaDialog` con name, amount, frequency, startDate, customPeriodDays |
| T-03 | Vista de detalle de tanda | ✅ | `TandaDetailPage` con resumen + requisitos de activación |
| T-04 | Invitación de participantes | ✅ | Formulario inline en `ParticipantsList` |
| T-05 | Listado y estados de participantes (INVITED, ACTIVE, LEFT, REMOVED) | ✅ | Badges tone-aware |
| T-06 | Aceptar/rechazar invitación | ⬜ | Fuera de alcance MVP inicial (requiere endpoint de aceptación) |
| T-07 | Activar tanda (con validación UI de 3+ participantes activos) | ✅ | Botón habilitado solo cuando `distinctPersonCount >= 3` |
| T-08 | Requisitos pendientes para activar visibles en UI | ✅ | Panel de requisitos con checkmarks |
| T-09 | Pausa y reanudación por organizador (notifica a todos) | ⬜ | Fuera de alcance MVP inicial (requiere endpoint de pausa) |
| T-10 | Flujo de cancelación (requiere unanimidad) | ⬜ | Fuera de alcance MVP inicial |
| T-11 | Flujo de abandono (máx 50% recibido para abandono unilateral) | ⬜ | Fuera de alcance MVP inicial |
| T-12 | Flujo de reasignación de turno (inicia organizador, acepta propuesto) | ⬜ | Fuera de alcance MVP inicial |

**Reglas de negocio aplicadas en UI:**
- ✅ Mínimo 3 participantes activos para activar
- ✅ Organizador puede participar o solo organizar (decisión explícita)
- ⬜ Pausa/reanudación, cancelación, abandono y reasignación: scaffolded en data layer, UI pendiente de que BE-04/BE-07 confirmen endpoints

**Criterios de aceptación:**
- [x] El usuario puede consultar sus tandas y su estado
- [x] El organizador puede crear y editar una tanda en borrador
- [x] Se muestran participantes e invitaciones con sus estados
- [x] Se distinguen las acciones disponibles para organizador y participante
- [x] Se informa qué requisitos faltan para activar la tanda
- [x] La interfaz contempla el mínimo de 3 participantes activos
- [x] Organizador puede participar (decisión explícita)

---

## FE-05 · Selección de cuenta bancaria por participación — [#5](https://github.com/1260811/hackatonSedeco/issues/5)

**Prioridad:** P0 | **Dependencias:** FE-03, FE-04
**✅ Implementado en commit [`5f56d23`](https://github.com/1260811/hackatonSedeco/commit/5f56d23) el 2026-11-08.**

| # | Tarea | Estado | Notas |
|---|-------|--------|-------|
| P-01 | Mostrar cuentas disponibles para el usuario al unirse a tanda | ✅ | `SelectBankAccountDialog` |
| P-02 | Seleccionar cuenta para la participación específica | ✅ | `PUT /tandas/{id}/participations/{pid}/bank-account` |
| P-03 | Mostrar cuenta seleccionada por participación | ✅ | Chip con icono wallet en `ParticipantsList` |
| P-04 | Informar cuando no hay cuentas ACTIVE disponibles | ✅ | Warning + hint sobre registrar cuenta |
| P-05 | Revisión de selección antes de activar la tanda | ✅ | Botón "Confirmar selección" solo habilitado tras cambio |

**Criterios de aceptación:**
- [x] Selección por tanda, no preferencia global
- [x] Solo cuentas permitidas visibles (ACTIVE enabled, otras disabled)
- [x] Info de que la cuenta debe estar ACTIVE para recibir pagos
- [x] Selección asociada a la participación correspondiente
- [x] Confirmación explícita antes de aplicar
- [x] No se asume cuenta por defecto sin confirmación

---

## FE-06 · Convenio de la tanda — [#6](https://github.com/1260811/hackatonSedeco/issues/6)

**Prioridad:** P0 | **Dependencias:** FE-04
**✅ Implementado en commit [`adcf0f2`](https://github.com/1260811/hackatonSedeco/commit/adcf0f2) el 2026-11-08.**

| # | Tarea | Estado | Notas |
|---|-------|--------|-------|
| AG-01 | Ver convenio vigente | ✅ | `GET /tandas/{id}/agreement` |
| AG-02 | Configurar convenio en borrador (organizador) | ⬜ | API lista (`updateAgreement`), UI de edición queda pendiente para iteración |
| AG-03 | Aceptar versión de convenio | ✅ | Botón explícito, bloqueado si ya aceptado |
| AG-04 | Mostrar estado de aceptación por participante (vista organizador) | ✅ | Panel "Aceptaciones" con badges |
| AG-05 | Indicar versión del convenio que se está aceptando | ✅ | Header muestra versión y conteo |
| AG-06 | Mostrar sanción configurada (fijo/porcentaje) o ausencia explícita | ✅ | Sección sanciones con icono `ShieldCheck` cuando sin sanción |

**Criterios de aceptación:**
- [x] Cada participante consulta el convenio completo antes de aceptar
- [x] La aceptación es acción explícita
- [x] Se contempla la opción de no establecer sanciones
- [x] Muestra estado de aceptación por participante
- [x] Identifica la versión aceptada
- [x] Informa que la tanda no se activa hasta aceptación de todos
- [x] No calcula sanciones automáticas

---

## FE-07 · Turnos y obligaciones — [#7](https://github.com/1260811/hackatonSedeco/issues/7)

**Prioridad:** P0 | **Dependencias:** FE-04, FE-05
**✅ Implementado en commit [`f062984`](https://github.com/1260811/hackatonSedeco/commit/f062984) el 2026-11-08.**

| # | Tarea | Estado | Notas |
|---|-------|--------|-------|
| TU-01 | Vista de turnos de una tanda (posición, receptor, fecha) | ✅ | `TurnsList` en detalle de tanda |
| O-01 | Listar obligaciones propias del participante | ✅ | `ObligationsList` filtra por `myParticipationIds` |
| O-02 | Vista de cantidades que le deben al participante | ⬜ | Agregado implícito desde turnos; vista dedicada pendiente |
| O-03 | Estados de obligaciones: PENDING, PAYMENT_REQUESTED, PAID, OVERDUE, etc. | ✅ | Badges tone-aware en `utils/obligation.ts` |
| O-04 | Vista completa para organizador (todos los movimientos de sus tandas) | ⬜ | Backend decide visibilidad; UI aplica filtro por participación actual |

**Reglas de negocio aplicadas en UI:**
- ✅ Participante solo ve sus propias obligaciones
- ✅ Estados diferenciados visualmente (6 estados soportados)
- ✅ Sanción acumulada visible cuando aplica
- ✅ Link a `/obligations/:id` para pago (FE-08)
- ✅ UI no inventa fechas ni vencimientos (usa datos de API)

**Criterios de aceptación:**
- [x] El participante consulta únicamente sus propias obligaciones y pagos
- [x] Cada turno muestra una sola persona receptora
- [x] Los estados se presentan de forma diferenciada y comprensible
- [x] La interfaz no inventa fechas ni vencimientos

---

## FE-08 · Pago de obligaciones mediante CoDi — [#8](https://github.com/1260811/hackatonSedeco/issues/8)

**Prioridad:** P0 | **Dependencias:** FE-07
**✅ Implementado en commit [`1c9c960`](https://github.com/1260811/hackatonSedeco/commit/1c9c960) el 2026-11-08.**
**⚠️ Integración real con Pey requiere BE-08/BE-09/BE-10 — mock funcional por el momento.**

| # | Tarea | Estado | Notas |
|---|-------|--------|-------|
| SR-01 | Detalle de obligación pendiente con importe exacto | ✅ | `PaymentPage` en `/obligations/:id` |
| SR-02 | Generar solicitud de pago QR/Push | ✅ | `Idempotency-Key` header generado por request |
| SR-03 | Renderizar QR en pantalla (qrPayload del backend) | ✅ | Frontend NO genera QR propio; renderiza payload |
| SR-04 | Consultar estado de solicitud de pago | ✅ | Polling cada 5s con `refetchInterval` |
| SR-05 | Estados: CREATED, PENDING, PROCESSING, EXPIRED, PAID, FAILED, UNDER_REVIEW | ✅ | Badges tone-aware en `utils/paymentRequest.ts` |
| SR-06 | Informar QR expirado o pago en revisión | ✅ | Mensajes contextuales en terminal states |

**Reglas de negocio aplicadas en UI:**
- ✅ No permite pagos parciales (warning explícito)
- ✅ No marca como pagado hasta confirmación del backend
- ✅ El QR viene del backend — el frontend solo lo muestra
- ✅ Botón de refresh manual + polling automático

**Criterios de aceptación:**
- [x] El participante puede abrir el detalle de una obligación pendiente
- [x] Se muestra el importe exacto de la obligación
- [x] El QR se presenta tal como lo entrega el backend
- [x] No se permite iniciar un pago parcial
- [x] La interfaz no muestra un pago como confirmado por generación del QR
- [x] El estado confirmado proviene del backend después de validación con Pey
- [x] Se informa cuando el QR expiró o el pago requiere revisión

---

## FE-09 · Historial de pagos y movimientos — [#9](https://github.com/1260811/hackatonSedeco/issues/9)

**Prioridad:** P0 | **Dependencias:** FE-07, FE-08
**✅ Implementado en commit [`17698b8`](https://github.com/1260811/hackatonSedeco/commit/17698b8) el 2026-11-08.**

| # | Tarea | Estado | Notas |
|---|-------|--------|-------|
| PA-01 | Historial de movimientos por tanda | ✅ | Agregado por tanda con `PaymentsGroup` |
| PA-02 | Vista filtrada para participante (solo propios) | ✅ | Backend filtra por rol; UI aplica filtros adicionales |
| PA-03 | Vista completa para organizador (todos los movimientos) | ✅ | Mismo endpoint con visibilidad gestionada por backend |
| PA-04 | Filtros básicos por fecha/estado (si API los soporta) | ✅ | Filtros: tanda (All o específica) + estado (CONFIRMED, LATE, UNDER_REVIEW) |
| PA-05 | Detalle de un movimiento y su estado | ✅ | Importe, timestamp, peyTransactionId, status |
| PA-06 | Distinguir: obligación / intento de pago / pago confirmado / pago externo | ✅ | Pagos aquí; obligaciones y solicitudes en vistas dedicadas |
| PA-07 | Flujo de registro de pago externo por organizador (con confirmación del receptor) | ⬜ | Fuera de alcance MVP inicial |
| PA-08 | Vista de liquidación por cancelación (cálculo de saldos, sin transferencias) | ⬜ | Fuera de alcance MVP inicial |

**Criterios de aceptación:**
- [x] El participante solo visualiza sus obligaciones, pagos y cantidades
- [x] Los filtros no permiten acceder a información fuera del alcance autorizado
- [x] Se distingue entre obligación, intento de pago y pago confirmado
- [x] No se presentan transacciones de Pey como confirmadas sin validación del backend

---

## FE-10 · Centro de notificaciones — [#10](https://github.com/1260811/hackatonSedeco/issues/10)

**Prioridad:** P1 | **Dependencias:** FE-01
**✅ Implementado en commit [`559c54d`](https://github.com/1260811/hackatonSedeco/commit/559c54d) el 2026-11-08.**
**⚠️ Integración con BE-11 y definición de canales (Q-09) pendientes.**

| # | Tarea | Estado | Notas |
|---|-------|--------|-------|
| N-01 | Listado/panel de notificaciones | ✅ | `GET /notifications` + polling 30s |
| N-02 | Indicador de notificaciones no leídas | ✅ | Dot indicator + contador en header + badge en sidebar |
| N-03 | Marcar como leída | ✅ | Botón explícito + al hacer click en la notificación |
| N-04 | Navegación desde notificación al contexto relacionado | ✅ | `notificationTargetRoute()` mapea 9 tipos de notificación a rutas |
| N-05 | Estados: vacío, carga y error | ✅ | `EmptyState`, `PageSpinner`, `ErrorMessage` |

**Tipos de notificaciones mapeadas a rutas:**
- `OBLIGATION_DUE`, `OBLIGATION_OVERDUE` → `/obligations/:id`
- `INVITATION`, `TANDA_PAUSED`, `TANDA_RESUMED`, `TANDA_CANCELLATION` → `/tandas/:id`
- `AGREEMENT_UPDATE` → `/tandas/:id/agreement`
- `PAYMENT_CONFIRMED`, `PAYMENT_FAILED` → `/history`

**Criterios de aceptación:**
- [x] Se muestran las notificaciones disponibles para el usuario autenticado
- [x] Se distingue cuáles están leídas y cuáles no
- [x] Una notificación lleva al detalle relacionado
- [x] Se contemplan estados vacíos y errores
- [x] La interfaz no duplica notificaciones
- [x] La presentación no presupone un canal de envío externo

---

## Bloqueos activos

| # | Descripción | Desde | Esperando | Afecta |
|---|-------------|-------|-----------|--------|
| B-01 | Mecanismo definitivo de autenticación (Q-13) | 2026-11-08 | Decisión de equipo | FE-02 (integración real) |
| B-02 | Paginación de listados no especificada | 2026-11-08 | Actualización del contrato API | FE-04, FE-07, FE-09 |
| B-03 | Integración real con Pey (BE-08, BE-09, BE-10) | 2026-11-08 | Backend | FE-08 (integración real) |
| B-04 | Definición de canales de notificación (Q-09) | 2026-11-08 | Decisión de equipo | FE-10 (integración real) |

> Los bloqueos no impiden el desarrollo frontend porque el modo mock
> (`VITE_USE_MOCKS=true`) permite simular todos los flujos.

---

## Decisiones tomadas

| Fecha | Decisión | Commit |
|-------|----------|--------|
| 2026-11-08 | Rama `feat/frontend-setup` creada desde `dev` | `bb71051` |
| 2026-11-08 | CLAUDE.md creado con reglas de desarrollo | `bb71051` |
| 2026-11-08 | PROGRESS.md sincronizado con issues de GitHub (#1–#10) | `d20c199` |
| 2026-11-08 | FE-01 completado: stack Vite+React+TS+Tailwind+TanStack Query+Zustand | `d0d2a20` |
| 2026-11-08 | FE-02 completado: auth UI con mock (pendiente definición Q-13) | `ced7a49` |
| 2026-11-08 | FE-03 completado: cuentas bancarias con CLABE y estados Pey | `8b67f88` |
| 2026-11-08 | FE-04 completado: tandas, participantes, activación con 3+ personas | `20bf8ac` |
| 2026-11-08 | FE-05 completado: selección de cuenta por participación | `5f56d23` |
| 2026-11-08 | FE-06 completado: convenio con aceptación explícita y versionado | `adcf0f2` |
| 2026-11-08 | FE-07 completado: turnos + obligaciones propias | `f062984` |
| 2026-11-08 | FE-08 completado: pago CoDi QR/Push con 7 estados e idempotency-key | `1c9c960` |
| 2026-11-08 | FE-09 completado: historial con filtros por tanda y estado | `17698b8` |
| 2026-11-08 | FE-10 completado: notificaciones con polling y navegación por tipo | `559c54d` |
| 2026-11-08 | Rama pusheada a `origin/feat/frontend-setup` | — |

---

## Orden de desarrollo (completado)

```
FE-01 ✅ (base)
  ├── FE-02 ✅ (auth · mock)
  ├── FE-03 ✅ (cuentas)
  │     └── FE-05 ✅ (selección cuenta por participación)
  ├── FE-04 ✅ (tandas)
  │     ├── FE-05 ✅
  │     ├── FE-06 ✅ (convenio)
  │     └── FE-07 ✅ (turnos/obligaciones)
  │           ├── FE-08 ✅ (pago CoDi · mock)
  │           └── FE-09 ✅ (historial)
  └── FE-10 ✅ (notificaciones · mock)
```

---

## Próximos pasos

1. ⏭️ Abrir PR desde `feat/frontend-setup` → `dev` para code review del equipo
2. ⏭️ Al mergear, las 10 issues se cerrarán automáticamente por los `Closes #N`
3. ⏭️ Esperar resolución de bloqueos B-01 (auth) y B-03 (Pey) para activar integración real (desactivar `VITE_USE_MOCKS`)
4. ⏭️ Iterar sobre flujos fuera del MVP inicial: pausa/reanudación, cancelación, abandono, reasignación, pagos externos, liquidación
