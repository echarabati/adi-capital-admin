/**
 * Movimientos Tab - Inversion Context
 *
 * Placeholder for movements list by investment.
 *
 * @see MOV-001
 */

export default function MovimientosPage() {
  return (
    <div
      className="flex h-48 items-center justify-center rounded-xl border"
      style={{
        backgroundColor: 'var(--sidebar-bg)',
        borderColor: 'var(--sidebar-border)',
      }}
    >
      <div className="text-center">
        <p className="text-muted-foreground text-sm">📋 Movimientos de esta inversión</p>
        <p className="text-muted-foreground mt-1 text-xs">Pendiente: MOV-001</p>
      </div>
    </div>
  );
}
