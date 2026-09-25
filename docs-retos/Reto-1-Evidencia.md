# Reto 1 - Imagen mínima

## Comparación de tamaños

Se comparó una imagen ingenua de una sola etapa con la imagen final construida mediante un **multi-stage build**.

```text
IMAGE                         ID             DISK USAGE   CONTENT SIZE
guestbook-api-naive:latest    1f9eeadcdb8a        664MB          138MB
julioo19githubio-api:latest   10b0691b1cde       36.8MB         11.9MB
```

La imagen final utiliza **36.8 MB**, frente a los **664 MB** de la versión ingenua.

La mitad de la imagen ingenua es:

```text
664 MB / 2 = 332 MB
```

Por lo tanto:

```text
36.8 MB < 332 MB
```

La imagen multi-stage cumple el requisito de ser menor a la mitad del tamaño de la versión ingenua.

## Docker history - versión ingenua

```text
IMAGE          CREATED          CREATED BY                                      SIZE      COMMENT
1f9eeadcdb8a   14 minutes ago   CMD ["./app-backend"]                           0B        buildkit.dockerfile.v0
<missing>      14 minutes ago   EXPOSE [3000/tcp]                               0B        buildkit.dockerfile.v0
<missing>      14 minutes ago   RUN /bin/sh -c CGO_ENABLED=0 GOOS=linux go b…   156MB     buildkit.dockerfile.v0
<missing>      15 minutes ago   COPY . . # buildkit                             28.7kB    buildkit.dockerfile.v0
<missing>      27 minutes ago   RUN /bin/sh -c go mod download # buildkit       63MB      buildkit.dockerfile.v0
<missing>      27 minutes ago   COPY go.mod go.sum ./ # buildkit                16.4kB    buildkit.dockerfile.v0
<missing>      27 minutes ago   WORKDIR /app                                    8.19kB    buildkit.dockerfile.v0
<missing>      7 days ago       WORKDIR /go                                     4.1kB     buildkit.dockerfile.v0
<missing>      7 days ago       RUN /bin/sh -c mkdir -p "$GOPATH/src" "$GOPA…   16.4kB    buildkit.dockerfile.v0
<missing>      7 days ago       COPY /target/ / # buildkit                      296MB     buildkit.dockerfile.v0
<missing>      7 days ago       ENV PATH=/go/bin:/usr/local/go/bin:/usr/loca…   0B        buildkit.dockerfile.v0
<missing>      7 days ago       ENV GOPATH=/go                                  0B        buildkit.dockerfile.v0
<missing>      7 days ago       ENV GOTOOLCHAIN=local                           0B        buildkit.dockerfile.v0
<missing>      7 days ago       ENV GOLANG_VERSION=1.27.1                       0B        buildkit.dockerfile.v0
<missing>      7 days ago       RUN /bin/sh -c apk add --no-cache ca-certifi…   1.25MB    buildkit.dockerfile.v0
<missing>      7 days ago       CMD ["/bin/sh"]                                 0B        buildkit.dockerfile.v0
<missing>      7 days ago       ADD alpine-minirootfs-3.24.2-x86_64.tar.gz /…   9.08MB    buildkit.dockerfile.v0
```

La versión ingenua contiene el entorno completo de Go, incluyendo el compilador y las herramientas necesarias para realizar el build.

## Docker history - versión final

```text
IMAGE          CREATED         CREATED BY                                      SIZE      COMMENT
10b0691b1cde   26 minutes ago   CMD ["./app-backend"]                           0B        buildkit.dockerfile.v0
<missing>      26 minutes ago   EXPOSE [3000/tcp]                               0B        buildkit.dockerfile.v0
<missing>      26 minutes ago   USER app                                        0B        buildkit.dockerfile.v0
<missing>      26 minutes ago   COPY /app-backend . # buildkit                  15.8MB    buildkit.dockerfile.v0
<missing>      28 minutes ago   WORKDIR /app                                    8.19kB    buildkit.dockerfile.v0
<missing>      28 minutes ago   RUN /bin/sh -c addgroup -S app && adduser -S…   41kB      buildkit.dockerfile.v0
<missing>      7 days ago       CMD ["/bin/sh"]                                 0B        buildkit.dockerfile.v0
<missing>      7 days ago       ADD alpine-minirootfs-3.24.2-x86_64.tar.gz /…   9.08MB    buildkit.dockerfile.v0
```

La imagen final contiene únicamente Alpine y el binario compilado de la aplicación. El compilador de Go, las dependencias de build y las herramientas utilizadas durante la compilación permanecen en la etapa de construcción y no forman parte de la imagen final.
