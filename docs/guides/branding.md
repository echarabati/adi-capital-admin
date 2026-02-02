# 🎨 TimeKast Branding & Assets Guide

Esta guía documenta la estrategia de branding, manejo de assets (logos, iconos) y configuración de marca para aplicaciones TimeKast.

> **SSOT:** `src/config/branding.ts` es la fuente de verdad para la configuración en código.

---

## 1. Estrategia de Logos

TimeKast usa una estrategia dual para permitir marca blanca (whitelabeling) sencilla o fallback robusto a la marca TimeKast.

### A. Cliente (Prioridad Alta)

Si deseas personalizar el logo para un cliente:

1. Define la variable de entorno:

   ```env
   NEXT_PUBLIC_CLIENT_LOGO_URL="/assets/mi-cliente/logo.png"
   ```

   _O URL externa: `https://cdn.cliente.com/logo.png`_

2. El componente `<Logo />` usará automáticamente esta URL.

### B. TimeKast (Fallback Default)

Si no hay logo de cliente configurado, el sistema usa los assets internos de TimeKast basándose en el tema (azul para light, silver para dark).

**Ubicación:** `public/assets/timekast/`

| Archivo                         | Uso         | Descripción             |
| ------------------------------- | ----------- | ----------------------- |
| `timekast-logo-blue.png`        | Light Theme | Logo icono (T) azul     |
| `timekast-logo-blue-full.png`   | Light Theme | Logo completo con texto |
| `timekast-logo-silver.png`      | Dark Theme  | Logo icono (T) plateado |
| `timekast-logo-silver-full.png` | Dark Theme  | Logo completo con texto |

> **Convención:** Usar `kebab-case` para nombres de archivo. Evitar espacios.

---

## 2. Iconos: PWA vs Browser Tab

Para garantizar la mejor experiencia visual, usamos dos juegos de iconos distintos:

### A. Browser Tab (Favicon)

El icono que aparece en la pestaña del navegador debe ser **transparente** para integrarse bien con cualquier color de UI del navegador.

- **Archivo:** `src/app/icon.png`
- **Formato:** PNG 32x32 px
- **Fondo:** **Transparente**
- **Detección:** Automática por Next.js App Router.

### B. PWA / Install Icon

El icono que aparece al instalar la app (home screen iOS/Android) debe ser **opaco** y tener un fondo sólido para asegurar visibilidad y contraste.

- **Archivos:** `public/pwa/`
  - `icon-192.png`
  - `icon-512.png`
  - `apple-touch-icon.png`
- **Fondo:** **Opaco** (ej. Azul TimeKast o Negro Midnight)
- **Config:** Referenciado en `manifest.ts` y `src/app/layout.tsx`.

---

## 3. Email Assets

Los correos electrónicos requieren assets públicos absolutos.

- **Ubicación:** `public/assets/timekast/email-logo.png` (o `NEXT_PUBLIC_CLIENT_LOGO_URL`)
- **Requisito:** Fondo transparente, optimizado (<50KB).

---

## 4. Cómo cambiar el Branding

Para cambiar la marca de una app generada con este starter kit:

1. **Reemplazar Favicon:**
   - Sobrescribir `src/app/icon.png` con tu logo transparente (32x32).

2. **Reemplazar PWA Icons:**
   - Generar nuevos iconos usando [PWA Asset Generator](https://github.com/onderceylan/pwa-asset-generator) o similar.
   - Reemplazar archivos en `public/pwa/`.
   - Asegurar fondo opaco (se ve mejor en iOS).

3. **Configurar Logo de App:**
   - Opción Rápida: `NEXT_PUBLIC_CLIENT_LOGO_URL` en `.env`.
   - Opción Permanente: Reemplazar assets en `public/assets/` y actualizar `src/config/branding.ts`.

4. **Colores:**
   - Ajustar `globals.css` (variables CSS).
   - Ajustar `tailwind.config.ts`.

---

_Generado por TimeKast Factory — Branding Guide v1.1_
