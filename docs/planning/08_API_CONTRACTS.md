# API Contracts — Adi Capital Admin

> Generado desde Discovery Brief y Architecture por `/docs`
> **Fuente:** `docs/planning/06_ARCHITECTURE.md`
> **SSOT:** Este documento + código

---

## Convenciones

- **Server Actions:** Funciones async en `lib/actions/`
- **Input:** Validación Zod
- **Output:** `{ success: true, data } | { error: string, details? }`
- **Auth:** Verificación de sesión obligatoria
- **RBAC:** Verificación de permisos según BR-011, BR-012

---

## Fondos (E-001)

### `getFondos`
**Implementa:** US-001
**RBAC:** P-001 (todos), P-002 (solo asignado)

```typescript
// Input
type GetFondosInput = void;

// Output
type GetFondosOutput = {
  success: true;
  data: Fondo[];
} | {
  error: 'UNAUTHORIZED' | 'FORBIDDEN';
};
```

### `createFondo`
**Implementa:** US-002
**RBAC:** P-001 only

```typescript
// Input
const CreateFondoSchema = z.object({
  nombre: z.string().min(1).max(100),
  slug: z.string().min(1).max(50).regex(/^[a-z0-9-]+$/),
  moneda_base: z.enum(['MXN', 'USD', 'EUR', 'ILS']),
  metodo_cascada: z.enum(['pref_primero', 'capital_primero']),
});

// Output
type CreateFondoOutput = {
  success: true;
  data: Fondo;
} | {
  error: 'UNAUTHORIZED' | 'FORBIDDEN' | 'VALIDATION_ERROR' | 'DUPLICATE_SLUG';
  details?: ZodError;
};
```

---

## Proyectos (E-002)

### `getProyectos`
**Implementa:** US-003
**RBAC:** BR-009 (filtro por fondo)

```typescript
// Input
const GetProyectosSchema = z.object({
  fondoId: z.string().uuid().optional(), // Requerido para P-002
  estado: z.enum(['activo', 'cerrado', 'concluido']).optional(),
});

// Output
type GetProyectosOutput = {
  success: true;
  data: Proyecto[];
};
```

### `createProyecto`
**Implementa:** US-004
**Side Effects:** Crea carpeta en Drive (FT-012)

```typescript
// Input
const CreateProyectoSchema = z.object({
  fondoId: z.string().uuid(),
  codigo: z.string().min(1).max(20),
  nombre: z.string().min(1).max(200),
  tasa_pref: z.number().min(0).max(100),
  success_fee_porcentaje: z.number().min(0).max(100),
  metodo_cascada: z.enum(['pref_primero', 'capital_primero']).optional(),
  descripcion: z.string().optional(),
});

// Side Effects
// 1. Crea carpeta en Drive: `Proyectos/{codigo}/`
// 2. Crea subcarpetas: Oportunidad/, Portafolio/, Privado/

// Output
type CreateProyectoOutput = {
  success: true;
  data: Proyecto;
} | {
  error: 'UNAUTHORIZED' | 'FORBIDDEN' | 'VALIDATION_ERROR' | 'DUPLICATE_CODIGO' | 'DRIVE_ERROR';
};
```

---

## Movimientos (E-006)

### `getMovimientos`
**Implementa:** US-011
**RBAC:** BR-009 (filtro por fondo)

```typescript
// Input
const GetMovimientosSchema = z.object({
  fondoId: z.string().uuid().optional(),
  concepto: z.enum([...conceptos]).optional(),
  estado: z.enum(['borrador', 'confirmado', 'cancelado']).optional(),
  fechaDesde: z.date().optional(),
  fechaHasta: z.date().optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().min(1).max(100).default(20),
});

// Output
type GetMovimientosOutput = {
  success: true;
  data: Movimiento[];
  pagination: { total: number; page: number; pages: number };
};
```

### `createMovimiento`
**Implementa:** US-012
**RBAC:** P-001, P-002 (su fondo)
**Validación:** BR-008

```typescript
// Input
const CreateMovimientoSchema = z.object({
  fondoId: z.string().uuid(),
  concepto: z.enum(['APO', 'APO_D', 'DIS', ...]),
  monto: z.number().positive(),
  moneda: z.enum(['MXN', 'USD', 'EUR', 'ILS']),
  tipo_cambio: z.number().positive().default(1),
  fecha_movimiento: z.date(),
  inversionistaId: z.string().uuid().optional(),
  inversionId: z.string().uuid().optional(),
  proyectoId: z.string().uuid().optional(),
  beneficiarioId: z.string().uuid().optional(),
  descripcion: z.string().optional(),
});

// Validation (BR-008)
// - APO, DIS, DEV: requiere inversionistaId + inversionId
// - INV, RET: requiere proyectoId
// - GAS, GASP: requiere beneficiarioId
// - APS, RPS, PRS, DPRS: inversionista.es_fundador = true

// Output
type CreateMovimientoOutput = {
  success: true;
  data: Movimiento; // estado: 'borrador'
} | {
  error: 'UNAUTHORIZED' | 'FORBIDDEN' | 'VALIDATION_ERROR' | 'INVALID_CONCEPTO_FIELDS';
};
```

### `confirmarMovimiento`
**Implementa:** US-013
**RBAC:** P-001 only (pendiente OQ)
**Side Effects:** BR-001, BR-013

```typescript
// Input
const ConfirmarMovimientoSchema = z.object({
  id: z.string().uuid(),
});

// Side Effects
// 1. Actualiza cached_* en entidades relacionadas
// 2. Marca sincronizado_firebase = false

// Output
type ConfirmarMovimientoOutput = {
  success: true;
  data: Movimiento; // estado: 'confirmado'
} | {
  error: 'UNAUTHORIZED' | 'FORBIDDEN' | 'NOT_FOUND' | 'INVALID_STATE';
};
```

### `cancelarMovimiento`
**Implementa:** US-014
**RBAC:** P-001 only
**Side Effects:** Lógica inversa BR-002

```typescript
// Input
const CancelarMovimientoSchema = z.object({
  id: z.string().uuid(),
  motivo: z.string().min(1),
});

// Side Effects
// 1. Revierte cached_* con lógica inversa
// 2. Marca sincronizado_firebase = false

// Output
type CancelarMovimientoOutput = {
  success: true;
  data: Movimiento; // estado: 'cancelado'
} | {
  error: 'UNAUTHORIZED' | 'FORBIDDEN' | 'NOT_FOUND' | 'INVALID_STATE';
};
```

---

## Wizard Reparto (FT-008)

### `calcularReparto`
**Implementa:** US-016
**RBAC:** P-001 only

```typescript
// Input
const CalcularRepartoSchema = z.object({
  proyectoId: z.string().uuid(),
  montoTotal: z.number().positive(),
});

// Output (preview, no persiste)
type CalcularRepartoOutput = {
  success: true;
  data: {
    proyecto: Proyecto;
    metodo_cascada: 'pref_primero' | 'capital_primero';
    desglose: Array<{
      inversionista: Inversionista;
      inversion: Inversion;
      capital_actual: number;
      pref_pendiente: number;
      pago_pref: number;
      pago_capital: number;
      utilidad: number;
      success_fee: number;
      neto: number;
    }>;
    totales: {
      pref_total: number;
      capital_total: number;
      utilidad_total: number;
      success_fee_total: number;
    };
  };
};
```

### `ejecutarReparto`
**Implementa:** US-017
**RBAC:** P-001 only
**Side Effects:** Genera movimientos DIS + FEE

```typescript
// Input
const EjecutarRepartoSchema = z.object({
  proyectoId: z.string().uuid(),
  montoTotal: z.number().positive(),
  confirmarInmediatamente: z.boolean().default(false),
});

// Side Effects
// 1. Crea movimientos DIS para cada inversionista
// 2. Crea movimientos FEE si hay utilidad (BR-005)
// 3. Si confirmarInmediatamente, confirma todos

// Output
type EjecutarRepartoOutput = {
  success: true;
  data: {
    movimientos: Movimiento[];
    grupoMovimiento: string; // UUID para agrupar
  };
};
```

---

## Documentos (FT-012)

### `listDocuments`
**Implementa:** US-018
**RBAC:** BR-010 (visibilidad por nivel)

```typescript
// Input
const ListDocumentsSchema = z.object({
  folderId: z.string(),
  tipo: z.enum(['oportunidad', 'portafolio', 'privado', 'inversionista']),
  proyectoId: z.string().uuid().optional(),
  inversionistaId: z.string().uuid().optional(),
});

// Output
type ListDocumentsOutput = {
  success: true;
  data: DriveFile[];
};
```

### `uploadDocument`
**Implementa:** US-019
**Side Effects:** Upload a Google Drive

```typescript
// Input
type UploadDocumentInput = {
  folderId: string;
  file: File;
  tipo: 'oportunidad' | 'portafolio' | 'privado' | 'inversionista';
};

// Output
type UploadDocumentOutput = {
  success: true;
  data: DriveFile;
} | {
  error: 'UNAUTHORIZED' | 'FORBIDDEN' | 'DRIVE_ERROR' | 'FILE_TOO_LARGE';
};
```

---

## Noticias (FT-013)

### `publicarNoticia`
**Implementa:** US-020
**RBAC:** P-001 only
**Side Effects:** Sync Firebase

```typescript
// Input
const PublicarNoticiaSchema = z.object({
  titulo: z.string().min(1).max(200),
  contenido: z.string().min(1),
  imagen_url: z.string().url().optional(),
  link: z.string().url().optional(),
  fondoId: z.string().uuid().optional(), // NULL = general
});

// Side Effects
// 1. Crea noticia con publicado = true
// 2. Marca sincronizado_firebase = false

// Output
type PublicarNoticiaOutput = {
  success: true;
  data: Noticia;
};
```

---

## Códigos de Error

| Código | HTTP | Mensaje Usuario |
|--------|------|-----------------|
| `UNAUTHORIZED` | 401 | "Debes iniciar sesión" |
| `FORBIDDEN` | 403 | "No tienes permiso para esta acción" |
| `NOT_FOUND` | 404 | "No encontramos el recurso" |
| `VALIDATION_ERROR` | 400 | "Revisa los datos ingresados" |
| `INVALID_STATE` | 409 | "La operación no es válida en este estado" |
| `DRIVE_ERROR` | 502 | "Error al comunicar con Drive" |
| `FIREBASE_ERROR` | 502 | "Error al sincronizar" |

---

## Open Questions

| # | Pregunta | Impacto | Owner |
|---|----------|---------|-------|
| OQ-01 | ¿confirmarMovimiento: P-002 puede o solo P-001? | **Alto** | Cliente |
| OQ-02 | ¿Límite de tamaño para uploadDocument? | Med | Dev |

---

## Assumptions

| # | Supuesto | Si es incorrecto |
|---|----------|------------------|
| A-01 | Todos los endpoints retornan JSON estándar | Impacto: Response format |
| A-02 | Validación Zod cubre 100% de inputs | Impacto: Validación adicional |

---

*Generado por TimeKast Factory — /docs*
