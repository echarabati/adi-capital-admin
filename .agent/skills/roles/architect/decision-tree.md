# 🌳 Technical Decision Tree

> Guía rápida para tomar decisiones arquitectónicas en el stack Next.js App Router + Drizzle.

---

## A) Data Fetching

**¿Dónde debo pedir los datos?**

| Situación | Decisión |
|-----------|----------|
| Data pública/SEO crítica | **Server Component** (`await getData()`) |
| Data privada del usuario | **Server Component** (preferido) |
| Depende de interacción (clicks, search) | **URL search params + Server Component** (preferido) |
| Necesita revalidación en cliente | **Server Component** + `revalidatePath/revalidateTag` |
| Real-time | **Client Component** + polling/websocket (solo si necesario) |

> **Nota:** El starter-kit NO incluye TanStack Query ni SWR. Usamos **Server Components + URL state** como estrategia principal.

---

## B) Mutations (Crear/Editar/Borrar)

**¿Cómo envío datos al servidor?**

| Situación | Decisión |
|-----------|----------|
| Formulario estándar | **Server Action** + `useActionState` |
| Interacción compleja (drag&drop) | **Server Action** invocado desde `onClick` |
| Webhook externo | **API Route** (`route.ts`) |
| Upload de archivos | **Client SDK** (UploadThing/S3) → Server Action para guardar ref |

> **Regla de Oro:** Preferir **Server Actions** sobre API Routes para todo lo que sea UI-driven.

---

## C) State Management

**¿Dónde guardo el estado?**

| Tipo de Estado | Dónde |
|----------------|-------|
| Data del servidor | **URL** (Search Params) + Server Component |
| UI state (modal, input) | **React.useState** |
| Compartido entre componentes lejanos | **Zustand** o **Context** (usar con moderación) |
| Persiste entre recargas | **URL** o **LocalStorage** |

> **Anti-Pattern:** Usar Redux/Zustand para data que ya está en el servidor o URL.

---

## D) Component Structure

**¿Server o Client?**

| Pregunta | Respuesta |
|----------|-----------|
| Por defecto | **Server Component** (`.tsx`) |
| Necesita hooks (useState, useEffect)? | `'use client'` |
| Necesita browser APIs (window, localStorage)? | `'use client'` |
| Necesita interactividad (onClick)? | `'use client'` |

> **Patrón:** Hojas del árbol son Client, ramas/tronco son Server. Pasar Server Components como `children` a Client Components.

---

## E) Auth / RBAC

| Situación | Decisión |
|-----------|----------|
| ¿Acceso por rol? | `requireRole()` en action/route |
| ¿Multi-tenant? | `tenant_id` enforced en schema + queries |
| ¿Excepciones a los roles? | ADR requerido |

---

## F) Database (Drizzle)

| Situación | Decisión |
|-----------|----------|
| Query simple | Usar `db.query.table.findMany()` (Relational API) |
| Performance crítica | Usar `db.select().from()` (SQL-like) |
| Mutaciones relacionadas | **Siempre** envolver en `db.transaction()` |
| Migraciones/renames | Plan de migración + rollback obligatorio |

---

## G) Dependencias

| Pregunta | Decisión |
|----------|----------|
| ¿Cubre capability existente del starter-kit? | **No agregar** nueva dependencia |
| ¿Es crítica (auth/payments/uploads)? | Preferir vendor probado |
| ¿Lock-in alto? | ADR + escalamiento si impacta negocio |

---

## H) Jobs / Background

| Situación | Decisión |
|-----------|----------|
| ¿Necesitas async? | Job runner (según stack) |
| ¿Retries/idempotencia? | **Requerido** en pagos/webhooks |

---

_TimeKast Factory — Architect Decision Tree_
