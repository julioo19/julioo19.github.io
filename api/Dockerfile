# ---- Etapa 1: build ----
FROM golang:1.27.1-alpine3.24 AS build

WORKDIR /app

# Dependencias primero para aprovechar la caché
COPY go.mod go.sum ./
RUN go mod download

# Código fuente
COPY . .

# Compilamos el binario
RUN CGO_ENABLED=0 GOOS=linux go build -o /app-backend


# ---- Etapa 2: runtime ----
FROM alpine:3.24

# Usuario sin privilegios
RUN addgroup -S app && adduser -S app -G app

WORKDIR /app

# Solo copiamos el binario final
COPY --from=build /app-backend .

# Ejecutar como usuario no root
USER app

EXPOSE 3000

CMD ["./app-backend"]