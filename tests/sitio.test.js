import { describe, it, expect, beforeAll } from 'vitest'
import { readFileSync, existsSync, readdirSync } from 'node:fs'
import { join, extname } from 'node:path'
import { JSDOM } from 'jsdom'

const SITIO = '_site'          // la carpeta que arma el job build
let doc

beforeAll(() => {
  const html = readFileSync(`${SITIO}/index.html`, 'utf-8')
  doc = new JSDOM(html).window.document
})

describe('index.html', () => {
  it('tiene un título', () => {
    expect(doc.title.trim()).not.toBe('')
  })

  it('tiene el contenedor raíz de React', () => {
    expect(doc.querySelector('#root')).not.toBeNull()
  })

  it('todas las imágenes tienen texto alternativo', () => {
    const sinAlt = [...doc.querySelectorAll('img')].filter((img) => !img.getAttribute('alt'))
    expect(sinAlt).toHaveLength(0)
  })

  it('los archivos locales que usa la página existen', () => {
    const rutas = [...doc.querySelectorAll('script[src], link[rel="stylesheet"], img[src]')]
      .map((el) => el.getAttribute('src') ?? el.getAttribute('href'))
      .filter((ruta) => !/^(https?:)?\/\//.test(ruta))   // ignora lo que viene de Internet
    for (const ruta of rutas) {
      expect(existsSync(`${SITIO}/${ruta}`), `falta ${ruta}`).toBe(true)
    }
  })
})

describe('el sitio que se publica', () => {
  it('no incluye archivos internos del repositorio', () => {
    for (const interno of ['compose.yaml', '.env.example', 'api', 'db', 'tests']) {
      expect(existsSync(`${SITIO}/${interno}`), `${interno} no debería publicarse`).toBe(false)
    }
  })
})

describe('pruebas propias del portfolio', () => {
  it('declara el idioma español', () => {
    expect(doc.documentElement.getAttribute('lang')).toBe('es')
  })

  it('declara el charset UTF-8', () => {
    const charset = doc.querySelector('meta[charset]')
    expect(charset?.getAttribute('charset')?.toLowerCase()).toBe('utf-8')
  })

  it('incluye la etiqueta viewport para dispositivos móviles', () => {
    const viewport = doc.querySelector('meta[name="viewport"]')
    expect(viewport).not.toBeNull()
    expect(viewport?.getAttribute('content')).toContain('width=device-width')
  })

  it('el bundle publicado contiene mi nombre', () => {
    const archivos = readdirSync(`${SITIO}/assets`).filter((f) => f.endsWith('.js'))
    const js = archivos.map((f) => readFileSync(`${SITIO}/assets/${f}`, 'utf-8')).join('')
    expect(js).toContain('JULIO CESAR')
  })

  it('no contiene referencias a localhost en los archivos publicados', () => {
    const extensiones = new Set(['.html', '.js', '.css'])

    function obtenerArchivos(carpeta) {
      return readdirSync(carpeta, { withFileTypes: true }).flatMap((entrada) => {
        const ruta = join(carpeta, entrada.name)

        if (entrada.isDirectory()) {
          return obtenerArchivos(ruta)
        }

        return [ruta]
      })
    }

    const archivos = obtenerArchivos(SITIO)
      .filter((ruta) => extensiones.has(extname(ruta)))

    for (const archivo of archivos) {
      const contenido = readFileSync(archivo, 'utf-8')

      expect(
        contenido,
        `Se encontró localhost en ${archivo}`
      ).not.toMatch(/localhost|127\.0\.0\.1/i)
    }
  })
})