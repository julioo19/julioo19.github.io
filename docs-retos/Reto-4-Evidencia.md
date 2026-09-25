# Reto 4: Red segmentada

## Verificación de resolución entre servicios

Desde `web`, se intentó resolver el nombre del servicio `db`:

```bash
docker compose exec web getent hosts db
```

No se obtuvo ninguna respuesta, por lo que `db` no es resoluble desde `web`.

Desde `api`, se realizó la misma prueba:

```bash
docker compose exec api getent hosts db
```

Resultado:

```text
172.18.0.2        db  db
```

Esto confirma que `api` sí puede resolver y comunicarse con `db`.

## Verificación de puertos publicados

Se ejecutó:

```bash
docker compose ps
```

Resultado relevante:

```text
SERVICE   PORTS
api       3000/tcp
db        5432/tcp
web       80/tcp, 0.0.0.0:8080->8080/tcp, [::]:8080->8080/tcp
```

Solo `web` publica un puerto hacia el host mediante `8080:8080`. Los servicios `api` y `db` no publican sus puertos hacia el host.

## Conclusión

La red se encuentra segmentada mediante dos redes:

* `frontend`: conecta `web` con `api`.
* `backend`: conecta `api` con `db`.

De esta manera, `web` no puede resolver directamente `db`, mientras que `api` sí puede acceder a la base de datos. Además, únicamente `web` expone un puerto hacia el host.
