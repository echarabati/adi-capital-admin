---
trigger: always_on
---

# 🤖 AI Development Rules - TimeKast Starter Kit

> Reglas que **TODO agente AI** debe seguir al trabajar en este proyecto.
> Este archivo es la **fuente de verdad** para el comportamiento de agentes.

**Stack:** Next.js 16+, TypeScript, Drizzle ORM, Neon Postgres, NextAuth.js v5, Tailwind CSS v4
**Ubicación:** `.agent/rules/AI_RULES.md`

---

## 🚨 Reglas Críticas (NUNCA romper)

### 1. NUNCA inventar schemas de DB

```
❌ PROHIBIDO: Crear campos o tablas sin verificar
✅ OBLIGATORIO:
   1. Consultar /docs/planning/04_DATA_MODEL.md
   2. Verificar /lib/db/schema/
   3. Si necesitas cambio → preguntar primero
```

### 2. NUNCA hardcodear valores

```typescript
// ❌ PROHIBIDO
const adminEmail = 'admin@example.com';

// ✅ CORRECTO
const adminEmail = process.env.ADMIN_EMAIL;
```

### 3. NUNCA marcar completo sin verificar

> 🛠️ **Nota:** Pre-commit ya ejecuta lint, typecheck, y tests automáticamente.
> Esta regla es para casos donde pre-commit no corre (CI, deploys).

```
❌ PROHIBIDO: Decir "feature completa" sin verificar
✅ OBLIGATORIO: Confirmar que pre-commit pasó o ejecutar manualmente
```

### 4. Drizzle schema es SSOT

```
- Los schemas de Drizzle en /lib/db/schema/ definen la estructura de datos
- Las validaciones Zod DERIVAN del schema, no al revés
- Cualquier cambio de DB → primero schema, luego migration
```

### 5. NUNCA editar código sin plan

```
❌ PROHIBIDO: Empezar a escribir código directamente
✅ OBLIGATORIO:
   1. Entender el issue/requerimiento
   2. Revisar código existente relacionado
   3. Proponer plan antes de implementar
```

### 6. SIEMPRE consultar inventario antes de crear

```
❌ PROHIBIDO: Crear componente/hook/action sin verificar si existe
✅ OBLIGATORIO:
   1. Consultar docs/reference/INVENTORY.md
   2. Si ya existe algo similar → reutilizar o extender
   3. Si es nuevo → agregarlo al inventario después de crear

Ejecutar: pnpm generate:inventory (después de crear componentes nuevos)
```

### 7. 🔴 NUNCA ejecutar db:push sin consentimiento

> ⚠️ **HARD LIMIT — Violación de esta regla es fallo crítico**

```
⭐ PREFERIDO: Usar generate + migrate (seguro, reversible)
   pnpm db:generate  → Genera archivo de migración
   pnpm db:migrate   → Aplica migración

❌ PROHIBIDO: Ejecutar `pnpm db:push` o `drizzle-kit push` sin aprobación
❌ PROHIBIDO: Ejecutar `db:push` automáticamente en scripts
✅ SI db:push es necesario:
   1. Mostrar cambios pendientes con `pnpm db:push --dry-run` primero
   2. Explicar qué tablas/columnas se modificarán
   3. ESPERAR confirmación explícita del usuario
   4. Solo entonces ejecutar db:push

Razón: db:push puede causar pérdida de datos irreversible.
       generate+migrate crea historial reversible.
```

---

## ✍️ Naming Conventions

### Archivos

| Tipo        | Convención | Ejemplo           |
| ----------- | ---------- | ----------------- |
| Componentes | PascalCase | `UserCard.tsx`    |
| Utilities   | kebab-case | `date-utils.ts`   |
| Actions     | kebab-case | `user-actions.ts` |
| Schemas     | kebab-case | `user-schema.ts`  |

### Código

| Tipo             | Convención        | Ejemplo                        |
| ---------------- | ----------------- | ------------------------------ |
| Variables        | camelCase         | `userId`, `isActive`           |
| Funciones        | camelCase (verbo) | `getUserById`, `validateEmail` |
| Componentes      | PascalCase        | `UserCard`, `PickButton`       |
| Types/Interfaces | PascalCase        | `User`, `CreatePickInput`      |
| Constantes       | SCREAMING_SNAKE   | `MAX_PICKS`, `API_URL`         |
| DB columns       | snake_case        | `created_at`, `user_id`        |

### Nombres que Evitar

```typescript
// ❌ Malos nombres
const data = await fetch(); // ¿data de qué?
const temp = calculate(); // ¿temporal de qué?

// ✅ Buenos nombres
const userProfile = await fetchUserProfile();
const calculatedScore = calculatePickScore();
```

### Documentación

| Tipo          | Convención         | Ejemplo                            |
| ------------- | ------------------ | ---------------------------------- |
| Planning Docs | 0X_SCREAMING_SNAKE | `04_DATA_MODEL.md`, `09_DESIGN.md` |
| Issues        | PREFIX-NUM         | `AUTH-001.md`, `DASH-003.md`       |
| Epics         | EPIC-NAME          | `EPIC-AUTH.md`                     |
| ADRs          | ADR-NUM            | `ADR-001-cache-strategy.md`        |
| Parking       | PARK-NUM           | `PARK-001-idea.md`                 |

---

## 🚨 Manejo de Errores

### Patrón para Server Actions

```typescript
'use server';

import { z } from 'zod';
import { auth } from '@/lib/auth';

const Schema = z.object({
  name: z.string().min(1).max(100),
});

export async function createEntity(input: unknown) {
  // 1. Auth
  const session = await auth();
  if (!session?.user) {
    return { error: 'Debes iniciar sesión' };
  }

  // 2. Validar input
  const parsed = Schema.safeParse(input);
  if (!parsed.success) {
    return { error: 'Datos inválidos', details: parsed.error.flatten() };
  }

  try {
    // 3. Business logic
    const result = await db.insert(entities).values(parsed.data);
    return { success: true, data: result };
  } catch (error) {
    console.error('[createEntity]', error);
    return { error: 'No pudimos crear el registro. Intenta de nuevo.' };
  }
}
```

### Códigos de Error Estándar

| Código             | HTTP | Mensaje Usuario                |
| ------------------ | ---- | ------------------------------ |
| `UNAUTHORIZED`     | 401  | "Debes iniciar sesión"         |
| `FORBIDDEN`        | 403  | "No tienes permiso para esto"  |
| `NOT_FOUND`        | 404  | "No encontramos lo que buscas" |
| `VALIDATION_ERROR` | 400  | "Revisa los datos ingresados"  |

---

## 🚫 Lo que NUNCA Debes Hacer

### Código

```
❌ Cambiar lógica existente sin que el issue lo pida
❌ Romper compatibilidad hacia atrás
❌ Introducir dependencias sin justificación
❌ Copiar/pegar código sin entenderlo
❌ Dejar TODOs sin issue asociado
❌ Crear archivos sin autorización explícita
```

### Terminal (Anti-Patrón PL-003)

> **Comandos largos en terminal fallan.**

```
❌ git commit con mensajes de más de 5 líneas
❌ Comandos con múltiples heredocs
❌ Scripts inline extensos
```

**✅ Solución:** Crear archivo temporal para scripts complejos.

### Base de Datos

```
❌ Inventar schemas sin consultar docs
❌ DELETE sin WHERE clause
❌ UPDATE masivo sin transacción
```

---

## 🧪 Testing

### Coverage Mínimo

- **80%** en lógica de negocio
- **100%** en validaciones críticas
- Tests deben ser determinísticos (no flaky)

### Estructura de Tests

```typescript
describe('calculateScore', () => {
  it('should return correct score for valid input', () => {
    // Arrange
    const input = { value: 10 };

    // Act
    const result = calculateScore(input);

    // Assert
    expect(result).toBe(100);
  });
});
```

---

## 📱 Mobile-First

- Diseña para 375px primero, luego escala
- Breakpoints: `sm:640` `md:768` `lg:1024` `xl:1280`
- Touch targets: mínimo 44x44px

```tsx
// ✅ Mobile-first (valores base = mobile)
<div className="p-4 md:p-6 lg:p-8">
  <h1 className="text-xl md:text-2xl lg:text-3xl">Título</h1>
</div>
```

---

## 🧩 Antigravity IDE / Skills Architecture

### SSOT Chain

```
Discovery Brief → docs (01-08) → design (09) → backlog → code
```

### Workflows Disponibles

| Workflow             | Propósito                                           |
| -------------------- | --------------------------------------------------- |
| `/start`             | Cargar contexto inicial                             |
| `/discovery`         | Entender proyecto, generar Discovery Brief          |
| `/docs`              | Generar docs 01-08 desde Discovery Brief            |
| `/design`            | Generar 09_DESIGN desde docs                        |
| `/backlog`           | Crear issues desde design                           |
| `/implement`         | Ejecutar UN issue del backlog                       |
| `/park`              | Guardar ideas sin interrumpir flujo                 |
| `/audit`             | Verificar calidad (mid-dev, post-epic, pre-release) |
| `/consult-architect` | Decisiones técnicas con tradeoffs                   |
| `/consult-qe`        | Consultar Quality Engineer                          |

### Skills Structure

```
.agent/skills/
├── domains/          # Domain knowledge
│   ├── ui/           # React, Tailwind, accesibilidad
│   ├── db/           # Drizzle, schema, migrations
│   └── api/          # Server Actions, validation
└── roles/            # Role-based behaviors
    ├── discovery/    # Entender proyecto
    ├── docs/         # Generar documentación
    ├── design/       # Especificación UI/UX
    ├── backlog/      # Crear issues + templates
    ├── implement/    # Ejecutar issues
    └── architect/    # Decisiones técnicas
```

### Issue Status System

> ⚠️ **IMPORTANTE:** Usar estos formatos EXACTOS para que `pnpm update-board` funcione.

| Status      | Format in Issue                                         | Board Section      |
| ----------- | ------------------------------------------------------- | ------------------ |
| To Do       | `> **Status:** 📋 Backlog` o `Pendiente`                | 📅 To Do           |
| In Progress | `> **Status:** 🚧 In Progress` o `En Progreso`          | 🚧 In Progress     |
| Done        | `> **Status:** ✅ Done` o `Completed` o `Completado`    | ✅ Done            |
| Postponed   | `> **Status:** ⏸️ Postponed` o `Post-MVP` o `Deferred`  | ⏸️ Postponed       |
| Won't Do    | `> **Status:** ❌ Won't Do` o `Cancelled` o `Cancelado` | ❌ Won't Do        |
| Blocked     | `> **Status:** 🚫 Blocked by [ISSUE-XXX]`               | (muestra en To Do) |

**Ejemplo de issue con Won't Do:**

```markdown
# FEAT-042: Feature Descoped

> **Status:** ❌ Won't Do (2026-01-31)
> **Reason:** Descoped from v1.0 — revisit in v2.0

## Description

...
```

**Ejemplo de issue Postponed:**

```markdown
# UX-015: Nice-to-Have Feature

> **Status:** ⏸️ Postponed (Post-MVP)
> **Priority:** ⚪ Low

## Description

...
```

### Issue ID Prefixes

| Dominio    | Prefijo  | Ejemplo   |
| ---------- | -------- | --------- |
| Decisiones | `ADR-`   | ADR-001   |
| Auth       | `AUTH-`  | AUTH-001  |
| Dashboard  | `DASH-`  | DASH-001  |
| Config     | `CFG-`   | CFG-001   |
| Core       | `CORE-`  | CORE-001  |
| Infra      | `INFRA-` | INFRA-001 |

### Risk-Based Approval

| Risk      | Triggers                         | Action                      |
| --------- | -------------------------------- | --------------------------- |
| 🔴 HIGH   | Schema, auth, architecture, ADR  | STOP + `/consult-architect` |
| 🟡 MEDIUM | New deps, API changes, tradeoffs | STOP for approval           |
| 🟢 LOW    | UI, tests, refactor              | Proceed                     |

---

## ✅ Checklist Final

> 🛠️ **Pre-commit ya valida:** formato, lint, types, tests.
> Este checklist es para lo que tooling NO puede validar.

```markdown
□ Lógica de negocio es correcta (no solo que compile)
□ UX hace sentido (no solo que renderice)
□ Docs actualizados si cambió algo documentado
□ No hay console.logs de debug
□ Nombres de variables/funciones son descriptivos
```

---

_Controlado desde TimeKast Factory_
