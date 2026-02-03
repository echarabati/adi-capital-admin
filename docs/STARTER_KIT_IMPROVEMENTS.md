# 🔧 Starter Kit Improvements Log

> Mejoras descubiertas durante el desarrollo de **Adi Capital Admin** para aplicar al TimeKast Starter Kit.
>
> **Fecha inicio:** 2026-02-03

---

## ✅ Aplicadas (pendiente sync al Starter Kit)

### 1. EMAIL_FROM con nombre de display

**Problema:** La validación de `EMAIL_FROM` solo aceptaba emails planos (`user@domain.com`), no el formato RFC 5322 con nombre (`"Name <email@domain.com>"`).

**Solución:** Actualizar validación Zod en `lib/env.ts` para aceptar ambos formatos.

**Archivo:** `lib/env.ts` línea ~81

```typescript
EMAIL_FROM: z
  .string()
  .optional()
  .refine(
    (val) => {
      if (!val) return true;
      const plainEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const rfc5322 = /^.+\s*<[^\s@]+@[^\s@]+\.[^\s@]+>$/;
      return plainEmail.test(val) || rfc5322.test(val);
    },
    { message: 'Must be a valid email or "Name <email@domain.com>" format' }
  ),
```

---

### 2. Seed scripts no cargan `.env.local`

**Problema:** `pnpm db:seed` y `pnpm db:seed:admin` usaban `tsx` sin cargar variables de `.env.local`, causando que `SUPER_ADMIN_EMAIL` y `DATABASE_URL` no estuvieran disponibles.

**Solución:** Actualizar scripts en `package.json` para precargar dotenv.

**Archivo:** `package.json`

```json
"db:seed": "tsx --require dotenv/config lib/db/seed.ts dotenv_config_path=.env.local",
"db:seed:admin": "tsx --require dotenv/config lib/db/seeds/admin.ts dotenv_config_path=.env.local",
```

---

### 3. AUTH_TRUST_HOST debe estar activo por defecto en dev

**Problema:** En desarrollo local, OAuth falla con errores de redirect si `AUTH_TRUST_HOST` no está configurado como `"true"`. El `.env.example` solo lo mencionaba en un comentario, no como variable activa.

**Solución:** Agregar `AUTH_TRUST_HOST="true"` como valor por defecto en `.env.example` y `.env.local`.

**Archivos:** `.env.example`, `.env.local`

```shell
# For local development/testing, trust the host header
# Required for OAuth to work correctly in local dev
AUTH_TRUST_HOST="true"
```

---

### 4. Avatar de perfil OAuth no se mostraba

**Problema:** El Header usaba iniciales hardcodeadas en lugar del componente Avatar. La imagen de Google OAuth no se pasaba del JWT al session ni se permitía en `next.config.ts`.

**Solución (3 partes):**

1. **Header.tsx** — Usar componente `Avatar` con `user.image`
2. **auth.ts callbacks** — Pasar `token.picture` → `session.user.image`
3. **next.config.ts** — Agregar `remotePatterns` para dominios de Google/GitHub

**Archivos:**

- `components/layout/Header.tsx`
- `lib/auth/auth.ts`
- `next.config.ts`

```typescript
// next.config.ts
images: {
  remotePatterns: [
    { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
    { protocol: 'https', hostname: 'avatars.githubusercontent.com' },
  ],
},
```

---

## 📋 Pendientes

| #   | Mejora                 | Prioridad | Notas                                       |
| --- | ---------------------- | --------- | ------------------------------------------- |
| 1   | Avatar de Google OAuth | Media     | Ya funciona, verificar que se muestra en UI |
| 2   | ...                    | ...       | ...                                         |

---

## 📝 Cómo agregar mejoras

1. Describir el **problema** encontrado
2. Documentar la **solución** aplicada
3. Indicar los **archivos** modificados
4. Marcar como ✅ cuando esté listo para sync

---

_Documento de tracking interno — TimeKast Factory_
