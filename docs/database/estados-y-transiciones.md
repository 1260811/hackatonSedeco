# Estados y transiciones

Este documento fija el vocabulario de persistencia. Las transiciones solo se ejecutan mediante servicios autorizados; la interfaz no cambia estados directamente.

## Tandas

| Estado | Significado | Transiciones principales |
|---|---|---|
| DRAFT | Preparación; admite invitaciones, solicitudes, convenio y turnos | ACTIVE al cumplir requisitos |
| ACTIVE | Operación normal | PAUSED, CANCELLATION_PENDING, COMPLETED |
| PAUSED | Sin nuevas obligaciones ni cobros | ACTIVE o CANCELLATION_PENDING |
| CANCELLATION_PENDING | Votación unánime; nuevos cobros bloqueados | SETTLING si todos aceptan; ACTIVE si se rechaza |
| SETTLING | Resolución de solicitudes/transacciones y cálculo de liquidación | CANCELLED al completar |
| COMPLETED | Ciclo completado normalmente | Estado terminal |
| CANCELLED | Cancelación y liquidación completadas | Estado terminal |

## Participaciones

| Estado | Significado |
|---|---|
| ACTIVE | Participación vigente |
| INACTIVE | Participación deshabilitada antes de consolidar obligaciones |
| WITHDRAWN | Abandono aceptado y registrado; conserva historial |

El abandono unilateral solo puede aprobarse si la persona recibió hasta el 50 % inclusive del importe total que le corresponde. La reasignación de turnos es un flujo separado y requiere aceptación de la persona propuesta y aprobación del organizador.

## Solicitudes de ingreso e invitaciones

| Estado | Significado |
|---|---|
| PENDING | Espera aceptación o aprobación |
| ACCEPTED | Invitación aceptada o solicitud aprobada; crea participación |
| REJECTED | Rechazada; conserva historial |
| CANCELLED | Retirada antes de resolverse |

## Turnos y reservas

| Entidad | Estados |
|---|---|
| Turno | AVAILABLE, RESERVED, ASSIGNED, COMPLETED, CANCELLED |
| Reserva | ACTIVE, CONFIRMED, EXPIRED, RELEASED |
| Historial de asignación | ASSIGNED, CANCELLED, REASSIGNED, RELEASED |

Una reserva activa expirada se libera mediante un proceso del backend. La unicidad parcial evita dos reservas activas simultáneas para un turno.

## Obligaciones y pagos

| Entidad | Estados |
|---|---|
| Obligación / detalle | PENDING, PARTIALLY_PAID, PAID, OVERDUE, CANCELLED |
| Solicitud de cobro | PENDING, GENERATING, ACTIVE, PAID, EXPIRED, FAILED, CANCELLED |
| Intento QR/Push | CREATED, PENDING, SUCCEEDED, FAILED, EXPIRED, CANCELLED |
| Pago | PENDING_CONFIRMATION, CONFIRMED, REJECTED, DISCREPANCY |
| Webhook | RECEIVED, PROCESSING, PROCESSED, FAILED, IGNORED |
| Sanción | PENDING, PAID, CANCELLED |

Un intento exitoso o un webhook recibido no significa que el pago esté confirmado. La confirmación Pey exige consulta y conciliación. Los pagos externos requieren confirmación del receptor; pueden ser parciales y acumularse.

## Cancelación y liquidación

| Entidad | Estados |
|---|---|
| Solicitud de cancelación | PENDING, APPROVED, REJECTED |
| Liquidación | CALCULATING, PENDING_REVIEW, IN_PROGRESS, COMPLETED |
| Partida de liquidación | PENDING, IN_PROGRESS, SETTLED |

La cancelación activa requiere respuesta afirmativa de todas las personas involucradas. Cualquier rechazo impide la cancelación. No se completa mientras haya solicitudes o transacciones de cobro pendientes ni devoluciones sin resolver.
