# 📝 User Stories — Adi Capital Admin

> Generado desde Discovery Brief §3 y Feature Map por `/docs`
> **Fuente:** `docs/planning/00_DISCOVERY_BRIEFING.md`
> **SSOT:** Este documento define las historias de usuario.

---

## Nomenclatura

| Prefijo | Significado |
|---------|-------------|
| US-0XX | Catálogos (Fondos, Proyectos, Inversionistas, Inversiones) |
| US-03X | Movimientos Base |
| US-04X-05X | Tipos de Movimientos |
| US-06X | Cálculos Automáticos |
| US-08X | Integraciones |
| US-09X | Comunicaciones |
| US-10X | Panel Admin |

---

## Catálogos: Fondos (FT-001)

### US-001: Crear Fondo

**Como** P-001 (Super Admin)
**Quiero** crear un nuevo fondo de inversión
**Para** gestionar las operaciones de diferentes vehículos de inversión por separado

| Campo | Valor |
|-------|-------|
| Feature | FT-001 |
| Prioridad | 🔴 Must |
| Entidades | E-001 (fondos) |
| Reglas | BR-001, BR-002 |

**Acceptance Criteria:**
```gherkin
Given que soy Super Admin
When creo un fondo con nombre "Adi Capital", moneda base "USD", método cascada "pref_primero"
Then el fondo se guarda con estado activo
And aparece en la lista de fondos
```

**Campos requeridos:**
- Nombre (único)
- Slug (auto-generado)
- Moneda base (MXN, USD, EUR, ILS)
- Método cascada (pref_primero | capital_primero)

---

### US-002: Editar Fondo

**Como** P-001 (Super Admin)
**Quiero** modificar la configuración de un fondo
**Para** ajustar parámetros operativos

| Campo | Valor |
|-------|-------|
| Feature | FT-001 |
| Prioridad | 🟡 Should |
| Entidades | E-001 |
| Reglas | BR-003 |

**Acceptance Criteria:**
```gherkin
Given que existe el fondo "Adi Capital"
When modifico el método de cascada a "capital_primero"
Then el cambio aplica a proyectos sin override
And proyectos con override mantienen su configuración
```

---

### US-003: Ver Lista de Fondos

**Como** P-001 (Super Admin) o P-002 (Admin de Fondo)
**Quiero** ver la lista de fondos según mi nivel de acceso
**Para** navegar a la gestión de cada fondo

| Campo | Valor |
|-------|-------|
| Feature | FT-001 |
| Prioridad | 🔴 Must |
| Entidades | E-001 |
| Reglas | BR-052, BR-063 |

**Acceptance Criteria:**
```gherkin
Given que soy Super Admin
Then veo todos los fondos del sistema

Given que soy Admin de Fondo asignado a Kentucky
Then solo veo el fondo Kentucky
And no tengo visibilidad de Adi Capital
```

---

## Catálogos: Proyectos (FT-002)

### US-004: Crear Proyecto

**Como** P-001 o P-002
**Quiero** crear un nuevo proyecto de inversión
**Para** registrar oportunidades donde el fondo invertirá

| Campo | Valor |
|-------|-------|
| Feature | FT-002 |
| Prioridad | 🔴 Must |
| Entidades | E-002 (proyectos) |
| Reglas | BR-004, BR-005 |

**Campos requeridos:**
- Código (único dentro del fondo)
- Nombre
- Fondo padre
- Tasa Pref (%)
- Success Fee (%)
- Método cascada (hereda de fondo o override)

**Campos opcionales:**
- Descripción
- Fecha inicio estimada
- Fecha terminación estimada
- Hero image ID
- Docs folder ID

---

### US-005: Configurar Tasas de Proyecto

**Como** P-001 o P-002
**Quiero** configurar las tasas de Pref y Success Fee del proyecto
**Para** que los cálculos automáticos usen los valores correctos

| Campo | Valor |
|-------|-------|
| Feature | FT-002 |
| Prioridad | 🔴 Must |
| Entidades | E-002 |
| Reglas | BR-006, BR-007 |

**Acceptance Criteria:**
```gherkin
Given que creo el proyecto "Marina Tower" con tasa Pref 12%
When un inversionista aporta $100,000
Then el Pref diario se calcula como ($100,000 × 12%) / 365 = $32.88
```

---

### US-006: Ver Detalle de Proyecto

**Como** P-001 o P-002
**Quiero** ver el detalle completo de un proyecto
**Para** conocer su estado financiero y participantes

| Campo | Valor |
|-------|-------|
| Feature | FT-002 |
| Prioridad | 🔴 Must |
| Entidades | E-002, E-004, E-005 |

**Información mostrada:**
- Datos generales (nombre, código, tasas)
- Posición financiera (inversión recibida, retornos, gastos)
- Lista de inversionistas participantes
- Movimientos del proyecto
- Documentos asociados

---

### US-007: Cambiar Estado de Proyecto

**Como** P-001 o P-002
**Quiero** marcar un proyecto como concluido o cerrar la inversión
**Para** reflejar su estado real

| Campo | Valor |
|-------|-------|
| Feature | FT-002 |
| Prioridad | 🟡 Should |
| Entidades | E-002 |
| Reglas | BR-008 |

**Estados:**
- **Inversión abierta:** Acepta nuevos inversionistas
- **Inversión cerrada:** No acepta nuevos, puede recibir aportaciones de existentes
- **Concluido:** Proyecto terminado, solo historia

---

### US-008: Ver Posición Financiera del Proyecto

**Como** P-001 o P-002
**Quiero** ver un resumen de la posición financiera del proyecto
**Para** conocer inversión, gastos, retornos y utilidad

| Campo | Valor |
|-------|-------|
| Feature | FT-002 |
| Prioridad | 🟡 Should |
| Entidades | E-002, E-005 |
| Reglas | BR-009 |

**Métricas:**
- Inversión recibida (SUM INV)
- Gastos del proyecto (SUM GASP)
- Retornos recibidos (SUM RET)
- Utilidad/Pérdida (calculado)

---

## Catálogos: Inversionistas (FT-003)

### US-009: Crear Inversionista

**Como** P-001 o P-002
**Quiero** registrar un nuevo inversionista
**Para** que pueda participar en proyectos del fondo

| Campo | Valor |
|-------|-------|
| Feature | FT-003 |
| Prioridad | 🔴 Must |
| Entidades | E-003 (inversionistas) |
| Reglas | BR-010, BR-011 |

**Campos requeridos:**
- Nombre completo
- Email (único)
- Teléfono
- Fondo(s) donde participa
- Es fundador (boolean)

**Campos opcionales:**
- Agente asignado
- Porcentaje propiedad (si fundador)
- Docs folder ID

---

### US-010: Marcar Inversionista como Fundador

**Como** P-001 o P-002
**Quiero** marcar a un inversionista como fundador/socio
**Para** que tenga acceso a movimientos exclusivos (APS, RPS, PRS, DPRS)

| Campo | Valor |
|-------|-------|
| Feature | FT-003 |
| Prioridad | 🟡 Should |
| Entidades | E-003 |
| Reglas | BR-012 |

**Acceptance Criteria:**
```gherkin
Given que un inversionista es fundador
Then puede recibir movimientos de tipo Socio (APS, RPS, PRS, DPRS)

Given que un inversionista NO es fundador
Then NO puede recibir movimientos de tipo Socio
And el sistema muestra error si se intenta
```

---

### US-011: Ver Lista de Inversionistas

**Como** P-001 o P-002
**Quiero** ver la lista de inversionistas de mi(s) fondo(s)
**Para** navegar a su detalle

| Campo | Valor |
|-------|-------|
| Feature | FT-003 |
| Prioridad | 🔴 Must |
| Entidades | E-003 |
| Reglas | BR-052, BR-063 |

**Filtros:**
- Por fondo
- Por estado (activo/inactivo)
- Por tipo (fundador/regular)
- Búsqueda por nombre/email

---

### US-012: Ver Detalle de Inversionista

**Como** P-001 o P-002
**Quiero** ver el detalle de un inversionista
**Para** conocer su participación y movimientos

| Campo | Valor |
|-------|-------|
| Feature | FT-003 |
| Prioridad | 🔴 Must |
| Entidades | E-003, E-004 |

**Información mostrada:**
- Datos personales
- Lista de inversiones por proyecto
- Saldos y posición
- Movimientos
- Documentos personales

---

### US-013: Asignar Agente a Inversionista

**Como** P-001 o P-002
**Quiero** asignar un agente de ventas a un inversionista
**Para** dar seguimiento y calcular comisiones (Post-MVP)

| Campo | Valor |
|-------|-------|
| Feature | FT-003 |
| Prioridad | ⚪ Could |
| Entidades | E-003 |

---

## Catálogos: Inversiones (FT-004)

### US-014: Crear Inversión

**Como** P-001 o P-002
**Quiero** registrar una inversión que vincula un inversionista con un proyecto
**Para** que el inversionista pueda aportar capital

| Campo | Valor |
|-------|-------|
| Feature | FT-004 |
| Prioridad | 🔴 Must |
| Entidades | E-004 (inversiones) |
| Reglas | BR-013, BR-014 |

**Campos requeridos:**
- Código (único)
- Inversionista
- Proyecto
- Monto compromiso
- Configuración Admin Fee

**Campos calculados (cached):**
- Capital aportado
- Pref acumulado
- Pref pagado
- Saldo compromiso

---

### US-015: Configurar Admin Fee de Inversión

**Como** P-001 o P-002
**Quiero** configurar cómo se cobra el Admin Fee en esta inversión
**Para** aplicar las reglas correctas de comisión

| Campo | Valor |
|-------|-------|
| Feature | FT-004 |
| Prioridad | 🟡 Should |
| Entidades | E-004 |
| Reglas | BR-015, BR-016 |

**Configuración:**
- Tipo: one_time | anual
- Porcentaje (%)
- Base: compromiso | aportado
- Método: capital_call_independiente | incluido_en_capital_call
- Presentación: desglosado | integrado

---

### US-016: Ver Estado del Compromiso

**Como** P-001 o P-002
**Quiero** ver cuánto ha aportado un inversionista vs su compromiso
**Para** dar seguimiento a cuentas por cobrar

| Campo | Valor |
|-------|-------|
| Feature | FT-004 |
| Prioridad | 🔴 Must |
| Entidades | E-004, E-005 |
| Reglas | BR-017 |

**Estados del compromiso:**
- **Pendiente:** Sin aportaciones
- **Parcial:** 0 < aportado < compromiso
- **Completado:** aportado = compromiso
- **Excedido:** aportado > compromiso

---

### US-017: Ver Lista de Inversiones por Proyecto

**Como** P-001 o P-002
**Quiero** ver todas las inversiones de un proyecto
**Para** conocer la estructura de participación

| Campo | Valor |
|-------|-------|
| Feature | FT-004 |
| Prioridad | 🔴 Must |
| Entidades | E-004 |

---

### US-018: Ver Lista de Inversiones por Inversionista

**Como** P-001 o P-002
**Quiero** ver todas las inversiones de un inversionista
**Para** conocer su participación total en el fondo

| Campo | Valor |
|-------|-------|
| Feature | FT-004 |
| Prioridad | 🔴 Must |
| Entidades | E-004 |

---

## Catálogos: Calendario de Pagos (FT-005)

### US-019: Crear Capital Call

**Como** P-001 o P-002
**Quiero** programar un capital call para una inversión
**Para** solicitar aportaciones según calendario

| Campo | Valor |
|-------|-------|
| Feature | FT-005 |
| Prioridad | 🟡 Should |
| Entidades | E-006 (calendario_pagos) |
| Reglas | BR-018 |

**Campos:**
- Número de call (secuencial)
- Fecha programada
- Monto esperado
- Estado (pendiente | parcial | completo)

---

### US-020: Registrar Pago de Capital Call

**Como** P-001 o P-002
**Quiero** marcar un capital call como pagado (total o parcial)
**Para** reflejar las aportaciones recibidas

| Campo | Valor |
|-------|-------|
| Feature | FT-005 |
| Prioridad | 🟡 Should |
| Entidades | E-006, E-005 |

---

### US-021: Ver Calendario de Pagos

**Como** P-001 o P-002
**Quiero** ver el calendario de pagos de una inversión
**Para** dar seguimiento a los calls pendientes

| Campo | Valor |
|-------|-------|
| Feature | FT-005 |
| Prioridad | 🟡 Should |
| Entidades | E-006 |

---

## Movimientos: Base (FT-010)

### US-030: Crear Movimiento Borrador

**Como** P-001 o P-002
**Quiero** registrar un movimiento en estado borrador
**Para** preparar operaciones sin afectar saldos todavía

| Campo | Valor |
|-------|-------|
| Feature | FT-010 |
| Prioridad | 🔴 Must |
| Entidades | E-005 (movimientos) |
| Reglas | BR-020, BR-021 |

**Estados:**
- **Borrador:** Editable, no afecta cálculos
- **Confirmado:** Inmutable, afecta saldos
- **Cancelado:** Lógica inversa, histórico

---

### US-031: Confirmar Movimiento

**Como** P-001 o P-002
**Quiero** confirmar un movimiento borrador
**Para** que afecte los saldos y se sincronice

| Campo | Valor |
|-------|-------|
| Feature | FT-010 |
| Prioridad | 🔴 Must |
| Entidades | E-005 |
| Reglas | BR-022, BR-023 |

**Acceptance Criteria:**
```gherkin
Given que tengo un movimiento APO en borrador por $10,000
When confirmo el movimiento
Then el capital_aportado del inversionista aumenta $10,000
And el saldo_compromiso disminuye $10,000
And el movimiento queda inmutable
And se marca para sincronizar a Firebase
```

---

### US-032: Cancelar Movimiento

**Como** P-001 o P-002
**Quiero** cancelar un movimiento confirmado
**Para** revertir una operación incorrecta

| Campo | Valor |
|-------|-------|
| Feature | FT-010 |
| Prioridad | 🔴 Must |
| Entidades | E-005 |
| Reglas | BR-024 |

**Acceptance Criteria:**
```gherkin
Given que tengo un movimiento APO confirmado por $10,000
When cancelo el movimiento
Then el capital_aportado del inversionista disminuye $10,000
And el movimiento cambia a estado Cancelado
And el movimiento original queda en historial
```

---

### US-033: Ver Lista de Movimientos

**Como** P-001 o P-002
**Quiero** ver la lista de movimientos con filtros
**Para** navegar y buscar operaciones

| Campo | Valor |
|-------|-------|
| Feature | FT-010 |
| Prioridad | 🔴 Must |
| Entidades | E-005 |

**Filtros:**
- Por fondo
- Por proyecto
- Por inversionista
- Por concepto (18 tipos)
- Por estado
- Por fecha
- Por moneda

---

### US-034: Ver Detalle de Movimiento

**Como** P-001 o P-002
**Quiero** ver el detalle completo de un movimiento
**Para** conocer todos sus datos y referencias

| Campo | Valor |
|-------|-------|
| Feature | FT-010 |
| Prioridad | 🔴 Must |
| Entidades | E-005 |

---

### US-035: Agrupar Movimientos Relacionados

**Como** P-001 o P-002
**Quiero** que los movimientos relacionados compartan un grupo
**Para** rastrear operaciones multi-línea

| Campo | Valor |
|-------|-------|
| Feature | FT-010 |
| Prioridad | 🟡 Should |
| Entidades | E-005 |
| Reglas | BR-025 |

---

## Cálculos Automáticos (FT-020, FT-021, FT-022, FT-023)

### US-060: Calcular Pref Diario

**Como** Sistema
**Quiero** calcular el Pref acumulado diariamente
**Para** mantener actualizados los intereses de cada inversión

| Campo | Valor |
|-------|-------|
| Feature | FT-020 |
| Prioridad | 🔴 Must |
| Entidades | E-004 |
| Reglas | BR-030, BR-031 |

**Fórmula:**
```
Pref diario = (capital_aportado × tasa_pref) / 365
```

---

### US-063: Ejecutar Wizard de Reparto

**Como** P-001 o P-002
**Quiero** usar un asistente para distribuir capital y utilidades
**Para** calcular automáticamente qué corresponde a cada inversionista

| Campo | Valor |
|-------|-------|
| Feature | FT-021 |
| Prioridad | 🔴 Must |
| Entidades | E-004, E-005 |
| Reglas | BR-035, BR-036, BR-037 |

**Flujo:**
1. Seleccionar proyecto
2. Ingresar monto total a distribuir
3. Sistema calcula distribución por inversionista según cascada
4. Preview con desglose
5. Confirmar → genera movimientos DIS + FEE

---

### US-064: Calcular Cascada Pref Primero

**Como** Sistema
**Quiero** aplicar el método "Pref primero" en distribuciones
**Para** que Adi Capital reparta según sus reglas

| Campo | Valor |
|-------|-------|
| Feature | FT-021 |
| Prioridad | 🔴 Must |
| Entidades | E-004, E-005 |
| Reglas | BR-036 |

**Lógica:**
```
1. Reparto reduce Pref acumulado primero
2. Luego reduce Capital
3. Pref sigue acumulando sobre capital completo
```

---

### US-065: Calcular Cascada Capital Primero

**Como** Sistema
**Quiero** aplicar el método "Capital primero" en distribuciones
**Para** que Kentucky reparta según sus reglas

| Campo | Valor |
|-------|-------|
| Feature | FT-021 |
| Prioridad | 🔴 Must |
| Entidades | E-004, E-005 |
| Reglas | BR-037 |

**Lógica:**
```
1. Reparto reduce Capital primero
2. Luego reduce Pref
3. Pref acumula sobre capital reducido
```

---

### US-068: Calcular Success Fee

**Como** Sistema
**Quiero** calcular automáticamente el Success Fee en distribuciones
**Para** generar el movimiento FEE correspondiente

| Campo | Valor |
|-------|-------|
| Feature | FT-022 |
| Prioridad | 🔴 Must |
| Entidades | E-005 |
| Reglas | BR-040 |

**Fórmula:**
```
Utilidad = Monto Reparto - Capital Invertido
Success Fee = Utilidad × success_fee_porcentaje
```

---

### US-070: Calcular Saldo Compromiso

**Como** Sistema
**Quiero** mantener actualizado el saldo del compromiso
**Para** mostrar cuánto falta por aportar

| Campo | Valor |
|-------|-------|
| Feature | FT-023 |
| Prioridad | 🔴 Must |
| Entidades | E-004, E-005 |
| Reglas | BR-017 |

**Fórmula:**
```
saldo_compromiso = compromiso - SUM(APO confirmados)
```

---

## Integraciones (FT-030, FT-031, FT-032)

### US-080: Navegar Documentos

**Como** P-001 o P-002
**Quiero** navegar por la estructura de documentos
**Para** encontrar archivos de proyectos e inversionistas

| Campo | Valor |
|-------|-------|
| Feature | FT-030 |
| Prioridad | 🔴 Must |
| Entidades | E-007 (documentos) |
| Reglas | BR-045, BR-046 |

**Estructura:**
```
/Proyectos/{code}/Oportunidad/     → Públicos
/Proyectos/{code}/Portafolio/      → Públicos
/Proyectos/{code}/Privado/         → Solo participantes
/Inversionistas/{name}/{project}/   → Solo ese inversionista
```

---

### US-081: Subir Documento

**Como** P-001 o P-002
**Quiero** subir un documento a la carpeta correspondiente
**Para** mantener archivos organizados

| Campo | Valor |
|-------|-------|
| Feature | FT-030 |
| Prioridad | 🔴 Must |
| Entidades | E-007 |

---

### US-086: Sincronizar a Firebase

**Como** Sistema
**Quiero** sincronizar datos confirmados a Firebase
**Para** que la app móvil muestre información actualizada

| Campo | Valor |
|-------|-------|
| Feature | FT-031 |
| Prioridad | 🔴 Must |
| Entidades | Todas |
| Reglas | BR-048, BR-049 |

**Tracking:**
- Campo `sincronizado_firebase` por entidad
- Sync se dispara al confirmar movimientos

---

### US-090: Registrar Tipo de Cambio

**Como** P-001 o P-002
**Quiero** registrar el tipo de cambio al crear movimientos
**Para** convertir a moneda base del fondo

| Campo | Valor |
|-------|-------|
| Feature | FT-032 |
| Prioridad | 🔴 Must |
| Entidades | E-005 |
| Reglas | BR-050 |

---

## Panel Admin (FT-050, FT-051, FT-052, FT-053)

### US-100: Ver Dashboard

**Como** P-001 o P-002
**Quiero** ver un dashboard con métricas clave
**Para** tener visión general del estado de los fondos

| Campo | Valor |
|-------|-------|
| Feature | FT-050 |
| Prioridad | 🟡 Should |
| Entidades | Varias |

**Métricas:**
- Total capital bajo administración
- Proyectos activos / concluidos
- Inversionistas activos
- Movimientos pendientes de confirmar

---

### US-103: Crear Usuario Admin

**Como** P-001 (Super Admin)
**Quiero** crear usuarios con rol Admin de Fondo
**Para** delegar gestión de fondos específicos

| Campo | Valor |
|-------|-------|
| Feature | FT-051 |
| Prioridad | 🔴 Must |
| Entidades | E-008 (usuarios) |
| Reglas | BR-061 |

---

### US-107: Asignar Fondo a Usuario

**Como** P-001 (Super Admin)
**Quiero** asignar fondos específicos a un Admin de Fondo
**Para** limitar su acceso

| Campo | Valor |
|-------|-------|
| Feature | FT-052 |
| Prioridad | 🔴 Must |
| Entidades | E-008, E-001 |
| Reglas | BR-063 |

---

### US-110: Instalar como PWA

**Como** P-001 o P-002
**Quiero** instalar el panel como aplicación
**Para** acceder rápidamente desde mi dispositivo

| Campo | Valor |
|-------|-------|
| Feature | FT-053 |
| Prioridad | ⚪ Could |

---

## Comunicaciones (FT-040)

### US-095: Crear Noticia

**Como** P-001 o P-002
**Quiero** crear una noticia para los inversionistas
**Para** comunicar novedades a través de la app

| Campo | Valor |
|-------|-------|
| Feature | FT-040 |
| Prioridad | 🟡 Should |
| Entidades | E-009 (noticias) |

**Campos:**
- Título
- Contenido
- Imagen (opcional)
- Fondo target (general | específico)
- Publicado (boolean)

---

### US-096: Publicar Noticia

**Como** P-001 o P-002
**Quiero** publicar una noticia
**Para** que aparezca en la app de inversionistas

| Campo | Valor |
|-------|-------|
| Feature | FT-040 |
| Prioridad | 🟡 Should |
| Entidades | E-009 |

---

## Open Questions

| # | Pregunta | Impacto | Owner |
|---|----------|---------|-------|
| OQ-01 | ¿El Admin de Fondo puede cancelar movimientos confirmados o solo Super Admin? | **Alto** | Cliente |
| OQ-02 | ¿La sincronización a Firebase es inmediata o batch? | **Alto** | Dev |
| OQ-03 | ¿Se requiere confirmación de dos personas para movimientos grandes? | Med | Cliente |

---

## Assumptions

| # | Supuesto | Si es incorrecto |
|---|----------|------------------|
| A-01 | Un movimiento confirmado puede cancelarse en cualquier momento | Impacto: Agregar reglas de ventana de tiempo |
| A-02 | El Pref se calcula una vez al día (no en tiempo real) | Impacto: Requiere cron job |
| A-03 | Los documentos se gestionan por referencia (IDs Drive), no se almacenan en BD | Impacto: Cambio de arquitectura de storage |

---

*Generado por TimeKast Factory — /docs*
