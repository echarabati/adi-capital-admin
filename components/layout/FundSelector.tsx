'use client';

/**
 * FundSelector Component (CMP-007)
 *
 * Dropdown in header to filter all views by active fund.
 * Uses RBAC: Super Admin sees all, Admin de Fondo sees assigned only.
 *
 * @see DASH-002
 */

import { Fragment } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { Building2, ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { useFund } from '@/lib/contexts/FundContext';

export function FundSelector() {
  const { selectedFondo, fondos, setSelectedFondo, isLoaded } = useFund();

  // Not loaded yet - show skeleton
  if (!isLoaded) {
    return (
      <div className="flex h-8 w-28 animate-pulse items-center gap-2 rounded-lg bg-white/10 px-3" />
    );
  }

  // No fondos available
  if (fondos.length === 0) {
    return null;
  }

  // Single fondo - display as text badge
  if (fondos.length === 1) {
    return (
      <div className="text-muted-foreground flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm">
        <Building2 className="h-4 w-4 opacity-70" />
        <span className="max-w-[120px] truncate font-medium">{fondos[0].nombre}</span>
      </div>
    );
  }

  // Multiple fondos - dropdown
  return (
    <Listbox value={selectedFondo?.id ?? ''} onChange={setSelectedFondo}>
      <div className="relative">
        <Listbox.Button
          className={cn(
            'hover:bg-secondary/50 flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm transition-colors',
            'text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-white/20'
          )}
        >
          <Building2 className="h-4 w-4 opacity-70" />
          <span className="max-w-[100px] truncate font-medium sm:max-w-[140px]">
            {selectedFondo?.nombre ?? 'Seleccionar fondo'}
          </span>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Listbox.Button>

        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Listbox.Options className="bg-card absolute left-0 z-50 mt-2 max-h-60 w-56 overflow-auto rounded-xl border border-white/10 py-1 shadow-xl ring-1 shadow-black/20 ring-black/5 backdrop-blur-sm focus:outline-none">
            {fondos.map((fondo) => (
              <Listbox.Option
                key={fondo.id}
                value={fondo.id}
                className={({ active, selected }) =>
                  cn(
                    'relative cursor-pointer px-4 py-2 text-sm transition-colors',
                    active && 'bg-secondary',
                    selected && 'text-primary font-medium'
                  )
                }
              >
                {({ selected }) => (
                  <div className="flex items-center justify-between">
                    <span className="truncate">{fondo.nombre}</span>
                    {selected && <Check className="h-4 w-4 shrink-0" />}
                  </div>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
}
