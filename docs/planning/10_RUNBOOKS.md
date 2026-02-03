# 🛠️ Runbooks — Adi Capital Admin

> **Propósito:** Guías de resolución de incidentes operacionales
> **Audiencia:** Desarrolladores, DevOps, Soporte L1/L2
> **SSOT:** Procedimientos de respuesta a incidentes

---

## Incidentes Comunes

### INC-001: Login no funciona

**Síntomas:**
- Error 500 al hacer login
- Redirect loop en login
- "Invalid callback URL" en consola

**Diagnóstico:**
```bash
# 1. Verificar variables de entorno
vercel env ls

# 2. Verificar AUTH_SECRET existe
echo $AUTH_SECRET | wc -c  # Debe ser >= 32 caracteres

# 3. Verificar AUTH_URL coincide con dominio
echo $AUTH_URL
```

**Resolución:**

| Causa | Solución |
|-------|----------|
| Falta `AUTH_SECRET` | `openssl rand -base64 32` y agregar en Vercel |
| Falta `AUTH_URL` | Agregar URL de producción exacta |
| OAuth callback incorrecto | Verificar en Google Cloud Console |
| Cookies bloqueadas | Verificar dominio y `trustHost` |

**Post-resolución:**
```bash
vercel --prod  # Redesplegar
```

---

### INC-002: Base de datos no responde

**Síntomas:**
- Error "Connection refused"
- Timeout en queries
- "ECONNRESET" en logs

**Diagnóstico:**
```bash
# 1. Verificar estado de Neon
# Dashboard: console.neon.tech

# 2. Probar conexión directa
psql $DATABASE_URL -c "SELECT 1"

# 3. Verificar pool de conexiones
# Neon Dashboard → Connection Pooling
```

**Resolución:**

| Causa | Solución |
|-------|----------|
| Neon caído | Verificar status.neon.tech, esperar o contactar soporte |
| Pool agotado | Reiniciar compute en dashboard Neon |
| DNS incorrecto | Verificar `DATABASE_URL` tiene formato correcto |
| SSL requerido | Agregar `?sslmode=require` a connection string |

---

### INC-003: Firebase sync fallando

**Síntomas:**
- App móvil no muestra datos nuevos
- Campo `firebase_synced = false` acumulándose
- Logs muestran "Firebase write failed"

**Diagnóstico:**
```sql
-- Verificar pendientes de sincronización
SELECT COUNT(*) FROM movements WHERE firebase_synced = false;
SELECT COUNT(*) FROM investments WHERE firebase_synced = false;

-- Ver últimos errores
SELECT * FROM sync_logs ORDER BY created_at DESC LIMIT 10;
```

**Resolución:**

| Causa | Solución |
|-------|----------|
| Credenciales expiradas | Regenerar service account en Firebase Console |
| Permisos insuficientes | Verificar reglas de Firestore permiten escritura |
| Cuota excedida | Verificar plan Firebase, upgrade si necesario |
| Formato de datos incorrecto | Revisar logs para campo específico |

**Sync manual:**
```bash
curl -X POST https://admin.adicapital.com/api/cron/sync-firebase \
  -H "Authorization: Bearer $CRON_SECRET"
```

---

### INC-004: Cálculo de Pref incorrecto

**Síntomas:**
- Valores de `pref_accumulated` no coinciden con esperado
- Fecha de `pref_accumulated_until` desactualizada
- Inversionistas reportan discrepancias

**Diagnóstico:**
```sql
-- Verificar última ejecución de cálculo
SELECT MAX(pref_accumulated_until) FROM investments;

-- Verificar inversiones específicas
SELECT id, investor_id, pref_rate, pref_accumulated, pref_accumulated_until
FROM investments
WHERE project_id = 'xxx'
ORDER BY pref_accumulated_until;

-- Verificar cron job
SELECT * FROM cron_logs WHERE job_name = 'calculate-pref' ORDER BY created_at DESC LIMIT 5;
```

**Resolución:**

| Causa | Solución |
|-------|----------|
| Cron no ejecutando | Verificar Vercel Cron Jobs activo |
| Error en fórmula | Revisar `lib/calculations/pref.ts` |
| Datos base incorrectos | Verificar `capital_aportado` y `pref_rate` |

**Recálculo manual:**
```bash
curl -X POST https://admin.adicapital.com/api/cron/calculate-pref \
  -H "Authorization: Bearer $CRON_SECRET"
```

---

### INC-005: Error 403 para usuario autorizado

**Síntomas:**
- Usuario no puede acceder a fondo asignado
- Error "Sin acceso a este fondo"
- Funcionalidad que antes funcionaba ya no funciona

**Diagnóstico:**
```sql
-- Verificar asignación de fondos
SELECT u.email, u.role, uf.fund_id, f.name
FROM users u
LEFT JOIN user_funds uf ON u.id = uf.user_id
LEFT JOIN funds f ON uf.fund_id = f.id
WHERE u.email = 'usuario@example.com';

-- Verificar rol actual
SELECT id, email, role, created_at FROM users WHERE email = 'usuario@example.com';
```

**Resolución:**

| Causa | Solución |
|-------|----------|
| Sin asignación de fondo | INSERT en `user_funds` |
| Rol incorrecto | UPDATE en `users.role` |
| Cache de sesión | Usuario debe cerrar sesión y volver a entrar |
| Middleware bloqueando | Verificar logs de auth middleware |

---

### INC-006: Movimientos duplicados

**Síntomas:**
- Mismo movimiento aparece múltiples veces
- Sumas no cuadran con totales esperados

**Diagnóstico:**
```sql
-- Buscar duplicados por referencia
SELECT reference, COUNT(*) as count
FROM movements
WHERE status = 'confirmed'
GROUP BY reference
HAVING COUNT(*) > 1;

-- Buscar duplicados por monto/fecha/inversión
SELECT investment_id, amount, movement_date, COUNT(*)
FROM movements
WHERE status = 'confirmed'
GROUP BY investment_id, amount, movement_date
HAVING COUNT(*) > 1;
```

**Resolución:**
1. Identificar cuál es el registro correcto (verificar `created_at`)
2. Soft delete del duplicado:
```sql
UPDATE movements SET deleted_at = NOW(), deleted_by = 'ADMIN-UUID'
WHERE id = 'duplicate-id';
```
3. Verificar que totales ahora cuadran

---

## Checklist de Release

### Pre-Deploy

- [ ] Todos los tests pasan: `pnpm test`
- [ ] Build exitoso: `pnpm build`
- [ ] Typecheck limpio: `pnpm typecheck`
- [ ] Lint sin errores: `pnpm lint`
- [ ] Migraciones revisadas: `pnpm db:generate`
- [ ] Variables de entorno actualizadas en Vercel (si aplica)
- [ ] CHANGELOG actualizado

### Deploy

```bash
# 1. Merge a main (auto-deploy en Vercel)
git checkout main
git pull origin main
git merge develop
git push origin main

# 2. Verificar deployment
# Dashboard Vercel → Deployments → Verificar status
```

### Post-Deploy

- [ ] Health check: `curl https://admin.adicapital.com/api/health`
- [ ] Login funciona (probar con cuenta de prueba)
- [ ] Dashboard carga correctamente
- [ ] Crear movimiento de prueba (borrador → eliminar)
- [ ] Verificar sync a Firebase (ver app móvil)
- [ ] Monitorear logs por 15 minutos

---

## Rollback

### Vercel (Deployment)

```bash
# Listar últimos deployments
vercel ls --limit 10

# Rollback al deployment anterior
vercel rollback [deployment-url]

# O desde Dashboard:
# Vercel → Project → Deployments → "..." → Promote to Production
```

### Base de Datos (Neon)

```bash
# Si la migración causó problemas:
# 1. Ir a Neon Dashboard → Branches
# 2. Crear branch desde point-in-time (antes del deploy)
# 3. Verificar que datos están correctos
# 4. Promover branch como principal (si confirmado)

# ⚠️ CUIDADO: Esto puede causar pérdida de datos post-migración
```

---

## Contactos de Escalación

| Nivel | Contacto | Cuándo | SLA |
|-------|----------|--------|-----|
| L1 | Dev on-call | Primer respondedor | 15 min |
| L2 | Tech Lead | Sin resolución en 30 min | 1 hora |
| L3 | Soporte Vercel | Infra Vercel | Según plan |
| L3 | Soporte Neon | DB Neon | Según plan |
| L3 | Soporte Firebase | Sync/Auth Firebase | Según plan |

---

## Comandos Útiles

### Logs

```bash
# Vercel logs (tiempo real)
vercel logs --follow

# Filtrar por función
vercel logs --scope api/cron
```

### Database

```bash
# Conectar a DB de producción
psql $DATABASE_URL

# Ver tablas
\dt

# Ver estructura de tabla
\d movements

# Exportar datos (backup manual)
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql
```

### Cron Jobs

```bash
# Listar cron jobs configurados
vercel crons ls

# Ejecutar manualmente
curl -X POST https://admin.adicapital.com/api/cron/[job-name] \
  -H "Authorization: Bearer $CRON_SECRET"
```

---

## Referencias

- [Deployment Guide](../guides/deployment.md)
- [Troubleshooting](../guides/troubleshooting.md)
- [Security Posture](../reference/security.md)

---

*TimeKast Factory — Documento Operacional*
