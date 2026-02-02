---
name: security
description: Authentication, authorization, RBAC, input validation, attack prevention
---

# 🔒 Security Skill

> **Dominio:** Auth, permisos, validación, vulnerabilidades.
> **Stack:** NextAuth.js v5, Zod, middleware.

---

## Principios Fundamentales

1. **Defense in depth** — múltiples capas de protección
2. **Principle of least privilege** — mínimo acceso necesario
3. **Never trust input** — validar TODO
4. **Fail securely** — errores no exponen info sensible
5. **Audit everything** — log de acciones críticas

---

## SIEMPRE / NUNCA

**SIEMPRE:**
1. Verificar auth en entry points (`await auth()`)
2. Validar permisos antes de operaciones
3. Sanitizar input antes de DB/email/logs
4. Rate limit endpoints sensibles

**NUNCA:**
1. Confiar en input del cliente sin validar
2. Exponer IDs internos (UUIDs en URLs)
3. Loggear tokens, passwords, o PII
4. Bypass de auth "temporal" en desarrollo

---

## Autenticación (NextAuth.js v5)

### Configuración Base

```typescript
// lib/auth/index.ts
import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import Email from 'next-auth/providers/email';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { db } from '@/lib/db/drizzle';

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Email({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      // Agregar campos custom al session
      session.user.id = user.id;
      session.user.role = user.role;
      return session;
    },
    async authorized({ auth, request }) {
      const isLoggedIn = !!auth?.user;
      const isProtectedRoute = request.nextUrl.pathname.startsWith('/dashboard');
      
      if (isProtectedRoute && !isLoggedIn) {
        return Response.redirect(new URL('/login', request.url));
      }
      return true;
    },
  },
  pages: {
    signIn: '/login',
    error: '/auth/error',
  },
});
```

### Verificar Sesión en Server

```typescript
// En Server Component o Server Action
import { auth } from '@/lib/auth';

export default async function ProtectedPage() {
  const session = await auth();
  
  if (!session?.user) {
    redirect('/login');
  }
  
  return <div>Welcome {session.user.name}</div>;
}
```

### Verificar Sesión en Server Action

```typescript
'use server';

import { auth } from '@/lib/auth';
import { AppError, ERROR_CODES } from '@/lib/errors';

export async function protectedAction(data: FormData) {
  const session = await auth();
  
  if (!session?.user) {
    throw new AppError(ERROR_CODES.UNAUTHORIZED);
  }
  
  // Continuar con lógica...
}
```

---

## Autorización (RBAC)

### Definir Roles y Permisos

```typescript
// lib/auth/permissions.ts
export const ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  GUEST: 'guest',
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export const PERMISSIONS = {
  'users:read': [ROLES.ADMIN, ROLES.USER],
  'users:write': [ROLES.ADMIN],
  'users:delete': [ROLES.ADMIN],
  'settings:manage': [ROLES.ADMIN],
} as const;

export type Permission = keyof typeof PERMISSIONS;

export function hasPermission(role: Role, permission: Permission): boolean {
  return PERMISSIONS[permission].includes(role);
}
```

### Verificar Permisos

```typescript
import { auth } from '@/lib/auth';
import { hasPermission } from '@/lib/auth/permissions';
import { AppError, ERROR_CODES } from '@/lib/errors';

export async function deleteUser(userId: string) {
  const session = await auth();
  
  if (!session?.user) {
    throw new AppError(ERROR_CODES.UNAUTHORIZED);
  }
  
  if (!hasPermission(session.user.role, 'users:delete')) {
    throw new AppError(ERROR_CODES.FORBIDDEN);
  }
  
  // Proceder con eliminación...
}
```

### Higher-Order Function para Permisos

```typescript
// lib/auth/withPermission.ts
import { auth } from '@/lib/auth';
import { hasPermission, type Permission } from './permissions';
import { AppError, ERROR_CODES } from '@/lib/errors';

export function withPermission<T extends (...args: any[]) => any>(
  permission: Permission,
  action: T
): T {
  return (async (...args: Parameters<T>) => {
    const session = await auth();
    
    if (!session?.user) {
      throw new AppError(ERROR_CODES.UNAUTHORIZED);
    }
    
    if (!hasPermission(session.user.role, permission)) {
      throw new AppError(ERROR_CODES.FORBIDDEN);
    }
    
    return action(...args);
  }) as T;
}

// Uso
export const deleteUser = withPermission('users:delete', async (userId: string) => {
  // Ya verificado que tiene permiso
});
```

---

## Validación de Input

### Zod en Boundaries

```typescript
// SIEMPRE validar en entry points
import { z } from 'zod';

// API Route
export async function POST(request: NextRequest) {
  const body = await request.json();
  const validated = userSchema.parse(body); // Throws si inválido
  // ...
}

// Server Action
export async function createUser(input: unknown) {
  const validated = userSchema.parse(input);
  // ...
}

// Form
const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});
```

### Sanitización

```typescript
import DOMPurify from 'isomorphic-dompurify';

// Para contenido que puede tener HTML
function sanitizeHtml(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br'],
    ALLOWED_ATTR: ['href'],
  });
}

// Para queries de búsqueda
function sanitizeSearchQuery(query: string): string {
  return query
    .trim()
    .slice(0, 100) // Limitar longitud
    .replace(/[<>]/g, ''); // Remover caracteres peligrosos
}
```

---

## Protección contra Ataques Comunes

### SQL Injection

```typescript
// ❌ NUNCA
const users = await db.execute(
  `SELECT * FROM users WHERE id = '${userId}'`
);

// ✅ SIEMPRE usar query builder o prepared statements
const users = await db
  .select()
  .from(usersTable)
  .where(eq(usersTable.id, userId));
```

### XSS (Cross-Site Scripting)

```typescript
// React escapa automáticamente, pero cuidado con:

// ❌ PELIGROSO
<div dangerouslySetInnerHTML={{ __html: userContent }} />

// ✅ Si es necesario, sanitizar primero
<div dangerouslySetInnerHTML={{ __html: sanitizeHtml(userContent) }} />

// ✅ O mejor, no usar dangerouslySetInnerHTML
<div>{userContent}</div>
```

### CSRF

```typescript
// Next.js Server Actions tienen protección CSRF built-in
// Para API Routes, verificar Origin header

export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin');
  
  if (origin !== process.env.NEXT_PUBLIC_APP_URL) {
    return NextResponse.json({ error: 'CSRF' }, { status: 403 });
  }
  
  // ...
}
```

---

## Rate Limiting

```typescript
// lib/rateLimit.ts
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '10 s'), // 10 requests per 10s
  analytics: true,
});

export async function checkRateLimit(identifier: string) {
  const { success, limit, reset, remaining } = await ratelimit.limit(identifier);
  
  return {
    success,
    headers: {
      'X-RateLimit-Limit': limit.toString(),
      'X-RateLimit-Remaining': remaining.toString(),
      'X-RateLimit-Reset': reset.toString(),
    },
  };
}

// En API Route
export async function POST(request: NextRequest) {
  const ip = request.ip ?? 'anonymous';
  const { success, headers } = await checkRateLimit(ip);
  
  if (!success) {
    return NextResponse.json(
      { error: 'Too many requests' },
      { status: 429, headers }
    );
  }
  
  // ...
}
```

---

## Variables de Entorno

### Naming Convention

```bash
# Server-only (NUNCA exponer al cliente)
DATABASE_URL=
AUTH_SECRET=
STRIPE_SECRET_KEY=
API_KEY=

# Public (ok exponer al cliente)
NEXT_PUBLIC_APP_URL=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
```

### Validación al Startup

```typescript
// lib/env.ts
import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  AUTH_SECRET: z.string().min(32),
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
  NEXT_PUBLIC_APP_URL: z.string().url(),
});

export const env = envSchema.parse(process.env);
```

---

## Logging de Seguridad

```typescript
// lib/audit.ts
import { db } from '@/lib/db/drizzle';
import { auditLogs } from '@/lib/db/schema';

type AuditAction = 
  | 'user.login'
  | 'user.logout'
  | 'user.password_change'
  | 'user.delete'
  | 'admin.role_change'
  | 'data.export';

export async function logAuditEvent({
  action,
  userId,
  targetId,
  metadata,
  ip,
}: {
  action: AuditAction;
  userId: string;
  targetId?: string;
  metadata?: Record<string, unknown>;
  ip?: string;
}) {
  await db.insert(auditLogs).values({
    action,
    userId,
    targetId,
    metadata,
    ip,
    timestamp: new Date(),
  });
}

// Uso
await logAuditEvent({
  action: 'user.login',
  userId: user.id,
  ip: request.ip,
  metadata: { provider: 'google' },
});
```

---

## Checklist de Seguridad

### Pre-Deploy

- [ ] Secrets en variables de entorno (no en código)
- [ ] `AUTH_SECRET` es string random de 32+ chars
- [ ] Rate limiting configurado
- [ ] CORS configurado correctamente
- [ ] Headers de seguridad configurados

### Code Review

- [ ] Input validado con Zod
- [ ] Queries usan query builder (no SQL raw)
- [ ] Permisos verificados en server
- [ ] No hay secrets hardcodeados
- [ ] Logs no exponen datos sensibles

---

## Anti-Patrones

| ❌ Evitar | ✅ Preferir |
|-----------|-------------|
| Verificar auth solo en client | Verificar siempre en server |
| SQL string interpolation | Query builder / prepared |
| Secrets en código | Variables de entorno |
| `any` en inputs | Zod validation |
| Logs con passwords | Logs sanitizados |
| Exponer stack traces | Mensajes genéricos al usuario |

---

## 🔗 Colaboración

| Con | Cuándo | Acción |
|-----|--------|--------|
| **architect** | Modelo de permisos nuevo, RBAC complejo | Escalar `/consult-architect` |
| **testing** | Auth E2E tests, security fixtures | Coordinar |
| **db** | Row-level security, audit fields | Coordinar |

---

_Skill de dominio del TimeKast Factory_
