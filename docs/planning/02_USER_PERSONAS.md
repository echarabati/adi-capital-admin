# 👥 User Personas — Adi Capital Admin

> Generado desde Discovery Brief §2 por `/docs`
> **Fuente:** `docs/planning/00_DISCOVERY_BRIEFING.md`
> **SSOT:** Este documento define los usuarios del sistema.

---

## Resumen de Roles

| ID | Rol | Descripción | Prioridad | Plataforma | Cantidad Esperada |
|----|-----|-------------|-----------|------------|-------------------|
| P-001 | Super Admin | Acceso total a todos los fondos | 100 | Web Admin | 2 (Abraham, Olga) |
| P-002 | Admin de Fondo | Gestión limitada a fondos asignados | 80 | Web Admin | 1-3 |
| P-003 | Agente de Ventas | Read-only, inversionistas que gestiona | 40 | Web Admin (Post-MVP) | 5-10 |
| P-004 | Inversionista | Read-only, solo sus datos | 30 | App Móvil Flutter | 50-200 |

---

## P-001: Super Admin

### Perfil

| Atributo | Valor |
|----------|-------|
| **Descripción** | Administrador principal con control total sobre la operación de todos los fondos |
| **Usuarios iniciales** | Abraham Cohen, Olga |
| **Nivel técnico** | Medio-Alto |
| **Frecuencia de uso** | Diario |
| **Dispositivo principal** | Desktop (Web) |

### Jobs to Be Done (JTBD)

1. **Gestionar la operación diaria** de ambos fondos (Adi Capital y Kentucky) desde una sola plataforma
2. **Registrar y confirmar movimientos financieros** (aportaciones, distribuciones, gastos)
3. **Calcular y ejecutar distribuciones** de capital y utilidades con el método de cascada correcto
4. **Mantener actualizados los datos** para que la app de inversionistas refleje información precisa
5. **Gestionar documentos** de proyectos e inversionistas
6. **Publicar noticias** para comunicar a los inversionistas

### Frustraciones Actuales (Pain Points)

1. **Google Sheets es frágil** — Un error en una fórmula puede propagar datos incorrectos
2. **Cálculos manuales** — El Pref y las distribuciones requieren trabajo manual propenso a errores
3. **Información fragmentada** — Los datos están divididos en múltiples hojas y libros
4. **Sync manual** — Actualizar la app de inversionistas requiere ejecutar scripts
5. **Sin control de acceso** — Cualquiera con acceso al Sheet ve todo

### Escenario de Uso

> Abraham inicia el día abriendo el panel de Adi Capital Admin. En el dashboard ve el resumen de ambos fondos. Entra al proyecto "Marina Tower" para registrar un retorno que acaba de llegar. El sistema calcula automáticamente cuánto Pref ha acumulado cada inversionista. Abraham abre el Wizard de Reparto, ingresa el monto total, revisa el desglose propuesto y confirma. Los movimientos se generan y sincronizan a la app móvil automáticamente.

### Permisos

| Acción | Permitido | Referencia |
|--------|-----------|------------|
| Ver y gestionar ambos fondos (Adi + Kentucky) | ✅ | BR-052 |
| CRUD completo de proyectos | ✅ | BR-053 |
| CRUD completo de inversionistas | ✅ | BR-054 |
| CRUD completo de inversiones | ✅ | BR-055 |
| Registrar cualquier tipo de movimiento | ✅ | BR-056 |
| Confirmar/cancelar movimientos | ✅ | BR-057 |
| Ejecutar Wizard de Reparto | ✅ | BR-058 |
| Gestionar documentos | ✅ | BR-059 |
| Publicar noticias | ✅ | BR-060 |
| Gestionar usuarios del sistema | ✅ | BR-061 |
| Ver métricas y dashboards | ✅ | BR-062 |

---

## P-002: Admin de Fondo

### Perfil

| Atributo | Valor |
|----------|-------|
| **Descripción** | Administrador con acceso limitado a uno o más fondos específicos |
| **Usuarios iniciales** | Por definir |
| **Nivel técnico** | Medio |
| **Frecuencia de uso** | Diario |
| **Dispositivo principal** | Desktop (Web) |

### Jobs to Be Done (JTBD)

1. **Gestionar la operación diaria** del fondo(s) asignado(s)
2. **Registrar movimientos** solo para su(s) fondo(s)
3. **Consultar posición de proyectos e inversionistas** de su fondo
4. **Gestionar documentos** de su fondo

### Frustraciones Actuales (Pain Points)

1. **Acceso excesivo** — Actualmente puede ver datos de fondos que no le corresponden
2. **Mismas limitaciones de Sheets** que P-001

### Escenario de Uso

> Carlos es Admin de Kentucky. Al entrar al panel, solo ve el fondo Kentucky. No tiene visibilidad de Adi Capital. Puede registrar aportaciones y movimientos, pero no puede ver ni modificar datos de inversionistas que participan en ambos fondos (solo ve su participación en Kentucky).

### Permisos

| Acción | Permitido | Referencia |
|--------|-----------|------------|
| Ver fondos asignados únicamente | ✅ | BR-063 |
| CRUD de proyectos de sus fondos | ✅ | BR-064 |
| CRUD de inversionistas de sus fondos | ✅ | BR-065 |
| Registrar movimientos de sus fondos | ✅ | BR-066 |
| Confirmar/cancelar movimientos | ✅ | BR-067 |
| Ejecutar Wizard de Reparto | ✅ | BR-068 |
| Gestionar documentos de sus fondos | ✅ | BR-069 |
| Ver otros fondos | ❌ | BR-070 |
| Gestionar usuarios | ❌ | BR-071 |

---

## P-003: Agente de Ventas (Post-MVP)

### Perfil

| Atributo | Valor |
|----------|-------|
| **Descripción** | Vendedor/captador con acceso read-only a inversionistas que gestiona |
| **Usuarios iniciales** | Por definir |
| **Nivel técnico** | Bajo-Medio |
| **Frecuencia de uso** | Semanal |
| **Dispositivo principal** | Mobile (PWA) |

### Jobs to Be Done (JTBD)

1. **Consultar estado** de sus inversionistas referidos
2. **Ver documentos** relacionados a sus inversionistas
3. **Dar seguimiento** a oportunidades de inversión

### Permisos (Post-MVP)

| Acción | Permitido | Referencia |
|--------|-----------|------------|
| Ver inversionistas asignados (read-only) | ✅ | BR-072 |
| Ver inversiones de sus inversionistas | ✅ | BR-073 |
| Descargar documentos | ✅ | BR-074 |
| Cualquier acción de escritura | ❌ | BR-075 |

---

## P-004: Inversionista

### Perfil

| Atributo | Valor |
|----------|-------|
| **Descripción** | Persona que invierte capital en proyectos de los fondos |
| **Usuarios** | 50-200 por fondo |
| **Nivel técnico** | Bajo |
| **Frecuencia de uso** | Mensual |
| **Dispositivo principal** | Mobile (App Flutter existente) |

### Jobs to Be Done (JTBD)

1. **Ver estado de sus inversiones** y saldos actualizados
2. **Consultar movimientos** de sus proyectos
3. **Acceder a documentos** personales y de proyectos
4. **Leer noticias** del fondo

### Notas

> ⚠️ **Este usuario NO accede al Admin Panel.**
> Solo consume datos a través de la app móvil Flutter existente.
> El Admin Panel sincroniza datos a Firebase para que la app los muestre.

### Permisos en App Móvil

| Acción | Permitido |
|--------|-----------|
| Ver sus inversiones y saldos | ✅ |
| Ver movimientos de sus proyectos | ✅ |
| Ver documentos personales | ✅ |
| Ver documentos de proyectos donde participa | ✅ |
| Ver noticias de su fondo | ✅ |
| Cualquier acción de escritura | ❌ |

---

## Matriz de Permisos Completa (RBAC)

> **Referencia detallada:** Ver `04_BUSINESS_RULES.md` sección RBAC

| Acción | P-001 | P-002 | P-003 | P-004 |
|--------|:-----:|:-----:|:-----:|:-----:|
| **Fondos** |
| Ver todos los fondos | ✅ | ❌ | ❌ | ❌ |
| Ver fondos asignados | ✅ | ✅ | ❌ | ❌ |
| Editar configuración fondo | ✅ | ❌ | ❌ | ❌ |
| **Proyectos** |
| Ver proyectos del fondo | ✅ | ✅ | ✅* | ✅* |
| Crear proyecto | ✅ | ✅ | ❌ | ❌ |
| Editar proyecto | ✅ | ✅ | ❌ | ❌ |
| Eliminar proyecto | ✅ | ❌ | ❌ | ❌ |
| **Inversionistas** |
| Ver todos los inversionistas | ✅ | ✅† | ✅‡ | ❌ |
| Crear inversionista | ✅ | ✅ | ❌ | ❌ |
| Editar inversionista | ✅ | ✅ | ❌ | ❌ |
| **Movimientos** |
| Registrar movimiento | ✅ | ✅ | ❌ | ❌ |
| Confirmar movimiento | ✅ | ✅ | ❌ | ❌ |
| Cancelar movimiento | ✅ | ✅ | ❌ | ❌ |
| **Documentos** |
| Ver docs públicos | ✅ | ✅ | ✅ | ✅* |
| Ver docs privados | ✅ | ✅ | ❌ | ❌ |
| Subir documentos | ✅ | ✅ | ❌ | ❌ |
| **Sistema** |
| Gestionar usuarios | ✅ | ❌ | ❌ | ❌ |
| Ver dashboard completo | ✅ | ✅† | ❌ | ❌ |

**Notas:**
- `*` Solo datos donde participa
- `†` Solo de sus fondos
- `‡` Solo inversionistas que gestiona (Post-MVP)

---

## Flujo de Onboarding por Rol

### P-001: Super Admin

1. Se crea cuenta con rol Super Admin
2. Acceso inmediato a todos los fondos
3. No requiere asignación adicional

### P-002: Admin de Fondo

1. Super Admin crea cuenta de usuario
2. Super Admin asigna fondo(s) específicos
3. Usuario solo ve fondos asignados

### P-003: Agente de Ventas (Post-MVP)

1. Admin crea cuenta con rol Agente
2. Admin asigna inversionistas al agente
3. Agente accede en modo read-only

---

## Open Questions

| # | Pregunta | Impacto | Owner |
|---|----------|---------|-------|
| OQ-01 | ¿Un Admin de Fondo puede asignar agentes a inversionistas o solo Super Admin? | Med | Cliente |
| OQ-02 | ¿Cuántos Admin de Fondo adicionales se esperan a corto plazo? | Low | Cliente |
| OQ-03 | ¿Los agentes de ventas recibirán notificaciones de actividad de sus inversionistas? | Med | Cliente |

---

## Assumptions

| # | Supuesto | Si es incorrecto |
|---|----------|------------------|
| A-01 | Los inversionistas NO necesitan acceso al Admin Panel | Impacto: Requeriría portal web adicional |
| A-02 | Un inversionista puede participar en múltiples fondos pero ve cada uno por separado | Impacto: Lógica de UI cambia |
| A-03 | Los agentes de ventas son read-only sin capacidad de generar reportes propios | Impacto: Features adicionales para v1.2 |

---

*Generado por TimeKast Factory — /docs*
