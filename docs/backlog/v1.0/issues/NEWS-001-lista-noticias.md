# NEWS-001: Lista de noticias

> **Issue ID:** NEWS-001
> **Priority:** P2
> **Effort:** M
> **Status:** ✅ Done (2026-02-06)
> **Epic:** [E10-EPIC-PANEL](../epics/EPIC-PANEL.md)

## 🎯 Objetivo

Implementar lista de noticias con estado borrador/publicado.

**Implementa:** US-095

---

## ✅ Criterios de Aceptación

- [x] URL: `/noticias`
- [x] DataTable: Título, Fondo, Estado (badge), Fecha
- [x] Filtro por fondo, estado
- [x] Botón "+ Nueva Noticia" abre dialog
- [x] Form: Título, Contenido, Imagen URL, Fondo (opcional)

---

**Dependencias:** Bloqueado por FOND-001 ✅. Bloquea NEWS-002.

---

## 📝 Implementation Notes

**Completed:** 2026-02-06

**Schema & DB:**

- `lib/db/schema/noticias.ts` — noticias table with nullable fondoId (null = general news, visible to all)
- `lib/db/schema/enums.ts` — added estadoNoticiaEnum ('borrador', 'publicado')
- Migration: `0004_keen_lethal_legion.sql`

**Server Actions:**

- `lib/actions/noticias/noticias-queries.ts` — getNoticias, getNoticiaById with RBAC
- `lib/actions/noticias/noticias-actions.ts` — createNoticia

**UI:**

- `src/app/(protected)/noticias/page.tsx` — server component
- `src/app/(protected)/noticias/NoticiasTable.tsx` — DataTable with filters
- `components/noticias/CreateNoticiaDialog.tsx` — create form dialog

**Navigation:**

- Added Noticias item to `src/config/navigation.ts`

**Design Decision:**

- `fondoId = NULL` means general news visible to all funds
- `fondoId = UUID` means fund-specific news

**Verification:**

- [x] Typecheck: Pass
- [x] Lint: Pass
- [x] Build: Pass

---

_Creado: 2026-02-03 — Completado: 2026-02-06_
