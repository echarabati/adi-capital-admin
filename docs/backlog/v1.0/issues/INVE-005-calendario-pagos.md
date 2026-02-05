# INVE-005: CRUD Calendario pagos

> **Issue ID:** INVE-005
> **Priority:** P1
> **Effort:** M
> **Status:** ✅ Completed (2026-02-05)
> **Epic:** [E05-EPIC-INVERSIONES](../epics/EPIC-INVERSIONES.md)

## 🎯 Objetivo

Implementar gestión de capital calls programados para una inversión.

## User Story

> Como **P-001/P-002**, quiero **programar capital calls** para **planificar aportaciones del inversionista**.

**Implementa:** US-019, US-021

---

## ✅ Criterios de Aceptación

- [x] Tab Calendario en detalle inversión
- [x] DataTable: #, Fecha Programada, Monto Esperado, Monto Pagado, Estado
- [x] Estado: Pendiente/Parcial/Completo
- [x] Crear capital call con fecha y monto
- [x] Editar capital call existente

---

**Dependencias:** Bloqueado por INVE-003 ✅, SCHEMA-002 ✅. Bloquea INVE-006.

---

## 📝 Implementation Notes

### Archivos Creados

- `lib/actions/calendario-pagos/calendario-pagos-queries.ts` — Query con RBAC
- `lib/actions/calendario-pagos/calendario-pagos-mutations.ts` — Create/Update
- `lib/validations/calendario-pagos/calendario-pagos-validation.ts` — Zod schema
- `src/app/(protected)/inversiones/[id]/calendario/_components/CalendarioTable.tsx` — DataTable
- `src/app/(protected)/inversiones/[id]/calendario/_components/CalendarioFormDialog.tsx` — Form dialog

### Archivos Modificados

- `src/app/(protected)/inversiones/[id]/calendario/page.tsx` — Integración completa

### Decisiones

- Usé `userFondos` para RBAC (no super_admin filtra por fondos asignados)
- Estado enum usa 'completo' (no 'completado') según schema existente
- Form dialog usa inputs nativos HTML (no shadcn Calendar/Popover que no existen)

### Verificación

```
✅ pnpm typecheck
✅ pnpm lint
```

---

_Creado: 2026-02-03_
_Completado: 2026-02-05_
