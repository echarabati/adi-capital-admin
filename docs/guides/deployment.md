# Deployment Guide

> Guía paso a paso para deploy en Vercel con Neon Postgres.

---

## Prerequisites

Antes de hacer deploy, asegúrate de tener:

- [ ] Cuenta en [Vercel](https://vercel.com) (free tier disponible)
- [ ] Cuenta en [Neon](https://neon.tech) (free tier: 0.5 GB storage)
- [ ] Repositorio en GitHub/GitLab/Bitbucket
- [ ] Environment variables configuradas localmente (`.env.local` funcionando)

---

## Quick Deploy

### Opción A: Vercel Dashboard (Recomendado)

1. Ve a [vercel.com/new](https://vercel.com/new)
2. Conecta tu repositorio de GitHub
3. Vercel detectará Next.js automáticamente
4. Configura las environment variables (ver sección abajo)
5. Click "Deploy"

### Opción B: Vercel CLI

```bash
# Instalar Vercel CLI
pnpm add -g vercel

# Login
vercel login

# Deploy (primera vez — configurará el proyecto)
vercel

# Deploy a producción
vercel --prod
```

---

## Environment Variables

Configura estas variables en **Vercel Dashboard > Settings > Environment Variables**:

### Required Variables

| Variable       | Descripción                      | Ejemplo                                          |
| -------------- | -------------------------------- | ------------------------------------------------ |
| `DATABASE_URL` | Neon connection string           | `postgresql://user:pass@host/db?sslmode=require` |
| `AUTH_SECRET`  | Secret para NextAuth (32+ chars) | `openssl rand -base64 32`                        |

### Optional Variables

| Variable               | Descripción            | Default                  |
| ---------------------- | ---------------------- | ------------------------ |
| `NEXT_PUBLIC_APP_URL`  | URL de la app          | Auto-detected por Vercel |
| `NEXT_PUBLIC_APP_NAME` | Nombre de la app       | "TimeKast"               |
| `EMAIL_PROVIDER`       | Provider de email      | "none"                   |
| `RESEND_API_KEY`       | API key de Resend      | —                        |
| `AUTH_GOOGLE_ID`       | Google OAuth Client ID | —                        |
| `AUTH_GOOGLE_SECRET`   | Google OAuth Secret    | —                        |
| `AUTH_GITHUB_ID`       | GitHub OAuth Client ID | —                        |
| `AUTH_GITHUB_SECRET`   | GitHub OAuth Secret    | —                        |

> [!TIP]
> Genera un AUTH_SECRET seguro:
>
> ```bash
> openssl rand -base64 32
> ```

---

## Custom Domain

### Agregar Dominio

1. Ve a **Project Settings > Domains**
2. Escribe tu dominio (ej: `app.tudominio.com`)
3. Vercel mostrará los DNS records necesarios

### DNS Configuration

Agrega estos records en tu DNS provider:

| Type  | Name | Value                |
| ----- | ---- | -------------------- |
| CNAME | app  | cname.vercel-dns.com |

O para apex domain (`tudominio.com`):

| Type | Name | Value       |
| ---- | ---- | ----------- |
| A    | @    | 76.76.21.21 |

> [!NOTE]
> Vercel provee SSL automáticamente. No necesitas configurar certificados.

---

## Preview Deployments

Cada push a un branch (que no sea `main`) crea un **Preview Deployment** automáticamente.

### Cómo Funcionan

```
feature/new-login (push)
    ↓
Vercel crea: https://tu-proyecto-abc123.vercel.app
    ↓
PR en GitHub muestra link al preview
```

### Environment Variables para Previews

En Vercel, cada variable puede configurarse para:

- **Production** — solo `main` branch
- **Preview** — todos los otros branches
- **Development** — `vercel dev` local

> [!IMPORTANT]
> Para OAuth callbacks en previews, puedes usar Vercel's automatic preview URL detection o configurar un wildcard en tu OAuth provider.

---

## Neon Branches para Preview DBs

> [!TIP]
> Neon Branches permiten crear una copia de tu database para cada preview deployment, evitando contaminar datos de producción.

### ¿Qué son Neon Branches?

Neon permite crear "branches" de tu database, similar a Git branches:

```
main (production DB)
  ├── preview/feature-login (branch DB — copia de main)
  └── preview/fix-auth (branch DB — copia de main)
```

Cada branch es una copia copy-on-write, muy rápida de crear y **gratis en el free tier**.

### Setup: Neon + Vercel Integration

1. **Instalar Neon Integration en Vercel:**
   - Ve a [Vercel Integrations](https://vercel.com/integrations/neon)
   - Click "Add Integration"
   - Conecta tu proyecto Neon

2. **Configurar Branching Automático:**
   - En Neon Dashboard, ve a **Settings > Integrations**
   - Habilita "Create branch for Vercel preview deployments"

3. **Branch Automático por PR:**
   Una vez configurado, cada PR creará automáticamente:
   - Preview deployment en Vercel
   - Branch de database en Neon
   - `DATABASE_URL` configurado automáticamente

### Configuración Manual (Alternativa)

Si prefieres control manual:

```bash
# Crear branch desde CLI
neonctl branches create --name preview-feature-x

# Obtener connection string del branch
neonctl connection-string preview-feature-x
```

Luego configura `DATABASE_URL` en la preview deployment específica.

### Cleanup

Los branches de preview se pueden configurar para eliminarse automáticamente cuando:

- El PR se cierra/mergea
- Pasan X días sin actividad

---

## Troubleshooting

### Build Fails: "Module not found"

**Causa:** Dependencia faltante o path incorrecto.

**Solución:**

```bash
# Verificar que todas las deps estén instaladas
pnpm install

# Verificar paths en tsconfig.json
```

### Environment Variables Not Loading

**Causa:** Variables no configuradas en Vercel o typo en el nombre.

**Diagnóstico:**

```bash
# Ver env vars en build logs
# Vercel muestra cuáles están configuradas (sin valores)
```

**Solución:**

- Verificar nombres exactos en Vercel Dashboard
- Asegurar que están marcadas para el environment correcto (Production/Preview)

### Database Connection Timeout

**Causa:** Connection string incorrecta o Neon project pausado.

**Solución:**

1. Verificar que Neon project esté activo
2. Verificar que `DATABASE_URL` incluye `?sslmode=require`
3. Si usas Neon free tier, el project puede pausarse después de 5 min de inactividad

---

## Production Checklist

Antes de ir a producción:

- [ ] `AUTH_SECRET` es un valor único (no el de desarrollo)
- [ ] OAuth callbacks configurados con dominio de producción
- [ ] Email provider configurado (si usas magic link o password reset)
- [ ] Custom domain configurado con SSL
- [ ] Environment variables revisadas (no secrets hardcodeados)

---

## Recursos Adicionales

- [Vercel Docs: Next.js Deployment](https://vercel.com/docs/frameworks/nextjs)
- [Neon Docs: Branching](https://neon.tech/docs/introduction/branching)
- [Neon + Vercel Integration](https://neon.tech/docs/guides/vercel)

---

_TimeKast Starter Kit — Deployment Guide_
