# Business Rules — Adi Capital Admin

> Generado desde Discovery Brief por `/docs`
> **Fuente:** `docs/planning/00_DISCOVERY_BRIEFING.md` §6
> **SSOT:** Este documento

---

## Convenciones

- **BR-XXX:** Regla de negocio con ID único
- **Severidad:** P0 (crítica), P1 (importante), P2 (nice-to-have)
- **Invariante:** Condición que SIEMPRE debe ser verdadera

---

## Reglas Core (Ledger)

### BR-001: Movimiento Ledger = SSOT
**Severidad:** P0
**Invariante:** SIEMPRE — Todos los campos `cached_*` se calculan desde movimientos confirmados.
**NUNCA:** Calcular un cache desde otro cache.

```
capital_aportado = SUM(APO confirmados)
pref_acumulado = cálculo diario desde capital
pref_pagado = SUM(pagos de pref en DIS)
```

### BR-002: Estados de Movimientos
**Severidad:** P0
**Estado:** Borrador → Confirmado → Cancelado

| Estado | Editable | Afecta Saldos | Eliminable |
|--------|----------|---------------|------------|
| Borrador | ✅ | ❌ | ✅ |
| Confirmado | ❌ | ✅ | ❌ (solo cancelar) |
| Cancelado | ❌ | ✅ (inverso) | ❌ |

**Invariante:** Un movimiento confirmado NUNCA se elimina, solo se cancela.

---

## Reglas de Cascada

### BR-003: Métodos de Cascada (Waterfall)
**Severidad:** P0

**Pref Primero (Adi Capital):**
```
Reparto → Reduce Pref primero → Luego Capital
Pref sigue acumulando sobre capital completo
```

**Capital Primero (Kentucky):**
```
Reparto → Reduce Capital primero → Luego Pref
Pref acumula sobre capital reducido después de reparto
```

**Configuración:** A nivel Fondo (default) con override por Proyecto.

### BR-004: Cálculo de Pref (Preferred Return)
**Severidad:** P0
**Fórmula:**
```
Acumulación diaria = (capital_aportado × tasa_pref) / 365
```

| Campo | Descripción |
|-------|-------------|
| `pref_acumulado` | Total acumulado hasta la fecha |
| `pref_pagado` | Total pagado en distribuciones |
| `pref_pendiente` | `pref_acumulado - pref_pagado` |

### BR-005: Success Fee
**Severidad:** P0
**Condición:** Solo se cobra sobre **utilidades** en distribuciones.

```
Utilidad = Monto Reparto - Capital Invertido
Success Fee = Utilidad × success_fee_porcentaje
```

**Invariante:** Si no hay utilidad, NO hay Success Fee.
**Efecto:** Auto-genera movimiento FEE al confirmar DIS con utilidad.

---

## Reglas de Admin Fee

### BR-005b: Admin Fee (Comisión de Administración)
**Severidad:** P0

| Tipo | Base | Frecuencia |
|------|------|------------|
| One-time | Compromiso | Una vez al cierre |
| Anual | Compromiso o Aportado | Anual prorrateado |

**Variantes de cobro anual:**

| Variante | Descripción |
|----------|-------------|
| Capital call independiente | Se cobra como llamada separada |
| Incluido en siguiente call | Se suma al próximo capital call |
| Desglosado | Línea separada en movimiento |
| Integrado | Incluido sin desglosar |

### BR-005c: Compromisos como Cuenta por Cobrar
**Severidad:** P0

```
Saldo pendiente = Compromiso - SUM(APO confirmados)
```

| Estado | Condición |
|--------|-----------|
| Pendiente | Sin aportaciones |
| Parcial | Aportaciones < Compromiso |
| Completado | Aportaciones = Compromiso |
| Excedido | Aportaciones > Compromiso |

### BR-005d: Posición Financiera del Proyecto
**Severidad:** P1

| Concepto | Cálculo |
|----------|---------|
| Inversión recibida | SUM(INV) |
| Gastos del proyecto | SUM(GASP) |
| Comisiones | Success fees + Admin fees |
| Retornos | SUM(RET) |
| Utilidad/Pérdida | Retornos - Inversión - Gastos |

### BR-006: Hurdle Rate
**Severidad:** P0
**Descripción:** Umbral mínimo de retorno antes de cobrar Success Fee.

```
Si retorno < hurdle → No se cobra Success Fee
Si retorno > hurdle → Success Fee solo sobre excedente
```

**Configuración a nivel Proyecto:**
- `tiene_hurdle: boolean` (default false)
- `tasa_hurdle: decimal` (% anual)

**Invariante:** Success Fee nunca aplica sobre retorno por debajo del hurdle.

---

## Reglas de Multi-moneda

### BR-007: Multi-moneda
**Severidad:** P0

- Moneda base a nivel Fondo
- Override por Proyecto permitido
- Tipo de cambio manual al momento de movimiento
- **Monedas:** MXN, USD, EUR, ILS

**Invariante:** Todo movimiento tiene `monto`, `moneda`, `tipo_cambio`.

---

## Reglas de Validación por Concepto

### BR-008: Validaciones por Concepto de Movimiento
**Severidad:** P0

| Concepto | Requiere |
|----------|----------|
| APO, DIS, DEV | inversionista + inversión |
| INV, RET | proyecto |
| GAS, GASP | beneficiario |
| APS, RPS, PRS, DPRS | inversionista con `es_fundador = true` |
| TRA | misma moneda origen/destino |
| CAM | diferente moneda + tipo de cambio |

**Invariante:** Movimiento sin campos requeridos → error de validación.

---

## Reglas de Aislamiento

### BR-009: Aislamiento de Fondos
**Severidad:** P0

- Inversionistas de un fondo NO ven datos del otro
- Administradores de Fondo están limitados a su fondo asignado
- Super Admins ven todo

**Invariante:** Query sin filtro de fondo → error de seguridad.

---

## Reglas de Documentos

### BR-010: Visibilidad de Documentos
**Severidad:** P0

| Tipo | Quién ve |
|------|----------|
| Oportunidad (`/Oportunidad/`) | Todos los del fondo |
| Portafolio (`/Portafolio/`) | Todos los del fondo |
| Privado (`/Privado/`) | Solo participantes del proyecto |
| Inversionista (`/Inversionistas/{name}/`) | Solo ese inversionista |

---

## Reglas RBAC

### BR-011: Matriz de Permisos Super Admin (P-001)
**Severidad:** P0

| Acción | Permitido |
|--------|-----------|
| Ver todos los fondos | ✅ |
| CRUD Fondos | ✅ |
| CRUD Proyectos (todos) | ✅ |
| CRUD Inversionistas (todos) | ✅ |
| CRUD Inversiones (todas) | ✅ |
| Registrar Movimientos | ✅ |
| Confirmar Movimientos | ✅ |
| Cancelar Movimientos | ✅ |
| Wizard Reparto | ✅ |
| Gestión Usuarios | ✅ |
| Publicar Noticias | ✅ |

### BR-012: Matriz de Permisos Admin de Fondo (P-002)
**Severidad:** P0

| Acción | Permitido | Restricción |
|--------|-----------|-------------|
| Ver fondos | ❗ | Solo su fondo asignado |
| CRUD Fondos | ❌ | — |
| CRUD Proyectos | ✅ | Solo su fondo |
| CRUD Inversionistas | ✅ | Solo su fondo |
| CRUD Inversiones | ✅ | Solo su fondo |
| Registrar Movimientos | ✅ | Solo su fondo |
| Confirmar Movimientos | ✅ | **Solo su fondo** (resuelto) |
| Cancelar Movimientos | ❌ | — |
| Wizard Reparto | ❌ | — |
| Gestión Usuarios | ❌ | — |
| Publicar Noticias | ❌ | — |

---

## Reglas de Sync

### BR-013: Sync Firebase
**Severidad:** P0

- Cada entidad tiene campo `sincronizado_firebase: boolean`
- Al confirmar movimiento → marcar entidades afectadas como `false`
- Job de sync actualiza Firebase y marca `true`

**Invariante:** App móvil solo ve datos con `sincronizado_firebase = true`.

---

## Open Questions

| # | Pregunta | Impacto | Owner | Estado |
|---|----------|---------|-------|--------|
| OQ-01 | ~~Admin de Fondo puede confirmar movimientos~~ | ~~Alto~~ | Cliente | ✅ Sí, de su fondo |
| OQ-02 | ~~Cálculo de pref: cron o tiempo real~~ | ~~Alto~~ | Dev | ✅ Cron nocturno |
| OQ-03 | ¿Movimientos cancelados revierten sync Firebase? | Med | Dev | Pendiente |

---

## Assumptions

| # | Supuesto | Si es incorrecto |
|---|----------|------------------|
| A-01 | Solo hay 2 métodos de cascada (Pref Primero, Capital Primero) | Impacto: Lógica adicional |
| ~~A-02~~ | ~~Hurdle Rate no aplica en MVP~~ | ✅ Ahora es MVP (ver BR-006) |
| ~~A-03~~ | ~~Soft-delete no es necesario~~ | ✅ Sí es necesario (ver 05_DATA_MODEL) |

---

*Generado por TimeKast Factory — /docs*
