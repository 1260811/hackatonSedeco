# Documentación de base de datos

Esta carpeta contiene el diseño lógico, físico y las reglas de integridad del sistema de tandas. El motor del MVP es **PostgreSQL 17** y las migraciones se administran con **Flyway**.

## Documentos

- [Modelo lógico](modelo-logico.md): dominios, entidades, relaciones y diagrama ER.
- [Modelo físico](modelo-fisico.md): tablas, columnas, tipos, claves e índices.
- [Reglas de integridad](reglas-integridad.md): reglas garantizadas por PostgreSQL y reglas transaccionales del backend.
- [Estados y transiciones](estados-y-transiciones.md): ciclo de vida de tandas, participaciones, turnos, pagos y cancelaciones.
- [Decisiones de datos](decisiones.md): decisiones confirmadas y parámetros configurables.

## Migraciones

Ubicación: `backend/src/main/resources/db/migration/`

- `V1__create_initial_schema.sql`: esquema inicial de 29 tablas.
- `V2__preserve_turn_accounts_and_enforce_integrity.sql`: snapshot de cuenta receptora por turno, integridad de asociaciones, máximo cinco usuarios por cuenta e idempotencia adicional de webhooks.

**No modificar migraciones ya aplicadas.** Todo cambio posterior debe incorporarse en una nueva versión Flyway.

## Validación local

Desde `backend/`:

```powershell
& "C:\Program Files\JetBrains\IntelliJ IDEA Community Edition 2024.2.3\plugins\maven\lib\maven3\bin\mvn.cmd" clean test
```

La prueba de migración debe ejecutarse también contra una base PostgreSQL vacía y contra la base local que ya tiene V1 aplicada. No borrar ni recrear la base local que contiene datos de trabajo.

## Alcance financiero

Pey gestiona los cobros CoDi. La plataforma no recibe, custodia ni transfiere fondos. Registra obligaciones, solicitudes, eventos, transacciones conciliadas, pagos externos y liquidaciones para seguimiento y trazabilidad.
