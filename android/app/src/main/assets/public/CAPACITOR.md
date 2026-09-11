# Capacitor — Multibiz Panel Nativo

## Descripción
Este paquete transforma la app web SPA en una aplicación móvil nativa (Android/iOS) usando **Capacitor**.

## Instalación rápida

### 1. Inicializar Capacitor (solo una vez)
```bash
npm install @capacitor/core @capacitor/cli
npx cap init
```
- App name: `Multibiz`
- App ID: `com.multibiz.app`
- Web directory: `.` (ya configurado en capacitor.config.json)

### 2. Agregar plataformas
```bash
# Android
npm install @capacitor/android
npx cap add android

# iOS (requiere Mac + Xcode)
npm install @capacitor/ios
npx cap add ios
```

### 3. Sincronizar
```bash
npx cap sync
```

## Estructura generada
```
multibiz/
├── android/           ← proyecto nativo Android (generado por Capacitor)
├── ios/               ← proyecto nativo iOS (generado por Capacitor)
├── capacitor.config.json  ← configuración actual
├── index.html
├── css/styles.css
├── js/store.js
├── js/app.js
├── manifest.json
├── sw.js
└── icons/            ← íconos PNG (ya generados)
```

## Plugins Capacitor instalados
| Plugin | Uso |
|--------|-----|
| `@capacitor/app` | Eventos de ciclo de vida (app start, pause) |
| `@capacitor/haptics` | Vibración táctil en feedback |
| `@capacitor/keyboard` | Manejo de teclado virtual |
| `@capacitor/status-bar` | Estilo de barra de estado |
| `@capacitor/browser` | Abrir URLs externas |
| `@capacitor/local-notifications` | Notificaciones de ventas |

## Configuración
- **Capacitor URL**: `http://localhost:8080` (para desarrollo)
- **Clearnet (HTTP)**: `true` en config (solo desarrollo; para producción usar HTTPS)

## Build para producción
### Android
```bash
npx cap open android
# En Android Studio: Build → Generate Signed Bundle/APK
```
### iOS
```bash
npx cap open ios
# En Xcode: Product → Archive
```

## Permisos necesarios
- **Internet**: para sincronizar con Supabase/API
- **Local Storage**: para cache offline (ya funciona con SW)
- **Notifications**: opcional, para alertas de ventas

## Características del wrapper nativo
- **Instalable**: APK/IPA como app nativa
- **Offline**: PWA Service Worker cachea assets
- **Splash screen**: personalizable en Android Studio/Xcode
- **Push notifications**: con Firebase/OneSignal
- **Biometría**: para login con huella/d facial (plugin `capacitor-biometric-auth`)

## Diferencias Web vs Nativo
| Web | Nativo |
|-----|--------|
| Desplegar hosting | Instalar APK/IPA |
| HTTPS requerido | HTTPS opcional |
| Service Worker | Plugin nativo |
| localStorage | Capacitor Storage |
| PWA install prompt | App store install |

---

¿Necesitas que configure algún plugin específico? Por ejemplo:
- Biometría para login
- Notifications para ventas
- NFC para pagos
- Cámara para escanear productos