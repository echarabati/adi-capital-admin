# TimeKast Starter Kit - Features

Lista completa de features incluidas en el starter kit.

---

## 🎨 Theming System

Soporte multi-theme con switching SSR-safe usando `next-themes`.

**Themes disponibles:**

- `light` - Blanco limpio con acentos azules
- `midnight` - Azul profundo (default)
- `dark` - Negro puro con acentos plateados

**Uso:**

```tsx
import { useTheme } from 'next-themes';

function MyComponent() {
  const { theme, setTheme } = useTheme();
  return <button onClick={() => setTheme('dark')}>Dark Mode</button>;
}
```

**Components:**

- `ThemeToggle` - Alternar entre themes
- `ThemeSelector` - Seleccionar theme específico

---

## ✅ Environment Validation

Variables de entorno type-safe con validación Zod y lazy loading.

**Ubicación:** `lib/env.ts`

**Features:**

- Lazy validation (no rompe builds/edge/tests)
- Boolean parsing: acepta `true/false/1/0/yes/no` (case-insensitive)
- Aliases de compatibilidad NextAuth (`NEXTAUTH_SECRET`, `NEXTAUTH_URL`)
- Smart fallback de auth method cuando no hay ninguno configurado

**Uso:**

```tsx
import { getEnv, getNextAuthSecret, getAuthFeatures } from '@/lib/env';

// Type-safe access
const config = getEnv();
const dbUrl = config.DATABASE_URL;

// Auth helpers
const secret = getNextAuthSecret(); // Falls back a AUTH_SECRET
const features = getAuthFeatures(); // Feature flags resueltos
```

**Variables validadas:**

- `DATABASE_URL` (opcional, permite build sin DB)
- `AUTH_SECRET` (required)
- `NEXTAUTH_SECRET`, `NEXTAUTH_URL` (aliases opcionales)
- `AUTH_GOOGLE_ID/SECRET`, `AUTH_GITHUB_ID/SECRET` (opcionales)
- `EMAIL_PROVIDER`, `RESEND_API_KEY`, `EMAIL_SERVER_*` (opcionales)
- Toda configuración `NEXT_PUBLIC_*`

---

## 📝 Form Kit

Forms con `react-hook-form` + validación Zod.

**Ubicación:** `components/form/`

| Component      | Descripción                |
| -------------- | -------------------------- |
| `Form`         | Form wrapper con context   |
| `FormField`    | Input texto/email/password |
| `FormTextarea` | Texto multiline            |
| `FormSelect`   | Dropdown select            |
| `FormCheckbox` | Checkbox con label         |
| `FormSwitch`   | Toggle switch              |
| `SubmitButton` | Submit con loading state   |

**Uso:**

```tsx
import { z } from 'zod';
import { Form, FormField, SubmitButton, useForm } from '@/components/form';

const schema = z.object({
  name: z.string().min(1, 'Required'),
  email: z.string().email(),
});

export function ContactForm() {
  const form = useForm({ schema });

  const onSubmit = async (data) => {
    console.log(data); // ¡Typed!
  };

  return (
    <Form form={form} onSubmit={onSubmit} className="space-y-4">
      <FormField name="name" label="Nombre" />
      <FormField name="email" label="Email" type="email" />
      <SubmitButton>Enviar</SubmitButton>
    </Form>
  );
}
```

---

## 📊 Table Kit

Data tables con sorting, filtering y pagination.

| Component         | Ubicación                        | Descripción         |
| ----------------- | -------------------------------- | ------------------- |
| `Table`           | `components/ui/Table.tsx`        | Sortable data table |
| `TableSearch`     | `components/ui/TableFilters.tsx` | Search input        |
| `TableToolbar`    | `components/ui/TableFilters.tsx` | Actions container   |
| `TablePagination` | `components/ui/TableFilters.tsx` | Page controls       |

**Hook:** `useTableState` (`lib/hooks/useTableState.ts`)

**Uso:**

```tsx
import { Table, TableSearch, TablePagination, TableToolbar } from '@/components/ui';
import { useTableState } from '@/lib/hooks/useTableState';

const columns = [
  { id: 'name', header: 'Nombre', accessor: 'name', sortable: true },
  { id: 'email', header: 'Email', accessor: 'email', sortable: true },
];

export function UsersTable({ users }) {
  const table = useTableState({
    data: users,
    searchableColumns: ['name', 'email'],
    pageSize: 10,
  });

  return (
    <>
      <TableToolbar>
        <TableSearch value={table.filters.search} onChange={table.setSearch} />
      </TableToolbar>
      <Table
        columns={columns}
        data={table.paginatedData}
        keyExtractor={(row) => row.id}
        sorting={{
          onSort: table.onSort,
          getSortDirection: table.getSortDirection,
        }}
      />
      <TablePagination
        page={table.page}
        totalPages={table.totalPages}
        onNext={table.nextPage}
        onPrev={table.prevPage}
      />
    </>
  );
}
```

---

## 🌐 API Client

Type-safe fetch wrapper con error handling e interceptors.

**Ubicación:** `lib/api/client.ts`

**Uso:**

```tsx
import { api, createApiClient } from '@/lib/api/client';

// GET request
const { data, error } = await api.get<User[]>('/api/users');

// POST request
const { data, error } = await api.post<User>('/api/users', { name: 'Juan' });

// Custom client con base URL
const externalApi = createApiClient({
  baseUrl: 'https://api.ejemplo.com',
  headers: { Authorization: 'Bearer token' },
  onError: (err) => console.error(err),
});
```

---

## 🎯 UI Components

**Base components en `components/ui/`:**

| Component       | Descripción              |
| --------------- | ------------------------ |
| `Avatar`        | User avatar con fallback |
| `Badge`         | Status labels            |
| `ConfirmDialog` | Confirmation modal       |
| `Pagination`    | Page navigation          |
| `Skeleton`      | Loading placeholders     |
| `ThemeToggle`   | Theme switcher           |

---

## 🗺️ Breadcrumb Context

Sistema de contexto global para reemplazar UUIDs por nombres legibles en breadcrumbs.

**Components:**

| Component            | Ubicación                      | Descripción                    |
| -------------------- | ------------------------------ | ------------------------------ |
| `Breadcrumb`         | `components/ui/Breadcrumb.tsx` | Muestra breadcrumb navigation  |
| `BreadcrumbSetter`   | `components/common/`           | Setea label para un segment    |
| `BreadcrumbProvider` | `lib/contexts/`                | Provider global (en Providers) |

**Uso:**

```tsx
// En páginas con params dinámicos
import { BreadcrumbSetter } from '@/components/common/BreadcrumbSetter';

export default async function UserPage({ params }) {
  const { id } = await params;
  const user = await getUser(id);

  return (
    <>
      <BreadcrumbSetter segment={id} label={user.name} />
      <h1>{user.name}</h1>
    </>
  );
}
```

**Result:** Breadcrumb muestra `Users > John Doe` en vez de `Users > abc-123-uuid`

**Priority order:** Context labels > Static routeLabels > Formatted segment

---

## 🔐 Authentication

NextAuth.js v5 con múltiples providers y configuración robusta.

**Providers:**

- Credentials (email/password)
- Magic Link (email) - requiere email provider
- Google OAuth
- GitHub OAuth

**Features:**

- Role-based access (user, admin, super_admin)
- Configurable vía environment variables
- Pre-built login/register forms
- Unique cookies por proyecto (multi-project dev support)
- OAuth credential validation (no silent failures)
- Database check en authorize (error claro si no está configurada)

**Auth Feature Flags:**

```bash
NEXT_PUBLIC_AUTH_PASSWORD="true"       # Email/password login
NEXT_PUBLIC_AUTH_MAGIC_LINK="true"     # Magic link (necesita email provider)
NEXT_PUBLIC_AUTH_REGISTRATION="true"   # User registration
NEXT_PUBLIC_AUTH_PASSWORD_RESET="true" # Password reset
```

**Smart Defaults:**

- Si no hay auth methods configurados → habilita password + registration como fallback
- Si magic link está enabled pero no hay email provider → auto-disable con warning
- OAuth providers solo enabled si ID y SECRET están configurados

**Ubicación:** `lib/auth/auth.ts`, `config/auth-features.ts`

---

## 📧 Email Provider

Unified email sending con soporte para Resend y SMTP.

**Configuración:**

```bash
# Options: "resend" | "smtp" | "none"
EMAIL_PROVIDER="none"
EMAIL_FROM="noreply@tudominio.com"

# Resend
RESEND_API_KEY=""

# SMTP
EMAIL_SERVER_HOST=""
EMAIL_SERVER_PORT="587"
EMAIL_SERVER_USER=""
EMAIL_SERVER_PASSWORD=""
```

**Features:**

- Factory pattern (switch providers vía env)
- Branded email templates (optional logo)
- Test endpoint: `/api/email/test` (dev/admin only)
- Rate limiting en test endpoint

**Ubicación:** `lib/email/`

---

## 🔑 Password Reset

Secure password reset flow con hashed tokens.

**Security:**

- Tokens hashed (SHA-256) antes de storage
- Un token por user (new request invalida el anterior)
- 1-hour expiration
- No user enumeration (siempre retorna success)

**Flow:**

1. `/forgot-password` → submit email
2. Email sent con reset link
3. `/reset-password?token=xxx` → validate + nueva password
4. Redirect a login

**API Endpoints:**

- `POST /api/auth/forgot-password`
- `GET /api/auth/reset-password?token=` (validate)
- `POST /api/auth/reset-password` (reset)

**Ubicación:** `lib/auth/password-reset.ts`, `components/auth/`

---

## 🎨 Design Tokens

CSS custom properties compatibles con shadcn/ui.

**Token categories:**

- Base colors (background, foreground)
- Component surfaces (card, popover)
- Semantic colors (primary, secondary, muted, accent)
- Status colors (success, error, warning, info)
- Layout tokens (sidebar, header, table)
- shadcn/ui compatibility (border, ring, radius, destructive)
- Shadows y utilities

Todos los tokens se adaptan automáticamente al theme seleccionado.

**Ubicación:** `src/app/globals.css`

---

## 📱 Progressive Web App (PWA)

Installable PWA con premium UX para install prompts y updates.

**Core Features:**

- Native manifest vía Next.js (`src/app/manifest.ts`)
- Service Worker con `next-pwa`
- Installable en desktop y mobile
- Offline fallback page

**Install UX:**

- Smart install toast (7-day cooldown tras dismiss)
- iOS "Add to Home Screen" hint (se muestra una vez)
- Detecta standalone mode

**Update UX:**

- Detecta nueva SW version
- "Update available" toast con one-click update
- Proper `SKIP_WAITING` → `controllerchange` flow

**Caching Policy:**

- API routes: `NetworkOnly` (security default)
- Static assets: `StaleWhileRevalidate`
- Next.js static: `CacheFirst`

**Components:**

| Component         | Ubicación            | Descripción            |
| ----------------- | -------------------- | ---------------------- |
| `PwaInstallToast` | `components/pwa/`    | Install prompt toast   |
| `PwaUpdateToast`  | `components/pwa/`    | Update available toast |
| `IosA2hsHint`     | `components/pwa/`    | iOS add to home hint   |
| `OfflineBanner`   | `components/common/` | Offline status banner  |

**Hooks:**

| Hook                 | Ubicación  | Descripción            |
| -------------------- | ---------- | ---------------------- |
| `usePwaInstall`      | `lib/pwa/` | Install state + prompt |
| `registerSwListener` | `lib/pwa/` | SW update listener     |

**Configuración:**

- `next.config.ts` - next-pwa config
- `public/sw.js` - Custom SW con SKIP_WAITING
- `public/pwa/` - PWA icons (192, 512, maskable, apple-touch)

**QA Script:**

```bash
pnpm pwa:check  # Lighthouse PWA audit
```

---

## 📁 Project Structure

```
├── app/                    # Next.js App Router
│   ├── (auth)/            # Auth pages (login, register)
│   ├── (dashboard)/       # Protected dashboard pages
│   └── api/               # API routes
├── components/
│   ├── form/              # Form Kit components
│   ├── layout/            # Sidebar, Header, MobileMenu
│   ├── pwa/               # PWA components
│   ├── providers/         # ThemeProvider, Providers
│   └── ui/                # Base UI components
├── config/                # App configuration
│   ├── auth-features.ts   # Auth feature flags
│   ├── branding.ts        # App branding + PWA logo
│   └── roles.ts           # RBAC configuration
├── lib/
│   ├── api/               # API client
│   ├── auth/              # Auth utilities
│   ├── db/                # Database (Drizzle + Neon)
│   ├── email/             # Email provider abstraction
│   ├── pwa/               # PWA hooks
│   ├── cache.ts           # Cache policy helpers
│   └── env.ts             # Environment validation
├── public/
│   └── pwa/               # PWA icons
└── types/                 # TypeScript declarations
```
