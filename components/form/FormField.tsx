'use client';

import { useFormContext as useRHFContext } from 'react-hook-form';
import { cn } from '@/lib/utils/cn';

// ─────────────────────────────────────────────────────────────────────────────
// FormField (Text Input)
// ─────────────────────────────────────────────────────────────────────────────

export interface FormFieldProps {
  name: string;
  label: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  autoComplete?: string;
}

export function FormField({
  name,
  label,
  type = 'text',
  placeholder,
  disabled,
  className,
  autoComplete,
}: FormFieldProps) {
  const {
    register,
    formState: { errors },
  } = useRHFContext();

  const error = errors[name]?.message as string | undefined;

  return (
    <div className={cn('space-y-1.5', className)}>
      <label htmlFor={name} className="text-card-foreground block text-sm font-medium">
        {label}
      </label>
      <input
        id={name}
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        autoComplete={autoComplete}
        {...register(name)}
        className={cn(
          'w-full rounded-lg border px-4 py-3 text-sm transition-colors',
          'border-input-border bg-input-bg text-card-foreground',
          'placeholder:text-muted-foreground',
          'focus:border-primary focus:ring-primary/20 focus:ring-2 focus:outline-none',
          'disabled:cursor-not-allowed disabled:opacity-50',
          error && 'border-error focus:border-error focus:ring-error/20'
        )}
      />
      {error && <p className="text-error text-sm">{error}</p>}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FormTextarea
// ─────────────────────────────────────────────────────────────────────────────

export interface FormTextareaProps {
  name: string;
  label: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  rows?: number;
}

export function FormTextarea({
  name,
  label,
  placeholder,
  disabled,
  className,
  rows = 4,
}: FormTextareaProps) {
  const {
    register,
    formState: { errors },
  } = useRHFContext();

  const error = errors[name]?.message as string | undefined;

  return (
    <div className={cn('space-y-1.5', className)}>
      <label htmlFor={name} className="text-card-foreground block text-sm font-medium">
        {label}
      </label>
      <textarea
        id={name}
        placeholder={placeholder}
        disabled={disabled}
        rows={rows}
        {...register(name)}
        className={cn(
          'w-full resize-none rounded-lg border px-4 py-3 text-sm transition-colors',
          'border-input-border bg-input-bg text-card-foreground',
          'placeholder:text-muted-foreground',
          'focus:border-primary focus:ring-primary/20 focus:ring-2 focus:outline-none',
          'disabled:cursor-not-allowed disabled:opacity-50',
          error && 'border-error focus:border-error focus:ring-error/20'
        )}
      />
      {error && <p className="text-error text-sm">{error}</p>}
    </div>
  );
}
