# Contratos de API

## Propósito

Este directorio contiene la fuente de verdad de los contratos HTTP entre la aplicación web y la API del sistema de gestión de tandas.

El contrato se mantiene en OpenAPI 3.1. Los cambios que afecten rutas, payloads, respuestas, estados o reglas observables por el cliente deben actualizar esta especificación y coordinarse mediante los issues de frontend y backend.

## Archivos

- **openapi.yaml**: especificación OpenAPI de la API propia del sistema.
- Este README: alcance, convenciones, decisiones y pendientes del contrato.

## Principios del contrato

1. **El contrato describe la API propia**, no replica directamente los endpoints de Pey. La integración con Pey permanece detrás del adaptador del backend.
2. **Los identificadores son opacos** para el cliente. El cliente no debe construir IDs ni inferir relaciones a partir de ellos.
3. **Los importes monetarios se representan como cadenas decimales** en JSON para evitar errores de precisión. La moneda del MVP es MXN.
4. **Las fechas se expresan en ISO 8601**, con zona horaria cuando representen instantes.
5. **Los errores tienen una estructura uniforme** basada en un código estable, mensaje y detalles opcionales.
6. **La autorización se valida en backend** para cada recurso y operación. Ocultar controles en frontend no sustituye autorización.
7. Las operaciones financieras deben ser idempotentes cuando corresponda y conservar trazabilidad.

## Reglas de negocio que el contrato debe respetar

- Una tanda requiere al menos tres personas distintas para activarse.
- Una persona puede tener más de una participación en una misma tanda; por ello, una participación tiene identidad propia y no se identifica únicamente por usuario y tanda.
- Cada participación selecciona explícitamente la cuenta bancaria que utilizará en esa tanda.
- Una cuenta bancaria puede asociarse como máximo a cinco usuarios registrados.
- Cada turno tiene una sola participación receptora y utiliza la cuenta seleccionada por esa participación.
- La selección de posiciones se consolida antes de activar la tanda; los espacios vacíos se compactan y la configuración final debe ser confirmada por la organización.
- Todas las participaciones activas deben aceptar la versión vigente del convenio antes de activar la tanda.
- Las sanciones son opcionales. Si se configuran, el convenio define tipo, valor, periodo de gracia y periodicidad. Se generan por cada periodo de retraso conforme al convenio aceptado.
- No se permiten aportaciones parciales.
- Las solicitudes QR y Push se generan por el importe exacto de la obligación.
- Una solicitud de pago conserva la cuenta bancaria destinataria con la que fue creada. Cambiar la cuenta seleccionada no modifica solicitudes ya emitidas.
- Un webhook de Pey es una notificación para iniciar la verificación; no constituye por sí mismo confirmación del pago. El backend consulta/verifica la transacción antes de liquidar la obligación.
- Pagos, obligaciones, solicitudes, intentos y transacciones externas son conceptos distintos.
- La cancelación de una tanda activa requiere acuerdo de todas las personas involucradas. La liquidación de fondos al cancelar requiere una regla de negocio adicional antes de implementar el flujo completo.
- El abandono no elimina participaciones, obligaciones ni historial. Las sustituciones y reasignaciones deben quedar auditadas.

## Convenciones HTTP

- Prefijo actual: `/api/v1`.
- JSON: `application/json`.
- Autenticación prevista: Bearer token. El mecanismo definitivo de emisión y renovación de credenciales sigue pendiente de aprobación.
- Los endpoints protegidos requieren identidad autenticada y autorización contextual a la tanda y participación.
- Los listados deben poder paginarse; el esquema de paginación se uniformará antes de cerrar los contratos de consulta.
- Las operaciones que creen solicitudes o recursos aceptarán una clave de idempotencia cuando el riesgo de duplicación lo justifique.
- No se exponen credenciales Pey, secretos de webhook ni datos sensibles de configuración al frontend.

## Códigos de error

Los clientes deben tomar decisiones con el campo `code`, no analizar el texto de `message`.

Códigos iniciales previstos:

- `VALIDATION_ERROR`: datos de entrada inválidos.
- `UNAUTHENTICATED`: falta autenticación válida.
- `FORBIDDEN`: el usuario no tiene permiso para la operación.
- `NOT_FOUND`: recurso inexistente o no visible para el usuario.
- `CONFLICT`: transición de estado no permitida o conflicto de concurrencia.
- `BUSINESS_RULE_VIOLATION`: regla de negocio incumplida.
- `PAYMENT_REQUIRES_REVIEW`: movimiento que requiere conciliación manual.
- `INTERNAL_ERROR`: error inesperado.

## Estado del documento

Esta es una primera línea base para coordinación frontend/backend, no una declaración de que todos los flujos estén cerrados. Los campos, transiciones y respuestas marcados como pendientes deben validarse en los issues antes de implementar el comportamiento definitivo.

### Decisiones pendientes que afectan contratos

1. Mecanismo definitivo de autenticación, recuperación y renovación de sesión.
2. Definición exacta del inicio del periodo de cobro para permitir o bloquear cambios de cuenta.
3. Reglas completas de abandono, sustitución de obligaciones y reasignación de turnos.
4. Fórmula de devolución/liquidación al cancelar una tanda activa.
5. Versionado y flujo de modificación del convenio después de su aceptación.
6. Política de paginación, filtros y ordenamiento común.
7. Reglas de expiración y reintento de solicitudes QR/Push, separadas de los reintentos internos de procesamiento de webhooks.
8. Campos exactos y estados finales que devuelve Pey para cada operación, a validar contra la versión de su OpenAPI usada por el adaptador.

## Flujo de cambios

1. Identificar el issue funcional afectado.
2. Actualizar primero este contrato cuando cambie la interfaz compartida.
3. Revisar compatibilidad hacia atrás y documentar cambios incompatibles.
4. Alinear implementación y pruebas de frontend/backend con la misma versión.
5. Mantener ejemplos de request/response y errores para operaciones financieras críticas.

Issue de seguimiento: [DOC-03 - Definir contratos API compartidos entre frontend y backend](https://github.com/1260811/hackatonSedeco/issues/23).
