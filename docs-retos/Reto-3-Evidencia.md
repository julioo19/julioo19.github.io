# Reto 3: Nadie es root

## `whoami`

```text
@julioo19 ➜ /workspaces/julioo19.github.io (main) $ for s in web api db; do docker compose exec $s whoami; done
nginx
app
root
```

Web y API se ejecutan con usuarios sin privilegios. PostgreSQL devuelve `root` mediante `docker compose exec` debido al usuario utilizado para ejecutar el comando, por lo que se verificó directamente el usuario del proceso de PostgreSQL.

## Usuario del proceso de PostgreSQL

```text
@julioo19 ➜ /workspaces/julioo19.github.io (main) $ docker compose exec db ps aux
PID   USER     TIME  COMMAND
    1 postgres  0:00 postgres
   25 postgres  0:00 postgres: checkpointer
   26 postgres  0:00 postgres: background writer
   28 postgres  0:00 postgres: walwriter
   29 postgres  0:00 postgres: autovacuum launcher
   30 postgres  0:00 postgres: logical replication launcher
   45 postgres  0:00 postgres: app libro 172.18.0.3(38418) idle
  161 root      0:00 ps aux
```

El proceso principal de PostgreSQL (`PID 1`) y sus procesos asociados se ejecutan con el usuario `postgres`. El usuario `root` corresponde únicamente al comando `ps aux` ejecutado mediante `docker compose exec`.
