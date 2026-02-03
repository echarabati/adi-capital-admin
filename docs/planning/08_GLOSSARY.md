# 📖 Glossary — Adi Capital Admin

> Generado desde Discovery Brief por `/docs`
> **Fuente:** `docs/planning/00_DISCOVERY_BRIEFING.md`
> **SSOT:** Este documento define el vocabulario del dominio.

---

## Términos Financieros

### Aportación (APO)

Ingreso de capital de un inversionista a su inversión en un proyecto. Reduce el saldo del compromiso y aumenta el capital aportado.

**Variante:** APO-D = Aportación a destiempo (fuera de calendario).

**Sinónimos:** Capital Call (en el contexto de la solicitud), Contribución.

---

### Capital Aportado

Suma total de las aportaciones confirmadas de un inversionista en un proyecto. Es la base para el cálculo del Pref.

**Fórmula:** `SUM(APO confirmados) - SUM(DEV confirmados)`

---

### Capital Call

Solicitud formal de aportación de capital a un inversionista según el calendario de pagos acordado.

**Estados:**
- Pendiente: No se ha recibido pago
- Parcial: Pago parcial recibido
- Completo: Pago total recibido

---

### Cascada

Método que define el orden de prioridad en las distribuciones de capital y utilidades.

**Métodos:**
| Método | Orden | Usado por |
|--------|-------|-----------|
| `pref_primero` | 1. Pref → 2. Capital → 3. Utilidad | Adi Capital |
| `capital_primero` | 1. Capital → 2. Pref → 3. Utilidad | Kentucky |

---

### Compromiso

Monto total que un inversionista se compromete a aportar a un proyecto. Puede pagarse en uno o varios capital calls.

**Derivados:**
- Saldo Compromiso = Compromiso - Capital Aportado
- Estado: Pendiente | Parcial | Completado | Excedido

---

### Distribución (DIS)

Pago de retornos a un inversionista. Puede aplicarse a Pref acumulado, devolución de capital, o utilidades, según el método de cascada.

---

### Devolución de Capital (DEV)

Retorno de capital aportado al inversionista sin generar utilidad. Reduce el capital aportado.

---

### Fondo

Vehículo de inversión que agrupa proyectos e inversionistas. Cada fondo tiene su propia configuración de cascada y moneda base.

**Ejemplos:** Adi Capital, Kentucky

---

### Hurdle Rate

Tasa mínima de retorno que debe alcanzarse antes de que el gestor pueda cobrar Success Fee sobre las utilidades. Post-MVP.

---

### IRR / TIR

Internal Rate of Return / Tasa Interna de Retorno. Métrica de rendimiento de una inversión. Post-MVP.

---

### Inversión

Participación formal de un inversionista en un proyecto específico. Contiene el compromiso, configuración de fees, y acumula el Pref.

---

### Pref / Preferred Return

Rendimiento preferencial acumulado diariamente sobre el capital aportado. Se paga antes de repartir utilidades al gestor.

**Fórmula diaria:** `(capital_aportado × tasa_pref / 100) / 365`

**Campos relacionados:**
- `pref_acumulado`: Total acumulado hasta la fecha
- `pref_pagado`: Monto ya distribuido
- `pref_pendiente`: pref_acumulado - pref_pagado

---

### Retorno (RET)

Ingreso de capital al proyecto proveniente de la venta, renta o liquidación de un activo. Es la fuente para distribuciones.

---

### Success Fee

Comisión que cobra el gestor del fondo sobre las utilidades generadas. Solo se cobra cuando hay ganancias (después de Pref y capital).

**Fórmula:** `(monto_distribuido - capital_invertido) × success_fee_porcentaje`

---

### Tipo de Cambio

Tasa de conversión entre monedas. Se registra en cada movimiento para convertir al moneda base del fondo.

**Monedas soportadas:** MXN, USD, EUR, ILS

---

### Utilidad

Ganancia neta después de devolver el capital y pagar el Pref. Base para el cálculo del Success Fee.

**Fórmula:** `monto_distribuido - capital_invertido - pref_pagado`

---

## Términos Operativos

### Admin de Fondo

Rol de usuario con acceso limitado a uno o más fondos asignados. No puede gestionar usuarios ni ver fondos no asignados.

---

### Admin Fee

Comisión administrativa cobrada al inversionista. Puede ser one-time (al cierre) o anual (prorrateado).

**Configuración:**
- Tipo: one_time | anual
- Base: sobre compromiso | sobre aportado
- Método: capital_call_independiente | incluido_en_capital_call

---

### Borrador

Estado inicial de un movimiento. Es editable y NO afecta saldos ni se sincroniza a Firebase.

---

### Beneficiario

Persona o empresa receptora de pagos de gastos (GAS, GASP).

---

### Confirmado

Estado de un movimiento que ya fue validado. Es inmutable, afecta saldos y se marca para sincronizar a Firebase.

---

### Cancelado

Estado de un movimiento que fue revertido. Los efectos en saldos se revierten pero el registro histórico permanece.

---

### Fundador / Socio

Inversionista con flag especial que puede recibir movimientos exclusivos (APS, RPS, PRS, DPRS). Típicamente un socio del fondo.

---

### Grupo de Movimiento

UUID compartido por movimientos que pertenecen a la misma operación (ej: una distribución genera múltiples DIS + FEE).

---

### RBAC

Role-Based Access Control. Sistema de permisos basado en roles (Super Admin, Admin de Fondo, Agente).

---

### Super Admin

Rol de usuario con acceso total a todos los fondos y capacidad de gestionar usuarios.

---

### Wizard de Reparto

Asistente guiado que calcula automáticamente la distribución de capital y utilidades entre inversionistas según el método de cascada.

---

## Tipos de Movimiento

### Categoría: Inversionistas

| Código | Nombre | Descripción | Efecto |
|--------|--------|-------------|--------|
| APO | Aportación | Ingreso de capital del inversionista | +capital_aportado, -saldo_compromiso |
| APO-D | Aportación Destiempo | Aportación fuera del calendario | +capital_aportado |
| DIS | Distribución | Pago al inversionista (Pref/Capital/Utilidad) | -pref_pendiente o -capital |
| DEV | Devolución | Retorno de capital sin utilidad | -capital_aportado |
| FEE | Success Fee | Comisión sobre utilidades | N/A (registro) |

### Categoría: Proyectos

| Código | Nombre | Descripción | Efecto |
|--------|--------|-------------|--------|
| INV | Inversión | Capital invertido en el proyecto | +inversion_recibida |
| INV-D | Desinversión | Retiro de capital del proyecto | -inversion_recibida |
| RET | Retorno | Ingreso por venta/renta del activo | +retornos |

### Categoría: Gastos

| Código | Nombre | Descripción | Efecto |
|--------|--------|-------------|--------|
| GAS | Gasto Administrativo | Gasto general del fondo | -saldo_caja |
| GASP | Gasto de Proyecto | Gasto específico del proyecto | +gastos_proyecto |

### Categoría: Socios

| Código | Nombre | Descripción | Efecto |
|--------|--------|-------------|--------|
| APS | Aportación Socio | Capital aportado por fundador | +capital_socios |
| RPS | Retiro Socio | Retiro de capital de socio | -capital_socios |
| PRS | Préstamo Socio | Préstamo de socio al fondo | +prestamos |
| DPRS | Devolución Préstamo | Pago de préstamo a socio | -prestamos |

### Categoría: Administración

| Código | Nombre | Descripción | Efecto |
|--------|--------|-------------|--------|
| TRA | Traspaso | Movimiento entre cuentas (misma moneda) | Transfer |
| CAM | Cambio | Conversión de moneda | Exchange |
| ERR | Corrección | Ajuste por error | Varies |
| TSI | Tipo de Cambio | Ajuste por diferencia cambiaria | Varies |

---

## Términos Técnicos

### Server Action

Función de Next.js que se ejecuta en el servidor. Usada para todas las operaciones de escritura (CRUD).

---

### Drizzle

ORM (Object-Relational Mapping) type-safe para PostgreSQL. Define los schemas de base de datos.

---

### Neon

Servicio de PostgreSQL serverless con branching. Base de datos principal del sistema.

---

### Firebase Firestore

Base de datos NoSQL de Google. Usada como mirror read-only para la app móvil Flutter.

---

### PWA

Progressive Web App. Permite instalar el panel admin como aplicación en desktop/mobile.

---

### Sync / Sincronización

Proceso de copiar datos confirmados de PostgreSQL (SSOT) a Firebase (app móvil).

---

### SSOT

Single Source of Truth. PostgreSQL es la fuente de verdad; Firebase es réplica de lectura.

---

## Acrónimos

| Acrónimo | Significado |
|----------|-------------|
| APO | Aportación |
| DIS | Distribución |
| DEV | Devolución |
| INV | Inversión |
| RET | Retorno |
| GAS | Gasto Administrativo |
| GASP | Gasto de Proyecto |
| APS | Aportación Socio |
| RPS | Retiro Socio |
| PRS | Préstamo Socio |
| DPRS | Devolución Préstamo Socio |
| TRA | Traspaso |
| CAM | Cambio (moneda) |
| ERR | Error/Corrección |
| TSI | Tipo de Cambio (ajuste) |
| FEE | Success Fee |
| RBAC | Role-Based Access Control |
| SSOT | Single Source of Truth |
| PWA | Progressive Web App |
| TIR | Tasa Interna de Retorno |
| IRR | Internal Rate of Return |

---

## Entidades del Sistema

| ID | Entidad | Descripción |
|----|---------|-------------|
| E-001 | Fondo | Vehículo de inversión |
| E-002 | Proyecto | Inversión inmobiliaria/empresarial |
| E-003 | Inversionista | Persona que aporta capital |
| E-004 | Inversión | Participación en proyecto |
| E-005 | Movimiento | Transacción financiera |
| E-006 | Calendario | Capital calls programados |
| E-007 | Documento | Referencia a archivo en Drive |
| E-008 | Beneficiario | Receptor de gastos |
| E-009 | Noticia | Comunicado para app |
| E-010 | Usuario | Usuario del panel admin |

---

## Open Questions

| # | Pregunta | Impacto | Owner |
|---|----------|---------|-------|
| OQ-01 | ¿Hay más tipos de movimiento no identificados? | Med | Cliente |
| OQ-02 | ¿Algún término tiene traducción específica al inglés requerida? | Low | Cliente |

---

## Assumptions

| # | Supuesto | Si es incorrecto |
|---|----------|------------------|
| A-01 | Los 18 tipos de movimiento cubren todos los casos actuales | Agregar nuevos conceptos |
| A-02 | La terminología es consistente entre fondos | Agregar alias por fondo |

---

*Generado por TimeKast Factory — /docs*
