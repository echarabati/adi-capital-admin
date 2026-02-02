# Optional Features

TimeKast Starter Kit incluye varias features opcionales que pueden activarse mediante variables de entorno.

## 1. Authentication Providers (OAuth)

Habilita social login configurando las credenciales en `.env.local`.

### Google

- **Variables**: `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`
- **Costo**: Gratis
- **Setup**: [Google Cloud Console](https://console.cloud.google.com/) > APIs & Services > Credentials > OAuth 2.0 Client IDs.

### GitHub

- **Variables**: `AUTH_GITHUB_ID`, `AUTH_GITHUB_SECRET`
- **Costo**: Gratis
- **Setup**: GitHub Settings > Developer settings > OAuth Apps.

## 2. Email Service

Elige entre `smtp` (servidor propio) o `resend` (API gateway).

### Configuración

Establece `EMAIL_PROVIDER` a `smtp` o `resend`.

#### SMTP (Custom / AWS SES / SendGrid / Gmail)

Requiere credenciales SMTP estándar:

- `EMAIL_SERVER_HOST`
- `EMAIL_SERVER_PORT` (ej: 587)
- `EMAIL_SERVER_USER`
- `EMAIL_SERVER_PASSWORD`
- `EMAIL_SERVER_SECURE` (true/false)

#### Resend

- **Variable**: `RESEND_API_KEY`
- **Costo**: Free tier incluye 100 emails/día.

### Branding

- **Logo**: Configura `EMAIL_LOGO_URL` con una URL pública (ej: desde tu CDN/Bucket) para eficiencia en producción.
  - _Fallback_: Si se omite, el sistema adjunta `public/assets/timekast/email-logo.png` automáticamente (útil para desarrollo local).

## 3. Database (PostgreSQL)

La base de datos principal para datos de la aplicación.

- **Variable**: `DATABASE_URL` (Connection string)
- **Proveedor recomendado**: [Neon](https://neon.tech) (serverless, free tier disponible)

## 4. E2E Tests in CI

Por defecto, E2E tests con base de datos están **deshabilitados** en CI.

### Activar E2E

```bash
pnpm setup:e2e
```

El script:

1. Te autentica con Neon (browser)
2. Crea/selecciona proyecto
3. Configura `DATABASE_URL` en GitHub Secrets
4. Crea `.github/workflows/e2e.yml`
5. Commit + push

**Prerequisitos:** `neonctl` y `gh` CLI instalados.

## 5. Error Tracking (Sentry)

- **Variable**: `NEXT_PUBLIC_SENTRY_DSN`
- **Costo**: Free tier disponible (5k errores/mes).
- **Setup**: Crear proyecto en [Sentry.io](https://sentry.io/).

## 6. Rate Limiting (Upstash Redis)

- **Variables**: `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`
- **Costo**: Free tier disponible (10k requests/día).
- **Setup**: Crear database en [Upstash](https://upstash.com/).

## 7. Production Alerting (Super Admin)

El Starter Kit incluye extension points para alertas de seguridad cuando se usan privilegios de super admin.

### Qué está incluido

- **Audit Log:** `logSuperAdminAction()` registra todas las acciones de super admin (login, promoción, etc.).
- **Alerts:** `alertSuperAdminUsage()` notifica cuando se crea/promueve un super admin.

### Cómo activar en producción

Los extension points están marcados con `// NOTE: Production alerting extension point` en el código.

**Buscar en el código:**

```bash
grep -rn "NOTE: Production alerting" lib/
```

**Archivo:** `lib/auth/super-admin.ts`

**Opciones de integración:**

| Servicio                                                   | Uso Recomendado         | Link                     |
| ---------------------------------------------------------- | ----------------------- | ------------------------ |
| [Sentry](https://sentry.io)                                | Logging centralizado    | `sendToLoggingService()` |
| [Slack Webhooks](https://api.slack.com/messaging/webhooks) | Alertas en tiempo real  | `alertSuperAdminUsage()` |
| Email (Resend/SMTP)                                        | Notificaciones formales | `alertSuperAdminUsage()` |

### Ejemplo de implementación

```typescript
// En lib/auth/super-admin.ts

// Logging a Sentry
import * as Sentry from '@sentry/nextjs';

async function sendToLoggingService(logEntry: SuperAdminActionLog) {
  Sentry.captureMessage(`SuperAdmin: ${logEntry.action}`, {
    level: 'info',
    extra: logEntry,
  });
}

// Alertas a Slack
async function sendSlackAlert(message: string) {
  await fetch(process.env.SLACK_WEBHOOK_URL!, {
    method: 'POST',
    body: JSON.stringify({ text: message }),
  });
}
```
