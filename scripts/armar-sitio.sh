#!/usr/bin/env bash
# Compila el sitio con Vite y deja en _site/ SOLO lo publico.
set -euo pipefail

npm run build
rm -rf _site
cp -r dist _site