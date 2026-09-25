# Reto 2: Arranque ordenado

## `docker compose up -d --wait`

```text
@julioo19 ➜ /workspaces/julioo19.github.io (chore/reto-b2) $ docker compose up -d --wait
[+] Running 5/5
 ✔ Network julioo19githubio_backend   Created                                                                                         0.0s 
 ✔ Network julioo19githubio_frontend  Created                                                                                         0.0s 
 ✔ Container julioo19githubio-db-1    Healthy                                                                                        11.3s 
 ✔ Container julioo19githubio-api-1   Healthy                                                                                        11.3s 
 ✔ Container julioo19githubio-web-1   Healthy
```

Los tres servicios finalizaron su arranque en estado `Healthy`.

La secuencia de dependencias configurada es:

```text
DB → API → Web
```

* DB debe estar `healthy` antes de iniciar la API.
* API debe estar `healthy` antes de iniciar Web.

## `docker compose config`

```text
@julioo19 ➜ /workspaces/julioo19.github.io/docs-retos (chore/reto-b2) $ docker compose config
name: julioo19githubio
services:
  api:
    build:
      context: /workspaces/julioo19.github.io/api
      dockerfile: Dockerfile
    depends_on:
      db:
        condition: service_healthy
        required: true
    environment:
      DB_HOST: db
      DB_NAME: libro
      DB_PASSWORD: cambia_esto
      DB_PORT: "5432"
      DB_USER: app
      PORT: "3000"
    healthcheck:
      test:
        - CMD
        - wget
        - -q
        - -O
        - '-'
        - http://localhost:3000/api/health
      timeout: 5s
      interval: 5s
      retries: 5
      start_period: 5s

  db:
    build:
      context: /workspaces/julioo19.github.io/db
      dockerfile: Dockerfile
    environment:
      POSTGRES_DB: libro
      POSTGRES_PASSWORD: cambia_esto
      POSTGRES_USER: app
    healthcheck:
      test:
        - CMD-SHELL
        - pg_isready -U $$POSTGRES_USER -d $$POSTGRES_DB
      timeout: 5s
      interval: 5s
      retries: 5
      start_period: 5s

  web:
    build:
      context: /workspaces/julioo19.github.io
      dockerfile: web/Dockerfile
    depends_on:
      api:
        condition: service_healthy
        required: true
    healthcheck:
      test:
        - CMD
        - wget
        - -q
        - -O
        - /dev/null
        - http://127.0.0.1:8080/
      timeout: 5s
      interval: 5s
      retries: 5
      start_period: 5s
```

La configuración confirma el uso de `condition: service_healthy` para controlar el arranque de las dependencias y los `healthcheck` de los tres servicios.
