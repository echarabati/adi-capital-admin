# 🎨 TimeKast Branding & Assets Guide

Esta guía documenta la estrategia de branding, manejo de assets (logos, iconos) y configuración de marca para aplicaciones TimeKast.

> **SSOT:** `src/config/branding.ts` es la fuente de verdad para la configuración en código.

---

## 1. Estrategia de Logos

TimeKast usa una estrategia dual para permitir marca blanca (whitelabeling) sencilla o fallback robusto a la marca TimeKast.

### A. Logo del Cliente

Para personalizar el logo de cliente, se requieren **DOS variantes** (light y dark):

```env
# Logo para temas claros (fondo blanco/claro)
NEXT_PUBLIC_CLIENT_LOGO_LIGHT="/assets/mi-cliente/logo-dark.png"

# Logo para temas oscuros (fondo oscuro/negro)
NEXT_PUBLIC_CLIENT_LOGO_DARK="/assets/mi-cliente/logo-light.png"
```

> **Nota:** Si NO hay logo configurado, se muestra el nombre de la app como texto.

#### Especificaciones del Logo

| Propiedad       | Requisito                                               |
| --------------- | ------------------------------------------------------- |
| **Formato**     | PNG con fondo transparente                              |
| **Dimensiones** | ~400-600px ancho (ratio 4:1 aprox)                      |
| **Variantes**   | Light (para fondos claros) + Dark (para fondos oscuros) |
| **Ubicación**   | `public/assets/[cliente]/`                              |

> **Nota:** El sistema ajusta automáticamente el tamaño según el contexto:
>
> - Sidebar: max ~160px ancho
> - Login: max ~280px ancho
> - Emails: tamaño original

### B. TimeKast (Fallback Default)

Si no hay logo de cliente configurado, el sistema usa el nombre de la app como texto. El branding de TimeKast siempre aparece en el footer del sidebar.

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
