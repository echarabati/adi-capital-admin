# Security Posture

> Guía de seguridad para el TimeKast Starter Kit

---

## Resumen

Este starter kit implementa prácticas de seguridad modernas por defecto. Este documento describe las medidas implementadas y configuraciones recomendadas para producción.

---

## Autenticación (NextAuth v5)

### Configuración Base

| Aspecto          | Implementación                             |
| ---------------- | ------------------------------------------ |
| Session Strategy | JWT (stateless)                            |
| Secret           | `AUTH_SECRET` (32+ chars, env-only)        |
| Cookie Prefix    | Personalizable via `NEXT_PUBLIC_APP_NAME`  |
| Trust Host       | `AUTH_TRUST_HOST=true` solo para dev local |

### Roles y Permisos (RBAC)

```typescript
// 3 niveles jerárquicos
type Role = 'user' | 'admin' | 'super_admin';

// Super admin: creado via seed, promoción manual en app
// Solo super_admins pueden promover otros super_admins
```

### OAuth Security

- Redirect URIs deben coincidir exactamente con los configurados en proveedores
- Client secrets son server-only (nunca `NEXT_PUBLIC_*`)
- Revoca tokens inmediatamente si se comprometen

---

## Password Reset

### Medidas Implementadas

| Medida             | Descripción                                |
| ------------------ | ------------------------------------------ |
| **No enumeration** | Siempre responde "email enviado si existe" |
| **Token hashing**  | SHA-256 antes de guardar en DB             |
| **Expiración**     | 1 hora (configurable)                      |
| **One-time use**   | Token se elimina tras uso                  |
| **Overwrite**      | Nuevo request invalida token anterior      |

### Rate Limiting

Rate limiting protects against brute force and abuse:

| Endpoint                    | Límite      | Ventana    |
| --------------------------- | ----------- | ---------- |
| `/api/auth/forgot-password` | 5 requests  | 1 minuto   |
| `/api/auth/reset-password`  | 10 requests | 1 minuto   |
| `/api/email/test`           | 5 requests  | 10 minutos |

#### Configuración

**Desarrollo:** In-memory (funciona sin configuración adicional).

**Producción (recomendado para multi-instancia):** Upstash Redis

```bash
# 🚀 Enable in 5 minutes:
# 1. Vercel Marketplace: https://vercel.com/integrations/upstash
# 2. Add Integration → auto-populates env vars
UPSTASH_REDIS_REST_URL=https://...
UPSTASH_REDIS_REST_TOKEN=...
```

**Límites personalizables:**

```bash
# .env
RATE_LIMIT_FORGOT_PASSWORD_REQUESTS=5
RATE_LIMIT_FORGOT_PASSWORD_WINDOW_SECONDS=60
RATE_LIMIT_RESET_PASSWORD_REQUESTS=10
RATE_LIMIT_RESET_PASSWORD_WINDOW_SECONDS=60
```

**Respuesta cuando se excede:**

```json
{
  "error": "Too Many Requests",
  "message": "Rate limit exceeded. Please try again later.",
  "retryAfter": 45
}
```

Headers incluidos: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`

---

## API Security

### Cache Policy

```typescript
// next.config.ts - PWA runtime caching
{
  urlPattern: /\/api\/.*/i,
  handler: 'NetworkOnly',  // ← Nunca cachea API routes
}
```

### Endpoints Sensibles

| Endpoint                    | Protección                                          |
| --------------------------- | --------------------------------------------------- |
| `/api/auth/*`               | NextAuth handlers (session required para protected) |
| `/api/email/test`           | `dev` mode OR `super_admin` + rate limit            |
| `/api/auth/forgot-password` | No auth (público), pero no enumerable               |
| `/api/auth/reset-password`  | Token validation                                    |

### Error Responses

Formato estándar recomendado:

```typescript
interface ApiError {
  error: string; // Código o mensaje corto
  message?: string; // Descripción legible
  details?: unknown; // Solo en dev
}
```

---

## Environment Variables

### Server-Only (Nunca exponer)

```bash
AUTH_SECRET
AUTH_GOOGLE_SECRET
AUTH_GITHUB_SECRET
SUPER_ADMIN_EMAILS
RESEND_API_KEY
DATABASE_URL
```

### Públicas (OK en cliente)

```bash
NEXT_PUBLIC_APP_URL
NEXT_PUBLIC_APP_NAME
NEXT_PUBLIC_AUTH_*     # Feature flags
```

---

## Headers de Seguridad (Producción)

Agregar en `next.config.ts` o via Vercel/CDN:

```typescript
// next.config.ts
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin'
  }
];

// En config:
async headers() {
  return [
    {
      source: '/:path*',
      headers: securityHeaders,
    },
  ];
}
```

---

## Logging Seguro

### ❌ NO logear:

- Tokens de reset
- Passwords (ni hashes)
- API keys
- Session tokens

### ✅ SÍ logear:

- Intentos de login fallidos (sin password)
- Acciones de super admin
- Rate limit violations
- Errores de autenticación

---

## Checklist de Producción

```bash
# 1. Verificar que no hay secrets expuestos
grep -r "GOCSPX-\|re_\|sk-\|npg_" . --include="*.ts" --include="*.tsx"

# 2. Verificar variables de entorno
pnpm env:check

# 3. Ejecutar quality gates
pnpm verify

# 4. Revisar build
pnpm build

# 5. Analizar bundle (opcional)
ANALYZE=true pnpm build
```

---

## Reporte de Vulnerabilidades

Si encuentras una vulnerabilidad:

1. **NO** abrir issue público
2. Contactar a: security@timekast.mx
3. Incluir: descripción, pasos para reproducir, impacto potencial
