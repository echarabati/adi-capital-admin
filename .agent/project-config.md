# Project Configuration — Adi Capital Admin

> Configuración del proyecto para AI development.
> **Generado:** 2026-02-03
> **Stack:** TimeKast Starter Kit

---

## 📋 Project Overview

| Campo | Valor |
|-------|-------|
| **Nombre** | Adi Capital Admin |
| **Tipo** | Panel de administración web (PWA) |
| **Cliente** | Abraham Cohen |
| **Deadline** | 28 de febrero 2026 |
| **Repositorio** | `echarabati/adi-capital-admin` |

### Descripción

Panel de administración que reemplaza Google Sheets para gestionar fondos de inversión (Adi Capital y Kentucky). Maneja inversionistas, proyectos, inversiones, movimientos financieros, cálculos de Pref y sincroniza con Firebase para la app móvil existente.

---

## 🛠️ Tech Stack

| Componente | Tecnología | Versión |
|------------|------------|---------|
| Framework | Next.js (App Router) | 16+ |
| Estilos | Tailwind CSS | v4 |
| Base de datos | Neon PostgreSQL | - |
| ORM | Drizzle | latest |
| Auth | NextAuth.js | v5 beta |
| Hosting | Vercel | - |
| Storage docs | Google Drive API | - |
| Sync móvil | Firebase Admin SDK | - |

---

## 👥 Roles del Sistema

| Rol | Prioridad | Scope |
|-----|-----------|-------|
| Super Admin | 100 | Todos los fondos, gestión completa |
| Admin de Fondo | 80 | CRUD en fondos asignados |
| Agente de Ventas | 40 | Read-only (post-MVP) |
| Inversionista | 30 | Solo app móvil Flutter |

---

## 🏗️ Core Entities

| Entidad | Descripción |
|---------|-------------|
| Fondo | Adi Capital, Kentucky — contenedores principales |
| Proyecto | Inversiones inmobiliarias/empresariales |
| Inversionista | Participantes con capital comprometido |
| Inversión | Relación inversionista-proyecto con config de Pref |
| Movimiento | 18 tipos de transacciones financieras |
| Calendario | Capital calls programados |
| Documento | Archivos en Google Drive |
| Noticia | Comunicados para app móvil |

---

## 📊 Business Rules (Resumen)

| ID | Regla |
|----|-------|
| RN-001 | Movimientos confirmados = SSOT |
| RN-002 | Estados: Borrador → Confirmado → Cancelado |
| RN-003 | Cascada: pref_primero (Adi) vs capital_primero (Kentucky) |
| RN-004 | Pref acumula diario: `(capital × tasa) / 365` |
| RN-005 | Success Fee solo sobre utilidades |
| RN-007 | Multi-moneda: MXN, USD, EUR, ILS |
| RN-009 | Aislamiento de fondos por rol |

---

## 🔗 Integraciones

| Sistema | Propósito | Fase |
|---------|-----------|------|
| Neon PostgreSQL | SSOT, todos los datos | MVP |
| Firebase Firestore | Sync para app móvil | MVP |
| Google Drive | Gestión documental | MVP |
| Firebase Auth | Usuarios app móvil | MVP |

---

## 📁 Project Structure

```
adi-capital-admin/
├── .agent/               # AI development config
│   ├── rules/            # AI_RULES, SSOT_HIERARCHY
│   ├── workflows/        # /start, /implement, etc.
│   └── skills/           # domains/, roles/
├── docs/
│   ├── planning/         # Discovery Brief, tech docs
│   ├── backlog/          # Issues por versión
│   └── reference/        # INVENTORY, glossary
├── lib/
│   ├── db/schema/        # Drizzle schemas (SSOT)
│   ├── auth/             # NextAuth config
│   └── hooks/            # Custom hooks
├── src/
│   ├── app/              # Next.js App Router
│   └── components/       # UI components
└── scripts/              # Dev tools
```

---

## 🚀 Development Pipeline

```
Discovery Brief ✅ → Docs 01-08 → Design → Backlog → Implement
      ↑
   CURRENT STAGE
```

### Next Steps

1. `/docs` — Generar documentación técnica (01-08)
2. `/design` — Especificación UI/UX
3. `/backlog` — Crear issues ejecutables
4. `/implement` — Implementar código

---

## 📝 Conventions

### Naming (from AI_RULES.md)

- **Components:** PascalCase (`InvestorCard.tsx`)
- **Utilities:** kebab-case (`date-utils.ts`)
- **DB columns:** snake_case (`created_at`)
- **Constants:** SCREAMING_SNAKE (`MAX_INVESTORS`)

### Issue Prefixes

| Dominio | Prefijo |
|---------|---------|
| Fondos | `FOND-` |
| Proyectos | `PROJ-` |
| Inversionistas | `INV-` |
| Movimientos | `MOV-` |
| Dashboard | `DASH-` |
| Auth | `AUTH-` |
| Documentos | `DOC-` |
| Sync | `SYNC-` |

---

## ⚠️ Special Considerations

### MVP Scope (Feb 28)

**Incluido:**
- CRUD de todas las entidades core
- 18 tipos de movimientos
- Cálculo automático de Pref
- Wizard de Reparto (cascada)
- Gestión documental (Drive)
- Sync a Firebase
- PWA básico

**Excluido:**
- Reportes avanzados (TIR/IRR)
- Comisionistas
- Notificaciones push
- Multi-idioma
- Importación masiva desde Sheets

### Dependencies

- Firebase gemelo para desarrollo (no tocar producción)
- Drive test folder para desarrollo
- Acceso a Sheets como referencia (read-only)

---

_TimeKast Factory — Project Configuration_
