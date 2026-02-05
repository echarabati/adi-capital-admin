/**
 * Cron Job: Daily Pref Calculation
 *
 * POST /api/cron/pref
 *
 * Calculates daily preferred return for all active investments.
 * Formula: pref_diario = (capital_aportado × tasa_pref / 100) / 365
 *
 * Auth:
 * - Automated (Vercel Cron): CRON_SECRET header
 * - Manual retry: ?manual=true with authenticated session
 *
 * @see CALC-001
 * @see BR-030
 * @see ADR-004
 */

import { NextResponse } from 'next/server';
import { db } from '@/lib/db/drizzle';
import { inversiones } from '@/lib/db/schema/inversiones';
import { proyectos } from '@/lib/db/schema/proyectos';
import { eq, gt, sql } from 'drizzle-orm';
import { auth } from '@/lib/auth';

// Disable caching for cron endpoint
export const dynamic = 'force-dynamic';

interface CronResponse {
  success: boolean;
  processed?: number;
  date?: string;
  error?: string;
}

export async function POST(request: Request): Promise<NextResponse<CronResponse>> {
  const { searchParams } = new URL(request.url);
  const isManual = searchParams.get('manual') === 'true';

  // Auth: Vercel Cron uses CRON_SECRET, manual uses session
  if (isManual) {
    const session = await auth();
    if (!session?.user) {
      console.error('[CRON:PREF] Manual trigger without session');
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    console.log(`[CRON:PREF] Manual trigger by ${session.user.email}`);
  } else {
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      console.error('[CRON:PREF] Invalid CRON_SECRET');
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
  }

  try {
    const today = new Date();

    // Get all investments with capital > 0, joined with project for tasa_pref
    const activeInversiones = await db
      .select({
        id: inversiones.id,
        capitalAportado: inversiones.capitalAportado,
        prefAcumulado: inversiones.prefAcumulado,
        prefRate: inversiones.prefRate,
        proyectoTasaPref: proyectos.tasaPref,
      })
      .from(inversiones)
      .innerJoin(proyectos, eq(inversiones.proyectoId, proyectos.id))
      .where(gt(sql`COALESCE(${inversiones.capitalAportado}, 0)`, 0));

    let processed = 0;

    for (const row of activeInversiones) {
      const capital = Number(row.capitalAportado) || 0;
      // Use investment-specific rate, fallback to project rate
      const tasaPref = Number(row.prefRate) || Number(row.proyectoTasaPref) || 0;

      if (capital <= 0 || tasaPref <= 0) {
        continue;
      }

      // Formula: pref_diario = (capital × tasa / 100) / 365
      const prefDiario = (capital * tasaPref) / 100 / 365;
      const currentPref = Number(row.prefAcumulado) || 0;
      const newPrefAcumulado = currentPref + prefDiario;

      await db
        .update(inversiones)
        .set({
          prefAcumulado: newPrefAcumulado.toFixed(2),
          prefAcumuladoHasta: today,
        })
        .where(eq(inversiones.id, row.id));

      processed++;
    }

    console.log(
      `[CRON:PREF] Processed ${processed}/${activeInversiones.length} at ${today.toISOString()}`
    );

    return NextResponse.json({
      success: true,
      processed,
      date: today.toISOString(),
    });
  } catch (error) {
    console.error('[CRON:PREF] Error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

// Also support GET for health checks (read-only, no auth)
export async function GET(): Promise<NextResponse> {
  return NextResponse.json({
    endpoint: '/api/cron/pref',
    schedule: '0 0 * * *',
    description: 'Daily Pref calculation for active investments',
  });
}
