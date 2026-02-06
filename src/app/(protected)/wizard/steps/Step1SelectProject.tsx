'use client';

/**
 * Step 1: Select Project
 *
 * User selects a project with active investors.
 *
 * @see WIZ-001 AC: Step 1: Seleccionar proyecto
 */

import { cn } from '@/lib/utils/cn';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/Badge';
import { UsersIcon, CheckIcon } from 'lucide-react';
import type { ProyectoForWizard } from '../wizard-queries';

// =============================================================================
// Step1SelectProject
// =============================================================================

interface Step1SelectProjectProps {
  proyectos: ProyectoForWizard[];
  selectedId: string | null;
  onSelect: (proyecto: ProyectoForWizard) => void;
}

export function Step1SelectProject({ proyectos, selectedId, onSelect }: Step1SelectProjectProps) {
  if (proyectos.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground">
          No hay proyectos con inversionistas activos disponibles.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-foreground text-lg font-semibold">Selecciona un Proyecto</h2>
        <p className="text-muted-foreground text-sm">
          Elige el proyecto para el cual deseas distribuir capital.
        </p>
      </div>

      <div className="grid gap-3">
        {proyectos.map((proyecto) => {
          const isSelected = proyecto.id === selectedId;
          return (
            <Card
              key={proyecto.id}
              onClick={() => onSelect(proyecto)}
              className={cn(
                'hover:border-primary/50 cursor-pointer p-4 transition-all',
                isSelected && 'border-primary bg-primary/5'
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-foreground font-medium">{proyecto.nombre}</span>
                    {proyecto.metodoCascada && (
                      <Badge className="text-xs">
                        {proyecto.metodoCascada === 'pref_primero'
                          ? 'Pref Primero'
                          : 'Capital Primero'}
                      </Badge>
                    )}
                  </div>
                  <div className="text-muted-foreground mt-1 flex items-center gap-4 text-sm">
                    <span>{proyecto.fondoNombre}</span>
                    <span className="flex items-center gap-1">
                      <UsersIcon className="h-3.5 w-3.5" />
                      {proyecto.inversionistasCount} inversionistas
                    </span>
                  </div>
                </div>
                {isSelected && (
                  <div className="bg-primary flex h-6 w-6 items-center justify-center rounded-full">
                    <CheckIcon className="text-primary-foreground h-4 w-4" />
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
