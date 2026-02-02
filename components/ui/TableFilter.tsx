/**
 * TableFilter Component
 *
 * Dropdown filter for tables with single or multi-select options.
 * Used in conjunction with DataTable/useTableState.
 */

'use client';

import { Fragment, useEffect, useMemo, useState } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDown, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface FilterOption {
  value: string;
  label: string;
  color?: string; // Optional color for status badges
}

export interface TableFilterProps {
  /** Filter label */
  label: string;
  /** Available options */
  options: FilterOption[];
  /** Currently selected value(s) */
  value: string | string[];
  /** onChange handler */
  onChange: (value: string | string[]) => void;
  /** Single or multi select mode */
  mode?: 'single' | 'multi';
  /** Placeholder when nothing selected */
  placeholder?: string;
  /** Optional className */
  className?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

export function TableFilter({
  label,
  options,
  value,
  onChange,
  mode = 'single',
  placeholder = 'Todos',
  className,
}: TableFilterProps) {
  // Normalize value to array for multi-select
  const selectedValues = useMemo(() => {
    if (mode === 'multi') {
      return Array.isArray(value) ? value : value ? [value] : [];
    }
    return value ? [value as string] : [];
  }, [value, mode]);

  // Get display text
  const displayText = useMemo(() => {
    if (selectedValues.length === 0) {
      return placeholder;
    }
    if (mode === 'multi') {
      return `${selectedValues.length} seleccionados`;
    }
    const selected = options.find((opt) => opt.value === selectedValues[0]);
    return selected?.label || placeholder;
  }, [selectedValues, options, mode, placeholder]);

  // Toggle option selection
  const toggleOption = (optionValue: string) => {
    if (mode === 'single') {
      onChange(optionValue === value ? '' : optionValue);
    } else {
      const newValues = selectedValues.includes(optionValue)
        ? selectedValues.filter((v) => v !== optionValue)
        : [...selectedValues, optionValue];
      onChange(newValues);
    }
  };

  // Select all (multi mode only)
  const selectAll = () => {
    if (mode === 'multi') {
      onChange(options.map((opt) => opt.value));
    }
  };

  // Clear selection
  const clearSelection = () => {
    onChange(mode === 'multi' ? [] : '');
  };

  const hasSelection = selectedValues.length > 0;

  // Fix for Headless UI hydration mismatch
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className={cn('flex flex-col gap-1', className)}>
        {/* Label */}
        <label className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
          {label}
        </label>
        {/* Skeleton for button */}
        <div className="bg-input-bg border-input-border h-9 w-full rounded-lg border px-3 py-2 opacity-50">
          <span className="text-muted-foreground text-sm">{displayText}</span>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('flex flex-col gap-1', className)}>
      {/* Label */}
      <label className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
        {label}
      </label>

      {/* Dropdown */}
      <Menu as="div" className="relative">
        <Menu.Button
          className={cn(
            'flex w-full items-center justify-between gap-2 rounded-lg border px-3 py-2 text-sm transition-colors',
            'border-input-border bg-input-bg hover:border-primary/50',
            hasSelection ? 'text-foreground' : 'text-muted-foreground'
          )}
        >
          <span className="truncate">{displayText}</span>
          <ChevronDown className="h-4 w-4 shrink-0" />
        </Menu.Button>

        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="bg-card absolute left-0 z-50 mt-1 w-full min-w-48 origin-top-left rounded-lg border border-white/10 py-1 shadow-xl ring-1 shadow-black/20 ring-black/5 backdrop-blur-sm focus:outline-none">
            {/* Multi-select actions */}
            {mode === 'multi' && (
              <div className="flex items-center justify-between border-b border-white/10 px-3 py-2">
                <button
                  type="button"
                  onClick={selectAll}
                  className="text-primary text-xs hover:underline"
                >
                  Seleccionar todos
                </button>
                <button
                  type="button"
                  onClick={clearSelection}
                  className="text-muted-foreground hover:text-foreground flex items-center gap-1 text-xs"
                >
                  <X className="h-3 w-3" />
                  Limpiar
                </button>
              </div>
            )}

            {/* Options */}
            <div className="max-h-60 overflow-y-auto py-1">
              {/* "Todos" option for single select */}
              {mode === 'single' && (
                <Menu.Item>
                  {({ active }) => (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        clearSelection();
                      }}
                      className={cn(
                        'flex w-full items-center gap-2 px-3 py-2 text-sm',
                        active && 'bg-secondary/50',
                        !hasSelection && 'bg-primary/10'
                      )}
                    >
                      <span
                        className={cn(
                          'flex h-4 w-4 shrink-0 items-center justify-center rounded-full border',
                          !hasSelection
                            ? 'border-primary bg-primary text-primary-foreground'
                            : 'border-muted-foreground/50'
                        )}
                      >
                        {!hasSelection && <Check className="h-3 w-3" />}
                      </span>
                      <span className={!hasSelection ? 'text-foreground' : 'text-muted-foreground'}>
                        {placeholder}
                      </span>
                    </button>
                  )}
                </Menu.Item>
              )}

              {options.map((option) => {
                const isSelected = selectedValues.includes(option.value);

                return (
                  <Menu.Item key={option.value}>
                    {({ active }) => (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          toggleOption(option.value);
                        }}
                        className={cn(
                          'flex w-full items-center gap-2 px-3 py-2 text-sm',
                          active && 'bg-secondary/50',
                          isSelected && 'bg-primary/10'
                        )}
                      >
                        {/* Checkbox/Radio indicator */}
                        <span
                          className={cn(
                            'flex h-4 w-4 shrink-0 items-center justify-center rounded border',
                            mode === 'multi' ? 'rounded' : 'rounded-full',
                            isSelected
                              ? 'border-primary bg-primary text-primary-foreground'
                              : 'border-muted-foreground/50'
                          )}
                        >
                          {isSelected && <Check className="h-3 w-3" />}
                        </span>

                        {/* Option label with optional color */}
                        <span className="flex items-center gap-2">
                          {option.color && (
                            <span
                              className="h-2 w-2 rounded-full"
                              style={{ backgroundColor: option.color }}
                            />
                          )}
                          <span
                            className={isSelected ? 'text-foreground' : 'text-muted-foreground'}
                          >
                            {option.label}
                          </span>
                        </span>
                      </button>
                    )}
                  </Menu.Item>
                );
              })}
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TableFilterBar - Container for multiple filters
// ─────────────────────────────────────────────────────────────────────────────

interface TableFilterBarProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Container for table filters, search, and actions
 */
export function TableFilterBar({ children, className }: TableFilterBarProps) {
  return (
    <div className={cn('flex flex-wrap items-end gap-4 border-b border-white/10 p-4', className)}>
      {children}
    </div>
  );
}
