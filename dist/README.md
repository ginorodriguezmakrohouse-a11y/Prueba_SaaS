# Multibiz · Panel multi-negocio

SPA completa (HTML/CSS/JS puro) para gestionar ventas, inventario, clientes y reportes de varios negocios.

## Estructura
```
multibiz/
├── index.html
├── css/styles.css
├── js/store.js
├── js/app.js
├── js/store-supabase.js
├── manifest.json
├── sw.js
├── icons/
├── supabase/
├── capacitor.config.json
├── scripts/gen-icons.js
├── tests/unit/store.test.js
└── README.md
```

## Cuentas demo
- Admin: `admin@multibiz.pe` / `admin123`
- Urbano: `maria@urbano.pe` / `urbano123`
- Café: `carlos@cafe.pe` / `cafe123`

## Despliegue
Subir `multibiz/` a cualquier hosting estático (cPanel, Netlify, Vercel, GitHub Pages).
No requiere build ni dependencias.

## Arquitectura
- `store.js`: capa de datos (localStorage, reemplazable por API/Supabase)
- `app.js`: auth, router, vistas, modales, gráfico de ventas
- `styles.css`: diseño responsive con glassmorphism y claymorphism
- `manifest.json` + `sw.js`: PWA instalable y offline
- `capacitor.config.json`: wrapper nativo Android/iOS
- `supabase/schema.sql`: backend opcional con RLS

## Testing
```bash
npm install
npm run test:unit:run
```
- 13 tests unitarios para Store (auth, CRUD, KPIs, permisos)
- Ver `README_TESTS.md` para más detalles

## Iconos PWA
```bash
npm run icons
```
Genera PNGs en 72, 96, 128, 144, 152, 192, 384 y 512 px desde `icons/icon.svg`.

## Capacitor
```bash
npm install @capacitor/core @capacitor/cli
npx cap init
npx cap add android
npx cap sync
```
- Ver `CAPACITOR.md` para guía completa

## Analytics
- Ver `ANALYTICS.md` para Plausible, GA4 o eventos custom

## OAuth/2FA
- Ver `OAUTH_2FA.md` para plan de implementación

## Migración a Supabase
1. Crear proyecto en [supabase.com](https://supabase.com)
2. Ejecutar `supabase/schema.sql` en SQL Editor
3. Reemplazar `js/store.js` por `js/store-supabase.js` en `index.html`
4. Configurar `SUPABASE_URL` y `SUPABASE_KEY` en `store-supabase.js`

Véase `supabase/README.md` para detalles.
