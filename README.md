# Sistema de gestión de tandas

Plataforma web para organizar y administrar tandas de ahorro entre varias personas, facilitando la coordinación de participantes, turnos, cuentas receptoras y aportaciones. El sistema busca dar visibilidad al calendario y al estado de los compromisos de cada tanda, además de integrar cobros digitales mediante **Pey y CoDi**.
Link de interfaz
https://hackaton-sedeco.vercel.app/login

Usuario: cualquier correo Contraseña: Combinación de letras y números de 6 valores
## ¿Qué problema resuelve?

La organización de una tanda suele depender de mensajes, acuerdos informales y controles manuales para saber quién participa, cuánto debe aportar, a quién le corresponde recibir y qué pagos ya se realizaron. Esta plataforma centraliza esa información y conserva un historial de los movimientos y acuerdos para que las personas participantes puedan consultar el estado de la tanda con mayor claridad.

## ¿Cómo funciona?

1. **Creación:** una persona organizadora registra una tanda, define el monto de las aportaciones, la periodicidad, el orden de los turnos y las condiciones acordadas.
2. **Invitación y participación:** las personas se incorporan a la tanda y registran o seleccionan la cuenta bancaria que utilizarán para recibir pagos en esa tanda.
3. **Acuerdos y activación:** las personas participantes aceptan las condiciones. La tanda puede mantenerse como borrador mientras se completa; para activarse necesita al menos tres participantes activos.
4. **Turnos y aportaciones:** en cada periodo, el sistema identifica a quién le corresponde recibir y registra las obligaciones y aportaciones de las personas participantes.
5. **Cobro digital:** la integración con Pey permite gestionar solicitudes de pago mediante CoDi. El sistema recibe notificaciones de eventos y consulta a Pey para confirmar el estado de las transacciones antes de actualizar los registros internos.
6. **Seguimiento:** la organización y las personas participantes consultan la información que les corresponde, así como el historial de pagos y movimientos.

## Reglas generales del negocio

- Una persona puede participar en varias tandas y registrar más de una cuenta bancaria.
- Cada participante selecciona explícitamente la cuenta que utilizará en cada tanda.
- Una cuenta bancaria puede estar asociada con hasta cinco usuarios registrados.
- Cada turno tiene una persona receptora y una cuenta receptora definidas a partir de la selección realizada para esa tanda.
- Para activar una tanda se requieren al menos tres participantes activos.
- Las aportaciones se realizan por el monto completo; no se contemplan pagos parciales en el alcance actual.
- La tanda puede establecer una penalización opcional por retraso, fija o porcentual, que debe ser aceptada por todas las personas participantes.
- La cancelación de una tanda activa requiere el acuerdo de todas las personas involucradas y debe contemplar la liquidación o devolución correspondiente según los movimientos existentes.
- Los cambios posteriores a la activación deben conservar el historial y las referencias de los turnos, cuentas y movimientos anteriores.

## Roles y visibilidad

- **Organizador:** administra la tanda y puede consultar sus movimientos y el seguimiento general de las tandas que organiza.
- **Participante:** consulta sus propias obligaciones, aportaciones y pagos dentro de cada tanda, además de la información necesaria para conocer los turnos y acuerdos.

El acceso a la información se limita según la participación y las responsabilidades de cada persona.

## Integración con Pey y CoDi

Pey se utiliza como proveedor de integración para las operaciones de cobro. La aplicación conserva la relación entre sus registros internos y las transacciones reportadas por el proveedor.

Las notificaciones webhook se consideran avisos de que ocurrió un evento, no una confirmación definitiva del pago. Para validar una operación, el backend consulta la información de la transacción mediante la API de Pey. También se contempla la deduplicación de eventos para evitar procesar dos veces una misma notificación o transacción.

La aplicación no debe asumir que una cuenta está habilitada para recibir pagos: se debe validar su estado antes de utilizarla en una solicitud de cobro.

## Tecnologías

- **Frontend:** React + TypeScript.
- **Backend:** Java + Spring Boot, organizado como monolito modular.
- **Base de datos:** PostgreSQL.
- **Integración de pagos:** Pey / CoDi.
- **Infraestructura propuesta para la demo:** Google Cloud.

## Estructura del repositorio

- `frontend/`: aplicación web.
- `backend/`: API y lógica de negocio.
- `docs/`: arquitectura, modelo de datos y contratos API.
- `infraestructure/`: configuración local y de infraestructura.

## Base de datos y ejecución local

La documentación del diseño está en [docs/database](docs/database/README.md). Para iniciar PostgreSQL local con Docker Compose consulta [infraestructure/database](infraestructure/database/README.md).

Las migraciones de Flyway se incorporan en `backend/src/main/resources/db/migration/`.

## Alcance y estado del proyecto

El proyecto se desarrolla por versiones. El objetivo del MVP es contar con el flujo web esencial para crear y administrar una tanda y probar una operación de cobro de extremo a extremo mediante Pey/CoDi. Las funciones descritas representan las reglas y el alcance funcional definidos para el producto; su disponibilidad en la aplicación depende del avance de implementación de cada módulo.

Proyecto en desarrollo.
