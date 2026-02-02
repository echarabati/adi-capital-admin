# Feature Map — Adi Capital Admin

> Generado desde Discovery Brief por `/docs`
> **Fuente:** `docs/planning/00_DISCOVERY_BRIEFING.md`
> **SSOT:** Este documento

---

## MVP Features (Feb 28, 2026)

### FT-001: Gestión de Fondos
**Prioridad:** P0 — Core
**Descripción:** CRUD de fondos de inversión (Adi Capital, Kentucky)
**Campos:** nombre, slug, moneda base, método cascada, capital socios

### FT-002: Gestión de Proyectos
**Prioridad:** P0 — Core
**Descripción:** CRUD de proyectos/oportunidades de inversión dentro de fondos
**Campos:** código, nombre, estado, tasa pref, success fee %, método cascada, hurdle

### FT-003: Gestión de Inversionistas
**Prioridad:** P0 — Core
**Descripción:** CRUD de inversionistas con asociación a fondos
**Campos:** nombre, email, teléfono, es_fundador, % propiedad, agente asignado

### FT-004: Gestión de Inversiones
**Prioridad:** P0 — Core
**Descripción:** CRUD de inversiones (participación inversionista-proyecto)
**Campos:** código, compromiso, estado, config pref, config admin fee

### FT-005: Calendario de Pagos
**Prioridad:** P0 — Core
**Descripción:** Gestión de capital calls y compromisos como cuenta por cobrar
**Campos:** número, fecha, monto esperado, monto pagado, estado

### FT-006: Sistema de Movimientos
**Prioridad:** P0 — Core
**Descripción:** Registro de 18 tipos de movimientos financieros
**Conceptos:** APO, APO-D, DIS, DEV, FEE, INV, INV-D, RET, GAS, GASP, APS, RPS, PRS, DPRS, TRA, CAM, ERR, TSI
**Estados:** Borrador → Confirmado → Cancelado

### FT-007: Cálculo de Pref (Preferred Return)
**Prioridad:** P0 — Core
**Descripción:** Cálculo automático de interés preferencial acumulado diariamente
**Fórmula:** `(capital_aportado × tasa_pref) / 365`

### FT-008: Wizard de Reparto
**Prioridad:** P0 — Core
**Descripción:** Flujo guiado para distribuir capital + utilidades con método de cascada
**Métodos:** Pref Primero (Adi), Capital Primero (Kentucky)
**Genera:** Movimientos DIS + FEE automáticamente

### FT-009: Admin Fee
**Prioridad:** P0 — Core
**Descripción:** Configuración y cálculo de comisión de administración por inversión
**Tipos:** One-time, Anual
**Bases:** Compromiso, Capital aportado

### FT-010: Gestión de Cuentas Bancarias
**Prioridad:** P1 — Soporte
**Descripción:** CRUD de cuentas bancarias del fondo
**Campos:** banco, número, CLABE, moneda, saldo

### FT-011: Gestión de Beneficiarios
**Prioridad:** P1 — Soporte
**Descripción:** CRUD de beneficiarios para gastos
**Campos:** nombre, datos bancarios

### FT-012: Gestión Documental
**Prioridad:** P0 — Core
**Descripción:** Integración con Google Drive para documentos
**Niveles:** Oportunidad, Portafolio, Privado de Proyecto, Inversionista
**Operaciones:** Listar, subir, eliminar, crear carpetas

### FT-013: Noticias
**Prioridad:** P1 — Comunicación
**Descripción:** Publicación de comunicados para inversionistas
**Campos:** título, contenido, publicado, fecha
**Scope:** General, por fondo

### FT-014: Posición Financiera de Proyecto
**Prioridad:** P1 — Reportes
**Descripción:** Reporte consolidado por proyecto
**Métricas:** Inversión recibida, gastos, comisiones, retornos, utilidad/pérdida

### FT-015: Sync Firebase
**Prioridad:** P0 — Integración
**Descripción:** Sincronización automática a Firebase para app móvil
**Tracking:** Campo `sincronizado_firebase` por entidad

### FT-016: Multi-moneda
**Prioridad:** P0 — Core
**Descripción:** Soporte para múltiples monedas con tipo de cambio manual
**Monedas:** MXN, USD, EUR, ILS

### FT-017: RBAC
**Prioridad:** P0 — Seguridad
**Descripción:** Control de acceso basado en roles
**Roles MVP:** Super Admin (100), Admin de Fondo (80)
**Aislamiento:** Por fondo

### FT-018: PWA
**Prioridad:** P1 — UX
**Descripción:** Panel instalable como Progressive Web App
**Capacidades:** Instalable, Service Worker básico, iconos/splash

### FT-019: Hurdle Rate
**Prioridad:** P0 — Core
**Descripción:** Umbral mínimo de retorno antes de cobrar Success Fee
**Lógica:** Si retorno < hurdle → No Success Fee. Si > hurdle → Fee solo sobre excedente
**Configuración:** A nivel proyecto (tiene_hurdle, tasa_hurdle)

### FT-020: Videos por Proyecto
**Prioridad:** P1 — Contenido
**Descripción:** Videos asociados a proyectos para app móvil (sync Firebase)
**Campos:** proyecto, tipo, url, título, activo
**Sync:** A Firebase Storage para visualización en app

---

## Non-Goals (Post-MVP)

| ID | Feature | Razón |
|----|---------|-------|
| NG-001 | Reportes avanzados (TIR, IRR) | Complejidad, no crítico para operación |
| NG-002 | Rol Agente de Ventas | MVP solo Super Admin + Admin Fondo |
| NG-003 | Comisiones por referido | Scope reducido |
| NG-004 | Notificaciones push | Requiere infraestructura adicional |
| NG-005 | Multi-idioma | MVP solo español |
| NG-006 | Importación masiva Sheets | Migración manual inicial |
| NG-007 | API pública | Sin requerimiento externo |

---

## Feature Dependencies

```
FT-001 (Fondos) ──► FT-002 (Proyectos) ──► FT-004 (Inversiones)
                          │                      │
                          ▼                      ▼
                   FT-003 (Inversionistas) ◄─────┘
                          │
                          ▼
                   FT-006 (Movimientos) ──► FT-007 (Pref)
                          │                      │
                          ▼                      ▼
                   FT-008 (Reparto) ◄────────────┘
                          │
                          ▼
                   FT-015 (Firebase Sync)
```

---

## Open Questions

| # | Pregunta | Impacto | Owner | Estado |
|---|----------|---------|-------|--------|
| OQ-01 | ~~Frecuencia del cálculo de Pref~~ | ~~Alto~~ | Dev | ✅ Resuelto: **Cron nocturno** |
| OQ-02 | ¿Los movimientos cancelados revierten el sync a Firebase? | Med | Dev | Pendiente |

---

## Assumptions

| # | Supuesto | Si es incorrecto |
|---|----------|------------------|
| A-01 | Todos los features MVP son bloqueantes para go-live | Impacto: Priorización |
| A-02 | Admin Fee se configura por inversión, no globalmente | Impacto: Data model |

---

*Generado por TimeKast Factory — /docs*
