# DRIVE-001: Drive API setup

> **Issue ID:** DRIVE-001
> **Priority:** P1
> **Effort:** M
> **Status:** 📋 Backlog
> **Epic:** [E09-EPIC-INTEGRACIONES](../epics/EPIC-INTEGRACIONES.md)

## 🎯 Objetivo

Configurar Google Drive API para navegación y gestión de documentos.

## User Story

> Como **desarrollador**, quiero **configurar la integración con Drive** para **navegar y subir documentos**.

**Implementa:** US-080 (prerequisito)

---

## 📚 Referencias

- [ADR-005: Drive como Storage](../../planning/06_ARCHITECTURE.md#adr-005)
- [Documentación Google Drive API](https://developers.google.com/drive/api/v3/reference)

---

## ✅ Criterios de Aceptación

```gherkin
Scenario: Configurar cliente de Drive
  Given que configuro GOOGLE_SERVICE_ACCOUNT_KEY en .env
  When inicializo el cliente de Drive
  Then puedo autenticar correctamente con la Service Account

Scenario: Listar archivos de una carpeta
  Given que tengo access a una carpeta compartida
  When llamo a drive.files.list({ q: 'parents in "FOLDER_ID"' })
  Then recibo lista de archivos con: id, name, mimeType, modifiedTime

Scenario: Validar permisos al startup
  Given que la app inicia
  When checkeo la conexión a Drive
  Then si falla, logueo warning pero la app sigue funcionando
```

- [ ] `lib/integrations/drive/client.ts` con GoogleAuth
- [ ] Env vars: GOOGLE_SERVICE_ACCOUNT_KEY (JSON stringified)
- [ ] Service Account con permisos al Workspace compartido
- [ ] Helper: `listFiles(folderId)`, `getFile(fileId)`
- [ ] Health check opcional en startup

## 🔧 Contexto Técnico

**Dependencias npm:**

- `googleapis` o `@google-cloud/storage`

**Env vars:**

```bash
GOOGLE_SERVICE_ACCOUNT_KEY='{"type":"service_account",...}'
GOOGLE_DRIVE_ROOT_FOLDER_ID="1abc..."
```

---

**Dependencias de Issues:**

- Bloqueado por: —
- Bloquea a: DRIVE-002, DRIVE-004

## 🧪 Tests Requeridos

- [ ] Unit: Mock de googleapis
- [ ] Integration: Health check con credentials reales (manual)

---

_Creado: 2026-02-03 — Actualizado: Remediación DoR_
