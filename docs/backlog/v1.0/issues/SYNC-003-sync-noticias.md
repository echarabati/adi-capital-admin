# SYNC-003: Sync noticias a Firestore

> **Issue ID:** SYNC-003
> **Priority:** P2
> **Effort:** S
> **Status:** 📋 Backlog
> **Epic:** [E09-EPIC-INTEGRACIONES](../epics/EPIC-INTEGRACIONES.md)

## 🎯 Objetivo

Sincronizar noticias publicadas a Firestore para la app móvil.

## User Story

> Como **Sistema**, quiero **sincronizar noticias a Firebase** para **que aparezcan en la app móvil**.

**Implementa:** US-096

---

## 📚 Referencias

- Business Rules: [BR-048](../../planning/04_BUSINESS_RULES.md#br-048) — Sync Firebase
- API Contract: `syncNoticia` (07_API_CONTRACTS.md L536-551)

---

## ✅ Criterios de Aceptación

```gherkin
Scenario: Publicar noticia sincroniza a Firebase
  Given que creo una noticia "Nueva Oportunidad" para fondo Adi Capital
  When la publico
  Then se crea documento en Firestore: /news/adi-capital/items/{id}
  And contiene: título, contenido, imageUrl, fechaPublicacion
  And el campo sincronizado_firebase = true

Scenario: Noticia no publicada no se sincroniza
  Given que guardo una noticia como borrador
  Then NO aparece en Firestore
  And sincronizado_firebase = false

Scenario: Actualizar noticia re-sincroniza
  Given que edito una noticia ya publicada
  When guardo los cambios
  Then el documento en Firestore se actualiza
```

- [ ] Sync automático al publicar noticia
- [ ] Path: `/news/{fondo_slug}/items/{noticia_id}`
- [ ] Campos: título, contenido, imageUrl, fechaPublicacion
- [ ] Campo sincronizado_firebase en DB local
- [ ] Re-sync al actualizar noticia publicada

---

**Dependencias de Issues:**

- Bloqueado por: SYNC-001, NEWS-002
- Bloquea a: —

## 🧪 Tests Requeridos

- [ ] Integration: Publicar noticia crea doc en Firestore
- [ ] Integration: Noticia borrador no crea doc

---

_Creado: 2026-02-03 — Actualizado: Remediación DoR_
