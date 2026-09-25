# Perfil: Julio Cesar Montalvan

Sitio personal publicado en https://julioo19.github.io

## Cómo se publica
Cada push a `main` despliega automáticamente con GitHub Pages.

## Flujo de trabajo
- `main` protegida; todo cambio entra por pull request
- Una rama por cambio: `feature/*`, `fix/*`
- Mensajes de commit en imperativo, ≤ 50 caracteres

## Historial del curso
- **S02**: Sitio inicial, ramas y pull requests

## Lab 02 -- Mi perfil, ahora con Backend:

## Bitacora de decisiones

### Reto 1: Imagen mínima de la API

* **Decisión:** Primero utilicé una imagen base de Go convencional para construir la API. Después cambié a una imagen de Go basada en Alpine, ya que permitió reducir considerablemente el tamaño de la imagen final sin tener que utilizar `scratch` y desprenderme de las herramientas y utilidades que proporciona Alpine.

* **Alternativas que evalué:**

  * **Imagen de Go convencional:** permite trabajar con un entorno más completo y familiar, pero genera una imagen considerablemente más pesada al conservar herramientas y componentes que no son necesarios para ejecutar la aplicación.
  * **Imagen basada en Alpine:** proporciona una base mucho más ligera, manteniendo utilidades básicas del sistema que pueden ser útiles durante la ejecución del contenedor.
  * **`scratch`:** permite crear imágenes extremadamente pequeñas al no incluir un sistema base, pero requiere que la aplicación sea completamente autosuficiente y elimina las herramientas disponibles en una distribución como Alpine.

* **Por qué elegí esta:** Elegí Alpine porque ofrece un buen equilibrio entre tamaño y funcionalidad. La imagen final se redujo considerablemente respecto a la imagen inicial, sin tener que llegar al extremo de utilizar `scratch` y perder las herramientas básicas disponibles en una distribución Linux.

* **Fuentes consultadas:** [Docker Docs — Multi-stage builds](https://docs.docker.com/build/building/multi-stage/) y [Docker Docs — Building best practices](https://docs.docker.com/build/building/best-practices/).

* **Cómo lo verifiqué:** Construí la API utilizando dos versiones del Dockerfile: una correspondiente a la implementación inicial y otra correspondiente a la versión final. Después comparé el tamaño de las imágenes y sus capas utilizando `docker history`.

  La imagen inicial tenía un tamaño aproximado de **664 MB**, mientras que la imagen final basada en Alpine quedó en aproximadamente **36.8 MB**.

* **Qué no me funcionó:** La primera implementación utilizaba una imagen de Go convencional. Aunque la API funcionaba correctamente, el tamaño resultante era demasiado elevado para el objetivo del reto. También consideré utilizar `scratch`, pero finalmente descarté esta alternativa porque implicaba prescindir de las herramientas y utilidades que proporciona Alpine. Esto me llevó a utilizar una imagen basada en Alpine como punto intermedio entre un tamaño reducido y disponer de un entorno de ejecución más completo.


### Reto 2: Arranque ordenado y healthchecks

* **Decisión:** Agregué `healthcheck` a los tres servicios y utilicé `depends_on` con `condition: service_healthy` para controlar el orden de arranque. De esta manera, un servicio dependiente espera a que su dependencia se encuentre saludable antes de continuar.

* **Alternativas que evalué:**

  * **Utilizar únicamente `depends_on`:** permite establecer las dependencias entre servicios, pero por sí solo no garantiza que el servicio ya esté listo para recibir conexiones.
  * **Utilizar `healthcheck` junto con `service_healthy`:** permite comprobar realmente el estado de cada servicio y utilizar esa condición para determinar cuándo puede iniciarse un servicio dependiente.

* **Por qué elegí esta:** Elegí utilizar `healthcheck` junto con `service_healthy` porque permite controlar el arranque basándose en el estado real de los servicios y no únicamente en que el contenedor haya sido iniciado.

* **Fuentes consultadas:** [Docker Docs — Control startup and shutdown order in Compose](https://docs.docker.com/compose/how-tos/startup-order/).

* **Cómo lo verifiqué:** Ejecuté:

  ```bash
  docker compose up -d --wait
  docker compose ps
  ```

  Los servicios iniciaron correctamente y alcanzaron el estado `healthy`.

* **Qué no me funcionó:** No tuve un intento fallido definitivo durante la implementación. La principal dificultad fue definir correctamente los `healthcheck` y el orden de las dependencias entre los servicios. Tuve que considerar qué servicio debía estar disponible primero: la base de datos debía estar saludable antes de que la API pudiera iniciar correctamente, y posteriormente la API debía estar saludable antes de que iniciara el servicio Web. Esto permitió entender la diferencia entre que un contenedor esté ejecutándose y que el servicio que contiene esté realmente listo para ser utilizado.


### Reto 3: Nadie es root

* **Decisión:** Configuré los contenedores para que los procesos de la aplicación no se ejecuten como `root`. En la API creé un usuario y grupo sin privilegios llamado `app`, mientras que para Web utilicé la imagen `nginxinc/nginx-unprivileged`, que está diseñada para ejecutar Nginx con un usuario sin privilegios.

* **Alternativas que evalué:**

  * **Utilizar una imagen de Nginx unprivileged:** permite utilizar una imagen preparada específicamente para ejecutar Nginx sin privilegios de root, reduciendo la necesidad de realizar manualmente toda la configuración del usuario y permisos.
  * **Crear usuarios sin privilegios directamente en el Dockerfile:** permite tener mayor control sobre el usuario utilizado por la aplicación. En la API opté por crear el grupo `app`, crear el usuario `app` y posteriormente establecerlo mediante `USER app`.

* **Por qué elegí esta:** Elegí combinar ambas alternativas según las necesidades de cada servicio. Para Web utilicé `nginxinc/nginx-unprivileged` porque ya proporciona una imagen preparada para ejecutar Nginx sin privilegios. Para la API creé explícitamente el usuario `app`, ya que se trata de una aplicación propia y necesitaba definir directamente el usuario con el que se ejecutaría el binario. Para determinar la forma adecuada de crear el usuario y grupo en la imagen de Go tuve apoyo de IA durante la implementación, y posteriormente verifiqué por mi cuenta el usuario efectivo de los procesos y contenedores.

* **Fuentes consultadas:** [Docker Docs — Dockerfile reference](https://docs.docker.com/reference/dockerfile/), especialmente la instrucción `USER`, y [NGINX — nginx-unprivileged](https://github.com/nginx/docker-nginx-unprivileged). También utilicé apoyo de IA como referencia durante la creación del usuario y grupo de la API.

* **Cómo lo verifiqué:** Ejecuté:

  ```bash
  for s in web api db; do docker compose exec $s whoami; done
  ```

  Obtuve:

  ```text
  nginx
  app
  root
  ```

  En el caso de la base de datos, la ejecución de `whoami` mediante `docker compose exec` devolvía `root`, por lo que también comprobé los procesos internos del contenedor con:

  ```bash
  docker compose exec db ps aux
  ```

  Allí comprobé que el proceso principal de PostgreSQL se ejecutaba como `postgres`.

* **Qué no me funcionó:** La primera comprobación con `docker compose exec db whoami` mostró `root`, lo que inicialmente podía parecer un incumplimiento del requisito. Al revisar los procesos del contenedor comprobé que `docker compose exec` estaba ejecutando el comando de diagnóstico como `root`, mientras que el proceso real de PostgreSQL se ejecutaba como `postgres`. Esto permitió distinguir entre el usuario utilizado para ejecutar un comando dentro del contenedor y el usuario con el que se ejecuta realmente el servicio.

### Reto 4: Red segmentada

* **Decisión:** Separé la comunicación en dos redes Docker: `frontend`, utilizada por Web y API, y `backend`, utilizada por API y DB. La API funciona como punto intermedio entre ambas.

* **Alternativas que evalué:**

  * **Una única red para los tres servicios:** simplifica la configuración y permite que todos los contenedores se comuniquen directamente, pero no limita la comunicación entre servicios.
  * **Dos redes segmentadas:** requiere configurar explícitamente las redes, pero permite impedir que Web tenga acceso directo a DB.

* **Por qué elegí esta:** Elegí utilizar dos redes segmentadas porque era un requisito planteado en el reto y quería conseguir que la comunicación entre los servicios estuviera limitada según sus necesidades. De esta manera, Web puede comunicarse con API, API puede comunicarse con DB, pero Web no puede comunicarse directamente con DB.

* **Fuentes consultadas:** [Docker Docs — Networking in Compose](https://docs.docker.com/compose/how-tos/networking/). La documentación explica cómo definir redes personalizadas y cómo conectar servicios únicamente a las redes que necesitan.

* **Cómo lo verifiqué:** Comprobé que API puede resolver el nombre de DB:

  ```bash
  docker compose exec api getent hosts db
  ```

  Resultado:

  ```text
  172.18.0.2 db db
  ```

  También comprobé desde Web:

  ```bash
  docker compose exec web getent hosts db
  ```

  No se obtuvo ninguna resolución, demostrando que Web no tiene acceso a la red `backend`.

  Además, `docker compose ps` mostró que únicamente Web tiene un puerto publicado hacia el host:

  ```text
  api   3000/tcp
  db    5432/tcp
  web   80/tcp, 0.0.0.0:8080->8080/tcp
  ```

* **Qué no me funcionó:** El comando `getent hosts db` ejecutado desde Web no devolvió una dirección IP. Inicialmente podía interpretarse como un problema de conectividad, pero era precisamente el comportamiento esperado debido a la segmentación de redes. La prueba permitió comprobar que Web no puede resolver directamente a DB.


### Reto 5: Publicación de imágenes en GHCR

* **Decisión:** Publiqué las imágenes `perfil-web:1.0` y `perfil-api:1.0` en GitHub Container Registry utilizando el namespace de GitHub y el tag fijo `1.0`. Configuré ambos paquetes como públicos y comprobé que podían descargarse sin autenticación.

* **Alternativas que evalué:**

  * **Docker Hub:** es un registro ampliamente utilizado y permite publicar imágenes Docker, pero el requisito del laboratorio especificaba GitHub Container Registry.
  * **GitHub Container Registry (GHCR):** está integrado con GitHub y permite publicar los paquetes bajo `ghcr.io`, cumpliendo directamente con el formato solicitado por el laboratorio.

* **Por qué elegí esta:** Elegí GitHub Container Registry porque cumple con el formato solicitado por el reto y permite almacenar las imágenes asociadas a mi cuenta de GitHub. Además, permite configurar las imágenes como públicas para que puedan descargarse sin autenticación.

* **Fuentes consultadas:** Me guié por la **clase que grabe de la sesión anterior**, la **guía proporcionada en el GitHub del curso** y la documentación oficial de GitHub: [Trabajar con el registro de contenedores](https://docs.github.com/es/packages/working-with-a-github-packages-registry/working-with-the-container-registry).

* **Cómo lo verifiqué:** Publiqué las imágenes con `docker push` y posteriormente cerré sesión en GHCR con:

  ```bash
  docker logout ghcr.io
  ```

  Después comprobé que las imágenes podían descargarse utilizando:

  ```bash
  docker pull ghcr.io/julioo19/perfil-web:1.0
  docker pull ghcr.io/julioo19/perfil-api:1.0
  ```

  Las descargas se realizaron sin autenticación, verificando que ambas imágenes estaban configuradas como públicas.

* **Qué no me funcionó:** No tuve un fallo definitivo durante la publicación. Sí fue necesario realizar primero el inicio de sesión en GHCR mediante un Personal Access Token con los permisos necesarios para poder realizar el `push`. Después de publicar las imágenes, cerré sesión para comprobar específicamente el requisito de descarga pública sin autenticación.


### Reto 6: Cero secretos y arranque automático

* **Decisión:** Mantengo `.env` fuera del repositorio y utilizo `.env.example` como plantilla. El `postCreateCommand` genera automáticamente `.env` al crear el Codespace y el `postStartCommand` ejecuta Docker Compose.

* **Alternativas que evalué:**

  * **Guardar las credenciales directamente en el repositorio:** permitiría que Compose funcionara inmediatamente, pero expondría las credenciales y no cumpliría el requisito de seguridad.
  * **Utilizar Codespaces Secrets:** evitaría almacenar una credencial en Git, pero el secreto dependería de la configuración de la cuenta del desarrollador y no estaría disponible automáticamente para un evaluador que cree su propio Codespace.
  * **Usar `.env.example` + `postCreateCommand`:** permite mantener `.env` fuera de Git y al mismo tiempo generar automáticamente una configuración de desarrollo en un Codespace nuevo.

* **Por qué elegí esta:** Elegí utilizar `.env.example` junto con `postCreateCommand` porque me permitió resolver de manera rápida el problema planteado por el reto: mantener `.env` fuera del repositorio y, al mismo tiempo, generar automáticamente un `.env` cuando se inicia un Codespace. De esta manera, el entorno queda preparado para ejecutar Docker Compose sin tener que crear manualmente el archivo. Considero que esta solución es adecuada para el entorno de desarrollo del laboratorio, aunque posiblemente no sea la alternativa más recomendable para un entorno real o de producción, donde sería preferible utilizar un sistema de gestión de secretos o credenciales proporcionadas de forma segura por el entorno.

* **Fuentes consultadas:** Docker Docs — variables de entorno en Compose y documentación de GitHub Codespaces sobre configuración de Dev Containers. También se utilizó la guía y material proporcionado durante el laboratorio para comprender el funcionamiento de `.env`, `.env.example` y la configuración automática del Codespace.

* **Cómo lo verifiqué:** Comprobé que `.env` está ignorado:

  ```bash
  git check-ignore -v .env
  ```

  Resultado:

  ```text
  .gitignore:25:.env      .env
  ```

  También comprobé que nunca apareció en el historial:

  ```bash
  git log --all --full-history -- .env
  ```

  El comando no produjo ninguna salida.

  Finalmente, revisé `.devcontainer/devcontainer.json` y confirmé:

  ```json
  "postCreateCommand": "cp .env.example .env",
  "postStartCommand": "docker compose up -d"
  ```

  También revisé las capas de las imágenes mediante `docker history` y no se encontraron las credenciales de la base de datos.

* **Qué no me funcionó:** No tuve un fallo definitivo con la solución final. La principal alternativa descartada fue depender de un Codespaces Secret, ya que el secreto estaría asociado al entorno del usuario y no garantizaría que un evaluador pudiera crear un Codespace funcional sin configuración adicional. La solución final fue utilizar una credencial de desarrollo de ejemplo mediante `.env.example` y generar automáticamente `.env` al crear el Codespace.

### Comentario adicional  
**Problema de comunicación en el primer Codespace: En el primer Codespace que utilicé se presentó un problema de comunicación con la API. Para solucionarlo ejecuté:**

  ```bash
sudo iptables-legacy -I FORWARD 1 -j ACCEPT
 ```

 Este comando agrega como primera regla de FORWARD una regla que permite todo el tráfico reenviado.

Para este lab, probablemente permitió que el tráfico de Docker pudiera atravesar/retransmitirse entre las redes o interfaces

Después de ejecutar este comando, la comunicación con la API funcionó correctamente. Al utilizar otros Codespaces, este problema no volvió a presentarse y no fue necesario ejecutar nuevamente el comando.

