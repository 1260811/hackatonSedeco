# Reglas de integridad y comportamiento

Las reglas se protegen en la base de datos cuando son invariantes estructurales y en el backend cuando requieren contexto, autorización o coordinación de varias entidades.

## 1. Usuarios y cuentas

1. El correo se normaliza con trim y minúsculas; la base impide duplicados sin distinguir mayúsculas.
2. Una cuenta se registra una sola vez en Pey y conserva su `pey_bank_account_id`.
3. Una cuenta puede asociarse con máximo cinco usuarios. El trigger serializa las altas concurrentes.
4. Cada participación selecciona explícitamente una asociación bancaria del mismo usuario.
5. El estado Pey de la cuenta es independiente del estado de la asociación usuario-cuenta.
6. Solo una cuenta ACTIVE en Pey puede seleccionarse para recibir cobros.
7. No se desactiva la última asociación bancaria activa de un usuario.
8. Cambiar la cuenta seleccionada afecta nuevas solicitudes; no modifica turnos asignados ni solicitudes ya generadas.
9. El nombre legal devuelto por Pey no se interpreta como verificación de titularidad. La declaración del usuario se conserva por separado.

## 2. Tandas y participaciones

1. El organizador no se incorpora automáticamente como participante.
2. Un usuario puede tener varias participaciones en una misma tanda.
3. Las invitaciones requieren aceptación; las solicitudes de ingreso requieren aprobación del organizador.
4. No se aceptan nuevas incorporaciones una vez activa la tanda.
5. Para activar se requieren al menos tres personas distintas, turnos asignados, cuenta válida por participación y aceptación de la versión vigente del convenio.
6. La activación congela la distribución inicial.
7. El organizador consulta los movimientos de sus tandas; cada participante solo consulta sus obligaciones y pagos propios.

## 3. Turnos y calendario

1. Los turnos disponibles pueden reservarse temporalmente durante la preparación.
2. Una reserva confirmada asigna el turno; una reserva expirada lo libera.
3. Antes de activar, una asignación puede cancelarse y volver a estar disponible, conservando historial.
4. Cada turno tiene una sola persona receptora.
5. El turno conserva la cuenta bancaria seleccionada para esa persona al momento de asignarse, incluyendo snapshot de los datos de destino.
6. El organizador puede pausar y reanudar una tanda activa sin unanimidad; se notifica a todas las personas participantes.
7. Al pausar no se generan nuevas obligaciones ni solicitudes; las existentes se conservan.
8. Al reanudar se establecen nuevas fechas para los turnos pendientes y se conserva el calendario original.
9. La reasignación la inicia el organizador, requiere aceptación de la persona propuesta y aprobación del organizador. Solo las obligaciones futuras pasan a la nueva persona; las vencidas o de periodos anteriores permanecen con la original.

## 4. Obligaciones, solicitudes y pagos

1. La obligación se consolida por usuario, tanda y periodo; el detalle conserva turnos y receptores.
2. El usuario no aporta por los turnos en los que él mismo recibe, considerando todas sus participaciones.
3. La solicitud CoDi es individual por pagador. Puede consolidar varias participaciones solo si son del mismo periodo y comparten cuenta destino.
4. No se genera cobro a una persona por sus propios turnos.
5. La solicitud conserva la cuenta destino a la que fue dirigida.
6. No se permiten pagos parciales CoDi como liquidación automática; se solicita el importe exacto.
7. El webhook es una notificación, no confirmación. Se consulta Pey y se valida transacción, importe, referencia y cuenta.
8. Duplicados, importes incorrectos o transacciones no asociadas quedan en discrepancia y no liquidan obligaciones.
9. El excedente no se aplica automáticamente a otras obligaciones.
10. Se permiten pagos externos parciales. Cada registro debe ser confirmado o rechazado por la persona receptora; solo importes confirmados se asignan al saldo.
11. El organizador puede registrar pagos externos, pero no confirmarlos en nombre de la persona receptora.

## 5. Sanciones

1. La sanción es opcional y queda versionada en el convenio: ninguna, monto fijo o porcentaje.
2. El porcentaje se calcula sobre la aportación individual del detalle de obligación.
3. Se aplica después del vencimiento y del periodo de gracia.
4. Se genera una sanción por cada periodo de retraso configurado en el convenio.
5. No se capitaliza: una sanción no forma parte de la base para calcular la siguiente.
6. La periodicidad de sanción es un parámetro explícito del convenio; no se inventa un valor global del sistema.

## 6. Abandono y cancelación

1. El abandono unilateral se permite cuando la persona ha recibido como máximo el 50 % del importe total que le corresponde recibir. Por encima del 50 % requiere acuerdo/solución conforme al proceso de la tanda.
2. La solicitud de abandono registra el porcentaje recibido y se audita.
3. La cancelación de una tanda activa requiere unanimidad de todas las personas involucradas.
4. Al iniciar cancelación se bloquean nuevas obligaciones y solicitudes de cobro.
5. Antes de completar la cancelación se resuelven solicitudes y transacciones Pey en curso.
6. El sistema calcula la liquidación por persona; el organizador no altera los importes.
7. La plataforma no realiza devoluciones ni transferencias. Las devoluciones externas se registran y requieren confirmación de quien recibe.
8. No se cierra la tanda mientras haya saldos o devoluciones pendientes de resolución.

## 7. Webhooks, seguridad y auditoría

1. La firma Standard Webhooks se valida con el cuerpo original, timestamp y secreto del ambiente.
2. `webhook-id` y `transactionId` tienen deduplicación independiente.
3. El procesamiento es idempotente y transaccional.
4. Una firma inválida no produce cambios de negocio.
5. Los movimientos financieros, aceptaciones, cambios de cuenta, pausas, reanudaciones, abandonos, reasignaciones, conciliaciones y cancelaciones conservan actor, acción, recurso, fecha y contexto.
6. Los secretos y datos bancarios sensibles innecesarios no se guardan en auditoría.

## 8. Reglas que requieren transacciones del backend

La base de datos protege las relaciones y unicidades; el backend debe validar permisos y consistencia contextual antes de ejecutar activación, cobros, conciliación, pagos externos, abandono, reasignación, pausa/reanudación y cancelación.
