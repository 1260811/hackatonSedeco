# PostgreSQL local para el proyecto de tandas

Esta configuración levanta PostgreSQL localmente con Docker Compose. Los datos se conservan en un volumen de Docker aunque se detenga o recree el contenedor.

## Requisitos

- Docker Desktop instalado y ejecutándose.
- Docker Compose disponible (`docker compose version`).

## Preparación

1. Copia `.env.example` y renombra la copia a `.env`.
2. Cambia `POSTGRES_PASSWORD` por una contraseña local.
3. Desde esta carpeta ejecuta:

```powershell
docker compose up -d
```

4. Comprueba el estado:

```powershell
docker compose ps
docker compose logs postgres
```

## Detener y volver a iniciar

```powershell
docker compose down
docker compose up -d
```

`docker compose down` conserva el volumen y los datos.

## Borrar la base local desde cero

**Esto elimina permanentemente los datos locales del contenedor:**

```powershell
docker compose down -v
```

No ejecutes ese comando si necesitas conservar información de prueba.

## Conexión desde Spring Boot

- Host: `localhost`
- Puerto: `5432`
- Base de datos: `tandas_demo`
- Usuario: `tandas_app`
- Contraseña: la definida en `.env`

Agrega el driver JDBC de PostgreSQL a las dependencias del backend. La plantilla `backend-config/application-local.yml` muestra la configuración de conexión y Flyway. Copia sus propiedades a la configuración real del proyecto cuando exista la estructura Spring Boot.

Para ejecutar Spring Boot con el perfil local, configura `DB_PASSWORD` con la misma contraseña de `.env` y activa el perfil `local`.

## Decisiones de esta configuración

- PostgreSQL 17 en imagen Alpine.
- Puerto enlazado únicamente a `127.0.0.1` para no exponerlo a la red.
- Volumen persistente `postgres_data`.
- Flyway queda habilitado como mecanismo de migraciones, pero todavía no se incluyen scripts SQL.
- No contiene credenciales de Pey ni credenciales de Google Cloud.
