'use client';

import { useFormContext } from './Form';
import { cn } from '@/lib/utils/cn';

// ─────────────────────────────────────────────────────────────────────────────
// SubmitButton
// ─────────────────────────────────────────────────────────────────────────────

export interface SubmitButtonProps {
  children: React.ReactNode;
  className?: string;
  loadingText?: string;
}

export function SubmitButton({
  children,
  className,
  loadingText = 'Guardando...',
}: SubmitButtonProps) {
  const { isSubmitting } = useFormContext();

  return (
    <button
      type="submit"
      disabled={isSubmitting}
      className={cn(
        'w-full rounded-lg py-3 font-semibold transition-colors',
        'bg-primary text-primary-foreground hover:bg-primary-hover',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
    >
      {isSubmitting ? loadingText : children}
    </button>
  );
}
