# Analytics — Multibiz Panel

## Opciones disponibles

### 1. Plausible (recomendado para privacidad)
1. Crear cuenta en [plausible.io](https://plausible.io)
2. Agregar tu dominio/site en el panel
3. Descomenta el snippet de Plausible en `index.html`:
```html
<script defer data-domain="tu-dominio.com" src="https://plausible.io/js/script.js"></script>
```
4. Reemplazar `tu-dominio.com` con tu dominio real
5. Subir a hosting con HTTPS (obligatorio para Plausible)

### 2. Google Analytics (GA4)
1. Crear propiedad en [Google Analytics](https://analytics.google.com)
2. Obtener el ID de medición `G-XXXXXXXXXX`
3. Descomenta el snippet de GA4 en `index.html`:
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer=window.dataLayer||[];
  function gtag(){dataLayer.push(arguments)}
  gtag('js',new Date());
  gtag('config','G-XXXXXXXXXX');
</script>
```

### 3. Autoincrementado (métricas propias)
`js/app.js` puede integrar eventos custom con el objeto `Analytics` global (opcional):
```js
window.Analytics?.trackEvent('venta', { total: 150, channel: 'wa' });
window.Analytics?.trackPage('dashboard');
```

## Métricas clave para Multibiz
| Evento | Cuándo | Propiedades |
|--------|--------|-------------|
| `page_view` | Cada ruta | `route`, `businessId`, `role` |
| `login` | Login exitoso | `email`, `role`, `businessCount` |
| `sale_created` | Venta creada | `total`, `channel`, `items` |
| `product_added` | Producto nuevo | `category`, `price` |
| `register` | Nuevo usuario | `businessName`, `plan` |

## Nota sobre datos demo
Las métricas de los usuarios demo **NO** se envían a ningún servicio externo a menos que configures manualmente un script de analytics. Esto garantiza privacidad durante pruebas.

---

¿Querés que configure una integración específica (Plausible, GA4, Mixpanel)? Decime cuál.