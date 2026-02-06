'use client';

/**
 * WizardStepper Component (CMP-003)
 *
 * Visual stepper for multi-step wizard navigation.
 * Shows current step, completed steps, and remaining steps.
 *
 * @see WIZ-001
 * @see 09_DESIGN.md#cmp-003
 */

import { cn } from '@/lib/utils/cn';
import { CheckIcon } from 'lucide-react';

// =============================================================================
// Types
// =============================================================================

export interface WizardStep {
  id: number;
  label: string;
}

export interface WizardStepperProps {
  steps: WizardStep[];
  currentStep: number;
  className?: string;
}

// =============================================================================
// WizardStepper
// =============================================================================

export function WizardStepper({ steps, currentStep, className }: WizardStepperProps) {
  return (
    <nav aria-label="Wizard progress" className={cn('w-full', className)}>
      {/* Mobile: Simple step indicator */}
      <div className="flex items-center justify-center gap-2 md:hidden">
        <span className="text-muted-foreground text-sm">
          Paso {currentStep} de {steps.length}
        </span>
        <span className="text-foreground font-medium">
          {steps.find((s) => s.id === currentStep)?.label}
        </span>
      </div>

      {/* Desktop: Full stepper */}
      <ol className="hidden w-full items-center md:flex">
        {steps.map((step, index) => {
          const isCompleted = step.id < currentStep;
          const isCurrent = step.id === currentStep;
          const isLast = index === steps.length - 1;

          return (
            <li key={step.id} className={cn('flex items-center', !isLast && 'flex-1')}>
              {/* Step circle + label */}
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors',
                    isCompleted && 'bg-primary border-primary text-primary-foreground',
                    isCurrent && 'border-primary bg-primary/10 text-primary',
                    !isCompleted && !isCurrent && 'border-muted-foreground/30 text-muted-foreground'
                  )}
                >
                  {isCompleted ? (
                    <CheckIcon className="h-5 w-5" />
                  ) : (
                    <span className="text-sm font-semibold">{step.id}</span>
                  )}
                </div>
                <span
                  className={cn(
                    'mt-2 max-w-[80px] text-center text-xs font-medium',
                    isCurrent && 'text-primary',
                    !isCurrent && 'text-muted-foreground'
                  )}
                >
                  {step.label}
                </span>
              </div>

              {/* Connector line */}
              {!isLast && (
                <div
                  className={cn(
                    'mx-4 h-0.5 flex-1',
                    isCompleted ? 'bg-primary' : 'bg-muted-foreground/30'
                  )}
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
