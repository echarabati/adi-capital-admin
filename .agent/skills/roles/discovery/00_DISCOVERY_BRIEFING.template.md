# Discovery Brief — {{PROJECT_NAME}}

**Fecha:** {{DATE}}
**Versión:** 1.0
**Estado:** Completo | Parcial
**Stakeholder:** {{STAKEHOLDER}}

---

## 📊 Coverage Map

| # | Sección | Estado | Notas |
|---|---------|--------|-------|
| §1 | Idea General | ✅/🟡/🔴/⚪ | |
| §2 | Usuarios y Roles | ✅/🟡/🔴/⚪ | |
| §3 | Funcionalidades Core | ✅/🟡/🔴/⚪ | |
| §4 | Modelo de Datos | ✅/🟡/🔴/⚪ | |
| §5 | Integraciones | ✅/🟡/🔴/⚪ | |
| §6 | Reglas de Negocio | ✅/🟡/🔴/⚪ | |
| §7 | UI/UX | ✅/🟡/🔴/⚪ | |
| §8 | Infraestructura | ✅/🟡/🔴/⚪ | |
| §9 | Branding | ✅/🟡/🔴/⚪ | |
| §10 | Mobile/PWA | ✅/🟡/🔴/⚪ | |

**Coverage Total:** X/10 completas
**Deadline:** {{DEADLINE}}

---

## §1 Idea General

### 1.1 Pitch de Elevador
> En 2-3 oraciones: qué hace, para quién, por qué.

### 1.2 Problema que Resuelve
- **Dolor principal:**
- **Cómo lo resuelven hoy:**
- **Por qué no funciona:**

### 1.3 Solución Propuesta
- **Ventaja competitiva:**

### 1.4 North Star (Métrica de Éxito)
- **Métrica:**
- **Target:**

### 1.5 Alcance MVP vs Futuro

| MVP | Fase 2 | Futuro |
|-----|--------|--------|
| | | |

---

## §2 Usuarios y Roles

### 2.1 Tipos de Usuario

| Rol | Descripción | Cantidad | Frecuencia | Device | Nivel Técnico |
|-----|-------------|----------|------------|--------|---------------|
| | | | | | |

### 2.2 Matriz de Permisos

| Acción | Rol 1 | Rol 2 | Admin |
|--------|-------|-------|-------|
| Ver | | | |
| Crear | | | |
| Editar | | | |
| Eliminar | | | |

### 2.3 Flujo de Onboarding
- **Registro:** Auto / Invitación
- **Aprobación:** Sí / No
- **Verificación email:** Sí / No

### 2.4 Autenticación
- [ ] Email + Password
- [ ] Magic Link
- [ ] Google OAuth
- [ ] Apple OAuth
- [ ] Otro: ___

---

## §3 Funcionalidades Core (MVP)

### 3.1 Features MVP

| Feature | Descripción | Usuario | Criticidad |
|---------|-------------|---------|------------|
| | | | 🔴 Core / 🟡 Importante / 🟢 Nice-to-have |

### 3.2 User Stories Prioritarias

1. Como **[ROL]**, quiero **[ACCIÓN]**, para **[BENEFICIO]**.
2. ...

### 3.3 Features Excluidas (Post-MVP)
- 
- 

---

## §4 Modelo de Datos

### 4.1 Entidades Principales

| Entidad | Descripción | Campos Clave | Estados |
|---------|-------------|--------------|---------|
| | | | |

### 4.2 Relaciones
```
[Entidad A] ──1:N──▶ [Entidad B]
[Entidad B] ──N:M──▶ [Entidad C]
```

### 4.3 Datos Sensibles
- [ ] PII (nombre, email, teléfono)
- [ ] Financieros
- [ ] Salud
- [ ] Compliance requerido: ___

---

## §5 Integraciones

### 5.1 APIs Externas

| Proveedor | Propósito | Frecuencia | Costo Est. |
|-----------|-----------|------------|------------|
| | | | |

### 5.2 Servicios Terceros

| Categoría | Servicio | Propósito |
|-----------|----------|-----------|
| Email | Resend | Notificaciones |
| Pagos | Stripe | Suscripciones |
| Storage | Vercel Blob | Uploads |
| Analytics | PostHog | Métricas |

---

## §6 Reglas de Negocio

### 6.1 Invariantes Críticas (NUNCA/SIEMPRE)

| ID | Regla |
|----|-------|
| RN-001 | [Entidad] NUNCA puede [acción] cuando [condición] |
| RN-002 | [Acción] SIEMPRE debe [requisito] |

### 6.2 Cálculos y Fórmulas
- 

### 6.3 Estados y Transiciones
```
DRAFT ──(publish)──▶ ACTIVE ──(complete)──▶ DONE
```

### 6.4 Validaciones de Negocio
- 

### 6.5 Triggers y Automatizaciones
- Cuando [evento] → [acción]

---

## §7 UI/UX

### 7.1 Plataformas
- [ ] Web responsive
- [ ] PWA (instalable)
- [ ] iOS nativo
- [ ] Android nativo

### 7.2 Pantallas Principales
1. 
2. 
3. 

### 7.3 Flujos Críticos
1. 
2. 
3. 

### 7.4 Preferencias de Diseño
- **Estilo:** Minimalista / Colorido / Corporativo / Playful
- **Dark mode:** Sí / No / Ambos
- **Referencias:** [apps que gustan]

---

## §8 Infraestructura

### 8.1 Organización
- [ ] **A) Infra Separada** — Cliente paga directamente
- [ ] **B) Infra Centralizada** — TimeKast absorbe costos

**Justificación:**

### 8.2 Hosting y DB
- **Hosting:** Vercel
- **Database:** Neon Postgres
- **Dominio:** ___

### 8.3 Jobs Programados

| Job | Frecuencia | Propósito | Si falla |
|-----|------------|-----------|----------|
| | | | |

### 8.4 Timeline
- **Deadline:** 
- **Prioridad si hay que sacrificar:** Features / Calidad / Performance

---

## §9 Branding

### 9.1 Nombre y Logo

| Elemento | Estado |
|----------|--------|
| Nombre | ✅ Definido / 🟡 Tentativo / 🔴 Por definir |
| Logo | ✅ Disponible / 🔴 Por crear |
| Favicon | ✅ Disponible / 🔴 Por crear |

### 9.2 Paleta de Colores

| Tipo | Hex | Uso |
|------|-----|-----|
| Primary | #______ | CTA buttons |
| Secondary | #______ | Elementos secundarios |
| Accent | #______ | Highlights |

### 9.3 Tipografía
- **Headings:** [font] o "default"
- **Body:** [font] o "default"

### 9.4 Tono de Comunicación
- **Formalidad:** Formal / Neutral / Casual
- **Tratamiento:** Tú / Usted
- **Idioma:** Español / Inglés / Ambos

### 9.5 Assets Existentes
- [ ] Logo SVG
- [ ] Logo PNG transparente
- [ ] Brand guidelines
- [ ] OG image (1200x630)

**Link a assets:**

---

## §10 Mobile/PWA

### 10.1 Device Principal

| Device | Prioridad |
|--------|-----------|
| Mobile | 🥇/🥈/❌ |
| Tablet | 🥇/🥈/❌ |
| Desktop | 🥇/🥈/❌ |

### 10.2 Funcionalidad Offline
- [ ] Ninguno (siempre online)
- [ ] Básico (datos cacheados)
- [ ] Parcial (crear/editar offline, sync después)
- [ ] Completo

### 10.3 Capacidades Nativas

| Capacidad | ¿Necesario? | Caso de uso |
|-----------|-------------|-------------|
| Cámara | Sí/No | |
| GPS | Sí/No | |
| Push Notifications | Sí/No | |
| Biometría | Sí/No | |

### 10.4 Instalabilidad
- [ ] PWA Instalable
- [ ] Solo Web
- [ ] App Store

**Nombre corto PWA:** ___ (máx 12 chars)

### 10.5 Performance Targets
- **TTI:** < 3s 4G
- **Lighthouse:** ≥ 80

---

## Scope Boundaries

### Incluye (MVP)
- 
- 

### Excluye (Post-MVP)
- 
- 

### Assumptions
> Si faltó info explícita, documentar asunciones aquí.
- 

---

## Open Questions

| # | Pregunta | Impacto | Owner | Estado |
|---|----------|---------|-------|--------|
| Q1 | | Alto/Med/Bajo | Cliente/TimeKast | ⬜/✅ |

---

## Riesgos

| Risk | Severidad | Impacto | Mitigación |
|------|-----------|---------|------------|
| | High/Med/Low | | |

---

## Próximos Pasos

1. [ ] Resolver Open Questions críticas
2. [ ] `/docs` — Generar documentación técnica
3. [ ] `/design` — Crear artefactos de diseño

---

_Generado por TimeKast Factory — Discovery Expert_
