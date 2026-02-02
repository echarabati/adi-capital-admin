'use client';

import { useFormContext as useRHFContext } from 'react-hook-form';
import { cn } from '@/lib/utils/cn';

// ─────────────────────────────────────────────────────────────────────────────
// FormSelect
// ─────────────────────────────────────────────────────────────────────────────

export interface SelectOption {
  value: string;
  label: string;
}

export interface FormSelectProps {
  name: string;
  label: string;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function FormSelect({
  name,
  label,
  options,
  placeholder,
  disabled,
  className,
}: FormSelectProps) {
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
      <select
        id={name}
        disabled={disabled}
        {...register(name)}
        className={cn(
          'w-full rounded-lg border px-4 py-3 text-sm transition-colors',
          'border-input-border bg-input-bg text-card-foreground',
          'focus:border-primary focus:ring-primary/20 focus:ring-2 focus:outline-none',
          'disabled:cursor-not-allowed disabled:opacity-50',
          error && 'border-error focus:border-error focus:ring-error/20'
        )}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="text-error text-sm">{error}</p>}
    </div>
  );
}
