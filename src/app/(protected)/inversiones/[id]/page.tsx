/**
 * Inversion Overview Page
 *
 * Overview tab content for inversion detail.
 * Shows CompromisoProgress placeholder and Admin Fee config.
 *
 * @see INVE-003
 */

import { getInversionById } from '@/lib/actions/inversiones/inversiones-queries';
import { notFound } from 'next/navigation';

interface InversionPageProps {
  params: Promise<{ id: string }>;
}

// Admin Fee labels
const TIPO_LABELS: Record<string, string> = {
  one_time: 'One-time (único)',
  anual: 'Anual',
};

const BASE_LABELS: Record<string, string> = {
  compromiso: 'Compromiso',
  aportado: 'Aportado',
};

const METODO_LABELS: Record<string, string> = {
  capital_call_independiente: 'Capital Call Independiente',
  incluido_en_capital_call: 'Incluido en Capital Call',
};

export default async function InversionPage({ params }: InversionPageProps) {
  const { id } = await params;
  const inversion = await getInversionById(id);

  if (!inversion) {
    notFound();
  }

  const hasAdminFee = inversion.adminFeeTipo !== null;

  return (
    <div className="space-y-6">
      {/* CompromisoProgress Placeholder (INVE-004) */}
      <div
        className="rounded-xl border p-6"
        style={{
          backgroundColor: 'var(--sidebar-bg)',
          borderColor: 'var(--sidebar-border)',
        }}
      >
        <h3 className="text-foreground mb-4 font-semibold">Estado del Compromiso</h3>
        <div className="bg-secondary/50 flex h-24 items-center justify-center rounded-lg">
          <p className="text-muted-foreground text-sm">
            📊 Componente de progreso pendiente (INVE-004)
          </p>
        </div>
      </div>

      {/* Configuration Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Rates */}
        <div
          className="rounded-xl border p-6"
          style={{
            backgroundColor: 'var(--sidebar-bg)',
            borderColor: 'var(--sidebar-border)',
          }}
        >
          <h3 className="text-foreground mb-4 font-semibold">Tasas</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground text-sm">Tasa Pref</span>
              <span className="text-foreground text-sm font-medium">
                {inversion.prefRate ? `${inversion.prefRate}%` : 'Hereda del proyecto'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground text-sm">Success Fee</span>
              <span className="text-foreground text-sm font-medium">
                {inversion.successFeePct ? `${inversion.successFeePct}%` : 'Hereda del proyecto'}
              </span>
            </div>
          </div>
        </div>

        {/* Admin Fee Config */}
        <div
          className="rounded-xl border p-6"
          style={{
            backgroundColor: 'var(--sidebar-bg)',
            borderColor: 'var(--sidebar-border)',
          }}
        >
          <h3 className="text-foreground mb-4 font-semibold">Admin Fee</h3>
          {hasAdminFee ? (
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground text-sm">Tipo</span>
                <span className="text-foreground text-sm font-medium">
                  {TIPO_LABELS[inversion.adminFeeTipo!] || inversion.adminFeeTipo}
                </span>
              </div>
              {inversion.adminFeePct && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground text-sm">Porcentaje</span>
                  <span className="text-foreground text-sm font-medium">
                    {inversion.adminFeePct}%
                  </span>
                </div>
              )}
              {inversion.adminFeeBase && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground text-sm">Base</span>
                  <span className="text-foreground text-sm font-medium">
                    {BASE_LABELS[inversion.adminFeeBase] || inversion.adminFeeBase}
                  </span>
                </div>
              )}
              {inversion.adminFeeMetodo && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground text-sm">Método</span>
                  <span className="text-foreground text-sm font-medium">
                    {METODO_LABELS[inversion.adminFeeMetodo] || inversion.adminFeeMetodo}
                  </span>
                </div>
              )}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">Sin Admin Fee configurado</p>
          )}
        </div>
      </div>

      {/* Notes */}
      {inversion.notas && (
        <div
          className="rounded-xl border p-6"
          style={{
            backgroundColor: 'var(--sidebar-bg)',
            borderColor: 'var(--sidebar-border)',
          }}
        >
          <h3 className="text-foreground mb-2 font-semibold">Notas</h3>
          <p className="text-muted-foreground text-sm">{inversion.notas}</p>
        </div>
      )}
    </div>
  );
}
