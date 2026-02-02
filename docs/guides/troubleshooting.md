# Troubleshooting Guide

> Problemas comunes y cómo resolverlos.

---

## 🔐 Auth Issues

### OAuth "redirect_uri_mismatch"

**Síntoma:** Google/GitHub login falla con error "redirect_uri_mismatch" o "Invalid redirect URI".

**Causa:** La URL de callback configurada en el OAuth provider no coincide con la app.

**Solución:**

1. Ve al OAuth provider dashboard:
   - **Google:** [console.cloud.google.com](https://console.cloud.google.com) > APIs & Services > Credentials
   - **GitHub:** Settings > Developer settings > OAuth Apps

2. Verifica que **Authorized redirect URIs** incluya:

   ```
   # Desarrollo
   http://localhost:3000/api/auth/callback/google
   http://localhost:3000/api/auth/callback/github

   # Producción
   https://tu-app.vercel.app/api/auth/callback/google
   https://tu-app.vercel.app/api/auth/callback/github
   ```

3. Si usas custom domain, agrega también:
   ```
   https://tudominio.com/api/auth/callback/google
   ```

---

### Session Expires Too Quickly

**Síntoma:** Usuario es deslogueado frecuentemente, especialmente después de cerrar el navegador.

**Causa:** Configuración de session strategy o cookies.

**Diagnóstico:**

```typescript
// Verificar config en lib/auth/auth.ts
session: {
  strategy: 'jwt',      // o 'database'
  maxAge: 30 * 24 * 60 * 60, // 30 días
}
```

**Solución:**

- Para JWT strategy: Aumentar `maxAge` en la configuración de session
- Verificar que `AUTH_SECRET` sea el mismo en todos los environments

---

### Magic Link No Llega

**Síntoma:** Usuario solicita magic link pero no recibe email.

**Causa probable:**

- `EMAIL_PROVIDER` no configurado
- Email en spam/junk folder
- Credenciales de email incorrectas
- Rate limit excedido

**Diagnóstico:**

```bash
# Verificar env vars
echo $EMAIL_PROVIDER  # Debe ser "resend" o "smtp"
echo $RESEND_API_KEY  # O EMAIL_SERVER_* para SMTP

# Test email (solo desarrollo o super_admin)
curl -X POST http://localhost:3000/api/email/test \
  -H "Content-Type: application/json" \
  -d '{"to": "tu-email@ejemplo.com"}'
```

**Solución:**

1. Configurar `EMAIL_PROVIDER` en `.env.local`
2. Si usas Resend, verificar que `RESEND_API_KEY` sea válido
3. Revisar spam folder del destinatario
4. Verificar que el dominio tenga SPF/DKIM configurados (ver [email-deliverability.md](./email-deliverability.md))

---

### Password Reset Token Invalid

**Síntoma:** Link de password reset muestra "Token inválido o expirado".

**Causa:**

- Token ya fue usado (single-use)
- Token expiró (1 hora de validez)
- Token fue reemplazado por nueva solicitud

**Solución:**

1. Solicitar nuevo link de reset
2. Usar el link dentro de 1 hora
3. No solicitar múltiples resets — solo el último es válido

---

## 🗄️ Database Issues

### Connection Timeout

**Síntoma:** Error "Connection timeout" o "Could not connect to database".

**Causa:**

- Connection string incorrecta
- Neon project pausado (free tier)
- Firewall/network issues

**Diagnóstico:**

```bash
# Verificar connection string
echo $DATABASE_URL

# Test conexión directa
psql $DATABASE_URL -c "SELECT 1"
```

**Solución:**

1. Verificar que `DATABASE_URL` incluya `?sslmode=require`
2. En Neon Dashboard, verificar que proyecto esté activo
3. Si usas free tier, el proyecto se pausa después de 5 min sin actividad — hacer cualquier request lo reactiva

---

### Migrations Fail

**Síntoma:** `pnpm db:migrate` falla con errores.

**Causa:**

- Schema out of sync
- Migration ya aplicada parcialmente
- Conflicto de nombres

**Diagnóstico:**

```bash
# Ver estado actual de migrations
pnpm drizzle-kit status

# Ver diff entre schema y DB
pnpm db:generate
```

**Solución:**

```bash
# Si es desarrollo local — push directo (destructivo)
pnpm db:push

# Si necesitas preservar datos
# 1. Backup de datos críticos
# 2. Revisar migration generada
# 3. Aplicar con cuidado
pnpm db:migrate
```

---

### "Relation Does Not Exist"

**Síntoma:** Error `relation "users" does not exist` o similar.

**Causa:**

- Migrations no aplicadas
- Apuntando a database incorrecta
- Tabla fue eliminada

**Solución:**

```bash
# Verificar tablas existentes
psql $DATABASE_URL -c "\dt"

# Aplicar migrations
pnpm db:migrate

# O push directo en desarrollo
pnpm db:push
```

---

## 📱 PWA Issues

### Install Prompt No Aparece

**Síntoma:** No aparece el prompt de "Instalar app" o el toast de instalación.

**Causa probable:**

- Ya está instalada
- No cumple criterios PWA
- Browser no soporta instalación
- Cooldown activo (7 días tras dismiss)

**Diagnóstico:**

```bash
# Verificar PWA score
pnpm pwa:check
```

En Chrome DevTools:

1. Application > Manifest — Verificar que no hay errores
2. Application > Service Workers — Verificar que SW está activo

**Solución:**

1. Verificar manifest en `src/app/manifest.ts`
2. Verificar que existen iconos en `public/pwa/`
3. Probar en Incognito mode (sin storage persistente)
4. Limpiar localStorage: `localStorage.removeItem('pwa-install-dismissed')`

---

### Service Worker Not Updating

**Síntoma:** Cambios en la app no se reflejan, versión antigua persiste.

**Causa:** SW cacheado no recibe `SKIP_WAITING` signal.

**Solución:**

1. **Hard refresh:** Ctrl+Shift+R (Windows) o Cmd+Shift+R (Mac)

2. **Unregister SW manualmente:**
   - Chrome DevTools > Application > Service Workers
   - Click "Unregister" en todos los SW

3. **Clear all site data:**
   - Chrome DevTools > Application > Storage
   - Click "Clear site data"

4. **Verificar update toast:**
   - Si aparece "Nueva versión disponible", hacer click en "Actualizar"

---

### Offline Mode No Funciona

**Síntoma:** App no funciona sin conexión.

**Causa:**

- SW no instalado
- Assets no cacheados
- Offline page no existe

**Diagnóstico:**

En Chrome DevTools:

1. Network > Offline checkbox
2. Verificar que app muestra `/offline` page

**Solución:**

1. Verificar que `public/offline.html` existe (o `/src/app/offline/page.tsx`)
2. Verificar config de `next-pwa` en `next.config.ts`
3. Verificar que SW está instalado en Application tab

---

## 📧 Email Issues

### Emails No Llegan (General)

**Síntoma:** Ningún email llega (magic link, invites, reset password).

**Diagnóstico:**

```bash
# Verificar configuración
echo $EMAIL_PROVIDER
echo $EMAIL_FROM
echo $RESEND_API_KEY  # o EMAIL_SERVER_*
```

**Solución:**

1. Verificar `EMAIL_PROVIDER` está configurado (`resend` o `smtp`)
2. Verificar `EMAIL_FROM` es un email válido del dominio verificado
3. Revisar logs en Resend dashboard o SMTP server
4. Verificar SPF/DKIM en DNS

---

### Template Rendering Errors

**Síntoma:** Email llega pero contenido está mal o vacío.

**Causa:** Error en template o variables no pasadas.

**Diagnóstico:**

```typescript
// Verificar en lib/email/templates/*.ts
// que todas las variables están siendo pasadas
```

**Solución:**

1. Test email template renderizando localmente
2. Verificar que todas las props requeridas se pasan a la función

---

### Rate Limit Exceeded

**Síntoma:** Error 429 o "rate limit exceeded".

**Causa:** Demasiados emails enviados en periodo corto.

**Solución:**

1. **Resend free tier:** 100 emails/día — esperar 24h o upgrade plan
2. **SMTP:** Depende del provider — contactar soporte
3. Implementar queue para envíos masivos

---

## 🔧 Build Issues

### TypeScript Errors

**Síntoma:** Build falla con errores de tipos.

**Diagnóstico:**

```bash
pnpm typecheck
```

**Solución común:**

```bash
# Regenerar tipos de Drizzle
pnpm db:generate

# Limpiar cache de TypeScript
rm -rf .next
rm -rf node_modules/.cache

# Reinstalar deps
pnpm install
```

---

### Missing Environment Variables

**Síntoma:** Build falla con "Environment variable X is required".

**Causa:** Variable no configurada en Vercel o incorrecta.

**Diagnóstico:**

- Vercel Dashboard > Project > Settings > Environment Variables
- Verificar nombres exactos (case-sensitive)

**Solución:**

1. Agregar variable faltante en Vercel
2. Verificar que está habilitada para el environment correcto (Production/Preview/Development)

---

### Module Resolution Errors

**Síntoma:** "Cannot find module '@/lib/...'".

**Causa:** Path alias no configurado o archivo no existe.

**Diagnóstico:**

```bash
# Verificar que archivo existe
ls -la lib/...

# Verificar tsconfig paths
cat tsconfig.json | grep paths
```

**Solución:**

1. Verificar path en `tsconfig.json` bajo `compilerOptions.paths`
2. Verificar que archivo existe en la ubicación correcta

---

## 🛠️ Comandos de Diagnóstico Rápido

```bash
# Estado general del proyecto
pnpm lint && pnpm typecheck && pnpm test

# Verificar dependencias
pnpm audit

# Verificar PWA
pnpm pwa:check

# Test de email
curl -X POST http://localhost:3000/api/email/test

# Estado de base de datos
pnpm drizzle-kit status

# Limpiar todo y reinstalar
rm -rf .next node_modules
pnpm install
pnpm dev
```

---

## ¿No Encuentras Tu Problema?

1. **Busca en issues del repo** — Puede que alguien ya lo haya reportado
2. **Revisa los logs** — Vercel dashboard tiene logs detallados
3. **Abre un issue** — Con descripción detallada, pasos para reproducir, y logs relevantes

---

_TimeKast Starter Kit — Troubleshooting Guide_
