# Decisiones de diseño de datos

## Confirmadas

| Tema | Decisión |
|---|---|
| Motor | PostgreSQL 17; Flyway para migraciones |
| Identificadores | UUID |
| Dinero | NUMERIC; nunca FLOAT |
| Usuario y tanda | Se permiten varias participaciones del mismo usuario en una tanda |
| Organizador | No participa automáticamente |
| Cuenta compartida | Máximo cinco usuarios por cuenta; asociación con estado propio y sin borrado físico |
| Selección bancaria | Explícita por participación; cada turno y solicitud conserva su cuenta destino histórica |
| Activación | Mínimo tres personas distintas; turnos, cuentas elegibles y convenio aceptado |
| Obligaciones | Consolidadas por usuario/tanda/periodo, con desglose por turno |
| Turnos propios | No se cobra al usuario por los turnos que recibe él mismo |
| CoDi | QR y Push; importes exactos, sin pagos parciales |
| Solicitudes | Una por pagador; consolidar solo mismo periodo y misma cuenta destino |
| Webhooks | Aviso, no confirmación; deduplicar webhook-id y transactionId y consultar Pey |
| Pagos externos | Pueden ser parciales; cada registro requiere confirmación del receptor |
| Sanciones | Opcionales; fijas o porcentuales sobre aportación base, por cada periodo de retraso, sin capitalización |
| Pausa | El organizador puede pausar/reanudar; notificar y conservar fechas originales |
| Abandono | Unilateral permitido hasta 50 % inclusive del importe total que corresponde recibir |
| Reasignación | La inicia organizador, acepta la persona propuesta y aprueba organizador; solo obligaciones futuras cambian |
| Cancelación | Requiere unanimidad; bloquea nuevos cobros, resuelve solicitudes en curso y calcula liquidación |
| Fondos | La plataforma no recibe, custodia ni transfiere dinero |

## Parámetros definidos por tanda o convenio

- Monto de aportación y frecuencia de la tanda.
- Fecha de cada turno y cambios al reanudar.
- Días de anticipación para vencimiento.
- Días de gracia.
- Tipo y valor de sanción.
- Periodicidad de cálculo de sanción en días, cuando aplique.

Estos parámetros no se sustituyen por valores globales inventados por la plataforma.

## Parámetros técnicos configurables

- TTL de reservas temporales de turnos.
- Timeouts y política de reintentos al consultar Pey.
- Retención de payloads webhook y datos de auditoría conforme a las políticas del ambiente.

## Pendientes externos o de operación

- Confirmar con Pey los códigos/estados definitivos de cada endpoint, los encabezados Standard Webhooks, la política de reintentos y la semántica exacta de consulta de transacciones.
- Definir los canales externos de notificación. El registro interno de notificaciones no depende de esta decisión.
- Definir la política operativa de recuperación de acceso y el mecanismo final de autenticación/sesión.

Las decisiones pendientes externas se reflejan como contratos/configuración y no deben implementarse mediante supuestos silenciosos.
