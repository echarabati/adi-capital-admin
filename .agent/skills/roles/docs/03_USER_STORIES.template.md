# 📝 User Stories - {{PROJECT_NAME}}

> Template para lista priorizada de funcionalidades.
> **Generado desde:** Script Canónico §3 (Funcionalidades Core)

---

## Épicas

| ID | Épica | Descripción | Prioridad | Stories |
|----|-------|-------------|-----------|---------|
| E1 | {{Nombre}} | {{Descripción corta}} | 🔴 Must | {{N}} |
| E2 | {{Nombre}} | {{Descripción corta}} | 🔴 Must | {{N}} |
| E3 | {{Nombre}} | {{Descripción corta}} | 🟡 Should | {{N}} |
| E4 | {{Nombre}} | {{Descripción corta}} | 🟢 Could | {{N}} |

---

## Stories por Épica

### Épica E1: {{Nombre de la Épica}}

#### US-001: {{Título corto}}

| Atributo | Valor |
|----------|-------|
| **Feature** | FT-XXX |
| **Prioridad** | 🔴 Must Have |
| **Estimación** | S / M / L / XL |
| **Épica** | E1 |

**Como** {{rol de usuario}}  
**Quiero** {{acción que quiere realizar}}  
**Para** {{beneficio que obtiene}}

**Acceptance Criteria (Gherkin):**

```gherkin
Scenario: Happy path - {{descripción del escenario}}
  Given {{contexto inicial}}
  When {{acción del usuario}}
  Then {{resultado esperado}}
  And {{resultado adicional}}

Scenario: Error path - {{descripción del escenario de error}}
  Given {{contexto inicial}}
  When {{acción que causa error}}
  Then {{mensaje de error esperado}}
```

> 💡 **Tip:** Incluir al menos 1 happy path + 1 error path por story.

**Notas Técnicas:**
- {{Nota sobre implementación}}
- {{Dependencia o consideración}}

**Mockup/Wireframe:** {{Link a Figma o descripción}}

---

#### US-002: {{Título corto}}

| Atributo | Valor |
|----------|-------|
| **Feature** | FT-XXX |
| **Prioridad** | 🔴 Must Have |
| **Estimación** | M |
| **Épica** | E1 |

**Como** {{rol}}  
**Quiero** {{acción}}  
**Para** {{beneficio}}

**Criterios de Aceptación:**
- [ ] {{Criterio 1}}
- [ ] {{Criterio 2}}

---

### Épica E2: {{Nombre de la Épica}}

#### US-010: {{Título}}

| Atributo | Valor |
|----------|-------|
| **Feature** | FT-XXX |
| **Prioridad** | 🔴 Must Have |
| **Estimación** | L |
| **Épica** | E2 |

**Como** {{rol}}  
**Quiero** {{acción}}  
**Para** {{beneficio}}

**Criterios de Aceptación:**
- [ ] {{Criterio 1}}
- [ ] {{Criterio 2}}

---

## Priorización MoSCoW

### 🔴 Must Have (MVP)

> Sin estas features, el producto no tiene sentido.

| ID | Story | Estimación |
|----|-------|------------|
| US-001 | {{Título}} | S |
| US-002 | {{Título}} | M |
| US-010 | {{Título}} | L |

**Total estimado MVP:** {{X}} puntos / {{Y}} semanas

### 🟡 Should Have (Post-MVP v1.1)

> Importantes pero el MVP puede vivir sin ellas.

| ID | Story | Estimación |
|----|-------|------------|
| US-020 | {{Título}} | M |
| US-021 | {{Título}} | S |

### 🟢 Could Have (Futuro v2.0)

> Nice to have, si hay tiempo.

| ID | Story | Estimación |
|----|-------|------------|
| US-030 | {{Título}} | L |

### ⚪ Won't Have (Descartado)

> Explícitamente fuera de scope.

| ID | Story | Razón |
|----|-------|-------|
| US-040 | {{Título}} | {{Por qué no lo haremos}} |

---

## Dependencias entre Stories

```
US-001 (Auth) ──► US-002 (Profile)
                      │
                      ▼
                 US-010 (Dashboard)
```

---

## Definición de Estimaciones

| Tamaño | Puntos | Tiempo aprox | Ejemplo |
|--------|--------|--------------|---------|
| S | 1 | 2-4 horas | Fix simple, ajuste UI |
| M | 2 | 1-2 días | Feature pequeña |
| L | 5 | 3-5 días | Feature mediana |
| XL | 8 | 1-2 semanas | Feature compleja |

---

*Generado con TimeKast Factory*
