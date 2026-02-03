# 🎫 FACTORY-001: Mejoras al Workflow de Backlog

> **Proyecto origen:** Adi Capital Admin
> **Fecha:** 2026-02-03
> **Tipo:** Enhancement
> **Prioridad:** Alta
> **Objetivo:** Integrar mejoras de calidad al `/backlog` workflow y skills relacionados

---

## 📋 Resumen Ejecutivo

Durante la generación del backlog para Adi Capital Admin, identificamos y aplicamos varias mejoras que deberían ser **estándar en Factory**. Este ticket documenta cada mejora para su integración en:

- `.agent/workflows/backlog.md`
- `.agent/skills/roles/backlog/SKILL.md`
- Templates de issues y epics

---

## 🎯 Mejoras Implementadas

### 1. Criterios de Aceptación en Gherkin (Español)

**Problema:** Los AC tipo checklist son ambiguos y no ejecutables.

**Solución:** Usar formato Gherkin para AC detallados.

**Formato Estándar en Español:**

```gherkin
Scenario: [Nombre descriptivo del escenario]
  Dado que [precondición]
  Y [precondición adicional si aplica]
  Cuando [acción del usuario]
  Entonces [resultado esperado]
  Y [resultado adicional si aplica]
```

**Ejemplo Real:**

```gherkin
Scenario: Super Admin ve todos los fondos
  Dado que estoy autenticado como Super Admin (Abraham)
  Cuando navego a /fondos
  Entonces veo "Adi Capital" y "Kentucky" en la lista

Scenario: Admin de Fondo ve solo asignados
  Dado que estoy autenticado como Admin de Fondo (Olga, solo Kentucky)
  Cuando navego a /fondos
  Entonces veo solo "Kentucky"
  Y no veo "Adi Capital"

Scenario: Validación de campos requeridos
  Dado que estoy creando un movimiento DIS
  Cuando no selecciono inversionista
  Entonces el sistema muestra error "Inversionista requerido"
  Y no se puede guardar
```

**Beneficios:**

- Ejecutables como tests
- Sin ambigüedad
- Documentación viva
- QA puede validar sin preguntar

**Implementación en Template:**

```markdown
## ✅ Criterios de Aceptación

\`\`\`gherkin
Scenario: [Happy path principal]
Dado que [setup]
Cuando [acción]
Entonces [expectativa]

Scenario: [Edge case o error]
Dado que [setup que causa error]
Cuando [acción]
Entonces [manejo de error esperado]
\`\`\`

- [ ] [Checklist item si aplica después de Gherkin]
```

---

### 2. Issues de Testing E2E Estratégicos (TEST-\*)

**Problema:** Los tests E2E se olvidan o se dejan para el final.

**Solución:** Crear issues TEST-\* explícitos vinculados a epics críticos.

**Patrón:**

| Issue    | Se ejecuta después de     | Valida                      |
| -------- | ------------------------- | --------------------------- |
| TEST-001 | Epic de Auth/RBAC         | Login, roles, aislamiento   |
| TEST-002 | Epic de Core Business     | Flujo principal completo    |
| TEST-003 | Epic de Wizard/Multi-step | Flujo complejo con cálculos |

**Template para TEST-\* Issue:**

```markdown
# TEST-XXX: E2E [Nombre del Flujo]

> **Issue ID:** TEST-XXX
> **Priority:** P0
> **Effort:** M/L
> **Status:** 📋 Backlog
> **Epic:** [Link al Epic padre]

## 🎯 Objetivo

Validar flujo completo de [descripción del flujo].

## Tipo de Issue

> **QA Issue** — Ejecutar después de completar [Epic ID]

---

## 📚 Referencias

- Business Rules: [BR-XXX](link)
- Flow: [FLW-XXX](link)

---

## ✅ Criterios de Aceptación

\`\`\`gherkin
Scenario: [Happy path]
Dado que [setup]
Cuando [acción]
Entonces [expectativa]

Scenario: [Otro escenario crítico]
...
\`\`\`

- [ ] [Checkpoint 1]
- [ ] [Checkpoint 2]

---

## 🔧 Contexto Técnico

**Test Files:**

- `tests/e2e/[nombre].spec.ts`

**Commands:**
\`\`\`bash
pnpm test:e2e tests/e2e/[nombre].spec.ts
\`\`\`

**Setup:**

- [Seed data requerido]
- [Usuario de prueba]

---

**Dependencias de Issues:**

- Bloqueado por: [issues del epic]
- Bloquea a: — (pero requerido para /audit R2)

---

_Creado: [fecha] — QE Strategy_
```

**Cuándo crear TEST-\* issues:**

| Condición                       | Crear TEST-\* |
| ------------------------------- | ------------- |
| Epic con Auth/RBAC              | ✅ Sí         |
| Epic con lógica de negocio core | ✅ Sí         |
| Epic con cálculos financieros   | ✅ Sí         |
| Epic con Wizard/multi-step      | ✅ Sí         |
| Epic UI-only (CRUD simple)      | ❌ No         |
| Epic de integraciones           | ⚠️ Depende    |

---

### 3. Story Points Mapping

**Problema:** Sin estimación, no hay predictibilidad.

**Solución:** Mapear Effort (S/M/L) a Story Points.

**Tabla Estándar:**

| Effort | Story Points | Descripción          | Tiempo Estimado |
| ------ | ------------ | -------------------- | --------------- |
| **XS** | 1 pt         | Cambio trivial       | < 1 hora        |
| **S**  | 2 pts        | Componente simple    | 1-2 horas       |
| **M**  | 3 pts        | Feature estándar     | 2-4 horas       |
| **L**  | 5 pts        | Feature complejo     | 4-8 horas       |
| **XL** | 8 pts        | Feature muy complejo | 1+ días         |

**Implementación en README:**

```markdown
## 🎯 Story Points Mapping

| Effort | Story Points | Descripción                   |
| ------ | ------------ | ----------------------------- |
| **XS** | 1 pt         | Cambio trivial, < 1 hora      |
| **S**  | 2 pts        | Componente simple, 1-2 horas  |
| **M**  | 3 pts        | Feature estándar, 2-4 horas   |
| **L**  | 5 pts        | Feature complejo, 4-8 horas   |
| **XL** | 8 pts        | Feature muy complejo, 1+ días |
```

**Implementación en Epic:**

```markdown
| #   | Epic   | Issues | Pts | Priority | Deps | Audit Tier |
| --- | ------ | ------ | --- | -------- | ---- | ---------- |
| E01 | SCHEMA | 3      | 9   | P0       | —    | R2         |
```

---

### 4. QA Strategy (/qc + /audit)

**Problema:** Calidad se verifica al final (costoso, riesgoso).

**Solución:** QA en capas progresivas.

**Estrategia de 3 Capas:**

```
┌─────────────────────────────────────────────────┐
│ CAPA 1: POR ISSUE                               │
│                                                 │
│  /implement ISSUE-XXX                           │
│       ↓                                         │
│  /qc ISSUE-XXX (R1, ~1min)                     │
│       ↓                                         │
│  ✅ Done / 🔴 Fix                               │
└─────────────────────────────────────────────────┘
        ↓
┌─────────────────────────────────────────────────┐
│ CAPA 2: POR EPIC                                │
│                                                 │
│  /audit R2 (cuando Epic = Done)                │
│       ↓                                         │
│  - lint, typecheck, test, build                 │
│  - security scan                                │
│  - coverage >= 80%                              │
│       ↓                                         │
│  ✅ Epic Done / 🟡 Fix warnings                 │
└─────────────────────────────────────────────────┘
        ↓
┌─────────────────────────────────────────────────┐
│ CAPA 3: PRE-RELEASE                             │
│                                                 │
│  /audit R3 (todos los epics = Done)            │
│       ↓                                         │
│  - R2 + E2E + Lighthouse                        │
│       ↓                                         │
│  ✅ Tag v1.0                                    │
└─────────────────────────────────────────────────┘
```

**Documentación en README:**

```markdown
## 🧪 QA Strategy

### Per Issue

\`\`\`
/implement ISSUE-XXX
↓
/qc ISSUE-XXX (~1 min)
↓
✅ Done / 🔴 Fix
\`\`\`

### Per Epic

\`\`\`
Epic completado
↓
/audit R2 (o R1 para UI-only epics)
↓
✅ Epic Done / 🟡 Fix warnings
\`\`\`

### Pre-Release

\`\`\`
Todos los epics Done
↓
/audit R3
↓
✅ Tag v1.0
\`\`\`
```

**Tabla de Risk Tier por Epic:**

| Tipo de Epic          | Audit Tier             |
| --------------------- | ---------------------- |
| DB/Schema             | R2                     |
| Auth/RBAC             | R2 + TEST-\*           |
| Core Business Logic   | R2 + TEST-\*           |
| Cálculos Financieros  | R2 + Validación Manual |
| Wizard/Multi-step     | R2 + TEST-\*           |
| Integraciones         | R2                     |
| UI-only (CRUD simple) | R1                     |
| Panel/Dashboard       | R1                     |

---

### 5. Referencias Inline (API Contracts + Business Rules)

**Problema:** Desarrolladores pierden tiempo buscando specs.

**Solución:** Referencias inline en cada issue.

**Sección Estándar:**

```markdown
## 📚 Referencias

- **Pantalla/Wireframe:** [SCR-XXX](link) — Título
- **API Contract:** [07_API_CONTRACTS.md#createXXX](link) — `createXXX(input)`
- **Business Rules:** [BR-XXX](link) — Descripción corta
- **Flow:** [FLW-XXX](link) — Nombre del flujo
```

**Métricas Target:**

- API Contract refs: ≥ 90% de issues
- Business Rules refs: ≥ 90% de issues
- Wireframe refs: 100% de issues con UI

---

### 6. Consistencia Epic-Issues

**Problema:** El count de issues en Epic header no matchea la tabla.

**Solución:** Verificación automática + formato estándar.

**Header de Epic Estándar:**

```markdown
# E[NN] — EPIC-[NOMBRE]: [Título]

> **Milestone:** v1.0
> **Status:** 📋 Planning
> **Issues:** X total (Y done) — includes TEST-XXX si aplica
> **Priority:** P[0-2]
```

**Comando de Verificación:**

```bash
for f in ./docs/backlog/v1.0/epics/EPIC-*.md; do
  name=$(basename "$f" .md | sed 's/EPIC-//')
  declared=$(grep -E "Issues:.* total" "$f" | grep -oE "[0-9]+" | head -1)
  actual=$(grep -E "^\| \[" "$f" | wc -l | tr -d ' ')
  if [ "$declared" -eq "$actual" ]; then
    echo "✅ $name: $declared = $actual"
  else
    echo "❌ $name: $declared ≠ $actual"
  fi
done
```

---

### 7. Cobertura de Conceptos (para dominios con catálogos)

**Problema:** Gaps en conceptos/tipos se descubren tarde.

**Solución:** Tabla de cobertura explícita en Epic.

**Ejemplo (Movimientos 18/18):**

```markdown
## Cobertura de Conceptos (18/18)

| Categoría      | Conceptos           | Issue      |
| -------------- | ------------------- | ---------- |
| Inversionistas | APO, APO-D          | MOV-003    |
| Inversionistas | DIS, DEV, FEE       | MOV-004    |
| Proyectos      | INV, INV-D, RET     | MOV-005    |
| Gastos         | GAS, GASP           | MOV-006    |
| Socios         | APS, RPS, PRS, DPRS | MOV-009 ✅ |
| Admin          | TRA, CAM, ERR, TSI  | MOV-010 ✅ |
```

**Cuándo usar:**

- Movimientos financieros
- Estados de entidad
- Roles de usuario
- Tipos de documento
- Cualquier enum con muchos valores

---

### 8. Starter Kit Coverage Section

**Problema:** Se crean issues para cosas que ya existen.

**Solución:** Sección explícita de qué cubre el Starter Kit.

```markdown
## ✅ Starter Kit Coverage

Los siguientes User Stories ya están implementados y **no requieren issues nuevos**:

| US ID  | Título                  | Starter Kit Feature     |
| ------ | ----------------------- | ----------------------- |
| US-103 | Crear Usuario Admin     | Settings → Users (RBAC) |
| US-107 | Asignar Fondo a Usuario | Extendido en SCHEMA-003 |
| US-110 | Instalar como PWA       | PWA Components          |
```

---

## 📁 Archivos a Modificar en Factory

### 1. `.agent/workflows/backlog.md`

Agregar:

- [ ] Paso de verificación de Starter Kit Coverage
- [ ] Generación automática de TEST-\* issues
- [ ] Tabla de Story Points en output
- [ ] Verificación de consistencia Epic-Issues
- [ ] QA Strategy section en README

### 2. `.agent/skills/roles/backlog/SKILL.md`

Agregar:

- [ ] Sección "Gherkin AC Format (Español)"
- [ ] Template para TEST-\* issues
- [ ] Story Points mapping table
- [ ] Checklist de referencias inline
- [ ] QA Strategy por capas

### 3. Templates

Actualizar:

- [ ] `templates/issue.md` — Agregar Gherkin AC section
- [ ] `templates/epic.md` — Agregar Audit Tier column
- [ ] `templates/readme.md` — Agregar QA Strategy + Story Points

### 4. `/qc` Workflow

Agregar:

- [ ] Check de Gherkin AC presente
- [ ] Check de refs inline (API, BR)
- [ ] Check de INVENTORY actualizado

---

## ✅ Checklist de Implementación

### Phase 1: Templates

- [ ] Actualizar template de issue con Gherkin
- [ ] Actualizar template de epic con TEST-\* support
- [ ] Actualizar template de README con QA Strategy

### Phase 2: Workflow

- [ ] Modificar `/backlog` para generar TEST-\* automático
- [ ] Agregar verificación de consistencia
- [ ] Agregar Story Points al output

### Phase 3: Skill

- [ ] Documentar Gherkin en español
- [ ] Documentar QA Strategy de 3 capas
- [ ] Agregar ejemplos de cada mejora

### Phase 4: QC

- [ ] Agregar checks de calidad de issue
- [ ] Validar refs inline

---

## 📊 Métricas de Éxito

| Métrica                     | Antes  | Después    |
| --------------------------- | ------ | ---------- |
| AC con Gherkin              | 0%     | ≥ 85%      |
| API Contract refs           | ~30%   | ≥ 90%      |
| Business Rules refs         | ~20%   | ≥ 90%      |
| TEST-\* issues por proyecto | 0      | ≥ 3        |
| Epic-Issue consistency      | Manual | Automático |
| QA Strategy documentada     | No     | Sí         |

---

## 🔗 Referencias

- [Backlog Comparison Analysis](./backlog_comparison.md)
- [QE Consultation](./qe_consultation.md)
- Proyecto de referencia: Adi Capital Admin

---

_Ticket generado: 2026-02-03_
_Autor: AI Assistant + /consult-architect + /consult-qe_
