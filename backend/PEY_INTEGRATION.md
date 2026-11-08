# Integración Pey (backend)

La integración se configura exclusivamente en el backend mediante variables de entorno. Nunca se expone la API key al frontend ni se versionan credenciales.

## Variables

| Variable | Uso | Obligatoria |
|---|---|---|
| `PEY_API_BASE_URL` | URL de API; por defecto `https://api.pey.mx` | No |
| `PEY_API_KEY` | API key Pey enviada como Bearer token | Para invocar Pey |
| `PEY_WEBHOOK_SECRET` | Secreto `whsec_...` para verificar Standard Webhooks | Para recibir webhooks |

En GitHub: **Settings → Secrets and variables → Actions → New repository secret**. Crear `PEY_API_KEY` y, cuando se configure el webhook en el portal de Pey, `PEY_WEBHOOK_SECRET`. No pegar estos valores en issues, commits ni conversaciones.

Para ejecución local, definir las variables en el entorno de la terminal antes de iniciar Spring Boot. Los Repository Secrets de GitHub Actions no se inyectan automáticamente en una ejecución local.

## Funcionalidad implementada

- Servicio de cuentas: registro en Pey una sola vez por CLABE, declaración de titularidad, asociación local y actualización del estado mediante consulta a Pey. Una cuenta ya asociada a otro usuario no se comparte automáticamente.
- Cliente HTTP para registro/consulta de cuentas, CoDi QR/Push y consulta de transacciones.
- API key enviada como Bearer token; timeout de conexión 5 s y respuesta 15 s.
- Servicio que crea solicitudes QR/Push a partir de un `payment_attempt`, valida cuenta destino `ACTIVE`, snapshot de cuenta e importe exacto, y conserva la referencia/respuesta Pey.
- Endpoint `POST /api/webhooks/pey`: conserva el cuerpo original, valida firma y timestamp con el SDK oficial `com.standardwebhooks:standardwebhooks`.
- Inbox persistente de webhooks, idempotencia independiente por `webhook-id` y `transactionId`.
- Cola con bloqueo concurrente `SKIP LOCKED`, reintentos limitados y procesamiento asíncrono.
- Consulta obligatoria de la transacción en Pey antes de liquidar.
- Conciliación transaccional: valida estado `PAID`, método CoDi, tipo QR/Push, MXN, importe, cuenta destino y referencia; crea pago/transacción/asignaciones; actualiza obligaciones y registra auditoría.
- Discrepancias se registran sin asignar fondos a obligaciones.
- Evento `bank.account.updated`: vuelve a consultar el estado de cuenta a Pey y actualiza el estado local.

## Reglas de seguridad y operación

- Una cuenta registrada comienza en `PENDING`; solo `ACTIVE` puede recibir pagos.
- La creación de QR/Push genera una solicitud, no confirma un pago.
- Un webhook solo es una señal; la confirmación requiere consultar y validar la transacción con Pey.
- Las credenciales nunca se comparten con el frontend.
- Pey documenta pruebas en producción con bancos reales; no ejecutar cobros de prueba sin autorización expresa y coordinación previa.

## Límites conocidos antes de habilitar producción

- El servicio de creación de solicitudes es una capa de aplicación; su endpoint HTTP debe integrarse cuando BE-02 (sesión/identidad y autorización contextual) esté listo. No exponerlo con la autenticación HTTP Basic provisional.
- No se hicieron solicitudes reales a Pey ni se generaron cobros.
- La CI valida compilación y pruebas unitarias; falta prueba de integración con PostgreSQL que ejecute V3/V4 y simule la conciliación completa.
- Confirmar el payload final de `bank.account.updated` con Pey en una prueba controlada antes de activar esa ruta en producción.
