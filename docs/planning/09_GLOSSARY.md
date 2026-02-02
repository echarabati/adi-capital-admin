# Glosario — Adi Capital Admin

> Generado desde Discovery Brief por `/docs`
> **Fuente:** `docs/planning/00_DISCOVERY_BRIEFING.md` §Terminología
> **SSOT:** Este documento

---

## Términos del Dominio

### Estructurales

| Término | Definición | Contexto |
|---------|------------|----------|
| **Fondo** | Entidad de inversión que agrupa proyectos e inversionistas. Ej: Adi Capital, Kentucky. | E-001 |
| **Proyecto** | Oportunidad de inversión específica dentro de un fondo. Tiene su propia tasa pref y success fee. | E-002 |
| **Inversionista** | Persona física o moral que aporta capital a proyectos. | E-003 |
| **Inversión** | Participación de un inversionista en un proyecto específico. Define compromiso y configuración de fees. | E-004 |
| **Fundador/Socio** | Inversionista con `es_fundador = true`. Participa en movimientos de capital social (APS/RPS). | BR-008 |

---

### Financieros

| Término | Definición | Contexto |
|---------|------------|----------|
| **Compromiso** | Monto total que un inversionista se compromete a aportar (capital call). | E-004, BR-005c |
| **Capital Aportado** | Suma de aportaciones confirmadas (APO). Campo cached para performance. | BR-001 |
| **Pref / Preferred Return** | Interés preferencial acumulado diariamente sobre capital aportado. Fórmula: `(capital × tasa) / 365`. | BR-004, FT-007 |
| **Pref Acumulado** | Total de pref generado hasta la fecha. | E-004 |
| **Pref Pagado** | Porción del pref que ya se distribuyó al inversionista. | E-004 |
| **Pref Pendiente** | `pref_acumulado - pref_pagado` | — |
| **Success Fee** | Comisión sobre utilidades en una distribución. Solo se cobra si hay ganancia. | BR-005 |
| **Admin Fee** | Comisión de administración. Puede ser one-time o anual. | BR-005b |
| **Cascada / Waterfall** | Orden de distribución de capital y utilidades. | BR-003 |
| **Hurdle Rate** | Retorno mínimo antes de aplicar success fee (para otros clientes, no MVP). | — |

---

### Métodos de Cascada

| Término | Definición | Usado en |
|---------|------------|----------|
| **Pref Primero** | Distribución reduce primero pref acumulado, luego capital. Pref sigue acumulando sobre capital completo. | Adi Capital |
| **Capital Primero** | Distribución reduce primero capital, luego pref. Pref acumula sobre capital reducido. | Kentucky |

---

### Movimientos (Conceptos)

| Código | Nombre | Descripción | Requiere |
|--------|--------|-------------|----------|
| **APO** | Aportación de Capital | Pago de capital call | Inversionista + Inversión |
| **APO-D** | Aportación Directa | Aportación sin compromiso previo | Inversionista + Inversión |
| **DIS** | Distribución | Reparto de capital/utilidades | Inversionista + Inversión |
| **DEV** | Devolución | Retorno de capital sin utilidad | Inversionista + Inversión |
| **FEE** | Comisión (Success) | Cobro automático de success fee | Auto-generado con DIS |
| **INV** | Inversión en Proyecto | Capital invertido en activo | Proyecto |
| **INV-D** | Inversión Directa | Sin aportación previa | Proyecto |
| **RET** | Retorno de Proyecto | Ingreso del activo | Proyecto |
| **GAS** | Gasto General | Gasto administrativo del fondo | Beneficiario |
| **GASP** | Gasto de Proyecto | Gasto específico del proyecto | Proyecto + Beneficiario |
| **APS** | Aportación Socio | Capital del socio fundador | Fundador |
| **RPS** | Retiro/Reembolso Socio | Retorno al socio | Fundador |
| **PRS** | Préstamo Socio | Préstamo del socio al fondo | Fundador |
| **DPRS** | Devolución Préstamo | Retorno del préstamo | Fundador |
| **TRA** | Transferencia | Entre cuentas misma moneda | Cuenta origen/destino |
| **CAM** | Cambio de Moneda | Conversión entre monedas | Tipo de cambio |
| **ERR** | Corrección | Ajuste por error | — |
| **TSI** | TSI (legacy) | Tipo sin identificar | — |

---

### Estados

| Término | Definición | Aplica a |
|---------|------------|----------|
| **Borrador** | Movimiento registrado pero no confirmado. No afecta saldos. | Movimientos |
| **Confirmado** | Movimiento aprobado. Afecta caches y se sincroniza. | Movimientos |
| **Cancelado** | Movimiento revertido. Aplica lógica inversa. | Movimientos |
| **Activo** | Proyecto/inversión en operación normal. | Proyectos, Inversiones |
| **Cerrado** | Proyecto sin nuevas inversiones. | Proyectos |
| **Concluido** | Proyecto finalizado, capital distribuido. | Proyectos |
| **Pendiente** | Pago sin abonar. | Calendario de Pagos |
| **Parcial** | Pago parcialmente cubierto. | Calendario de Pagos |
| **Completado** | Pago totalmente cubierto. | Calendario de Pagos |

---

### Documentos

| Término | Definición | Visibilidad |
|---------|------------|-------------|
| **Oportunidad** | Documentos públicos de la oportunidad de inversión. | Todos los del fondo |
| **Portafolio** | Documentos del proyecto en cartera. | Todos los del fondo |
| **Privado** | Documentos confidenciales del proyecto. | Solo participantes |
| **Inversionista** | Carpeta personal del inversionista. | Solo ese inversionista |

---

### Técnicos

| Término | Definición |
|---------|------------|
| **SSOT** | Single Source of Truth. Ubicación autoritativa del dato. |
| **Cache** | Campo calculado para performance (`cached_*`). Se recalcula desde movimientos. |
| **Ledger** | Sistema de registro contable. Los movimientos confirmados son la fuente de verdad. |
| **RBAC** | Role-Based Access Control. Permisos basados en rol. |
| **PWA** | Progressive Web App. Panel instalable en dispositivo. |

---

### Roles

| Término | Prioridad | Alcance |
|---------|-----------|---------|
| **Super Admin** | 100 | Acceso total a todos los fondos |
| **Admin de Fondo** | 80 | Solo su fondo asignado |
| **Agente de Ventas** | 40 | Read-only inversiones que gestiona (Post-MVP) |
| **Inversionista** | 30 | Read-only datos propios (app móvil) |

---

## Abreviaciones

| Abrev. | Significado |
|--------|-------------|
| APO | Aportación |
| DIS | Distribución |
| DEV | Devolución |
| FEE | Comisión |
| INV | Inversión |
| RET | Retorno |
| GAS | Gasto |
| GASP | Gasto de Proyecto |
| Pref | Preferred Return |
| MXN | Peso Mexicano |
| USD | Dólar Americano |
| EUR | Euro |
| ILS | Shekel Israelí |

---

*Generado por TimeKast Factory — /docs*
