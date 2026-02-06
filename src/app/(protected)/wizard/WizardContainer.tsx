'use client';

/**
 * WizardContainer
 *
 * Client component managing wizard state and step navigation.
 *
 * @see WIZ-001
 * @see WIZ-004
 */

import { useState, useCallback, useEffect, useTransition } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { WizardStepper } from '@/components/wizard/WizardStepper';
import { Step1SelectProject } from './steps/Step1SelectProject';
import { Step2EnterAmount } from './steps/Step2EnterAmount';
import { Step3Preview } from './steps/Step3Preview';
import { Step4Confirmation } from './steps/Step4Confirmation';
import type { ProyectoForWizard, InversionForCascada } from './wizard-queries';
import { getInversionesForCascada } from './wizard-queries';

// =============================================================================
// Types
// =============================================================================

export interface WizardData {
  proyectoId: string | null;
  proyectoNombre: string | null;
  metodoCascada: string | null;
  monto: number;
  destino: 'a_pref' | 'a_capital' | 'a_utilidad' | null;
}

const INITIAL_DATA: WizardData = {
  proyectoId: null,
  proyectoNombre: null,
  metodoCascada: null,
  monto: 0,
  destino: null,
};

const STEPS = [
  { id: 1, label: 'Proyecto' },
  { id: 2, label: 'Monto' },
  { id: 3, label: 'Preview' },
  { id: 4, label: 'Confirmar' },
];

// =============================================================================
// WizardContainer
// =============================================================================

interface WizardContainerProps {
  proyectos: ProyectoForWizard[];
}

export function WizardContainer({ proyectos }: WizardContainerProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [wizardData, setWizardData] = useState<WizardData>(INITIAL_DATA);
  const [inversiones, setInversiones] = useState<InversionForCascada[]>([]);
  const [isPending, startTransition] = useTransition();

  // Fetch inversiones when proyecto changes
  useEffect(() => {
    if (!wizardData.proyectoId) {
      startTransition(() => {
        setInversiones([]);
      });
      return;
    }

    startTransition(async () => {
      const data = await getInversionesForCascada(wizardData.proyectoId!);
      setInversiones(data);
    });
  }, [wizardData.proyectoId]);

  // Navigation
  const goToNext = useCallback(() => {
    setCurrentStep((prev) => Math.min(prev + 1, STEPS.length));
  }, []);

  const goToPrev = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  }, []);

  // Data updates
  const updateData = useCallback((updates: Partial<WizardData>) => {
    setWizardData((prev) => ({ ...prev, ...updates }));
  }, []);

  // Check if can proceed
  const canProceed = (): boolean => {
    switch (currentStep) {
      case 1:
        return wizardData.proyectoId !== null;
      case 2:
        return wizardData.monto > 0;
      case 3:
        return inversiones.length > 0; // Must have inversiones to proceed
      case 4:
        return wizardData.destino !== null;
      default:
        return false;
    }
  };

  // Render current step
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1SelectProject
            proyectos={proyectos}
            selectedId={wizardData.proyectoId}
            onSelect={(proyecto) =>
              updateData({
                proyectoId: proyecto.id,
                proyectoNombre: proyecto.nombre,
                metodoCascada: proyecto.metodoCascada,
              })
            }
          />
        );
      case 2:
        return (
          <Step2EnterAmount
            monto={wizardData.monto}
            onMontoChange={(monto) => updateData({ monto })}
          />
        );
      case 3:
        return (
          <Step3Preview
            proyectoNombre={wizardData.proyectoNombre}
            monto={wizardData.monto}
            metodoCascada={wizardData.metodoCascada}
            inversiones={inversiones}
            isLoading={isPending}
          />
        );
      case 4:
        return (
          <Step4Confirmation
            wizardData={wizardData}
            onDestinoChange={(destino) => updateData({ destino })}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Stepper */}
      <WizardStepper steps={STEPS} currentStep={currentStep} />

      {/* Step content */}
      <Card>
        <CardContent className="pt-6">{renderStep()}</CardContent>
      </Card>

      {/* Navigation buttons */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={goToPrev} disabled={currentStep === 1}>
          Anterior
        </Button>

        {currentStep < STEPS.length ? (
          <Button onClick={goToNext} disabled={!canProceed()}>
            Siguiente
          </Button>
        ) : (
          <Button disabled={!canProceed()}>Confirmar Reparto</Button>
        )}
      </div>
    </div>
  );
}
