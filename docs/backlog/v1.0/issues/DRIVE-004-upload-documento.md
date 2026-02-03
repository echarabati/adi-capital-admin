# DRIVE-004: Upload de Documentos

> **Issue ID:** DRIVE-004
> **Priority:** P0
> **Effort:** M
> **Status:** 📋 Backlog
> **Epic:** [E09-EPIC-INTEGRACIONES](../epics/EPIC-INTEGRACIONES.md)

---

## 🎯 Objetivo

Implementar funcionalidad de subida de documentos a Google Drive desde el panel.

## User Story

> Como **P-001/P-002**, quiero **subir documentos** para **mantener archivos organizados por proyecto e inversionista**.

**Implementa:** US-081

---

## 📚 Referencias

**Design:**

- [SCR-070 Documentos](../../planning/09_DESIGN.md#scr-070-documentos)
- Wireframe: [SCR-070_drive_navigator.png](../../wireframes/SCR-070_drive_navigator.png)

**Business Rules:**

- [BR-045, BR-046](../../planning/04_BUSINESS_RULES.md) — Estructura de carpetas y visibilidad

**API Contract:**

- `uploadDocumento` (07_API_CONTRACTS.md L499-515)

---

## ✅ Criterios de Aceptación

```gherkin
Scenario: Subir documento a proyecto
  Given que estoy en DriveNavigator de proyecto "Marina Tower"
  And navego a carpeta "Portafolio"
  When hago click en "Subir Documento"
  And selecciono un archivo PDF de 5MB
  Then el archivo se sube a Drive
  And aparece en la lista de documentos
  And se muestra toast de éxito

Scenario: Rechazar archivo muy grande
  Given que selecciono un archivo de 50MB
  Then el sistema muestra error "Archivo excede límite de 25MB"

Scenario: Subir a carpeta privada
  Given que subo a carpeta "Privado" del proyecto
  Then el documento solo es visible para participantes del proyecto (BR-046)
```

- [ ] Botón "Subir" en DriveNavigator
- [ ] Dialog de selección de archivo
- [ ] Tipos permitidos: PDF, DOC, DOCX, XLS, XLSX, JPG, PNG
- [ ] Límite: 25MB por archivo
- [ ] Progress bar durante upload
- [ ] Refresh de lista al completar
- [ ] Manejo de errores (conexión, permisos)

## 🔧 Contexto Técnico

**Archivos a crear:**

- `src/components/drive/upload-button.tsx`
- `lib/actions/drive/upload.ts`

**Flujo técnico:**

1. Client: selecciona archivo
2. Server Action: obtiene signed URL de Drive
3. Client: upload directo a Drive
4. Server Action: registra metadata

**RBAC:**

- P-001, P-002 pueden subir a cualquier carpeta de su fondo
- Visibilidad depende de carpeta destino (BR-046)

---

**Dependencias de Issues:**

- Bloqueado por: DRIVE-001, DRIVE-002
- Bloquea a: —

## 🧪 Tests Requeridos

- [ ] Unit: Validación tipo y tamaño de archivo
- [ ] Integration: Upload exitoso a Drive
- [ ] E2E: Flujo completo subir y ver documento

## 🚫 Out of Scope

- Drag & drop (Post-MVP)
- Preview de documentos (Post-MVP)
- Bulk upload (Post-MVP)

---

_Creado: 2026-02-03 — Remediación GAP-02_
