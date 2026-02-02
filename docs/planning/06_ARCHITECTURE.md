# Architecture — Adi Capital Admin

> Generado desde Discovery Brief por `/docs`
> **Fuente:** `docs/planning/00_DISCOVERY_BRIEFING.md` §8
> **SSOT:** Código + ADRs

---

## Stack Técnico

| Componente | Tecnología | Versión | Notas |
|------------|------------|---------|-------|
| **Frontend** | Next.js | 16+ | App Router |
| **Estilos** | Tailwind CSS | v4 | Mobile-first |
| **Base de datos** | Neon PostgreSQL | — | Serverless |
| **ORM** | Drizzle | — | Type-safe |
| **Auth** | NextAuth.js | v5 | Credentials + Session |
| **Hosting** | Vercel | — | Edge functions |
| **Email** | Resend | — | Transaccional |
| **Storage docs** | Google Drive API | — | OAuth2 |
| **Sync móvil** | Firebase Admin SDK | — | Firestore + Storage |

---

## Arquitectura de Alto Nivel

```
┌─────────────────────────────────────────────────────────────────┐
│                         USUARIOS                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│     ┌──────────────┐           ┌──────────────────────┐        │
│     │ Super Admin  │           │ Inversionista (iOS)  │        │
│     │ Admin Fondo  │           │ (App existente)      │        │
│     └──────┬───────┘           └──────────┬───────────┘        │
│            │                              │                     │
│            ▼                              ▼                     │
│   ┌─────────────────┐           ┌─────────────────┐            │
│   │  Adi Admin PWA  │           │  Firebase/iOS   │            │
│   │    (Next.js)    │           │    (Flutter)    │            │
│   └────────┬────────┘           └────────▲────────┘            │
│            │                              │                     │
├────────────┼──────────────────────────────┼─────────────────────┤
│            │        BACKEND               │                     │
│            ▼                              │                     │
│   ┌─────────────────┐                     │                     │
│   │ Server Actions  │─────────────────────┤                     │
│   │   (Next.js)     │                     │                     │
│   └────────┬────────┘                     │                     │
│            │                              │                     │
│       ┌────┴────┬─────────┬───────┐       │                     │
│       ▼         ▼         ▼       ▼       │                     │
│   ┌───────┐ ┌───────┐ ┌───────┐ ┌───────┐ │                     │
│   │ Neon  │ │Google │ │Firebase│ │Resend │ │                     │
│   │(SSOT) │ │Drive  │ │  Sync  │────────┘ │                     │
│   └───────┘ └───────┘ └───────┘           │                     │
│                                           │                     │
└───────────────────────────────────────────┘                     │
```

---

## Patrones de Arquitectura

### Server Actions Pattern

Todas las operaciones de datos usan Server Actions con validación Zod:

```typescript
// lib/actions/movimientos.ts
'use server';

import { z } from 'zod';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';

const CreateMovimientoSchema = z.object({
  concepto: z.enum(['APO', 'DIS', ...]),
  monto: z.number().positive(),
  moneda: z.enum(['MXN', 'USD', 'EUR', 'ILS']),
  // ...
});

export async function createMovimiento(input: unknown) {
  const session = await auth();
  if (!session?.user) return { error: 'UNAUTHORIZED' };

  const parsed = CreateMovimientoSchema.safeParse(input);
  if (!parsed.success) return { error: 'VALIDATION_ERROR', details: parsed.error };

  // RBAC check (BR-011, BR-012)
  const hasPermission = await checkPermission(session.user, 'movimientos:create');
  if (!hasPermission) return { error: 'FORBIDDEN' };

  try {
    const result = await db.insert(movimientos).values(parsed.data);
    return { success: true, data: result };
  } catch (error) {
    return { error: 'SERVER_ERROR' };
  }
}
```

### RBAC Pattern

Permisos basados en roles con middleware de verificación:

```typescript
// lib/auth/permissions.ts
export const ROLE_PERMISSIONS = {
  SUPER_ADMIN: ['*'], // Todos los permisos
  ADMIN_FONDO: [
    'fondos:read:own',
    'proyectos:*:own',
    'inversionistas:*:own',
    'inversiones:*:own',
    'movimientos:create:own',
    'movimientos:read:own',
    'documentos:*:own',
  ],
};

export async function checkPermission(
  user: User,
  action: string,
  resource?: { fondoId?: string }
): Promise<boolean> {
  // Super Admin: todo permitido
  if (user.role === 'SUPER_ADMIN') return true;

  // Admin Fondo: verificar que sea su fondo
  if (action.includes(':own') && resource?.fondoId) {
    return user.fondoAsignado === resource.fondoId;
  }

  return ROLE_PERMISSIONS[user.role]?.includes(action) ?? false;
}
```

---

## Integraciones

### Firebase Sync (FT-015)

```
┌─────────────┐     ┌─────────────┐     ┌─────────────────┐
│ Neon (SSOT) │────▶│ Sync Job    │────▶│ Firebase PROD   │
└─────────────┘     └─────────────┘     └─────────────────┘
       │                  │
       │                  ▼
       │           ┌─────────────────┐
       │           │ sincronizado_   │
       │           │ firebase = true │
       └───────────┴─────────────────┘
```

**Estrategia:**
1. Cada entidad tiene `sincronizado_firebase: boolean`
2. Al confirmar movimiento → marcar entidades afectadas como `false`
3. Job (trigger o cron) detecta `false` y sincroniza
4. Post-sync → marcar `true`

**Colecciones Firebase a sincronizar:**
- `funds/{slug}/investors/{id}/projects/{slug}/`
- `funds/{slug}/projects/{slug}/`
- `news/{slug}/items/`

### Google Drive (FT-012)

```typescript
// lib/integrations/drive.ts
export async function listFiles(folderId: string): Promise<DriveFile[]>;
export async function uploadFile(folderId: string, file: File): Promise<DriveFile>;
export async function createFolder(parentId: string, name: string): Promise<string>;
export async function deleteFile(fileId: string): Promise<void>;
```

**Estructura de carpetas:**
```
Drive Root/
├── Proyectos/
│   └── {codigo}/
│       ├── Oportunidad/    # Públicos
│       ├── Portafolio/     # Públicos
│       └── Privado/        # Solo participantes
└── Inversionistas/
    └── {nombre}/
        └── {proyecto}/     # Solo ese inversionista
```

---

## Decisiones de Arquitectura

### ADR-001: Firebase Sync Strategy
**Estado:** ⚠️ Pendiente decisión
**Contexto:** Necesitamos sincronizar datos a Firebase sin romper la app móvil existente.
**Opciones:**

| Opción | Pro | Contra |
|--------|-----|--------|
| A) Sync síncrono (en transacción) | Consistencia inmediata | Latencia, punto de fallo |
| B) Sync asíncrono (job/trigger) | Resiliente, desacoplado | Eventual consistency |
| C) Sync batch (cron cada X min) | Simple, predecible | Datos no inmediatos |

**Recomendación:** Opción B para MVP, con fallback manual.

---

### ADR-002: Cálculo de Pref Timing
**Estado:** ⚠️ Pendiente decisión
**Contexto:** El interés preferencial debe calcularse diariamente.
**Opciones:**

| Opción | Pro | Contra |
|--------|-----|--------|
| A) Cron job nocturno | Simple, predecible | Datos de ayer |
| B) Trigger en movimiento | Tiempo real | Complejidad |
| C) On-demand (al consultar) | Sin jobs | Cálculo en runtime |

**Recomendación:** Opción A para MVP (simplicidad).

---

### ADR-003: Estado Borrador de Movimientos
**Estado:** ✅ Decidido
**Decisión:** Todos los movimientos inician en Borrador.
**Razón:** Permite revisión antes de afectar saldos (BR-002).

---

## Ambientes

| Ambiente | Propósito | URLs |
|----------|-----------|------|
| Development | Local | localhost:3000 |
| Preview | PR reviews | Vercel preview |
| Staging | Pre-prod | staging.* |
| Production | Producción | TBD (subdominio cliente) |

**Variables por ambiente:**
- `DATABASE_URL` (Neon)
- `FIREBASE_*` (Admin SDK)
- `GOOGLE_DRIVE_*` (OAuth)
- `RESEND_API_KEY`

---

## Componentes del Starter Kit Utilizados

| Componente | Uso en Adi Capital |
|------------|-------------------|
| `DashboardLayout` | Layout principal admin |
| `DataTable` | Tablas de fondos, proyectos, movimientos |
| `Form`, `FormField` | Formularios CRUD |
| `usePermissions` | Hook para RBAC |
| Auth flow | Login, sesiones |
| PWA setup | Instalable |

---

## Open Questions

| # | Pregunta | Impacto | Owner |
|---|----------|---------|-------|
| OQ-01 | ¿ADR-001: Sync Firebase síncrono o asíncrono? | **Alto** | Dev + Architect |
| OQ-02 | ¿ADR-002: Cálculo de Pref en cron o realtime? | **Alto** | Dev |
| OQ-03 | ¿Proyecto Firebase gemelo para desarrollo o mismo? | Med | Cliente |

---

## Assumptions

| # | Supuesto | Si es incorrecto |
|---|----------|------------------|
| A-01 | Firebase Admin SDK tiene acceso completo al proyecto | Impacto: Permisos IAM |
| A-02 | Google Drive OAuth2 ya está configurado | Impacto: Setup adicional |
| A-03 | Starter Kit cubre 80% de componentes UI necesarios | Impacto: Desarrollo extra |

---

*Generado por TimeKast Factory — /docs*
