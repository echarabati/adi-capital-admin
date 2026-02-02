# {PREFIX}-{NUM}: {Título Descriptivo}

> **Issue ID:** {PREFIX}-{NUM}
> **Priority:** P0 | P1 | P2 | P3
> **Effort:** XS | S | M | L | XL
> **Status:** 📋 Backlog
> **Epic:** [EPIC-{NAME}](../epics/EPIC-{NAME}.md)

---

## 🎯 Objetivo

{Descripción clara del problema o feature. Suficiente contexto para implementar sin preguntas.}

## User Story

> Como **P-XXX** ({rol}), quiero **{acción}** para **{beneficio}**.

**Implementa:** US-XXX

---

## 📚 Referencias

**Design:**

- Pantalla: [SCR-XXX](../../planning/06_DESIGN.md#scr-xxx)
- Flujo: [FLW-XXX](../../planning/06_DESIGN.md#flw-xxx)

**Schema:**

- Entidades: [E-XXX](../../planning/04_DATA_MODEL.md#e-xxx)

**Componentes Starter Kit:**

- `DataTable` — {uso}
- `{Componente}` — {uso}

**Componentes Nuevos:**

- `CMP-XXX` — {descripción breve}

---

## ✅ Criterios de Aceptación

- [ ] {Criterio 1 - verificable y específico}
- [ ] {Criterio 2 - verificable y específico}
- [ ] {Criterio 3 - verificable y específico}

## 🔧 Contexto Técnico

**Archivos a crear/modificar:**

- `{ruta/archivo.ts}` — {qué hacer}
- `{ruta/archivo.ts}` — {qué hacer}

### API Contract (si aplica a Server Actions)

> ⚠️ **Obligatorio** para issues que crean/modifican server actions.
> Omitir si el issue es solo UI o refactor.

**Action:** `{actionName}`

```typescript
// Input
type Input = {
  fieldId: string; // UUID del recurso
  amount: number; // Monto en centavos
};

// Output
type Output =
  | { success: true; data: { id: string; version: number } }
  | { success: false; error: string; code: ErrorCode };

// Errors
type Errors = 'VALIDATION_ERROR' | 'NOT_FOUND' | 'UNAUTHORIZED' | 'CONFLICT';
```

**Side Effects:**

- Escribe en tabla `{tabla}`
- Invalida cache `{key}` (si aplica)
- Dispara notificación (si aplica)

**RBAC:**

- Permiso requerido: `{PERMISSION_NAME}` sobre `{resource}`

---

**Dependencias de Issues:**

- Bloqueado por: {PREFIX}-XXX (si aplica)
- Bloquea a: {PREFIX}-XXX (si aplica)

## ⚠️ Edge Cases

- {Caso 1}: {Cómo manejarlo}
- {Caso 2}: {Cómo manejarlo}

## 🧪 Tests Requeridos

- [ ] Unit: {qué testear}
- [ ] Integration: {qué testear}
- [ ] E2E: {flujo a testear} (si aplica)

## 🚫 Out of Scope

- {Qué NO incluir en este issue}

---

## 📝 Bitácora de Implementación

<!-- Completar DURANTE y DESPUÉS de implementar -->

### Decisiones Tomadas

| Fecha      | Decisión     | Razón     |
| ---------- | ------------ | --------- |
| YYYY-MM-DD | {Decisión X} | {Por qué} |

### Problemas y Soluciones

| Fecha      | Problema   | Solución   |
| ---------- | ---------- | ---------- |
| YYYY-MM-DD | {Problema} | {Solución} |

### Desviaciones del Plan

- {Si algo cambió del plan original}

### Notas para Mantenimiento

- {Tips, gotchas, contexto importante}

---

## Commits

<!-- Actualizar con cada commit -->

- `abc1234` — feat: {descripción}

---

_Creado: {{DATE}}_
_Última actualización: {{DATE}}_
