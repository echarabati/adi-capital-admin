# Cache Policy

> Qué cachear y qué nunca cachear.

## ❌ Nunca Cachear (SW: NetworkOnly)

| Categoría     | Ejemplos                | Razón      |
| ------------- | ----------------------- | ---------- |
| Auth          | `/api/auth/*`, sessions | Seguridad  |
| PII           | Perfiles, emails        | Privacidad |
| Billing       | Precios, subscriptions  | Exactitud  |
| Admin         | Endpoints de admin      | Seguridad  |
| **Todas API** | `/api/*` por defecto    | Seguridad  |

## ✅ Seguro para Cachear

| Categoría      | Estrategia           | TTL   |
| -------------- | -------------------- | ----- |
| Static assets  | StaleWhileRevalidate | Largo |
| Next.js static | CacheFirst           | Largo |
| Images         | CacheFirst           | Largo |

## Service Worker

Configurado en `next.config.ts` vía `next-pwa`.

- **API routes: `NetworkOnly`** (por defecto, security-first)
- Next.js static: `CacheFirst`
- Static assets: `StaleWhileRevalidate`

> [!IMPORTANT]
> Para cachear APIs públicas específicas, agregar allowlist explícito en `next.config.ts`.

## Client-Side

Usar `isSensitiveApiRoute()` de `lib/cache.ts`:

```ts
import { isSensitiveApiRoute } from '@/lib/cache';

const cache = isSensitiveApiRoute(url) ? 'no-store' : 'default';
```

---

_TimeKast Factory_
