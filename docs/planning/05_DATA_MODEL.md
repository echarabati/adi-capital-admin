# Data Model — Adi Capital Admin

> Generado desde Discovery Brief por `/docs`
> **Fuente:** `docs/planning/00_DISCOVERY_BRIEFING.md` §4
> **SSOT:** `lib/db/schema/*` cuando exista (este doc es referencia)

---

## Diagrama de Entidades

```
┌─────────────┐
│   E-001     │
│   FONDO     │ (Adi Capital, Kentucky)
└──────┬──────┘
       │ 1:N
       ▼
┌─────────────┐        ┌─────────────┐
│   E-002     │◄──N:M──│   E-003     │
│  PROYECTO   │        │INVERSIONISTA│
└──────┬──────┘        └──────┬──────┘
       │                      │
       │      ┌───────────────┴───────────────┐
       │      ▼                               │
       │ ┌─────────────┐                      │
       └─│   E-004     │◄─────────────────────┘
         │  INVERSIÓN  │ (participación)
         └──────┬──────┘
                │ 1:N
                ▼
         ┌─────────────┐
         │   E-006     │
         │ MOVIMIENTO  │
         └─────────────┘
```

---

## Entidades

### E-001: Fondo

**Descripción:** Entidad de inversión principal (Adi Capital, Kentucky)

| Campo | Tipo | Constraints | Notas |
|-------|------|-------------|-------|
| id | uuid | PK | — |
| nombre | varchar(100) | NOT NULL, UNIQUE | "Adi Capital", "Kentucky" |
| slug | varchar(50) | NOT NULL, UNIQUE | "adicapital", "kentucky" |
| moneda_base | enum | NOT NULL | MXN, USD, EUR, ILS |
| metodo_cascada | enum | NOT NULL, DEFAULT 'pref_primero' | pref_primero, capital_primero |
| capital_socios | decimal(18,2) | DEFAULT 0 | Cached desde APS/RPS |
| created_at | timestamp | NOT NULL, DEFAULT now() | — |
| updated_at | timestamp | NOT NULL | — |
| **deleted_at** | timestamp | NULL | Soft-delete |

**Índices:** `slug` (UNIQUE)

---

### E-002: Proyecto

**Descripción:** Oportunidad de inversión dentro de un fondo

| Campo | Tipo | Constraints | Notas |
|-------|------|-------------|-------|
| id | uuid | PK | — |
| fondo_id | uuid | FK → E-001, NOT NULL | — |
| codigo | varchar(20) | NOT NULL, UNIQUE | "ADI-001" |
| nombre | varchar(200) | NOT NULL | — |
| estado | enum | NOT NULL, DEFAULT 'activo' | activo, cerrado, concluido |
| tasa_pref | decimal(5,2) | NOT NULL | % anual (ej: 12.00) |
| success_fee_porcentaje | decimal(5,2) | NOT NULL | % sobre utilidad |
| metodo_cascada | enum | NULL | Override de fondo |
| tiene_hurdle | boolean | DEFAULT false | Para otros clientes |
| tasa_hurdle | decimal(5,2) | NULL | — |
| inversion_cerrada | boolean | DEFAULT false | — |
| oportunidad_inversion | boolean | DEFAULT true | Visible en oportunidades |
| portafolio | boolean | DEFAULT false | Visible en portafolio |
| drive_folder_id | varchar(100) | NULL | ID carpeta Drive |
| hero_image_id | varchar(100) | NULL | ID imagen Drive |
| descripcion | text | NULL | — |
| inicio | date | NULL | — |
| terminacion | date | NULL | — |
| sincronizado_firebase | boolean | DEFAULT false | BR-013 |
| created_at | timestamp | NOT NULL, DEFAULT now() | — |
| updated_at | timestamp | NOT NULL | — |
| **deleted_at** | timestamp | NULL | Soft-delete |

**Índices:** `fondo_id`, `codigo` (UNIQUE), `estado`

---

### E-003: Inversionista

**Descripción:** Persona que invierte en proyectos

| Campo | Tipo | Constraints | Notas |
|-------|------|-------------|-------|
| id | uuid | PK | — |
| fondo_id | uuid | FK → E-001, NOT NULL | Fondo principal |
| nombre | varchar(200) | NOT NULL | — |
| email | varchar(255) | NOT NULL | — |
| telefono | varchar(30) | NULL | — |
| es_fundador | boolean | DEFAULT false | Para movimientos APS/RPS |
| porcentaje_propiedad | decimal(5,2) | NULL | Solo fundadores |
| agente_id | uuid | FK → users, NULL | Agente asignado |
| drive_folder_id | varchar(100) | NULL | ID carpeta Drive |
| pais | varchar(50) | NULL | — |
| sincronizado_firebase | boolean | DEFAULT false | BR-013 |
| created_at | timestamp | NOT NULL, DEFAULT now() | — |
| updated_at | timestamp | NOT NULL | — |
| **deleted_at** | timestamp | NULL | Soft-delete |

**Índices:** `fondo_id`, `email`, `es_fundador`

---

### E-004: Inversión

**Descripción:** Participación de un inversionista en un proyecto

| Campo | Tipo | Constraints | Notas |
|-------|------|-------------|-------|
| id | uuid | PK | — |
| proyecto_id | uuid | FK → E-002, NOT NULL | — |
| inversionista_id | uuid | FK → E-003, NOT NULL | — |
| codigo | varchar(30) | NOT NULL, UNIQUE | "ADI-001-INV001" |
| compromiso | decimal(18,2) | NOT NULL | Capital call total |
| estado | enum | NOT NULL, DEFAULT 'activo' | activo, completado, cancelado |
| porcentaje_pactado | decimal(5,4) | NULL | % del proyecto |
| a_nombre_de | varchar(200) | NULL | Para beneficiario diferente |
| **Cached (BR-001)** | | | |
| capital_aportado | decimal(18,2) | DEFAULT 0 | SUM(APO confirmados) |
| pref_acumulado | decimal(18,2) | DEFAULT 0 | Cálculo diario |
| pref_pagado | decimal(18,2) | DEFAULT 0 | SUM(pagos pref) |
| utilidad_repartida | decimal(18,2) | DEFAULT 0 | SUM(DIS - capital) |
| **Admin Fee (BR-005b)** | | | |
| admin_fee_tipo | enum | NULL | one_time, anual |
| admin_fee_porcentaje | decimal(5,2) | NULL | — |
| admin_fee_metodo | enum | NULL | capital_call_independiente, incluido |
| admin_fee_presentacion | enum | NULL | desglosado, integrado |
| admin_fee_base | enum | NULL | compromiso, aportado |
| admin_fee_saldo | decimal(18,2) | DEFAULT 0 | Balance pendiente |
| notas | text | NULL | — |
| sincronizado_firebase | boolean | DEFAULT false | BR-013 |
| created_at | timestamp | NOT NULL, DEFAULT now() | — |
| updated_at | timestamp | NOT NULL | — |
| **deleted_at** | timestamp | NULL | Soft-delete |

**Índices:** `proyecto_id`, `inversionista_id`, `codigo` (UNIQUE)
**Constraint:** UNIQUE(proyecto_id, inversionista_id)

---

### E-005: CalendarioPago

**Descripción:** Capital calls programados por inversión

| Campo | Tipo | Constraints | Notas |
|-------|------|-------------|-------|
| id | uuid | PK | — |
| inversion_id | uuid | FK → E-004, NOT NULL | — |
| numero | int | NOT NULL | 1, 2, 3... |
| fecha_programada | date | NOT NULL | — |
| monto_esperado | decimal(18,2) | NOT NULL | — |
| monto_pagado | decimal(18,2) | DEFAULT 0 | — |
| estado | enum | NOT NULL, DEFAULT 'pendiente' | pendiente, parcial, completado |
| created_at | timestamp | NOT NULL, DEFAULT now() | — |
| updated_at | timestamp | NOT NULL | — |

**Índices:** `inversion_id`, `fecha_programada`

---

### E-006: Movimiento

**Descripción:** Transacción financiera (18 conceptos)

| Campo | Tipo | Constraints | Notas |
|-------|------|-------------|-------|
| id | uuid | PK | — |
| fondo_id | uuid | FK → E-001, NOT NULL | — |
| concepto | enum | NOT NULL | Ver BR-008 |
| monto | decimal(18,2) | NOT NULL | — |
| moneda | enum | NOT NULL | MXN, USD, EUR, ILS |
| tipo_cambio | decimal(10,4) | DEFAULT 1 | — |
| monto_base | decimal(18,2) | NOT NULL | monto × tipo_cambio |
| estado | enum | NOT NULL, DEFAULT 'borrador' | borrador, confirmado, cancelado |
| fecha_movimiento | date | NOT NULL | — |
| **Referencias opcionales** | | | |
| inversionista_id | uuid | FK → E-003, NULL | Para APO, DIS, DEV, etc. |
| inversion_id | uuid | FK → E-004, NULL | Para APO, DIS, etc. |
| proyecto_id | uuid | FK → E-002, NULL | Para INV, RET, GASP |
| beneficiario_id | uuid | FK → E-008, NULL | Para GAS, GASP |
| cuenta_id | uuid | FK → E-007, NULL | Cuenta bancaria |
| grupo_movimiento | uuid | NULL | Para operaciones multi-línea |
| descripcion | text | NULL | — |
| sincronizado_firebase | boolean | DEFAULT false | BR-013 |
| created_at | timestamp | NOT NULL, DEFAULT now() | — |
| updated_at | timestamp | NOT NULL | — |
| confirmed_at | timestamp | NULL | — |
| confirmed_by | uuid | FK → users, NULL | — |
| **deleted_at** | timestamp | NULL | Soft-delete |

**Índices:** `fondo_id`, `concepto`, `estado`, `fecha_movimiento`, `inversionista_id`, `proyecto_id`

---

### E-007: CuentaBancaria

**Descripción:** Cuentas bancarias del fondo

| Campo | Tipo | Constraints | Notas |
|-------|------|-------------|-------|
| id | uuid | PK | — |
| fondo_id | uuid | FK → E-001, NOT NULL | — |
| banco | varchar(100) | NOT NULL | — |
| numero_cuenta | varchar(50) | NOT NULL | — |
| clabe | varchar(20) | NULL | Solo México |
| moneda | enum | NOT NULL | MXN, USD, EUR, ILS |
| alias | varchar(50) | NULL | — |
| activo | boolean | DEFAULT true | — |
| created_at | timestamp | NOT NULL, DEFAULT now() | — |
| updated_at | timestamp | NOT NULL | — |

**Índices:** `fondo_id`, `moneda`

---

### E-008: Beneficiario

**Descripción:** Destinatario de gastos

| Campo | Tipo | Constraints | Notas |
|-------|------|-------------|-------|
| id | uuid | PK | — |
| fondo_id | uuid | FK → E-001, NOT NULL | — |
| nombre | varchar(200) | NOT NULL | — |
| banco | varchar(100) | NULL | — |
| numero_cuenta | varchar(50) | NULL | — |
| clabe | varchar(20) | NULL | — |
| rfc | varchar(15) | NULL | — |
| activo | boolean | DEFAULT true | — |
| created_at | timestamp | NOT NULL, DEFAULT now() | — |
| updated_at | timestamp | NOT NULL | — |

**Índices:** `fondo_id`

---

### E-009: Noticia

**Descripción:** Comunicados para inversionistas

| Campo | Tipo | Constraints | Notas |
|-------|------|-------------|-------|
| id | uuid | PK | — |
| fondo_id | uuid | FK → E-001, NULL | NULL = general |
| titulo | varchar(200) | NOT NULL | — |
| contenido | text | NOT NULL | — |
| imagen_url | varchar(500) | NULL | — |
| link | varchar(500) | NULL | — |
| publicado | boolean | DEFAULT false | — |
| publicado_at | timestamp | NULL | — |
| sincronizado_firebase | boolean | DEFAULT false | BR-013 |
| created_at | timestamp | NOT NULL, DEFAULT now() | — |
| updated_at | timestamp | NOT NULL | — |

**Índices:** `fondo_id`, `publicado`

---

### E-010: Video

**Descripción:** Videos asociados a proyectos para app móvil (Firebase sync)

| Campo | Tipo | Constraints | Notas |
|-------|------|-------------|-------|
| id | uuid | PK | — |
| proyecto_id | uuid | FK → E-002, NOT NULL | — |
| tipo | varchar(50) | NOT NULL | "video", "document" |
| url | varchar(500) | NOT NULL | URL del video |
| titulo | varchar(200) | NOT NULL | — |
| activo | boolean | DEFAULT true | Visible en app |
| sincronizado_firebase | boolean | DEFAULT false | BR-013 |
| created_at | timestamp | NOT NULL, DEFAULT now() | — |
| updated_at | timestamp | NOT NULL | — |

**Índices:** `proyecto_id`, `activo`

---

## Enums

```typescript
// Monedas
export const monedaEnum = pgEnum('moneda', ['MXN', 'USD', 'EUR', 'ILS']);

// Método de cascada
export const metodoCascadaEnum = pgEnum('metodo_cascada', ['pref_primero', 'capital_primero']);

// Estado de proyecto
export const estadoProyectoEnum = pgEnum('estado_proyecto', ['activo', 'cerrado', 'concluido']);

// Estado de inversión
export const estadoInversionEnum = pgEnum('estado_inversion', ['activo', 'completado', 'cancelado']);

// Estado de movimiento
export const estadoMovimientoEnum = pgEnum('estado_movimiento', ['borrador', 'confirmado', 'cancelado']);

// Conceptos de movimiento (18 tipos)
export const conceptoMovimientoEnum = pgEnum('concepto_movimiento', [
  'APO', 'APO_D', 'DIS', 'DEV', 'FEE',           // Inversionistas
  'INV', 'INV_D', 'RET',                          // Proyectos
  'GAS', 'GASP',                                  // Gastos
  'APS', 'RPS', 'PRS', 'DPRS',                    // Socios
  'TRA', 'CAM', 'ERR', 'TSI'                      // Administración
]);

// Admin Fee
export const adminFeeTipoEnum = pgEnum('admin_fee_tipo', ['one_time', 'anual']);
export const adminFeeMetodoEnum = pgEnum('admin_fee_metodo', ['capital_call_independiente', 'incluido']);
export const adminFeePresentacionEnum = pgEnum('admin_fee_presentacion', ['desglosado', 'integrado']);
export const adminFeeBaseEnum = pgEnum('admin_fee_base', ['compromiso', 'aportado']);

// Estado de calendario de pago
export const estadoPagoEnum = pgEnum('estado_pago', ['pendiente', 'parcial', 'completado']);
```

---

## Open Questions

| # | Pregunta | Impacto | Owner | Estado |
|---|----------|---------|-------|--------|
| OQ-01 | ~~Soft-delete necesario~~ | ~~Alto~~ | Dev | ✅ Sí, agregado |
| OQ-02 | ¿Inversionista puede estar en múltiples fondos con el mismo registro? | **Alto** | Cliente | Pendiente |
| OQ-03 | ¿Movimientos requieren auditoría detallada (quién, cuándo, qué cambió)? | Med | Dev | Pendiente |

---

## Assumptions

| # | Supuesto | Si es incorrecto |
|---|----------|------------------|
| ~~A-01~~ | ~~Hard-delete es suficiente para MVP~~ | ✅ Soft-delete implementado |
| A-02 | Un inversionista pertenece a un fondo principal | Impacto: Tabla pivote |
| A-03 | UUIDs para todas las PKs | Impacto: Cambiar a serial |

---

*Generado por TimeKast Factory — /docs*
