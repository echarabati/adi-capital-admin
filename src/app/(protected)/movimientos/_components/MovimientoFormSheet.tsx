'use client';

/**
 * MovimientoFormSheet Component
 *
 * Sheet lateral for creating new movements.
 * Step 1: Select concepto
 * Step 2: Fill dynamic fields based on concepto
 *
 * @see MOV-002
 */

import { useState, useTransition, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { X, ArrowLeft, Loader2, Save } from 'lucide-react';
import { ConceptoSelector } from './ConceptoSelector';
import { InversionSelector } from './InversionSelector';
import {
  type Concepto,
  CONCEPTO_LABELS,
} from '@/lib/validations/movimientos/movimientos-validation';
import { createMovimiento } from '@/lib/actions/movimientos/movimientos-mutations';
import type { InversionSelectorItem } from '@/lib/actions/inversiones/inversiones-queries';

// =============================================================================
// Types
// =============================================================================

interface MovimientoFormSheetProps {
  isOpen: boolean;
  onClose: () => void;
  fondos: { id: string; nombre: string }[];
  inversiones: InversionSelectorItem[];
  defaultFondoId?: string;
}

type Step = 'concepto' | 'details';

// =============================================================================
// Component
// =============================================================================

export function MovimientoFormSheet({
  isOpen,
  onClose,
  fondos,
  inversiones,
  defaultFondoId,
}: MovimientoFormSheetProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [step, setStep] = useState<Step>('concepto');
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [concepto, setConcepto] = useState<Concepto | null>(null);
  const [fondoId, setFondoId] = useState(defaultFondoId || '');
  const [monto, setMonto] = useState('');
  const [moneda, setMoneda] = useState<'USD' | 'MXN'>('USD');
  const [tipoCambio, setTipoCambio] = useState('');
  const [fechaMovimiento, setFechaMovimiento] = useState(new Date().toISOString().split('T')[0]);
  const [descripcion, setDescripcion] = useState('');
  // APO fields
  const [inversionId, setInversionId] = useState('');
  const [fechaEfectiva, setFechaEfectiva] = useState('');

  // Calculate monto in USD
  const montoUsd = useMemo(() => {
    if (!monto) return null;
    const m = parseFloat(monto);
    if (isNaN(m)) return null;
    if (moneda === 'USD') return m;
    const tc = parseFloat(tipoCambio);
    if (isNaN(tc) || tc <= 0) return null;
    return m / tc;
  }, [monto, moneda, tipoCambio]);

  // Needs tipo_cambio if MXN
  const needsTipoCambio = moneda !== 'USD';

  // APO conceptos require inversión
  const needsInversion =
    concepto === 'APO' ||
    concepto === 'APO-D' ||
    concepto === 'DIS' ||
    concepto === 'DEV' ||
    concepto === 'FEE';
  const isApoD = concepto === 'APO-D';

  function handleClose() {
    resetForm();
    onClose();
  }

  function resetForm() {
    setStep('concepto');
    setConcepto(null);
    setFondoId(defaultFondoId || '');
    setMonto('');
    setMoneda('USD');
    setTipoCambio('');
    setFechaMovimiento(new Date().toISOString().split('T')[0]);
    setDescripcion('');
    setInversionId('');
    setFechaEfectiva('');
    setError(null);
  }

  function handleConceptoSelect(c: Concepto) {
    setConcepto(c);
    setStep('details');
  }

  function handleBack() {
    setStep('concepto');
  }

  async function handleSubmit() {
    if (!concepto || !fondoId) {
      setError('Completa todos los campos requeridos');
      return;
    }

    // Validate inversión for APO conceptos
    if (needsInversion && !inversionId) {
      setError('Selecciona una inversión');
      return;
    }

    setError(null);

    startTransition(async () => {
      const result = await createMovimiento({
        fondoId,
        concepto,
        monto,
        moneda,
        tipoCambio: needsTipoCambio ? tipoCambio : undefined,
        fechaMovimiento,
        descripcion,
        inversionId: needsInversion ? inversionId : undefined,
      });

      if (result.error) {
        setError(result.error);
      } else {
        handleClose();
        router.refresh();
      }
    });
  }

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40 bg-black/50 transition-opacity" onClick={handleClose} />

      {/* Sheet */}
      <div className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-lg overflow-y-auto bg-(--sidebar-bg) shadow-xl">
        {/* Header */}
        <div className="border-b border-(--sidebar-border) px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {step === 'details' && (
                <button
                  onClick={handleBack}
                  className="text-muted-foreground hover:text-foreground -ml-2 p-2"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
              )}
              <div>
                <h2 className="text-foreground text-lg font-semibold">Nuevo Movimiento</h2>
                <p className="text-muted-foreground text-sm">
                  {step === 'concepto'
                    ? 'Paso 1: Selecciona el tipo'
                    : `Paso 2: ${CONCEPTO_LABELS[concepto!] || concepto}`}
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="text-muted-foreground hover:text-foreground p-2"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === 'concepto' ? (
            <ConceptoSelector value={concepto || undefined} onChange={handleConceptoSelect} />
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
              className="space-y-6"
            >
              {/* Concepto Badge */}
              {concepto && (
                <div className="bg-secondary/50 rounded-lg border p-3">
                  <span className="text-muted-foreground text-xs uppercase">Concepto</span>
                  <div className="text-foreground mt-1 font-medium">
                    {concepto} - {CONCEPTO_LABELS[concepto]}
                  </div>
                </div>
              )}

              {/* Fondo */}
              <div>
                <label className="text-foreground mb-1.5 block text-sm font-medium">
                  Fondo <span className="text-rose-500">*</span>
                </label>
                <select
                  value={fondoId}
                  onChange={(e) => setFondoId(e.target.value)}
                  required
                  className="border-input bg-background text-foreground focus:ring-primary w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:outline-none"
                >
                  <option value="">Selecciona un fondo</option>
                  {fondos.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.nombre}
                    </option>
                  ))}
                </select>
              </div>

              {/* Inversión Selector (for APO/DIS/DEV/FEE conceptos) */}
              {needsInversion && (
                <InversionSelector
                  value={inversionId}
                  onChange={setInversionId}
                  inversiones={inversiones}
                  required
                />
              )}

              {/* Fecha Efectiva (for APO-D only) */}
              {isApoD && (
                <div>
                  <label className="text-foreground mb-1.5 block text-sm font-medium">
                    Fecha Efectiva <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={fechaEfectiva}
                    onChange={(e) => setFechaEfectiva(e.target.value)}
                    required
                    min={fechaMovimiento}
                    className="border-input bg-background text-foreground focus:ring-primary w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:outline-none"
                  />
                  <p className="text-muted-foreground mt-1 text-xs">
                    Fecha en que se efectiviza la aportación diferida
                  </p>
                </div>
              )}

              {/* Monto y Moneda */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-foreground mb-1.5 block text-sm font-medium">
                    Monto <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={monto}
                    onChange={(e) => setMonto(e.target.value)}
                    required
                    placeholder="0.00"
                    className="border-input bg-background text-foreground focus:ring-primary w-full rounded-lg border px-3 py-2 text-sm tabular-nums focus:ring-2 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-foreground mb-1.5 block text-sm font-medium">
                    Moneda <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={moneda}
                    onChange={(e) => setMoneda(e.target.value as 'USD' | 'MXN')}
                    required
                    className="border-input bg-background text-foreground focus:ring-primary w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:outline-none"
                  >
                    <option value="USD">USD</option>
                    <option value="MXN">MXN</option>
                  </select>
                </div>
              </div>

              {/* Tipo de Cambio (if MXN) */}
              {needsTipoCambio && (
                <div>
                  <label className="text-foreground mb-1.5 block text-sm font-medium">
                    Tipo de Cambio (MXN → USD) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    min="0"
                    value={tipoCambio}
                    onChange={(e) => setTipoCambio(e.target.value)}
                    required={needsTipoCambio}
                    placeholder="17.50"
                    className="border-input bg-background text-foreground focus:ring-primary w-full rounded-lg border px-3 py-2 text-sm tabular-nums focus:ring-2 focus:outline-none"
                  />
                  {montoUsd !== null && (
                    <p className="text-muted-foreground mt-1 text-xs">
                      Equivalente: ${montoUsd.toFixed(2)} USD
                    </p>
                  )}
                </div>
              )}

              {/* Fecha */}
              <div>
                <label className="text-foreground mb-1.5 block text-sm font-medium">
                  Fecha <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  value={fechaMovimiento}
                  onChange={(e) => setFechaMovimiento(e.target.value)}
                  required
                  className="border-input bg-background text-foreground focus:ring-primary w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:outline-none"
                />
              </div>

              {/* Descripción */}
              <div>
                <label className="text-foreground mb-1.5 block text-sm font-medium">
                  Descripción
                </label>
                <textarea
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  rows={3}
                  placeholder="Notas adicionales..."
                  className="border-input bg-background text-foreground focus:ring-primary w-full resize-none rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:outline-none"
                />
              </div>

              {/* Error */}
              {error && (
                <div className="rounded-lg bg-rose-500/10 p-3 text-sm text-rose-600 dark:text-rose-400">
                  {error}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleClose}
                  className="border-input text-foreground hover:bg-secondary flex-1 rounded-lg border px-4 py-2.5 text-sm font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium disabled:opacity-50"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Guardar Borrador
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
