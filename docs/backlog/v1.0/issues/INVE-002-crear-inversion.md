# INVE-002: Crear inversión con config fees

> **Issue ID:** INVE-002
> **Priority:** P1
> **Effort:** L
> **Status:** 📋 Backlog
> **Epic:** [E05-EPIC-INVERSIONES](../epics/EPIC-INVERSIONES.md)

## 🎯 Objetivo

Implementar formulario complejo para crear inversión con configuración de Admin Fee.

## User Story

> Como **P-001/P-002**, quiero **crear inversiones** para **vincular inversionistas con proyectos**.

**Implementa:** US-014, US-015

---

## ✅ Criterios de Aceptación

- [ ] Seleccionar inversionista (si viene desde proyecto) o proyecto (si viene desde inversionista)
- [ ] Validación: inversionista debe pertenecer al fondo del proyecto (BR-013)
- [ ] Código único autogenerado
- [ ] Campo compromiso requerido
- [ ] Config Admin Fee: Tipo (one_time/anual), %, Base, Método, Presentación
- [ ] Toast éxito/error

---

**Dependencias:** Bloqueado por INVE-001. Bloquea INVE-003, INVE-005.

---

_Creado: 2026-02-03_
