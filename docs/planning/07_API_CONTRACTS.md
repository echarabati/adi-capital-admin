# 🔌 API Contracts — Adi Capital Admin

> Generado desde Architecture y User Stories por `/docs`
> **Fuente:** `docs/planning/06_ARCHITECTURE.md`
> **SSOT:** Este documento + código implementado

---

## Convenciones

### Server Actions

Todas las acciones siguen el patrón definido en ADR-001:

```typescript
// Patrón estándar
export async function actionName(input: unknown): Promise<ActionResult<T>> {
  // 1. Auth check
  // 2. Input validation (Zod)
  // 3. RBAC check
  // 4. Business logic
  // 5. revalidatePath
  // 6. Return result
}

// Tipo de retorno
type ActionResult<T> =
  | { success: true; data: T }
  | { error: string; details?: Record<string, string[]> };
```

### Nomenclatura

| Acción | Prefijo | Ejemplo |
|--------|---------|---------|
| Crear | `create` | `createMovimiento` |
| Actualizar | `update` | `updateProyecto` |
| Eliminar | `delete` | `deleteInversionista` |
| Obtener uno | `get` | `getInversion` |
| Listar | `list` | `listMovimientos` |
| Acción especial | verbo | `confirmarMovimiento`, `ejecutarReparto` |

---

## Fondos

### `createFondo`

**Implementa:** US-001
**RBAC:** BR-053 (solo Super Admin)

```typescript
// lib/actions/fondos/create.ts
const CreateFondoInput = z.object({
  nombre: z.string().min(1).max(100),
  monedaBase: z.enum(['MXN', 'USD', 'EUR', 'ILS']),
  metodoCascada: z.enum(['pref_primero', 'capital_primero']),
});

type CreateFondoInput = z.infer<typeof CreateFondoInput>;

interface CreateFondoOutput {
  id: string;
  nombre: string;
  slug: string;
  monedaBase: string;
  metodoCascada: string;
  createdAt: Date;
}

// Errors
| Code | Message |
|------|---------|
| UNAUTHORIZED | "Debes iniciar sesión" |
| FORBIDDEN | "Solo Super Admin puede crear fondos" |
| VALIDATION_ERROR | "Datos inválidos" |
| DUPLICATE_NAME | "Ya existe un fondo con ese nombre" |
```

### `updateFondo`

**Implementa:** US-002
**RBAC:** BR-053 (solo Super Admin)

```typescript
const UpdateFondoInput = z.object({
  id: z.string(),
  nombre: z.string().min(1).max(100).optional(),
  metodoCascada: z.enum(['pref_primero', 'capital_primero']).optional(),
});
```

### `listFondos`

**Implementa:** US-003
**RBAC:** BR-051, BR-052, BR-063

```typescript
const ListFondosInput = z.object({
  // No input - se filtra por rol del usuario
});

interface ListFondosOutput {
  fondos: Array<{
    id: string;
    nombre: string;
    slug: string;
    monedaBase: string;
    proyectosActivos: number;
    inversionistasActivos: number;
  }>;
}
```

---

## Proyectos

### `createProyecto`

**Implementa:** US-004, US-005
**RBAC:** BR-054, BR-064

```typescript
const CreateProyectoInput = z.object({
  fondoId: z.string(),
  codigo: z.string().min(1).max(20),
  nombre: z.string().min(1).max(200),
  tasaPref: z.string().regex(/^\d+(\.\d{1,2})?$/),
  successFeePorcentaje: z.string().regex(/^\d+(\.\d{1,2})?$/),
  metodoCascada: z.enum(['pref_primero', 'capital_primero']).optional(),
  descripcion: z.string().optional(),
});

// Side Effects
- Crear carpetas en Google Drive (async)
- NO sincroniza a Firebase hasta tener inversiones
```

### `getProyecto`

**Implementa:** US-006
**RBAC:** BR-064

```typescript
const GetProyectoInput = z.object({
  id: z.string(),
});

interface GetProyectoOutput {
  proyecto: Proyecto;
  posicionFinanciera: {
    inversionRecibida: string;
    gastosProyecto: string;
    retornos: string;
    utilidad: string;
  };
  inversiones: InversionResumen[];
  movimientosRecientes: MovimientoResumen[];
}
```

### `updateProyectoEstado`

**Implementa:** US-007
**RBAC:** BR-064

```typescript
const UpdateProyectoEstadoInput = z.object({
  id: z.string(),
  estado: z.enum(['inversion_abierta', 'inversion_cerrada', 'concluido']),
});

// Validations
- Si estado = 'concluido', verificar que no hay movimientos en borrador
```

---

## Inversionistas

### `createInversionista`

**Implementa:** US-009, US-010
**RBAC:** BR-055, BR-065

```typescript
const CreateInversionistaInput = z.object({
  nombre: z.string().min(1).max(200),
  email: z.string().email(),
  telefono: z.string().optional(),
  fondoIds: z.array(z.string()).min(1),
  esFundador: z.boolean().default(false),
  porcentajePropiedad: z.string().optional(),
});

// Side Effects
- Crear carpeta en Google Drive
- Agregar relaciones con fondos
```

### `listInversionistas`

**Implementa:** US-011
**RBAC:** BR-055, BR-065

```typescript
const ListInversionistasInput = z.object({
  fondoId: z.string().optional(),
  esFundador: z.boolean().optional(),
  search: z.string().optional(),
  page: z.number().default(1),
  limit: z.number().default(20),
});

interface ListInversionistasOutput {
  inversionistas: InversionistaResumen[];
  total: number;
  page: number;
  totalPages: number;
}
```

---

## Inversiones

### `createInversion`

**Implementa:** US-014, US-015
**RBAC:** BR-055, BR-065

```typescript
const CreateInversionInput = z.object({
  inversionistaId: z.string(),
  proyectoId: z.string(),
  codigo: z.string(),
  compromiso: z.string(),
  adminFeeTipo: z.enum(['one_time', 'anual']).optional(),
  adminFeePorcentaje: z.string().optional(),
  adminFeeMetodo: z.enum(['capital_call_independiente', 'incluido_en_capital_call']).optional(),
  adminFeeBase: z.enum(['compromiso', 'aportado']).optional(),
});

// Validations (BR-013)
- inversionista.fondos MUST contain proyecto.fondoId
- codigo MUST be unique
```

### `getEstadoCompromiso`

**Implementa:** US-016
**RBAC:** BR-055, BR-065

```typescript
const GetEstadoCompromisoInput = z.object({
  inversionId: z.string(),
});

interface GetEstadoCompromisoOutput {
  compromiso: string;
  capitalAportado: string;
  saldoCompromiso: string;
  estado: 'pendiente' | 'parcial' | 'completado' | 'excedido';
  porcentajeCompletado: number;
}
```

---

## Movimientos

### `createMovimiento`

**Implementa:** US-030
**RBAC:** BR-056, BR-066

```typescript
const CreateMovimientoInput = z.object({
  fondoId: z.string(),
  concepto: z.enum([
    'APO', 'APO-D', 'DIS', 'DEV', 'FEE',
    'INV', 'INV-D', 'RET',
    'GAS', 'GASP',
    'APS', 'RPS', 'PRS', 'DPRS',
    'TRA', 'CAM', 'ERR', 'TSI'
  ]),
  monto: z.string(),
  moneda: z.enum(['MXN', 'USD', 'EUR', 'ILS']),
  tipoCambio: z.string().optional(),
  fechaMovimiento: z.string().datetime(),
  proyectoId: z.string().optional(),
  inversionistaId: z.string().optional(),
  inversionId: z.string().optional(),
  beneficiarioId: z.string().optional(),
  descripcion: z.string().optional(),
});

// Validations por concepto (BR-026 → BR-029)
- APO/DIS/DEV/FEE: require inversionistaId, inversionId
- INV/RET: require proyectoId
- GAS/GASP: require beneficiarioId
- GASP: require proyectoId
- APS/RPS/PRS/DPRS: require inversionista.esFundador = true
- CAM: require tipoCambio
```

### `confirmarMovimiento`

**Implementa:** US-031
**RBAC:** BR-057, BR-067

```typescript
const ConfirmarMovimientoInput = z.object({
  id: z.string(),
});

// Side Effects (BR-022)
1. Validar reglas por concepto
2. Actualizar caches:
   - APO: aumentar capitalAportado
   - DIS: actualizar prefPagado si aplica
   - etc.
3. Marcar sincronizadoFirebase = false
4. Set estado = 'confirmado'
5. Set fechaConfirmacion = NOW()

// Errors
| Code | Message |
|------|---------|
| ALREADY_CONFIRMED | "El movimiento ya está confirmado" |
| INVALID_STATE | "Solo se pueden confirmar borradores" |
| MISSING_REQUIRED_FIELD | "Falta {campo} para este tipo de movimiento" |
```

### `cancelarMovimiento`

**Implementa:** US-032
**RBAC:** BR-057, BR-067

```typescript
const CancelarMovimientoInput = z.object({
  id: z.string(),
  razon: z.string().optional(),
});

// Side Effects (BR-024)
1. Revertir efectos en caches
2. Set estado = 'cancelado'
3. Marcar sincronizadoFirebase = false
```

### `listMovimientos`

**Implementa:** US-033
**RBAC:** BR-056, BR-066

```typescript
const ListMovimientosInput = z.object({
  fondoId: z.string().optional(),
  proyectoId: z.string().optional(),
  inversionistaId: z.string().optional(),
  concepto: z.string().optional(),
  estado: z.enum(['borrador', 'confirmado', 'cancelado']).optional(),
  fechaDesde: z.string().datetime().optional(),
  fechaHasta: z.string().datetime().optional(),
  page: z.number().default(1),
  limit: z.number().default(50),
});
```

---

## Wizard de Reparto

### `calcularReparto`

**Implementa:** US-063, US-064, US-065
**RBAC:** BR-058, BR-068

```typescript
const CalcularRepartoInput = z.object({
  proyectoId: z.string(),
  montoTotal: z.string(),
});

interface CalcularRepartoOutput {
  proyecto: {
    id: string;
    nombre: string;
    metodoCascada: 'pref_primero' | 'capital_primero';
  };
  montoTotal: string;
  desglose: Array<{
    inversionId: string;
    inversionistaId: string;
    inversionistaNombre: string;
    capitalAportado: string;
    prefAcumulado: string;
    prefPendiente: string;
    // Distribución calculada
    aPref: string;
    aCapital: string;
    aUtilidad: string;
    successFee: string;
    netoInversionista: string;
  }>;
  totales: {
    totalPref: string;
    totalCapital: string;
    totalUtilidad: string;
    totalSuccessFee: string;
    totalNeto: string;
  };
}
```

### `ejecutarReparto`

**Implementa:** US-063
**RBAC:** BR-058, BR-068

```typescript
const EjecutarRepartoInput = z.object({
  proyectoId: z.string(),
  montoTotal: z.string(),
  confirmarInmediatamente: z.boolean().default(false),
});

// Side Effects
1. Generar movimientos DIS por cada inversionista
2. Generar movimientos FEE si hay utilidad
3. Todos con mismo grupoMovimiento
4. Si confirmarInmediatamente, ejecutar confirmarMovimiento para cada uno

interface EjecutarRepartoOutput {
  grupoMovimiento: string;
  movimientosGenerados: number;
  estado: 'borrador' | 'confirmado';
}
```

---

## Sync Firebase

### `syncToFirebase`

**Uso interno, no expuesta como API**

```typescript
interface SyncToFirebaseInput {
  entityType: 'inversionista' | 'proyecto' | 'movimiento' | 'noticia';
  entityIds: string[];
}

// Side Effects
1. Transformar datos al formato Firestore
2. Batch write a Firestore
3. Actualizar sincronizadoFirebase = true en PostgreSQL

// Errors
| Code | Message |
|------|---------|
| FIREBASE_ERROR | "Error de conexión con Firebase" |
| BATCH_LIMIT | "Máximo 500 documentos por batch" |
```

---

## Documentos (Drive)

### `listDocumentos`

**Implementa:** US-080
**RBAC:** BR-080

```typescript
const ListDocumentosInput = z.object({
  tipo: z.enum(['proyecto', 'inversionista']),
  entityId: z.string(),
  carpeta: z.enum(['oportunidad', 'portafolio', 'privado', 'personal']).optional(),
});

interface ListDocumentosOutput {
  documentos: Array<{
    id: string;
    nombre: string;
    tipo: string; // MIME type
    tamano: number;
    modificado: Date;
    url: string;
  }>;
  carpetaActual: string;
  carpetasHijas: string[];
}
```

### `uploadDocumento`

**Implementa:** US-081
**RBAC:** BR-059, BR-069

```typescript
const UploadDocumentoInput = z.object({
  tipo: z.enum(['proyecto', 'inversionista']),
  entityId: z.string(),
  carpeta: z.enum(['oportunidad', 'portafolio', 'privado', 'personal']),
  file: z.instanceof(File),
});

// Side Effects
1. Upload a Google Drive
2. Actualizar metadata en Firestore para sync a app
```

---

## Noticias

### `createNoticia`

**Implementa:** US-095
**RBAC:** BR-060

```typescript
const CreateNoticiaInput = z.object({
  fondoId: z.string().optional(), // NULL = general
  titulo: z.string().min(1).max(200),
  contenido: z.string(),
  link: z.string().url().optional(),
  imageUrl: z.string().url().optional(),
});
```

### `publicarNoticia`

**Implementa:** US-096
**RBAC:** BR-060

```typescript
const PublicarNoticiaInput = z.object({
  id: z.string(),
});

// Side Effects
1. Set publicado = true
2. Set fechaPublicacion = NOW()
3. Marcar sincronizadoFirebase = false
4. Trigger sync a Firebase
```

---

## Cron Jobs

### `POST /api/cron/pref`

**Implementa:** US-060
**Auth:** Bearer token (CRON_SECRET)

```typescript
// Input: None (triggered by Vercel Cron)

interface CronPrefOutput {
  success: boolean;
  processed: number;
  date: string;
  duration: number; // ms
}

// Schedule: 0 0 * * * (diario a las 00:00 UTC)
```

### `POST /api/cron/sync`

**Implementa:** US-086
**Auth:** Bearer token (CRON_SECRET)

```typescript
interface CronSyncOutput {
  success: boolean;
  synced: number;
  failed: number;
  errors: string[];
}

// Schedule: */5 * * * * (cada 5 minutos)
```

---

## Error Codes

| Code | HTTP | Descripción |
|------|------|-------------|
| `UNAUTHORIZED` | 401 | No hay sesión activa |
| `FORBIDDEN` | 403 | Sin permisos para la acción |
| `NOT_FOUND` | 404 | Recurso no encontrado |
| `VALIDATION_ERROR` | 400 | Input inválido (ver details) |
| `DUPLICATE` | 409 | Violación de unicidad |
| `INVALID_STATE` | 422 | Estado no permite la acción |
| `INTERNAL_ERROR` | 500 | Error interno del servidor |

---

## Open Questions

| # | Pregunta | Impacto | Owner |
|---|----------|---------|-------|
| OQ-01 | ¿Implementar rate limiting en actions críticas? | Med | Dev |
| OQ-02 | ¿Logging estructurado para auditoría? | **Alto** | Dev |

---

## Assumptions

| # | Supuesto | Si es incorrecto |
|---|----------|------------------|
| A-01 | File uploads van directamente a Drive (no pasan por nuestro server) | Cambiar a upload via server |
| A-02 | Batch de Firebase soporta el volumen esperado | Implementar queue |

---

*Generado por TimeKast Factory — /docs*
