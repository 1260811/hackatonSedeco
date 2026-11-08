# Modelo físico de datos

## 1. Convenciones

| Elemento | Definición |
|---|---|
| Motor | PostgreSQL 17 |
| Identificadores | UUID, generados con `gen_random_uuid()` |
| Instantes | `TIMESTAMPTZ` |
| Fechas de calendario | `DATE` |
| Importes | `NUMERIC(12,2)` |
| Porcentajes | `NUMERIC(7,4)` o precisión equivalente validada |
| Estados | `VARCHAR` con restricciones `CHECK` |
| Payloads y snapshots flexibles | `JSONB` / `TEXT` |
| Nombres | `snake_case` |

No usar FLOAT/REAL para importes. Las FK históricas y financieras usan `ON DELETE RESTRICT`.

## 2. Tablas

La migración V1 crea las 29 tablas del modelo lógico. Las columnas principales se agrupan así:

| Dominio | Tablas | Columnas/relaciones principales |
|---|---|---|
| Identidad | `users` | email normalizado, teléfono, hash, nombre, estado |
| Cuentas | `bank_accounts`, `user_bank_accounts` | ID Pey único, CLABE, estado Pey; asociación, titularidad declarada y estado |
| Tandas | `tandas`, `participation_requests`, `participations` | organizador, configuración, invitaciones/solicitudes, participaciones múltiples |
| Convenios | `agreements`, `agreement_acceptances` | versión, aportación, vencimiento, gracia, sanción y aceptación |
| Turnos | `turns`, `turn_reservations`, `turn_assignment_history`, `turn_schedule_history` | posición, receptor, reserva, historial de asignación y fechas |
| Obligaciones | `payment_obligations`, `obligation_details` | consolidación usuario/tanda/periodo y desglose por turno |
| Solicitudes | `payment_requests`, `payment_request_items`, `payment_attempts` | cuenta destino y snapshot, conceptos, QR/Push y reintentos |
| Sanciones | `penalties` | importe, base, tipo, valor y periodo de retraso |
| Pagos | `payments`, `payment_allocations`, `pey_transactions` | fuente Pey/externa, confirmación, asignaciones y conciliación |
| Webhooks | `webhook_events` | webhook-id, transaction-id, payload, firma y estado de procesamiento |
| Operación | `incidents`, `cancellation_requests`, `cancellation_acceptances` | discrepancias y unanimidad de cancelación |
| Liquidación | `settlements`, `settlement_items` | proceso y saldo neto por usuario |
| Seguimiento | `notifications`, `audit_logs` | destinatario, recurso, lectura y trazabilidad |

## 3. Restricciones únicas e índices críticos

- `users.email`: UNIQUE y UNIQUE sobre `LOWER(BTRIM(email))`.
- `bank_accounts.pey_bank_account_id`: UNIQUE.
- `user_bank_accounts(user_id, bank_account_id)`: UNIQUE.
- `agreements(tanda_id, version)`: UNIQUE.
- `turns(tanda_id, turn_number)`: UNIQUE.
- `payment_obligations(tanda_id, user_id, period_number)`: UNIQUE.
- `obligation_details(payment_obligation_id, turn_id)`: UNIQUE.
- Una reserva activa por turno: índice único parcial.
- `payment_attempts(payment_request_id, attempt_number)`: UNIQUE.
- `penalties(obligation_detail_id, period_number)`: UNIQUE.
- `pey_transactions.transaction_id`: UNIQUE.
- `webhook_events.webhook_id`: UNIQUE.
- `webhook_events.transaction_id`: UNIQUE parcial cuando no es NULL.
- `agreement_acceptances(agreement_id, participation_id)`: UNIQUE.
- `cancellation_acceptances(cancellation_request_id, user_id)`: UNIQUE.
- `settlement_items(settlement_id, user_id)`: UNIQUE.

No existe UNIQUE para `participations(user_id, tanda_id)`.

## 4. Snapshot bancario de cada turno (V2)

`turns` incorpora:

- `receiver_user_id`
- `receiver_user_bank_account_id`
- `receiver_bank_account_id`
- `receiver_pey_bank_account_id_snapshot`
- `receiver_clabe_snapshot`
- `receiver_account_name_snapshot`

Las FK compuestas garantizan que la participación receptora y la asociación bancaria pertenecen al mismo usuario y que la asociación corresponde a la cuenta guardada. Los campos snapshot preservan el destino de cobro aunque después cambie la cuenta seleccionada en la participación.

## 5. Integridad reforzada por PostgreSQL (V2)

- Máximo cinco asociaciones por cuenta bancaria, mediante trigger y advisory transaction lock para evitar carreras concurrentes.
- La asociación bancaria de una participación debe pertenecer al mismo usuario.
- La cuenta y asociación guardadas en un turno deben corresponder a la participación receptora.
- Un `transaction_id` solo puede aparecer en un evento webhook contabilizable.
- El correo normalizado no puede duplicarse aunque dos solicitudes concurrentes intenten registrarlo.
- La reasignación queda identificada en el historial de turnos.

## 6. Reglas transaccionales del backend

- No desactivar la última asociación bancaria activa de un usuario.
- Verificar que una cuenta esté ACTIVE en Pey al seleccionarla para recibir.
- Validar el mínimo de tres personas distintas al activar.
- Exigir cuenta por participación y aceptación de la versión vigente del convenio.
- Validar que turno, tanda, participación y cuenta destino correspondan.
- Excluir del cobro al usuario receptor de un turno, considerando todas sus participaciones.
- Consolidar solicitudes por pagador, periodo y cuenta destino.
- Confirmar CoDi solo tras consulta Pey e importe exacto.
- Aplicar pagos externos parciales solo después de confirmación del receptor.
- Reasignar solo obligaciones futuras; conservar las vencidas con la persona original.
- Exigir unanimidad para cancelar y no finalizar mientras existan solicitudes/transacciones pendientes.

## 7. Política de borrado

Las entidades financieras, aceptaciones, historial, webhooks, liquidaciones y auditoría no se eliminan físicamente mediante operaciones normales. Se usan estados y referencias históricas.
