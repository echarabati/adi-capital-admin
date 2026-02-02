# Getting Started

> Guía completa para comenzar con el TimeKast Starter Kit.

---

## Prerequisites

Antes de comenzar, asegúrate de tener:

- **Node.js 20+** — [nodejs.org](https://nodejs.org)
- **pnpm 9+** — `npm install -g pnpm`
- **Cuenta Neon** — [neon.tech](https://neon.tech) (database)
- **Cuenta Vercel** — [vercel.com](https://vercel.com) (hosting)

---

## Quick Start (5 minutos)

### 1. Clone y Setup

```bash
# Clonar el Starter Kit
git clone https://github.com/TimeKast/starter-kit.git mi-proyecto
cd mi-proyecto

# Limpiar historial (para nuevo proyecto)
rm -rf .git
git init
git add .
git commit -m "chore: initial commit from TimeKast Starter Kit"

# Instalar dependencias
pnpm install
```

### 2. Configurar Environment

```bash
# Copiar template
cp .env.example .env.local
```

Edita `.env.local` con los valores mínimos:

```env
# Database (obtener de Neon Dashboard)
DATABASE_URL="postgresql://user:pass@host/db?sslmode=require"

# Auth secret (generar con: openssl rand -base64 32)
AUTH_SECRET="tu-secret-seguro-de-32-caracteres"

# Super admin email (para bootstrap con seed)
SUPER_ADMIN_EMAIL="tu.email@gmail.com"
```

### 3. Crear Database

```bash
# Crear tablas en Neon
pnpm db:push

# Crear superadmin inicial
pnpm db:seed
```

### 4. Ejecutar

```bash
pnpm dev
```

Abre [http://localhost:3000](http://localhost:3000) — ¡Listo!

---

## Auth Setup

El Starter Kit viene con auth **100% implementado**. Solo necesitas configurar variables.

### ¿Qué Está Incluido?

| Feature             | Estado | Descripción              |
| ------------------- | ------ | ------------------------ |
| Login con password  | ✅     | Credentials provider     |
| Login con Google    | ✅     | OAuth (configurar keys)  |
| Login con GitHub    | ✅     | OAuth (configurar keys)  |
| Magic Link          | ✅     | Requiere email provider  |
| Password Reset      | ✅     | Requiere email provider  |
| Roles (RBAC)        | ✅     | super_admin, admin, user |
| Super Admin seed    | ✅     | Via `pnpm db:seed`       |
| Dashboard protegido | ✅     | `/dashboard`             |
| Session JWT         | ✅     | 30 días de duración      |

### OAuth Setup (Opcional)

#### Google

1. Ve a [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Crea OAuth 2.0 Client ID
3. Authorized redirect URIs:
   ```
   http://localhost:3000/api/auth/callback/google
   https://tu-app.vercel.app/api/auth/callback/google
   ```
4. Agrega a `.env.local`:
   ```env
   AUTH_GOOGLE_ID="tu-client-id"
   AUTH_GOOGLE_SECRET="tu-client-secret"
   ```

#### GitHub

1. Ve a [GitHub Developer Settings](https://github.com/settings/developers)
2. Create OAuth App
3. Callback URL:
   ```
   http://localhost:3000/api/auth/callback/github
   ```
4. Agrega a `.env.local`:
   ```env
   AUTH_GITHUB_ID="tu-client-id"
   AUTH_GITHUB_SECRET="tu-client-secret"
   ```

### Feature Flags

Habilita/deshabilita features con env vars:

```env
NEXT_PUBLIC_AUTH_PASSWORD="true"       # Login con password
NEXT_PUBLIC_AUTH_MAGIC_LINK="true"     # Magic link (requiere email)
NEXT_PUBLIC_AUTH_REGISTRATION="true"   # Registro público
NEXT_PUBLIC_AUTH_PASSWORD_RESET="true" # Password reset
```

### Usando Roles y Permisos

```typescript
import { usePermissions, Can, RequireRole } from '@/lib/hooks';

// Hook
const { can, hasRole, isSuperAdmin } = usePermissions();

// Componentes
<Can action="create" resource="users">
  <button>Crear Usuario</button>
</Can>

<RequireRole role="admin">
  <AdminPanel />
</RequireRole>
```

---

## Project Structure

```
mi-proyecto/
├── src/
│   ├── app/                # Next.js App Router
│   │   ├── (auth)/         # Auth pages (login, register)
│   │   ├── (protected)/    # Dashboard pages
│   │   └── api/            # API routes
│   └── config/             # Branding, roles, auth-features
│
├── lib/                    # Business logic
│   ├── db/                 # Drizzle ORM
│   │   ├── schema/         # Table schemas
│   │   └── drizzle.ts      # DB client
│   ├── auth/               # Auth utilities
│   ├── actions/            # Server Actions
│   └── utils/              # Utilities
│
├── components/             # React components
│   ├── ui/                 # Base components
│   ├── auth/               # Auth forms
│   └── layout/             # Header, Sidebar
│
├── docs/                   # Documentation
│   ├── guides/             # How-to guides
│   └── reference/          # Reference docs
│
└── tests/                  # Tests
    ├── unit/               # Vitest
    └── e2e/                # Playwright
```

---

## Scripts Disponibles

### Development

```bash
pnpm dev              # Dev server (Turbopack)
pnpm build            # Production build
pnpm start            # Start production server
```

### Quality

```bash
pnpm lint             # ESLint
pnpm typecheck        # TypeScript
pnpm format           # Prettier
pnpm verify           # All of the above + tests
```

### Testing

```bash
pnpm test             # Vitest (unit)
pnpm test:e2e         # Playwright (e2e)
pnpm test:coverage    # Coverage report
pnpm setup:e2e        # Configurar E2E en CI (Neon + GitHub)
```

> **Tip:** Por defecto, E2E en CI está deshabilitado. Ejecuta `pnpm setup:e2e` para configurarlo automáticamente. Ver [E2E Tests in CI](../reference/optional-features.md#4-e2e-tests-in-ci).

### Database

```bash
pnpm db:generate      # Generate migrations
pnpm db:migrate       # Apply migrations
pnpm db:push          # Push directly (dev only)
pnpm db:studio        # Open Drizzle Studio
pnpm db:seed          # Seed data
```

---

## Stack Técnico

| Layer         | Technology                          |
| ------------- | ----------------------------------- |
| **Framework** | Next.js 16+ (App Router, Turbopack) |
| **Language**  | TypeScript (strict mode)            |
| **ORM**       | Drizzle ORM                         |
| **Database**  | Neon Postgres (serverless)          |
| **Auth**      | NextAuth.js v5                      |
| **UI**        | Tailwind CSS v4 + Lucide React      |
| **Testing**   | Vitest + Playwright                 |
| **Hosting**   | Vercel                              |

---

## TimeKast Factory Workflows

El Starter Kit incluye la metodología TimeKast Factory para desarrollo AI-first.

> [!TIP]
> **Antigravity Users:** Al iniciar cada sesión, ejecuta `/start` para cargar contexto.

### Bootstrap (Nuevo Proyecto)

```
/discovery → /proposal → /docs → /backlog → /setup
```

### Development (Diario)

```bash
/implement ISSUE-001    # Implementar un issue
/bugfix "descripción"   # Corregir bug
/refactor archivo.ts    # Refactorizar
/verify                 # Quality checks
```

### Pre-Release

```bash
/audit-pre-release      # Auditoría exhaustiva
```

---

## Next Steps

1. **Personalizar branding** — `src/config/branding.ts`
2. **Agregar OAuth** — Ver sección OAuth Setup arriba
3. **Configurar email** — Ver [optional-features.md](reference/optional-features.md)
4. **Deploy** — Ver [deployment.md](guides/deployment.md)

---

## Resources

- 📖 [Features Reference](reference/features.md)
- 🔐 [Security Posture](reference/security.md)
- 🚀 [Deployment Guide](guides/deployment.md)
- 🔧 [Troubleshooting](guides/troubleshooting.md)
- 📧 [Email Deliverability](guides/email-deliverability.md)

---

_TimeKast Starter Kit — Getting Started_
