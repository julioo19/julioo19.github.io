# B5: Imágenes publicadas

## Publicación en GitHub Container Registry

Las imágenes del proyecto fueron publicadas en GitHub Container Registry (GHCR) utilizando el tag fijo `1.0`.

Los paquetes pueden consultarse desde el perfil de GitHub:

https://github.com/julioo19?tab=packages

## Flujo de publicación

Primero se realizó la autenticación en GHCR utilizando un Personal Access Token con permisos para paquetes:

```bash
echo $CR_PAT | docker login ghcr.io -u julioo19 --password-stdin
```

Resultado:

```text
Login Succeeded
```

Posteriormente, se construyeron las imágenes utilizando los nombres correspondientes al registro:

```bash
docker build -t ghcr.io/julioo19/perfil-web:1.0 -f web/Dockerfile .
docker build -t ghcr.io/julioo19/perfil-api:1.0 ./api
```

Se verificó la existencia de las imágenes:

```bash
docker images
```

Resultado relevante:

```text
ghcr.io/julioo19/perfil-api:1.0   cf16a19b8f6b   36.8MB
ghcr.io/julioo19/perfil-web:1.0   7239bc228bd0   81.9MB
```

Luego se publicaron ambas imágenes en GHCR:

```bash
docker push ghcr.io/julioo19/perfil-api:1.0
docker push ghcr.io/julioo19/perfil-web:1.0
```

El `push` de `perfil-api` generó el digest:

```text
sha256:cf16a19b8f6b8a30df7f4294dee87f45c601bd2552c263d325f06af0e2cf0b04
```

El `push` de `perfil-web` generó el digest:

```text
sha256:7239bc228bd0277a8cc33dc59acce8c00c54bdc3da8e467b78f36fa92a124bf7
```

Finalmente, se cerró la sesión de GHCR:

```bash
docker logout ghcr.io
```

Resultado:

```text
Removing login credentials for ghcr.io
```

## Verificación de descarga sin autenticación

Con la sesión de GHCR cerrada, se comprobó que las imágenes podían descargarse nuevamente desde el registro:

```bash
docker pull ghcr.io/julioo19/perfil-web:1.0
docker pull ghcr.io/julioo19/perfil-api:1.0
```

Ambas imágenes se descargaron correctamente sin autenticación, demostrando que los paquetes son públicos.

Para `perfil-web:1.0`, se obtuvo:

```text
Status: Downloaded newer image for ghcr.io/julioo19/perfil-web:1.0
```

El digest obtenido coincidió con el generado durante el `docker push`:

```text
sha256:7239bc228bd0277a8cc33dc59acce8c00c54bdc3da8e467b78f36fa92a124bf7
```

## Resultado

Se cumple el requisito de B5:

* `ghcr.io/julioo19/perfil-web:1.0` está publicado en GHCR.
* `ghcr.io/julioo19/perfil-api:1.0` está publicado en GHCR.
* Ambas imágenes utilizan el tag fijo `1.0`.
* Ambas imágenes son públicas.
* Ambas pueden descargarse mediante `docker pull` sin autenticación.
