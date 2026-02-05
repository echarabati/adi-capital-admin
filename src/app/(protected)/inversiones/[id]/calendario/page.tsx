/**
 * Calendario Tab - Inversion Context
 *
 * Placeholder for payment schedule/calendar.
 *
 * @see Future issue
 */

export default function CalendarioPage() {
  return (
    <div
      className="flex h-48 items-center justify-center rounded-xl border"
      style={{
        backgroundColor: 'var(--sidebar-bg)',
        borderColor: 'var(--sidebar-border)',
      }}
    >
      <div className="text-center">
        <p className="text-muted-foreground text-sm">📅 Calendario de pagos</p>
        <p className="text-muted-foreground mt-1 text-xs">Próximamente</p>
      </div>
    </div>
  );
}
