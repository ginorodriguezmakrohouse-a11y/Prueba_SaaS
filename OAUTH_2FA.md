# OAuth/2FA — Plan de implementación (Multibiz Panel)

## Estado actual
La versión actual usa autenticación básica con email/contraseña almacenada en localStorage (hash simple para demo). Para entornos productivos se recomienda:
- Migrar a Supabase Auth (ya preparado en `js/store-supabase.js`)
- O usar Auth0/Firebase/Auth0 para delegación OAuth

## Opciones de implementación

### 1. OAuth Social Login (Google, GitHub, Facebook)
- **Ruta**: Redirigir a proveedor → callback → crear/actualizar usuario en Store
- **Implementación en Store**:
  - Añadir método `oauthLogin(provider, token)`
  - Mapear claims → usuario local
  - Vincular cuentas existentes por email
- **Ventajas**: SSO, menos fricción para usuarios
- **Desventajas**: Requiere backend para validar tokens (o usar PKCE con SPA directamente)

### 2. Autenticación de dos factores (2FA)
- **Método**: TOTP (Google Authenticator, Authy) o códigos por SMS/email
- **Pasos**:
  1. Login con credenciales
  2. Si 2FA activado → mostrar campo código
  3. Validar código → generar sesión
- **Almacenamiento**: secret por usuario en Supabase/localStorage
- **Bibliotecas**: `speakeasy` o `otplib` para generar/validar códigos TOTP
- **UI**: Modal de verificación + códigos de rescate

### 3. Contraseñas seguras (producción)
- Reemplazar hash simple por bcrypt/scrypt (solo en backend real)
- En frontend: usar Web Crypto API para hash del lado cliente antes de enviar
- Política: mínimo 8 chars, mayúscula, número, símbolo

## Preparación para migración a Supabase
El archivo `js/store-supabase.js` ya incluye:
- Tabla `users` con columnas para OAuth (`github_id`, `google_id`, etc.)
- Funciones RPC para login social
- Hooks para 2FA (por implementar)

### Pasos para habilitar OAuth en Supabase:
1. En Supabase Dashboard → Authentication → Settings → External OAuth
2. Habilitar proveedores (Google, GitHub, etc.)
3. Configurar redirect URLs (`https://tu-dominio.com/auth/callback`)
4. Implementar flujo en `store-supabase.js` (ya tiene placeholders)
5. Actualizar `index.html` para redirigir a `/auth/callback` si aplica

## Implementación mínima sin backend
Si no se usa Supabase:
- Usar `implicit flow` con PKCE (para SPA) directamente con proveedores
- Almacenar tokens JWT en localStorage (con expiración)
- Renovar silenciosamente con refresh token (si proveedor lo permite)
- Implementar cierre de sesión global

## Archivos de ejemplo
- `js/auth-oauth.js` (esqueleto)
- `js/auth-2fa.js` (esqueleto)
- `supabase/migrations/` (para añadir columnas 2FA)

---

¿Querés que implemente una opción específica ahora? Por ejemplo:
- Código de ejemplo para Google OAuth con PKCE
- TOTP 2FA con UI
- Migración completa a Supabase Auth