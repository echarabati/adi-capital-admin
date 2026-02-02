'use client';

import { useEffect } from 'react';
import { toast } from 'sonner';

export function PwaUpdateToast() {
  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;

    const handleUpdate = (waitingSW: ServiceWorker) => {
      toast('Nueva versión disponible', {
        description: 'Actualiza para obtener las últimas mejoras.',
        duration: Infinity,
        action: {
          label: 'Actualizar',
          onClick: () => {
            // Send SKIP_WAITING to waiting SW
            // controllerchange listener in sw-listener.ts will reload
            waitingSW.postMessage({ type: 'SKIP_WAITING' });
          },
        },
      });
    };

    navigator.serviceWorker.ready.then((reg) => {
      // Check if there's already a waiting SW
      if (reg.waiting) {
        handleUpdate(reg.waiting);
      }

      reg.addEventListener('updatefound', () => {
        const newWorker = reg.installing;
        newWorker?.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            handleUpdate(newWorker);
          }
        });
      });
    });
  }, []);

  return null;
}
