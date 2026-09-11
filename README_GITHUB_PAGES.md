# Multibiz · Panel Multi-negocio

SPA completa (HTML/CSS/JS puro) para gestionar ventas, inventario, clientes y reportes de varios negocios. Desplegable en GitHub Pages sin build step.

## Cuentas demo
| Rol | Email | Contraseña |
|-----|-------|------------|
| Superadmin | `admin@multibiz.pe` | `admin123` |
| Owner (Urbano) | `maria@urbano.pe` | `urbano123` |
| Owner (Café) | `carlos@cafe.pe` | `cafe123` |

## Despliegue en GitHub Pages

### Opción A: Subir archivos manualmente (más simple)

1. **Crear repositorio en GitHub**
   - Ve a https://github.com/new
   - Nombre: `multibiz` (o el que prefieras)
   - Público/Privado: **Público** (GitHub Pages gratis requiere repo público)
   - No marques "Add a README" (ya tienes uno)

2. **Subir archivos**
   - En la página del repo vacío, click "uploading an existing file"
   - Arrastra **todos los archivos** de esta carpeta (`index.html`, `css/`, `js/`, `manifest.json`, `sw.js`, `icons/`, `.nojekyll`, etc.)
   - Commit: "Initial commit"

3. **Activar GitHub Pages**
   - Settings → Pages
   - Source: **Deploy from a branch**
   - Branch: `main` / (root)
   - Save
   - Espera 1-2 min → tu sitio estará en `https://TU_USUARIO.github.io/multibiz/`

### Opción B: Usar Git + gh-pages (automatizado)

```bash
# 1. Instalar gh-pages globalmente (una sola vez)
npm install -g gh-pages

# 2. En la carpeta del proyecto
cd "C:\Users\YULI´s\Downloads\Prueba_SaaS"

# 3. Inicializar Git (si no lo hiciste)
git init
git add .
git commit -m "Initial commit: Multibiz panel"

# 4. Crear repo en GitHub (web) y conectar
git remote add origin https://github.com/TU_USUARIO/multibiz.git
git branch -M main
git push -u origin main

# 5. Desplegar a gh-pages branch
gh-pages -d .
```

GitHub Pages servirá desde la rama `gh-pages` generada automáticamente.

## Estructura para GitHub Pages

```
multibiz/
├── index.html          # ← Documento raíz (obligatorio)
├── .nojekyll           # ← Desactiva Jekyll (necesario)
├── css/styles.css
├── js/store.js
├── js/app.js
├── js/store-supabase.js
├── manifest.json       # ← PWA manifest
├── sw.js               # ← Service Worker (requiere HTTPS)
├── icons/icon.svg
├── README.md
├── REPORTE.md
├── package.json
├── .gitignore
└── supabase/
    ├── schema.sql
    └── README.md
```

## Notas importantes

- **HTTPS obligatorio** para PWA + Service Worker (GitHub Pages lo da gratis)
- **`.nojekyll`** evita que GitHub procese carpetas con `_` (como `_css`, `_js`)
- **Sin build step** → archivos servidos tal cual
- **Dominio personalizado**: agrega archivo `CNAME` con tu dominio en la raíz

## Rutas en GitHub Pages

| Función | URL |
|---------|-----|
| Panel principal | `https://TU_USUARIO.github.io/multibiz/` |
| Manifest PWA | `https://TU_USUARIO.github.io/multibiz/manifest.json` |
| Service Worker | `https://TU_USUARIO.github.io/multibiz/sw.js` |

---

¿Dudas? Revisa `REPORTE.md` para arquitectura completa.