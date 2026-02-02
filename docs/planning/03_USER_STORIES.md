# User Stories — Adi Capital Admin

> Generado desde Discovery Brief por `/docs`
> **Fuente:** `docs/planning/00_DISCOVERY_BRIEFING.md` §3
> **SSOT:** Este documento

---

## Convenciones

- **Formato:** Como **[Persona]**, quiero **[acción]**, para **[beneficio]**
- **AC:** Acceptance Criteria (Given/When/Then)
- **Refs:** Feature (FT-XXX), Rules (BR-XXX), Entities (E-XXX)

---

## FT-001: Gestión de Fondos

### US-001: Ver listado de fondos
**Como** P-001 (Super Admin), **quiero** ver un listado de todos los fondos, **para** tener una vista general de la operación.

| Refs | FT-001, E-001 |
|------|---------------|
| AC-1 | Given usuario autenticado, When accede a /fondos, Then ve tabla con todos los fondos |
| AC-2 | Given hay 2 fondos, Then muestra Adi Capital y Kentucky |

### US-002: Crear/Editar fondo
**Como** P-001 (Super Admin), **quiero** crear o editar un fondo, **para** configurar sus parámetros.

| Refs | FT-001, E-001, BR-003 |
|------|----------------------|
| AC-1 | Given formulario de fondo, When ingreso nombre, moneda base, método cascada, Then se guarda |
| AC-2 | Given fondo existente, When edito método cascada, Then se aplica a nuevos proyectos |

---

## FT-002: Gestión de Proyectos

### US-003: Ver proyectos de un fondo
**Como** P-001/P-002 (Admin), **quiero** ver proyectos de un fondo, **para** gestionar oportunidades de inversión.

| Refs | FT-002, E-002, BR-009 |
|------|----------------------|
| AC-1 | Given Admin de Fondo, When accede a proyectos, Then solo ve proyectos de su fondo asignado |
| AC-2 | Given Super Admin, When accede a proyectos, Then ve todos los proyectos |

### US-004: Crear proyecto
**Como** P-001 (Super Admin), **quiero** crear un proyecto con sus configuraciones, **para** abrir una nueva oportunidad de inversión.

| Refs | FT-002, E-002, BR-003, FT-012 |
|------|------------------------------|
| AC-1 | Given formulario, When ingreso código, nombre, tasa pref, success fee, Then se crea proyecto |
| AC-2 | Given proyecto creado, Then se crea carpeta automática en Drive |

---

## FT-003: Gestión de Inversionistas

### US-005: Ver inversionistas
**Como** P-001/P-002 (Admin), **quiero** ver listado de inversionistas, **para** gestionar sus datos.

| Refs | FT-003, E-003, BR-009 |
|------|----------------------|
| AC-1 | Given Admin, When accede a inversionistas, Then ve solo los de su fondo |
| AC-2 | Given tabla, Then muestra nombre, email, teléfono, es_fundador, agente |

### US-006: Crear inversionista
**Como** P-001/P-002 (Admin), **quiero** crear un inversionista, **para** registrarlo en el sistema.

| Refs | FT-003, E-003, FT-012 |
|------|----------------------|
| AC-1 | Given formulario, When ingreso datos, Then se crea inversionista |
| AC-2 | Given inversionista creado, Then se crea carpeta en Drive |

---

## FT-004: Gestión de Inversiones

### US-007: Ver inversiones de un proyecto
**Como** P-001/P-002 (Admin), **quiero** ver todas las inversiones de un proyecto, **para** conocer la composición de capital.

| Refs | FT-004, E-004, E-002, E-003 |
|------|----------------------------|
| AC-1 | Given proyecto, When accedo a detalle, Then veo tabla de inversiones |
| AC-2 | Given inversión, Then muestra compromiso, aportado, pref acumulado, estado |

### US-008: Crear inversión
**Como** P-001/P-002 (Admin), **quiero** crear una inversión para un inversionista en un proyecto, **para** registrar su participación.

| Refs | FT-004, E-004, BR-005 |
|------|----------------------|
| AC-1 | Given formulario, When selecciono inversionista, proyecto, compromiso, Then se crea |
| AC-2 | Given config Admin Fee, When selecciono tipo y %, Then se guarda configuración |

---

## FT-005: Calendario de Pagos

### US-009: Ver calendario de pagos
**Como** P-001/P-002 (Admin), **quiero** ver el calendario de pagos de una inversión, **para** dar seguimiento a compromisos.

| Refs | FT-005, E-005, BR-005c |
|------|------------------------|
| AC-1 | Given inversión, When accedo a calendario, Then veo pagos programados |
| AC-2 | Given pagos, Then muestra fecha, monto esperado, monto pagado, saldo pendiente |

### US-010: Registrar pago de capital call
**Como** P-001/P-002 (Admin), **quiero** registrar cuando un inversionista paga un capital call, **para** actualizar el saldo.

| Refs | FT-005, FT-006, E-005, BR-005c |
|------|-------------------------------|
| AC-1 | Given pago pendiente, When registro monto pagado, Then actualiza saldo |
| AC-2 | Given pago total, When compromiso = 0, Then estado cambia a Completado |

---

## FT-006: Sistema de Movimientos

### US-011: Ver movimientos
**Como** P-001/P-002 (Admin), **quiero** ver el historial de movimientos, **para** revisar transacciones.

| Refs | FT-006, E-006, BR-001 |
|------|----------------------|
| AC-1 | Given página movimientos, Then veo tabla con filtros por fecha, concepto, estado |
| AC-2 | Given movimientos, Then muestra concepto, monto, moneda, estado, inversionista/proyecto |

### US-012: Crear movimiento borrador
**Como** P-001/P-002 (Admin), **quiero** crear un movimiento en estado borrador, **para** registrar sin afectar saldos.

| Refs | FT-006, E-006, BR-002, BR-008 |
|------|------------------------------|
| AC-1 | Given formulario, When selecciono concepto, Then muestra campos requeridos |
| AC-2 | Given APO, When ingreso inversionista + inversión + monto, Then se crea borrador |
| AC-3 | Given borrador, Then NO afecta cálculos de saldo ni pref |

### US-013: Confirmar movimiento
**Como** P-001 (Super Admin), **quiero** confirmar un movimiento, **para** que afecte los saldos.

| Refs | FT-006, E-006, BR-002, FT-015 |
|------|------------------------------|
| AC-1 | Given movimiento borrador, When confirmo, Then estado = Confirmado |
| AC-2 | Given confirmado, Then actualiza cached_* en entidades relacionadas |
| AC-3 | Given confirmado, Then se marca para sync a Firebase |

### US-014: Cancelar movimiento
**Como** P-001 (Super Admin), **quiero** cancelar un movimiento confirmado, **para** revertir una operación.

| Refs | FT-006, E-006, BR-002 |
|------|----------------------|
| AC-1 | Given movimiento confirmado, When cancelo, Then estado = Cancelado |
| AC-2 | Given cancelado, Then aplica lógica inversa a saldos |
| AC-3 | Given cancelado, Then queda en historial (no se elimina) |

---

## FT-007: Cálculo de Pref

### US-015: Calcular pref acumulado
**Como** Sistema, **quiero** calcular el interés preferencial diariamente, **para** mantener el pref_acumulado actualizado.

| Refs | FT-007, E-004, BR-004 |
|------|----------------------|
| AC-1 | Given inversión activa, When ejecuta cálculo, Then pref += (capital × tasa) / 365 |
| AC-2 | Given método Pref Primero, When hay reparto, Then reduce pref antes que capital |

---

## FT-008: Wizard de Reparto

### US-016: Iniciar wizard de reparto
**Como** P-001 (Super Admin), **quiero** iniciar el wizard de reparto, **para** distribuir capital + utilidades.

| Refs | FT-008, FT-006, BR-003, BR-005 |
|------|-------------------------------|
| AC-1 | Given proyecto con capital, When inicio wizard, Then selecciono proyecto |
| AC-2 | Given monto a repartir, Then sistema calcula cascada según método |
| AC-3 | Given preview, Then muestra desglose por inversionista |

### US-017: Confirmar distribución
**Como** P-001 (Super Admin), **quiero** confirmar la distribución, **para** generar los movimientos.

| Refs | FT-008, FT-006, BR-003, BR-005 |
|------|-------------------------------|
| AC-1 | Given preview aprobado, When confirmo, Then genera movimientos DIS |
| AC-2 | Given utilidad > 0, Then genera movimientos FEE automáticamente |
| AC-3 | Given movimientos generados, Then estado = Confirmado |

---

## FT-012: Gestión Documental

### US-018: Ver documentos de proyecto
**Como** P-001/P-002 (Admin), **quiero** ver documentos de un proyecto, **para** acceder a la información.

| Refs | FT-012, BR-010 |
|------|----------------|
| AC-1 | Given proyecto, When accedo a docs, Then veo explorador tipo Drive |
| AC-2 | Given niveles, Then veo Oportunidad, Portafolio, Privado según permisos |

### US-019: Subir documento
**Como** P-001/P-002 (Admin), **quiero** subir un documento, **para** compartirlo con inversionistas.

| Refs | FT-012 |
|------|--------|
| AC-1 | Given carpeta seleccionada, When subo archivo, Then aparece en listado |
| AC-2 | Given upload exitoso, Then documento visible según nivel de visibilidad |

---

## FT-013: Noticias

### US-020: Publicar noticia
**Como** P-001 (Super Admin), **quiero** publicar una noticia, **para** comunicar a inversionistas.

| Refs | FT-013, FT-015 |
|------|----------------|
| AC-1 | Given formulario, When ingreso título, contenido, imagen, Then se publica |
| AC-2 | Given noticia publicada, Then se sincroniza a Firebase |
| AC-3 | Given scope, Then puedo elegir General o fondo específico |

---

## FT-014: Posición Financiera

### US-021: Ver posición financiera de proyecto
**Como** P-001/P-002 (Admin), **quiero** ver la posición financiera de un proyecto, **para** conocer su estado.

| Refs | FT-014, BR-005d |
|------|-----------------|
| AC-1 | Given proyecto, When accedo a posición, Then veo reporte consolidado |
| AC-2 | Given reporte, Then muestra inversión, gastos, comisiones, retornos, utilidad/pérdida |

---

## Open Questions

| # | Pregunta | Impacto | Owner |
|---|----------|---------|-------|
| OQ-01 | ¿US-013: Admin de Fondo puede confirmar movimientos o solo Super Admin? | **Alto** | Cliente |
| OQ-02 | ¿US-016: Wizard permite preview sin confirmar para revisión? | Med | Dev |

---

## Assumptions

| # | Supuesto | Si es incorrecto |
|---|----------|------------------|
| A-01 | Todos los movimientos pasan por estado Borrador antes de Confirmar | Impacto: Flujo diferente |
| A-02 | Solo Super Admin puede ejecutar Wizard de Reparto | Impacto: Permisos |

---

*Generado por TimeKast Factory — /docs*
