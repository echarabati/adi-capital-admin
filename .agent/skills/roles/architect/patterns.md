# 🏗️ Architectural Patterns

> Patrones aprobados para mantener el código limpio, escalable y consistente.
> Stack: Next.js App Router + Server Actions + Drizzle + Zod.

---

## 1. Clean Architecture (Simplificada)

Organizamos el código por **responsabilidad**, no solo por tipo de archivo.

```
src/
├── app/                 # Capa de Presentación (UI, Routing)
├── lib/
│   ├── actions/         # Capa de Aplicación (Use Cases)
│   ├── services/        # Capa de Dominio (Business Logic pura)
│   ├── db/              # Capa de Infraestructura (Data Access)
│   ├── auth/            # Auth primitives (session, RBAC helpers)
│   ├── validations/     # Zod schemas (shared)
│   └── errors/          # AppError + mapping
```

**Reglas:**
- **UI** (`app`) solo llama a **Actions** (no DB directo)
- **Actions** validan inputs (Zod), controlan auth, orquestan services/DB
- **Services** contienen reglas de negocio complejas (reutilizables)
- **DB** es tonta, solo guarda/lee

---

## 2. Server Actions First

Preferir Server Actions sobre API Routes cuando:
- La mutación viene de UI interna
- Necesitas progressive enhancement
- Quieres tipado y boundary claro

**API Routes (`route.ts`) solo para:**
- Webhooks externos
- Integración con terceros
- Callbacks donde no hay UI directa

---

## 3. Service Layer Pattern

Para lógica compleja, no la pongas en el Server Action ni en el Componente.

**Regla práctica:** Si una action pasa de ~20–30 líneas o mezcla cálculo + persistencia + side effects → service.

**Mal:**
```ts
// action.ts
export async function createOrder() {
  // 50 líneas de validación, cálculo de impuestos, emails, db insert
}
```

**Bien:**
```ts
// services/order-service.ts
export class OrderService {
  async create(...) { ... }
  async calculateTax(...) { ... }
}

// action.ts
export async function createOrder(data) {
  await orderService.create(data); // Simple orquestación
}
```

---

## 4. Side Effects (Dónde Van)

**Qué son side effects:**
- Emails (transaccionales, notificaciones)
- Queue/jobs (background processing)
- Third-party APIs (pagos, analytics, tracking)
- File operations (uploads finalize, cleanup)

**Regla:** 
- **Actions orquestan** side effects (cuándo y en qué orden)
- **Services calculan/deciden** (lógica pura, testeable)
- **Side effects son llamados**, no mezclados con lógica de negocio

```ts
// action.ts
export async function completeOrder(orderId: string) {
  const order = await orderService.finalize(orderId); // lógica
  await sendOrderConfirmation(order);                  // side effect
  await analytics.track('order_completed', order);     // side effect
}
```

---

## 5. Boundary Defense (Zod en Bordes)

Nunca confiar en el input. Validar en los bordes.

- **Server Actions:** `schema.parse(input)` al inicio
- **Route Handlers:** validar params, query, body
- **DB:** si usas drizzle-zod, deriva tipos desde schema

> ⚠️ **No validación = deuda técnica.**

---

## 6. Error Handling Centralizado

No usar `try/catch` en cada componente.

- Usar `error.tsx` de Next.js para errores de renderizado
- Retornar objetos en Actions: `{ ok: true, data }` / `{ ok: false, error }`
- Usar `AppError` custom para errores de negocio conocidos
- Centralizar mapping de errores a UI-safe (no leaks)

---

## 7. Composition over Inheritance

En UI, preferir composición.

**Mal:** `TableWithSearchAndFiltersAndPagination`
**Bien:**
```tsx
<DataTable>
  <TableToolbar>
     <Search />
     <Filters />
  </TableToolbar>
  <Pagination />
</DataTable>
```

---

## 8. Data Integrity y Transacciones

- Si hay mutaciones relacionadas → `db.transaction`
- Asegurar idempotencia cuando aplique (webhooks, retries)
- **Constraints DB > validaciones app** (unique, FK, check)

---

## 9. Auth & RBAC Guardrails

- Auth check en actions/route handlers, **no en UI**
- Helpers únicos: `requireUser()`, `requireRole()`
- Multi-tenant: `tenant_id` en todas las tablas relevantes y en queries

---

## 10. Observabilidad Mínima

Para producción:
- Logging estructurado para: auth failures, webhooks, pagos, jobs
- En features críticas: medir latencia y tasa de error
- Tracing/metrics si el stack lo permite

---

## 11. Caching y Performance

- Server components: caching explícito si aplica
- Paginación por defecto en lists
- Evitar N+1 (Relational API / joins controlados)
- Indexes en columnas de filtros frecuentes

---

## 12. Política de Dependencias ("Boring Tech")

Agregar librería solo si:
- Reduce complejidad neta
- Tiene mantenimiento activo
- Evita escribir algo inseguro (auth, crypto, uploads)

> ⚠️ **Nueva dependencia ⇒ revisión Architect + posible ADR**

---

_TimeKast Factory — Architect Patterns_
