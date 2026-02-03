# SYNC-001: Firebase Admin SDK setup

> **Issue ID:** SYNC-001
> **Priority:** P1
> **Effort:** M
> **Status:** 📋 Backlog
> **Epic:** [E09-EPIC-INTEGRACIONES](../epics/EPIC-INTEGRACIONES.md)

## 🎯 Objetivo

Configurar Firebase Admin SDK para sincronización a Firestore.

---

## 📚 Referencias

- [ADR-003: Edge Inline con waitUntil](../../planning/06_ARCHITECTURE.md#adr-003)

---

## ✅ Criterios de Aceptación

- [ ] `lib/integrations/firebase/admin.ts` con inicialización
- [ ] Credenciales en env vars
- [ ] Helper `firestore` exportado
- [ ] Funciona desde Edge Functions

---

**Dependencias:** Bloquea SYNC-002, SYNC-003.

---

_Creado: 2026-02-03_
