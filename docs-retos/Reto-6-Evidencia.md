# Reto 6: Cero secretos... y aun así arranca solo

## Objetivo

Garantizar que las credenciales utilizadas por el entorno de desarrollo no sean almacenadas en el repositorio ni incorporadas a las imágenes Docker, pero que un Codespace nuevo pueda iniciar el proyecto automáticamente sin intervención manual.

---

## 1. Verificación de `.env`

El archivo `.env` contiene las variables utilizadas por Docker Compose, pero se encuentra excluido del control de versiones mediante `.gitignore`.

Se verificó con:

```bash
git check-ignore -v .env
```

Resultado:

```text
.gitignore:25:.env      .env
```

Esto confirma que `.env` está siendo ignorado por Git.

También se verificó que `.env` nunca haya formado parte del historial del repositorio:

```bash
git log --all --full-history -- .env
```

El comando no produjo ninguna salida, por lo que no existen registros de `.env` en el historial de Git.

Además, mediante:

```bash
git status --ignored
```

se comprobó que `.env` existe localmente pero permanece ignorado:

```text
Ignored files:
  .env

nothing to commit, working tree clean
```

---

## 2. Archivo `.env.example`

Para proporcionar una configuración inicial sin almacenar el archivo `.env` real, el repositorio contiene `.env.example`:

```text
DB_NAME=libro
DB_USER=app
DB_PASSWORD=cambia_esto
```

El valor `cambia_esto` corresponde a una credencial de desarrollo de ejemplo y no a una contraseña real utilizada como secreto de producción.

De esta manera, cualquier desarrollador puede obtener una configuración inicial sin que el repositorio tenga que almacenar las credenciales locales reales.

---

## 3. Creación automática del `.env` en Codespaces

El archivo `.devcontainer/devcontainer.json` contiene:

```json
"postCreateCommand": "cp .env.example .env",
"postStartCommand": "docker compose up -d"
```

Esto permite resolver la aparente contradicción entre:

* no almacenar `.env` en Git;
* y necesitar `.env` para ejecutar Docker Compose automáticamente.

El flujo es:

```text
Creación del Codespace
        ↓
postCreateCommand
        ↓
cp .env.example .env
        ↓
Se crea el .env local
        ↓
postStartCommand
        ↓
docker compose up -d
        ↓
Servicios iniciados
```

Por lo tanto, `.env` se genera localmente dentro del Codespace y nunca necesita ser incluido en el repositorio.

---

## 4. Sustitución de variables en Docker Compose

El proyecto utiliza variables de entorno mediante la sintaxis `${VARIABLE}` en `compose.yaml`.

Por ejemplo:

```yaml
environment:
  POSTGRES_DB: ${DB_NAME}
  POSTGRES_USER: ${DB_USER}
  POSTGRES_PASSWORD: ${DB_PASSWORD}
```

Docker Compose obtiene estas variables desde el entorno de ejecución, incluyendo el archivo `.env` generado automáticamente.

De esta forma, la contraseña no necesita estar escrita directamente en el `Dockerfile` ni en el archivo `compose.yaml`.

### Diferencia con `env_file`

`env_file` es una opción de Compose utilizada para proporcionar variables de entorno a un contenedor.

En este proyecto se utiliza directamente la sustitución de variables:

```yaml
${DB_PASSWORD}
```

Por ello, `.env` funciona como fuente de valores para Compose, sin necesidad de declarar `env_file`.

---

## 5. Por qué no se utiliza `ENV PASSWORD=...` en el Dockerfile

Una alternativa incorrecta sería colocar una contraseña directamente en un Dockerfile:

```dockerfile
ENV PASSWORD=mi_contraseña
```

Esto no es apropiado para manejar secretos porque el valor puede quedar registrado como parte de la configuración de una imagen y ser visible mediante herramientas como:

```bash
docker history --no-trunc <imagen>
```

Además, cualquier persona que obtenga la imagen podría inspeccionar información asociada a sus capas y configuración.

Por esta razón, las credenciales no se incorporan al proceso de construcción de las imágenes.

En este proyecto, las credenciales se proporcionan durante la ejecución mediante Docker Compose.

---

## 6. Verificación de las capas de las imágenes

Se revisó el historial completo de las imágenes mediante:

```bash
docker history --no-trunc ghcr.io/julioo19/perfil-api:1.0
```

y:

```bash
docker history --no-trunc ghcr.io/julioo19/perfil-web:1.0
```

También se revisó la imagen de PostgreSQL utilizada por el servicio de base de datos:

```bash
docker history --no-trunc julioo19githubio-db:latest
```

En los historiales revisados no aparecen valores correspondientes a:

```text
DB_PASSWORD
POSTGRES_PASSWORD
PASSWORD
```

La imagen de API muestra únicamente las instrucciones necesarias para construir y ejecutar el binario, mientras que la imagen Web contiene las instrucciones correspondientes a Nginx y los archivos estáticos generados.

La imagen de base de datos corresponde a la imagen PostgreSQL personalizada del proyecto y sus scripts de inicialización, sin incorporar la contraseña utilizada por Compose.


