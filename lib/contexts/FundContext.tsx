'use client';

/**
 * Fund Context
 *
 * Global state for the selected fund. Syncs with cookie for persistence.
 * Used to filter all views by the active fund.
 *
 * @see DASH-002
 */

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { setSelectedFundCookie } from '@/lib/utils/fund-cookie';
import { useMounted } from '@/lib/hooks/useMounted';

// =============================================================================
// Types
// =============================================================================

export type FondoOption = {
  id: string;
  nombre: string;
};

type FundContextValue = {
  selectedFondoId: string | null;
  selectedFondo: FondoOption | null;
  fondos: FondoOption[];
  setSelectedFondo: (id: string) => void;
  isLoaded: boolean;
};

// =============================================================================
// Context
// =============================================================================

const FundContext = createContext<FundContextValue | null>(null);

// =============================================================================
// Provider
// =============================================================================

interface FundProviderProps {
  children: ReactNode;
  fondos: FondoOption[];
  initialFondoId?: string | null;
}

export function FundProvider({ children, fondos, initialFondoId }: FundProviderProps) {
  // Use existing useMounted hook to track hydration
  const isLoaded = useMounted();

  // Initialize state from server-provided values (already read from cookie in layout)
  const [selectedFondoId, setSelectedFondoId] = useState<string | null>(() => {
    if (initialFondoId && fondos.some((f) => f.id === initialFondoId)) {
      return initialFondoId;
    }
    return fondos.length > 0 ? fondos[0].id : null;
  });

  const setSelectedFondo = useCallback(
    (id: string) => {
      if (fondos.some((f) => f.id === id)) {
        setSelectedFondoId(id);
        setSelectedFundCookie(id);
      }
    },
    [fondos]
  );

  const selectedFondo = selectedFondoId
    ? (fondos.find((f) => f.id === selectedFondoId) ?? null)
    : null;

  return (
    <FundContext.Provider
      value={{
        selectedFondoId,
        selectedFondo,
        fondos,
        setSelectedFondo,
        isLoaded,
      }}
    >
      {children}
    </FundContext.Provider>
  );
}

// =============================================================================
// Hook
// =============================================================================

export function useFund() {
  const context = useContext(FundContext);
  if (!context) {
    throw new Error('useFund must be used within a FundProvider');
  }
  return context;
}

/**
 * Get selected fondo ID, null-safe for components outside provider
 */
export function useSelectedFondoId(): string | null {
  const context = useContext(FundContext);
  return context?.selectedFondoId ?? null;
}
