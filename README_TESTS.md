# Testing Setup for Multibiz SPA

This project includes **unit tests** for the `Store` module using **Vitest** + **jsdom**. 

## Scripts de prueba disponibles

| Script | Descripción |
|--------|-------------|
| `npm run test:unit` | Ejecuta tests unitarios con Vitest (en modo headless) |
| `npm run test:unit:watch` | Ejecuta tests unitarios en watch mode (re-ejecuta en cambios) |
| `npm run test:unit:ui` | Ejecuta tests con UI (si tienes `vitest-ui` instalado) |

## Requisitos previos

1. **Node.js** (>= 18) instalado localmente.
2. **Git** para clonar el repositorio.
3. **Cuenta en GitHub** (opcional, si lo estás alojando en GitHub Pages).

## Pasos para instalar y correr tests

### 1. Clonar el repositorio

```bash
cd "C:\Users\YULI´s\Downloads\Prueba_SaaS"
# Si ya lo tienes, actualiza:
# git pull origin main
```

### 2. Instalar dependencias (solo desarrollo)

```bash
npm install
# Esto instalará vite, vitest, jsdom, etc.
```

### 21. Probar localmente

```bash
# Test en modo headless (válido para CI/CD)
npm run test:unit

# Test en watch mode (útil durante desarrollo)
npm run test:unit:watch

# Test con UI (opcional, se necesita vite-plugin-test-ui)
# npm run test:unit:ui
```

### 3. Para el despliegue (GitHub Pages)

El directorio `tests/` es **stático** (contenido solo para pruebas) y NO es requerido por el sitio web.
Puedes mantenerlo en el repo para contribuir, pero no es necesario para la producción.

## Scripts de prueba detallados

### `package.json`

```json
{
  "name": "multibiz-panel",
  "version": "1.0.0",
  "scripts": {
    "start": "npx serve",
    "test:unit": "vitest",
    "test:unit:watch": "vitest --watch",
    "test:unit:ui": "vitest --ui"
  },
  "devDependencies": {
    "vite": "^5.0.0",
    "vitest": "^1.0.0",
    "jsdom": "^22.0.0",
    "@vitest/ui": "^1.0.0",
    "happy-dom": "^12.0.0"
  }
}
```

**¿Qué hace cada script?**

| Script | Función |
|--------|----------|
| `start` | Inicia un servidor estático (`npx serve`) para servir `index.html` localmente |
| `test:unit` | Ejecuta Vitest en modo headless (ideal para CI/CD) |
| `test:unit:watch` | Ejecuta Vitest en modo watch (re-ejecuta tests en cambios de archivo) |
| `test:unit:ui` | Ejecuta Vitest con UI (requiere `vite-plugin-test-ui`) |

## Ejemplo de test unitario (tests/unit/store.test.js)

```javascript
// tests/unit/store.test.js
import { describe, it, expect, beforeEach } from 'vitest';

describe('Store - Auth', () => {
  it('login con credenciales válidas', async () => {
    localStorage.clear();
    const result = await Store.login('admin@multibiz.pe', 'admin123');
    expect(result).toBeDefined();
    expect(result.email).toBe('admin@multibiz.pe');
  });
});
```

## Como ejecutar tests localmente (paso a paso)

1. **Abrir terminal** en la carpeta del proyecto (`cd "C:\Users\YULI´s\Downloads\Prueba_SaaS"`)
2. **Instalar dependencias** (`npm install`)
3. **Ejecutar tests** (`npm run test:unit`)
4. **Ver resultados** (output en terminal, reporte de cobertura)

### Mostrar resultados en la terminal

```bash
# Test headless (rápido, sin UI)
$ npm run test:unit
  ✓ Store - Auth ...
  ✗ Store - CRUD ...
  ● 1 failed

# Test watch (se ejecuta en cambios)
$ npm run test:unit:watch
```

## Para contributors

- **Añadir nuevo test**: `tests/unit/` (ej: `tests/unit/app.test.js`)
- **Running tests**: `npm run test:unit` o `npm run test:unit:watch`
- **Coverage report**: `npm run test:unit -- --coverage`
- **Generar reporte HTML**: `npm run test:unit -- --reporter html`

## Consideraciones de CI/CD (GitHub Actions)

Ejemplo de workflow para pruebas (`.github/workflows/tests.yml`):

```yaml
name: Tests

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v4

    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'

    - name: Install dependencies
      run: npm ci

    - name: Run unit tests
      run: npm run test:unit
```

## Requisitos previos (para usuarios avanzados)

Si prefieres usar un entorno separado (Docker, devcontainer, etc.), simplemente haz que el directorio actual contenga:
- `package.json` (con los scripts definidos arriba)
- `vitest.config.js`
- `tests/` (con los archivos de test)

El proyecto **no requiere build** — el repositorio GitHub Pages servirá `index.html`, `css/styles.css`, `js/` directamente desde la raíz.

---

**Conclusión:** Los tests unitarios están listos y se ejecutan con `npm run test:unit`. Puedes optar por no incluir `tests/` si no quieres código extra en la producción.

Si necesitas ayuda con un test específico o ajustes de configuración, decímelo.