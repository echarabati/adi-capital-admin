# Discovery Brief — Adi Capital Admin

**Fecha:** 2026-02-02
**Versión:** 1.0
**Estado:** Completo
**Cliente:** Abraham Cohen
**Deadline:** 28 de febrero 2026

---

## Coverage Map

| # | Sección | Estado |
|---|---------|--------|
| §1 | Idea General | ✅ |
| §2 | Usuarios y Roles | ✅ |
| §3 | Funcionalidades Core | ✅ |
| §4 | Modelo de Datos | ✅ |
| §5 | Integraciones | ✅ |
| §6 | Reglas de Negocio | ✅ |
| §7 | UI/UX | ✅ |
| §8 | Infraestructura | ✅ |
| §9 | Branding | ✅ |
| §10 | Mobile/PWA | ✅ |

---

## §1 Idea General

### Problema

Adi Capital gestiona dos fondos de inversión (Adi Capital y Kentucky) usando Google Sheets como sistema principal. Esto presenta múltiples problemas:
- Sheets no es una base de datos relacional
- Frágil, propenso a errores, difícil de mantener
- Dividido en 2 libros con múltiples hojas
- Lento y no escalable
- Sin control de acceso granular

### Solución

**Adi Capital Admin** — Panel de administración web que:
1. Reemplaza Google Sheets completamente
2. Gestiona fondos, proyectos, inversionistas, inversiones y movimientos financieros
3. Calcula automáticamente intereses (Pref), participaciones y distribuciones
4. Gestiona documentos integrado con Google Drive
5. Sincroniza datos a Firebase para la app móvil existente (Flutter)

### North Star

> Los administradores pueden gestionar toda la operación de los fondos desde una interfaz web intuitiva, eliminando Sheets y Cloud Functions, con sincronización automática a la app de inversionistas.

### MVP Scope (Feb 28)

| Incluido | Excluido (Post-MVP) |
|----------|---------------------|
| CRUD Fondos, Proyectos, Inversionistas | Reportes avanzados IRR/TIR |
| CRUD Inversiones con calendarios | Multi-idioma |
| 18 tipos de Movimientos | Notificaciones push |
| Cálculo Pref acumulado diario | API pública |
| Wizard de Reparto (cascada) | Comisionistas |
| Gestión documental (Drive) | Importación masiva Sheets |
| Noticias | |
| Sync a Firebase | |
| **PWA Admin Panel** | |
| **Tracking gastos de proyecto** | |
| **Compromisos como cuenta por cobrar** | |

---

## §2 Usuarios y Roles

### Roles del Sistema

| Rol | Prioridad | Acceso | Plataforma |
|-----|-----------|--------|------------|
| **Super Admin** | 100 | Todos los fondos, gestión completa | Web Admin |
| **Admin de Fondo** | 80 | CRUD en fondos asignados | Web Admin |
| **Agente de Ventas** | 40 | Read-only, inversiones que gestiona | Web Admin (futuro) |
| **Inversionista** | 30 | Read-only, solo sus datos | App Móvil (Flutter) |

### Usuarios Iniciales

- **Abraham Cohen** — Super Admin (Adi + Kentucky)
- **Olga** — Super Admin (Adi + Kentucky)

### Aislamiento de Fondos

- Inversionistas de Adi Capital no ven Kentucky y viceversa
- Un inversionista puede participar en ambos fondos (con inversiones separadas)
- Admins de Fondo solo ven su fondo asignado

---

## §3 Funcionalidades Core (MVP)

### CRUDs Principales

| Entidad | Campos Clave |
|---------|--------------|
| **Fondo** | nombre, slug, moneda base, método cascada, capital socios |
| **Proyecto** | código, nombre, estado, tasa pref, success fee %, método cascada |
| **Inversionista** | nombre, email, teléfono, es_fundador, % propiedad, agente asignado |
| **Inversión** | código, compromiso, estado, config pref, config admin fee |
| **Calendario de Pagos** | número, fecha, monto esperado, monto pagado, estado |
| **Cuenta Bancaria** | banco, número, CLABE, moneda, saldo |
| **Beneficiario** | nombre, datos bancarios (para gastos) |
| **Noticia** | título, contenido, publicado, fecha |

### Sistema de Movimientos (18 Conceptos)

#### Inversionistas
| Código | Nombre | Dirección | Descripción |
|--------|--------|-----------|-------------|
| APO | Aportación | Ingreso | Inversionista aporta capital |
| APO-D | Aportación Directa | Virtual | Auto-genera INV-D |
| DIS | Reparto | Egreso | Distribución al inversionista |
| DEV | Devolución | Egreso | Devolución por cancelación |
| FEE | Success Fee | Egreso | Fee sobre utilidades |

#### Proyectos
| Código | Nombre | Dirección | Descripción |
|--------|--------|-----------|-------------|
| INV | Inversión a Proyecto | Egreso | Fondo invierte en proyecto |
| INV-D | Inversión Directa | Virtual | Auto-generada por APO-D |
| RET | Retorno de Inversión | Ingreso | Proyecto devuelve capital + utilidades |

#### Gastos
| Código | Nombre | Dirección | Descripción |
|--------|--------|-----------|-------------|
| GAS | Gasto Administración | Egreso | Gastos operativos del fondo |
| GASP | Gasto de Proyecto | Egreso | Gastos específicos de proyecto |

#### Socios (Solo Fundadores)
| Código | Nombre | Dirección | Descripción |
|--------|--------|-----------|-------------|
| APS | Aportación Socio | Ingreso | Socio aporta al fondo |
| RPS | Retiro Socio | Egreso | Socio retira del fondo |
| PRS | Préstamo a Socio | Egreso | Préstamo del fondo |
| DPRS | Devolución Préstamo | Ingreso | Socio devuelve préstamo |

#### Administración
| Código | Nombre | Dirección | Descripción |
|--------|--------|-----------|-------------|
| TRA | Traspaso | Ambos | Transferencia misma moneda |
| CAM | Cambio Divisa | Ambos | Cambio entre monedas |
| ERR | Error | Ingreso | Depósitos por error |
| TSI | Transferencia Saldo | Ambos | Ajuste virtual entre inversionistas |

### Wizard de Reparto (Distribución)

Flujo automatizado para distribuir capital + utilidades:
1. Seleccionar proyecto con capital a distribuir
2. Ingresar monto total
3. Sistema calcula cascada según método configurado
4. Preview con desglose por inversionista
5. Confirmar → genera movimientos DIS + FEE

### Gestión Documental

**4 niveles de visibilidad:**
| Tipo | Ubicación Drive | Visibilidad |
|------|-----------------|-------------|
| Públicos de Proyecto | `Proyectos/{code}/Oportunidad/` | Todos los del fondo |
| Portafolio | `Proyectos/{code}/Portafolio/` | Todos los del fondo |
| Privados de Proyecto | `Proyectos/{code}/Privado/` | Solo participantes |
| Por Inversionista | `Inversionistas/{name}/{project}/` | Solo ese inversionista |

**Operaciones:**
- Listar archivos (UI tipo explorador)
- Subir archivos
- Eliminar/mover
- Crear carpetas automáticamente

---

## §4 Modelo de Datos

### Entidades Principales

```
┌─────────┐
│  FONDO  │ (Adi Capital, Kentucky)
└────┬────┘
     │ 1:N
     ▼
┌──────────┐      ┌─────────────┐
│ PROYECTO │──N:M─│ INVERSIONISTA│
└────┬─────┘      └──────┬──────┘
     │                   │
     │      ┌────────────┴────────────┐
     │      ▼                         │
     │ ┌──────────┐                   │
     └─│ INVERSIÓN│ (participación)   │
       └────┬─────┘                   │
            │ 1:N                     │
            ▼                         │
       ┌───────────┐                  │
       │MOVIMIENTO │◀─────────────────┘
       └───────────┘
```

### Campos Críticos por Entidad

**Fondo:**
- `moneda_base` (MXN, USD, EUR, ILS)
- `metodo_cascada` (pref_primero | capital_primero) — heredable
- `capital_socios` (cached desde movimientos APS/RPS)

**Proyecto:**
- `tasa_pref` (% anual)
- `success_fee_porcentaje` (% sobre utilidades)
- `metodo_cascada` (override opcional)
- `tiene_hurdle`, `tasa_hurdle` (para otros clientes)

**Inversión:**
- `compromiso` (monto comprometido)
- `capital_aportado` (cached desde APO)
- `pref_acumulado` (acumulación diaria)
- `pref_pagado` (total pagado)
- `config_admin_fee` (tipo, %, método)

**Movimiento:**
- `concepto` (18 tipos)
- `monto`, `moneda`, `tipo_cambio`
- `estado` (**Borrador** | **Confirmado** | **Cancelado**)
- `fecha_movimiento`
- `grupo_movimiento` (para operaciones multi-línea)
- `sincronizado_firebase` (tracking de sync)

---

## §5 Integraciones

### Arquitectura de Integración

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ DESARROLLO                                                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────┐       ┌─────────────┐       ┌─────────────────┐           │
│  │ Adi Admin   │──────▶│    Neon     │       │ Firebase PROD   │           │
│  │ (Next.js)   │       │ (SSOT)      │       │ (intacto)       │◀── iOS    │
│  └──────┬──────┘       └─────────────┘       └─────────────────┘           │
│         │                                                                   │
│         │ Firebase Admin SDK                   Google Drive API             │
│         ▼                                            │                      │
│  ┌─────────────────┐                    ┌────────────▼────────┐            │
│  │ Firebase GEMELO │                    │   Drive TEST        │            │
│  │ (pruebas)       │                    │   (estructura dev)  │            │
│  └─────────────────┘                    └─────────────────────┘            │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ PRODUCCIÓN                                                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────┐       ┌─────────────┐                                     │
│  │ Adi Admin   │──────▶│    Neon     │                                     │
│  │ (Next.js)   │       │ (SSOT)      │                                     │
│  └──────┬──────┘       └─────────────┘                                     │
│         │                                                                   │
│         │ Firebase Admin SDK            Google Drive API                    │
│         ▼                                      │                            │
│  ┌─────────────┐                    ┌──────────▼──────────┐                │
│  │ Firebase    │◀── App Móvil       │   Drive Cliente     │                │
│  │ (ex-gemelo) │                    │   (Workspace)       │                │
│  └─────────────┘                    └─────────────────────┘                │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Estrategia de Migración

| Fase | Acción |
|------|--------|
| **1. Desarrollo** | Admin escribe a Neon + Firebase gemelo + Drive test |
| **2. Migración datos** | Rutina extrae de Sheets → puebla Neon |
| **3. Migración usuarios** | Export/import Firebase Auth al gemelo |
| **4. Switch** | Gemelo se convierte en prod, Cloud Functions eliminadas |

### Sync Tracking

Campo `sincronizado_firebase: boolean` en cada entidad para saber qué ya se sincronizó.

### Google Drive

| Acción | Implementación |
|--------|----------------|
| Listar archivos | Drive API → UI tipo explorador |
| Subir archivos | Drive API → carpeta específica |
| Crear carpetas | Automático al crear Proyecto/Inversionista |
| Referencias | `drive_folder_id` en BD |

---

## §6 Reglas de Negocio

### RN-001: Movimiento Ledger = SSOT

**SIEMPRE:** Todos los campos `cached_*` se calculan desde movimientos confirmados.
**NUNCA:** Calcular un cache desde otro cache.

### RN-002: Estados de Movimientos

```
┌──────────┐     Confirmar     ┌────────────┐     Cancelar     ┌────────────┐
│ BORRADOR │ ─────────────────▶│ CONFIRMADO │ ─────────────────▶│ CANCELADO  │
└──────────┘                   └────────────┘                   └────────────┘
     │                              │                                │
     │ Editable                     │ Inmutable                      │ Histórico
     │ Eliminable                   │ Afecta saldos                  │ Lógica inversa
     │ NO afecta cálculos           │                                │
```

### RN-003: Métodos de Cascada (Waterfall)

**Pref Primero (Adi Capital):**
```
Reparto → Reduce Pref primero → Luego Capital
Pref sigue acumulando sobre capital completo
```

**Capital Primero (Kentucky):**
```
Reparto → Reduce Capital primero → Luego Pref
Pref acumula sobre capital reducido
```

Configuración: A nivel Fondo con override por Proyecto.

### RN-004: Cálculo de Pref (Preferred Return)

```
Acumulación diaria = (capital_aportado × tasa_pref) / 365
```

- Se calcula diariamente (cron job o trigger)
- Se acumula en `pref_acumulado`
- Se paga al hacer Reparto según método de cascada

### RN-005: Success Fee

Solo se cobra sobre **utilidades** en distribuciones:
```
Utilidad = Monto Reparto - Capital Invertido
Success Fee = Utilidad × success_fee_porcentaje
```

Auto-genera movimiento FEE al confirmar DIS con utilidad.

### RN-005b: Admin Fee (Comisión de Administración)

**¿Qué es?**
Porcentaje que cobra el organizador del fondo por administrar las inversiones.

**Modalidades de aplicación:**

| Tipo | Base de Cálculo | Frecuencia | Descripción |
|------|-----------------|------------|-------------|
| **One-time** | Compromiso | Una vez | % sobre capital comprometido al cierre |
| **Anual** | Compromiso o Aportado | Anual | % anual prorrateado |

**Variantes del cobro anual:**

| Variante | Descripción |
|----------|-------------|
| **Capital call independiente** | Se cobra como llamada de capital separada |
| **Incluido en siguiente capital call** | Se incluye dentro del próximo capital call |
| **Desglosado** | Se muestra como línea separada en el movimiento |
| **Integrado** | Se incluye en el monto sin desglosar |

**Campos en Inversión:**
- `admin_fee_tipo` (one_time | anual)
- `admin_fee_porcentaje` (% a cobrar)
- `admin_fee_metodo` (capital_call_independiente | incluido_en_capital_call)
- `admin_fee_presentacion` (desglosado | integrado)
- `admin_fee_base` (compromiso | aportado)
- `admin_fee_saldo` (balance pendiente de cobro)

### RN-005c: Compromisos como Cuenta por Cobrar

**Concepto:** El compromiso de inversión funciona como una **cuenta por cobrar**.

```
Compromiso inicial: $100,000
Aportación 1: -$30,000 → Saldo pendiente: $70,000
Aportación 2: -$50,000 → Saldo pendiente: $20,000
Aportación 3: -$20,000 → Saldo pendiente: $0 (Completado)
```

**Estados del compromiso:**
| Estado | Descripción |
|--------|-------------|
| Pendiente | Sin aportaciones |
| Parcial | Aportaciones < Compromiso |
| Completado | Aportaciones = Compromiso |
| Excedido | Aportaciones > Compromiso |

**Campo calculado:** `saldo_compromiso = compromiso - SUM(APO confirmados)`

### RN-005d: Posición Financiera del Proyecto

**Reporte de posición financiera por proyecto:**

| Concepto | Cálculo |
|----------|----------|
| **Inversión recibida** | SUM(INV) - inversión del fondo al proyecto |
| **Inversión realizada** | Capital efectivamente desplegado |
| **Gastos del proyecto** | SUM(GASP) |
| **← Comisiones** | Success fees cobrados |
| **← Admin fees** | Admin fees del proyecto |
| **← Otros gastos** | GASP genéricos |
| **Retornos recibidos** | SUM(RET) |
| **Utilidad/Pérdida** | Retornos - Inversión - Gastos |

### RN-006: Hurdle Rate (para otros clientes)

Umbral mínimo de retorno antes de cobrar Success Fee:
```
Si retorno < hurdle → No se cobra Success Fee
Si retorno > hurdle → Success Fee solo sobre excedente
```

### RN-007: Multi-moneda

- Moneda base a nivel Fondo
- Override por Proyecto
- Tipo de cambio manual al momento de movimiento
- Monedas default: MXN, USD, EUR, ILS

### RN-008: Validaciones por Concepto

| Concepto | Requiere |
|----------|----------|
| APO, DIS, DEV | inversionista + inversión |
| INV, RET | proyecto |
| GAS, GASP | beneficiario |
| APS, RPS, PRS, DPRS | inversionista con `es_fundador = true` |
| TRA | misma moneda |
| CAM | diferente moneda + tipo de cambio |

### RN-009: Aislamiento de Fondos

- Inversionistas de un fondo NO ven el otro
- Administradores pueden estar limitados a un fondo
- Super Admins ven todo

### RN-010: Documentos - Visibilidad

| Tipo | Quién ve |
|------|----------|
| Oportunidad de Inversión | Todos los del fondo |
| Portafolio | Todos los del fondo |
| Privado de Proyecto | Solo participantes del proyecto |
| Personal de Inversionista | Solo ese inversionista |

---

## §7 UI/UX

### Estilo

- **Base:** Starter kit TimeKast (moderno, limpio)
- **Enfoque:** Mobile-first, intuitivo
- **Dark mode:** Soportado
- **Tipografía:** Inter o similar

### Pantallas Principales

| Pantalla | Funcionalidad |
|----------|---------------|
| Dashboard | Resumen de fondos, métricas clave |
| Proyectos | Lista, detalle, documentos |
| Inversionistas | Lista, detalle, inversiones, documentos |
| Inversiones | Por proyecto o inversionista |
| Movimientos | Lista filtrable, registro, confirmación |
| Wizard Reparto | Flujo guiado de distribución |
| Documentos | Explorador tipo Drive |
| Noticias | CRUD de comunicados |
| Configuración | Usuarios, roles, cuentas bancarias |

---

## §8 Infraestructura

### Stack Técnico

| Componente | Tecnología |
|------------|------------|
| Frontend | Next.js 16+ (App Router) |
| Estilos | Tailwind CSS v4 |
| Base de datos | Neon PostgreSQL |
| ORM | Drizzle |
| Auth | NextAuth.js v5 |
| Hosting | Vercel |
| Storage docs | Google Drive API |
| Sync móvil | Firebase Admin SDK |

### Ambientes

| Ambiente | Propósito |
|----------|-----------|
| Development | Local + Firebase gemelo + Drive test |
| Staging | Vercel preview + Firebase gemelo |
| Production | Vercel + Firebase (ex-gemelo) + Drive cliente |

### Dominio

- Admin: Subdominio del cliente (por definir)
- App móvil: Firebase hosting actual

---

## §9 Branding

| Elemento | Valor |
|----------|-------|
| **Nombre app** | Adi Capital Admin |
| **Logo** | TimeKast placeholder (cliente proveerá) |
| **Colores** | Por definir (usar palette del starter kit) |
| **Tono** | Profesional, financiero |

---

## §10 Mobile/PWA

### PWA para Admin Panel

El Admin Panel será una **Progressive Web App (PWA)** para permitir:
- Instalación en dispositivos móviles/desktop
- Acceso offline básico (vista de datos cacheados)
- Notificaciones push (post-MVP)
- Experiencia nativa sin app stores

**Capacidades MVP:**
- [x] Instalable (manifest.json)
- [x] Service Worker básico
- [x] Iconos y splash screens
- [ ] Offline mode completo (post-MVP)

### App Inversionistas (Existente)

La app de inversionistas ya existe (Flutter iOS/Web) y consume Firebase. No se modifica.

---

## Scope Boundaries

### Incluye (MVP - Feb 28)

- [x] CRUD completo de todas las entidades
- [x] 18 tipos de movimientos con validaciones
- [x] Estados Borrador/Confirmado/Cancelado
- [x] Cálculo automático de Pref
- [x] Wizard de Reparto con cascada
- [x] Gestión documental integrada con Drive
- [x] Noticias
- [x] Sync a Firebase
- [x] Multi-moneda (manual)
- [x] RBAC (Super Admin, Admin de Fondo)

### Excluye (Post-MVP)

- [ ] Reportes avanzados (TIR, gráficos)
- [ ] Comisionistas (comisión por referido)
- [ ] Agentes de Ventas (acceso limitado)
- [ ] Notificaciones push
- [ ] API pública
- [ ] Multi-idioma
- [ ] Importación masiva desde Sheets

### Assumptions

1. Cliente tiene acceso completo a Google Workspace, Firebase y Drive
2. Estructura de datos en Firestore es conocida y documentable
3. Cloud Functions pueden ser reemplazadas por sync directo desde Admin
4. Usuarios de Firebase Auth pueden migrarse al proyecto gemelo
5. **Código fuente de Cloud Functions y estructura de Sheets disponible** como referencia

---

## Referencia: Sistemas Actuales

> ⚠️ **Documentación adicional disponible**
>
> El cliente puede proporcionar acceso a:
> - Google Sheets actual (SSOT actual)
> - Código de Cloud Functions (Python)
> - Estructura de Firebase/Firestore
> - SDK de la app Flutter
>
> Estos recursos servirán como referencia para:
> 1. Migración de datos a Neon
> 2. Replicar estructura exacta en Firebase sync
> 3. Validar cálculos financieros contra sistema actual

### Análisis de xlsx (6 archivos analizados)

#### Ingresos y Egresos (per fund, 11 tabs)
- **Ingresos y Egresos**: Historial de movimientos (17 columnas)
- **Inversionistas**: Catálogo (9 columnas incl. booleano Administrador)
- **Compromisos**: Capital calls — **ilimitados** (columnas C1-CN dinámicas)
- **Agentes**: Catálogo básico (Nombre, Mail)
- **Cuentas**, **Conceptos**: Catálogos auxiliares

#### Master (per fund, 30+ tabs)
- **Proyectos**: Configuración (21 columnas)
- **Intereses**: Cálculo de pref día a día (12 columnas)
- **Resumen Pref**: Agregados de interés generado/pagado/pendiente
- **Videos**: Links para app (Proyecto, Tipo, URL, Activo)
- **{PROYECTO}**: Hojas por proyecto — **son reportes, no fuente de datos**

> [!IMPORTANT]
> ### Problemas de Normalización a Corregir
>
> **1. Administradores mezclados con inversionistas**
> - Actualmente: `Inversionistas.Administrador = true/false`
> - Corrección: Tabla separada `usuarios` con rol explícito
>
> **2. Agentes mezclados**
> - Actualmente: Agentes en tab separado pero vinculados por nombre a inversionistas
> - Corrección: Relación FK en tabla `usuarios` con rol `AGENTE`
>
> **3. Capital calls hardcodeados**
> - Actualmente: Columnas C1, C1$, C2, C2$... hasta C10
> - Corrección: Tabla `capital_calls` con N filas por compromiso
>
> **4. Hojas de proyecto = reportes**
> - Actualmente: Cada proyecto tiene una hoja con breakdown por inversionista
> - Corrección: Estas son vistas calculadas, no se migran como datos

---

## Estructura Firestore (Documentado desde Cloud Functions)

> **Fuente:** Análisis de `sync_sheet/main.py`, `sync_drive/main.py`, `sync_news/main.py`

### Colecciones Raíz

```
firestore/
├── funds/
│   └── {fund_slug}/                    # "adicapital", "kentucky"
│       ├── nombre: string              # "Adi Capital"
│       │
│       ├── investors/{inv_id}/         # ID normalizado (lowercase, espacios únicos)
│       │   ├── nombreSocio: string
│       │   ├── mail: string
│       │   ├── telefono: string
│       │   ├── docsFolderId: string    # ID carpeta Drive
│       │   ├── agente: string
│       │   ├── agenteMail: string
│       │   │
│       │   └── projects/{proj_slug}/
│       │       ├── nombreProyecto: string
│       │       ├── retornoPreferencial: string
│       │       ├── docsFolderId: string
│       │       ├── heroImageId: string
│       │       ├── concluido: boolean
│       │       ├── inversionCerrada: boolean
│       │       ├── oportunidadInversion: boolean
│       │       ├── portafolio: boolean
│       │       ├── descripcion: string
│       │       ├── porcentajeRecaudado_f: string
│       │       ├── agente: string
│       │       ├── agenteMail: string
│       │       ├── aportacionesCapital_f: string    # "$100,000.00"
│       │       ├── utilidadRepartida_f: string
│       │       ├── capitalPendienteAportar_f: string
│       │       ├── %Pactado_f: string
│       │       ├── montoPactado_f: string
│       │       ├── prefAcumulado: string
│       │       ├── prefAcumuladoHasta: string       # "2026-01-31"
│       │       ├── porcentajeProyecto_f: string
│       │       ├── notas: string
│       │       │
│       │       ├── movements/{auto_id}/
│       │       │   ├── fecha: timestamp
│       │       │   ├── moneda: string
│       │       │   ├── concepto: string        # "Aportación de Capital", "Retornos", etc.
│       │       │   ├── importeOrig_f: string   # Solo si != USD
│       │       │   ├── importeUSD_f: string
│       │       │   ├── tcIng_f: string
│       │       │   └── tcEgr_f: string
│       │       │
│       │       ├── docsInversionista/{filename}/   # Docs privados del inversionista
│       │       │   ├── path: string
│       │       │   ├── modified: timestamp
│       │       │   └── type: string              # "pdf", "image", "video"
│       │       │
│       │       ├── docsPortafolio/{doc_id}/
│       │       ├── docsPrivados/{doc_id}/
│       │       └── docsOportunidades/{doc_id}/
│       │
│       └── projects/{proj_slug}/
│           ├── nombre: string
│           ├── recaudacion: string           # "$1,000,000.00"
│           ├── inversion: string
│           ├── totalAdmonFee: string
│           ├── admonFee: string
│           ├── gastos: string
│           ├── comisiones: string
│           ├── utilidad: string
│           ├── docsFolderId: string
│           ├── heroImageId: string
│           ├── heroImageUrl: string
│           ├── concluido: boolean
│           ├── retornoPreferencial: string
│           ├── inversionCerrada: boolean
│           ├── oportunidadInversion: boolean
│           ├── portafolio: boolean
│           ├── descripcion: string
│           ├── porcentajeRecaudado_f: string
│           ├── inicio: string
│           ├── terminacion: string
│           ├── aportacionesCapital_f: string
│           ├── utilidadRepartida_f: string
│           │
│           ├── investors/{inv_id}/          # Espejo de projects bajo investor
│           │   └── (mismos campos que arriba)
│           │
│           ├── docsPortafolio/{doc_id}/
│           │   ├── path: string             # "funds/.../portafolio/file.pdf"
│           │   ├── modified: timestamp
│           │   ├── type: string
│           │   └── url: string              # URL pública (si aplica)
│           │
│           ├── docsPrivados/{doc_id}/
│           └── docsOportunidades/{doc_id}/
│
├── news/
│   └── {slug}/                              # "general", "adicapital", "kentucky"
│       └── items/{auto_id}/
│           ├── titulo: string
│           ├── link: string
│           ├── image: string
│           ├── desc: string
│           └── ts: timestamp
│
└── users/
    └── {uid}/
        ├── email: string
        ├── isAdmin: string                  # "00", "01", "10", "11" (bitmask por fondo)
        ├── isAgent: string                  # Igual formato
        └── country: string
```

### Firebase Storage (Bucket: `adi-capital-docs`)

```
adi-capital-docs/
├── funds/{fund_slug}/
│   ├── investors/{inv_id}/
│   │   └── projects/{proj_slug}/
│   │       └── {filename}              # Docs privados por inversionista/proyecto
│   │
│   └── projects/{proj_slug}/
│       ├── heroImage/{filename}        # Imagen portada (pública)
│       ├── portafolio/{filename}       # Docs públicos
│       ├── privado/{filename}          # Docs privados
│       └── oportunidad/{filename}      # Docs de oportunidad
│
└── news/
    └── Logo_Adi_Capital.png            # Logo default para noticias
```

### Mapeo Concepto de Movimientos

| Sheets | Firestore |
|--------|-----------|
| "Aportación a Cuenta" | "Aportación de Capital" |
| "Aportación Directa" | "Aportación de Capital" |
| "Utilidad Renta" | "Retornos" |
| "Utilidades" | "Retornos" |
| "Retiros" | "Retornos" |
| "Devolución Capital" | "Devolución Capital" |
| (otros) | Se mantienen igual |

### Hojas de Sheets Requeridas

| Sheet | Tab | Campos Clave |
|-------|-----|--------------|
| **Catálogo** | Inversionistas | Nombre, Mail, Teléfono, Agente, URL Documentos, Administrador, País |
| **Catálogo** | Proyectos | Proyecto, Pref, URL Documentos, URL Imagen, Concluido, Inversión Cerrada, Oportunidad de Inversión, Portafolio |
| **Catálogo** | Agentes | Nombre, Mail |
| **Catálogo** | Compromisos | Proyecto, Inversionista, % Pactado, Monto Pactado, A Nombre De |
| **Master** | Resumen Pref | Inversionista, Proyecto, Intereses Generados, Intereses Pendientes |
| **Master** | {Proyecto} | Inversionista, % Proyecto, Nota |
| **Master** | Videos | Proyecto, URL, Título, Activo, Tipo de documento |
| **Catálogo** | Ingresos y Egresos | Fecha, Moneda, Ingreso, TC Ing, Egreso, TC Egr, Ingreso USD, Egreso USD, Inversionista/Admin, Categoría, Concepto, Proyecto, Pref, Cuenta |
| **Noticias** | General/ADI Capital/Kentucky | Noticia Activa en App, Titulo, Link, Descripción |

### Bitmask de Roles (isAdmin/isAgent)

| Valor | Binario | Significado |
|-------|---------|-------------|
| 0 | "00" | Sin acceso |
| 1 | "01" | Solo Kentucky |
| 2 | "10" | Solo Adi Capital |
| 3 | "11" | Ambos fondos |

---

## Open Questions

| # | Pregunta | Impacto | Owner |
|---|----------|---------|-------|
| Q1 | ¿Estructura exacta de colecciones Firestore? | Alto | Desarrollador |
| Q2 | ¿Colores corporativos de Adi Capital? | Bajo | Cliente |
| Q3 | ¿Subdominio para el Admin? | Medio | Cliente |
| Q4 | ¿Frecuencia de cálculo de Pref? (cron diario vs tiempo real) | Medio | Desarrollador |

---

## Riesgos

| Risk | Severidad | Impacto | Mitigación |
|------|-----------|---------|------------|
| Timeline agresivo (4 semanas) | 🟡 Medio | Scope incompleto | Backlog granular, priorización estricta |
| Sync Firebase rompe app móvil | 🔴 Alto | App inoperativa | Proyecto gemelo para testing |
| Cálculos financieros incorrectos | 🔴 Alto | Errores en distribuciones | Tests exhaustivos, validación con cliente |
| Migración usuarios Firebase | 🟡 Medio | Usuarios pierden acceso | Export/import nativo de Firebase Auth |

---

## Terminología

| Término | Significado |
|---------|-------------|
| **Fondo** | Entidad de inversión (Adi Capital, Kentucky) |
| **Proyecto** | Oportunidad de inversión dentro de un fondo |
| **Inversionista** | Persona que invierte en proyectos |
| **Inversión** | Participación de un inversionista en un proyecto |
| **Movimiento** | Transacción financiera (18 tipos) |
| **Pref** | Preferred Return - retorno preferencial acumulado |
| **Cascada** | Método de distribución (Pref Primero / Capital Primero) |
| **Reparto** | Distribución de capital + utilidades |
| **Success Fee** | Comisión del fondo sobre utilidades |
| **Admin Fee** | Comisión de administración |
| **Hurdle** | Umbral mínimo de retorno (tasa mínima) |
| **TIR** | Tasa Interna de Retorno (IRR) |
| **Multiplicador** | MOIC - Multiple of Invested Capital |

---

## ADRs Pendientes

| ADR | Tema | Prioridad |
|-----|------|-----------|
| ADR-001 | Estrategia de integración Firebase/Drive | 🔴 Alta |
| ADR-002 | Flujo de estados de movimientos | 🟡 Media |
| ADR-003 | Métodos de cascada y cálculo de Pref | 🟡 Media |

---

## Próximos Pasos

1. `/docs` — Generar documentación técnica (01-06)
2. `/design` — Especificar pantallas y flujos UI
3. `/backlog` — Crear issues granulares del MVP
4. `/implement` — Desarrollo iterativo por issues

---

_Generated by TimeKast Factory — Discovery Workflow_
