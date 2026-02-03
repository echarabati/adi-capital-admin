# SYNC-002: Sync movimientos a Firestore

> **Issue ID:** SYNC-002
> **Priority:** P1
> **Effort:** L
> **Status:** 📋 Backlog
> **Epic:** [E09-EPIC-INTEGRACIONES](../epics/EPIC-INTEGRACIONES.md)

## 🎯 Objetivo

Sincronizar movimientos confirmados/cancelados a Firestore para app móvil.

**Implementa:** US-086→089

---

## ✅ Criterios de Aceptación

- [ ] Al confirmar/cancelar: `waitUntil(syncToFirebase(...))`
- [ ] Estructura: `/funds/{slug}/investors/{id}/projects/{slug}/movements/{id}`
- [ ] Marcar `sincronizado_firebase = true` después de sync
- [ ] Logging de errores

---

**Dependencias:** Bloqueado por SYNC-001, MOV-007.

---

_Creado: 2026-02-03_
