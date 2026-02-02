# User Personas — Adi Capital Admin

> Generado desde Discovery Brief por `/docs`
> **Fuente:** `docs/planning/00_DISCOVERY_BRIEFING.md` §2
> **SSOT:** Este documento

---

## P-001: Super Admin

**Usuarios:** Abraham Cohen, Olga
**Prioridad de Rol:** 100 (máxima)
**Plataforma:** Web Admin

### Perfil
Administrador principal de la operación de fondos. Tiene visibilidad y control total sobre Adi Capital y Kentucky.

### Jobs To Be Done (JTBD)
1. Gestionar la operación completa de todos los fondos
2. Confirmar movimientos financieros críticos
3. Supervisar cálculos de Pref y distribuciones
4. Administrar usuarios y permisos del sistema
5. Publicar noticias y comunicados a inversionistas

### Frecuencia de Uso
- **Diario:** Revisar movimientos pendientes, confirmar operaciones
- **Semanal:** Revisar reportes, publicar actualizaciones
- **Mensual:** Gestionar distribuciones, nuevas inversiones

### Device/Context
- Desktop primario (oficina)
- Tablet/móvil para revisiones rápidas

### Permisos
Ver **BR-001 → BR-010** (RBAC Rules)

---

## P-002: Admin de Fondo

**Usuarios:** Operadores asignados a un fondo específico
**Prioridad de Rol:** 80
**Plataforma:** Web Admin

### Perfil
Administrador operativo con acceso limitado a un solo fondo (Adi Capital O Kentucky, no ambos).

### Jobs To Be Done (JTBD)
1. Registrar movimientos financieros de su fondo
2. Gestionar inversionistas y proyectos asignados
3. Subir y organizar documentos
4. Revisar calendarios de pagos y compromisos

### Frecuencia de Uso
- **Diario:** Registrar movimientos, actualizar estados
- **Semanal:** Gestión documental, seguimiento de compromisos

### Device/Context
- Desktop (oficina)
- Acceso remoto ocasional

### Permisos
Ver **BR-011 → BR-015** (RBAC Rules)
**Restricción:** Solo puede ver/editar datos de su fondo asignado

---

## P-003: Agente de Ventas

**Usuarios:** Referidores de inversionistas
**Prioridad de Rol:** 40
**Plataforma:** Web Admin (Post-MVP)
**Estado:** ⏳ Post-MVP

### Perfil
Persona que refiere inversionistas y recibe comisiones. Acceso read-only limitado a las inversiones que gestiona.

### Jobs To Be Done (JTBD)
1. Ver estado de inversiones de sus referidos
2. Consultar comisiones generadas
3. Monitorear actividad de sus clientes

### Frecuencia de Uso
- **Semanal:** Consulta de estado
- **Mensual:** Revisión de comisiones

### Device/Context
- Móvil primario
- Desktop ocasional

### Permisos
- Read-only en inversiones que gestiona
- Sin acceso a movimientos ni configuración

---

## P-004: Inversionista

**Usuarios:** Participantes de los fondos
**Prioridad de Rol:** 30
**Plataforma:** App Móvil (Flutter iOS/Web) — **NO modificada**

### Perfil
Persona que invierte capital en proyectos de los fondos. Accede a su información mediante la app móvil existente.

### Jobs To Be Done (JTBD)
1. Ver sus inversiones y rendimientos
2. Consultar documentos de sus proyectos
3. Recibir actualizaciones y noticias
4. Ver estado de compromisos pendientes

### Frecuencia de Uso
- **Semanal:** Consulta de estado
- **Después de distribuciones:** Verificar montos

### Device/Context
- iOS App primario
- Web App como alternativa

### Permisos
- Read-only de sus propios datos
- Aislamiento total entre fondos (si participa en ambos)

---

## Matriz de Acceso por Rol

| Recurso | P-001 Super | P-002 Admin Fondo | P-003 Agente | P-004 Inversionista |
|---------|-------------|-------------------|--------------|---------------------|
| Ver todos los fondos | ✅ | ❌ (solo asignado) | ❌ | ❌ |
| CRUD Fondos | ✅ | ❌ | ❌ | ❌ |
| CRUD Proyectos | ✅ | ✅ (su fondo) | ❌ | ❌ |
| CRUD Inversionistas | ✅ | ✅ (su fondo) | ❌ | ❌ |
| CRUD Inversiones | ✅ | ✅ (su fondo) | ❌ | ❌ |
| Registrar Movimientos | ✅ | ✅ (su fondo) | ❌ | ❌ |
| Confirmar Movimientos | ✅ | ⚠️ (limitado) | ❌ | ❌ |
| Wizard Reparto | ✅ | ❌ | ❌ | ❌ |
| Gestión Usuarios | ✅ | ❌ | ❌ | ❌ |
| Ver Documentos | ✅ (todos) | ✅ (su fondo) | ❌ | ✅ (propios) |
| Publicar Noticias | ✅ | ❌ | ❌ | ❌ |

---

## Open Questions

| # | Pregunta | Impacto | Owner |
|---|----------|---------|-------|
| OQ-01 | ¿Admin de Fondo puede confirmar movimientos o solo registrar borradores? | **Alto** | Cliente |
| OQ-02 | ¿Habrá más Super Admins además de Abraham y Olga? | Bajo | Cliente |

---

## Assumptions

| # | Supuesto | Si es incorrecto |
|---|----------|------------------|
| A-01 | Solo hay 2 fondos activos (Adi Capital, Kentucky) | Impacto: Schema multi-tenant |
| A-02 | Inversionistas usan app existente sin cambios | Impacto: No hay UI de inversionista en Admin |
| A-03 | Agente de Ventas es completamente Post-MVP | Impacto: Priorización de features |

---

*Generado por TimeKast Factory — /docs*
