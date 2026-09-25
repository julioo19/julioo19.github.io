# ---- Etapa 1: build del sitio con Vite ----
FROM node:22.23.3-alpine3.24 AS build

WORKDIR /app

# Copiamos package.json y el lockfile ANTES que el resto del codigo,
# para aprovechar la cache de Docker (igual que hicimos con go.mod/go.sum).
COPY package.json package-lock.json ./
RUN npm ci

# Copiamos el resto del proyecto. Como el CONTEXTO de este build es la raiz
# del repo (definido en compose.yaml, no aqui), estas rutas son relativas
# a la raiz, no a la carpeta web/.
COPY . .

# Genera la carpeta dist/ con el sitio compilado (HTML/JS/CSS finales).
RUN npm run build

# ---- Etapa 2: nginx sirviendo el resultado ----
FROM nginxinc/nginx-unprivileged:1.30.5-alpine3.24

# Reemplaza la configuracion por defecto de nginx por la nuestra
# (la que define el proxy hacia /api/).
COPY web/nginx.conf /etc/nginx/conf.d/default.conf

# Copia SOLO el resultado compilado desde la etapa de build.
# Node, node_modules, el codigo fuente .tsx, nada de eso llega aqui.
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80